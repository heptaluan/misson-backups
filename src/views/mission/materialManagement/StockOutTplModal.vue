<template>
  <div>
    <j-modal
      :title="title"
      :width="width"
      :visible="visible"
      switchFullscreen
      :okButtonProps="{ class: { 'jee-hidden': dis } }"
      cancelText="关闭"
      :footer="footer"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model
        style="max-width: 1080px; margin: 0 auto;"
        ref="ruleForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :model="form"
        :rules="rules"
      >
        <a-form-model-item ref="name" label="耗材包名称" prop="planName">
          <a-input :disabled="dis" placeholder="请输入耗材包名称" v-model="form.planName" />
        </a-form-model-item>

        <!-- <a-form-model-item label="癌种名称" prop="cancerType">
          <j-dict-select-tag
            type="list"
            v-model="form.cancerType"
            dictCode="types_cancer"
            placeholder="请选择项目癌种"
          />
        </a-form-model-item> -->

        <a-form-model-item label="关联产品" prop="productRecognition">
          <a-select :disabled="dis" v-model="form.productRecognition" placeholder="请选择产品" @change="handleChange">
            <a-select-option v-for="item in productInfoList" :key="item.id" :value="item.productRecognition">
              {{ item.productName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <!-- <a-form-model-item ref="name" label="备注说明" prop="remark">
          <a-input :disabled="dis" placeholder="请输入备注说明" v-model="form.remark" />
        </a-form-model-item> -->

        <h3>耗材包内容清单</h3>
        <div class="tool-bar" style="text-align: right">
          <a-button :disabled="buttonDisabledState" @click="handleAddMaterial">选择耗材</a-button>
        </div>

        <!-- table区域-begin -->
        <a-table
          ref="table"
          size="middle"
          :scroll="{ x: true }"
          bordered
          rowKey="rowIndex"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          class="j-table-force-nowrap"
          @change="handleTableChange"
        >
          <template slot="amount" slot-scope="text, record">
            <editable-cell :disabled="dis" :text="text" @change="onCellChange(record.id, 'amount', $event)" />
          </template>
          <span
            slot="action"
            slot-scope="text, record, index"
            style="display:flex;align-items:center;justify-content:space-evenly;"
          >
            <a @click="handleEdit(record, index)" v-has="'stockTplAdd'" class="action-btn">编辑</a>
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(index)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </a-table>
      </a-form-model>
      <div style="margin-top: 60px"></div>
      <div class="footer-bar">
        <span class="flex-1"></span>
        <a-button key="back" @click="handleCancel">关闭</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">保存</a-button>
      </div>
    </j-modal>

    <MateriaChooseModal ref="materiaChooseModal" @ok="submitCallback" />
    <StockOutTplEditModal ref="stockOutTplEditModal" @ok="editCallback" />
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'
import MateriaChooseModal from './MateriaChooseModal'
import StockOutTplEditModal from './StockOutTplEditModal'
import { addMaterialList, queryMaterialPlan, updateMaterialPlan } from '../../../api/material/index'
import Vue from 'vue'
import { UI_CACHE_DB_DICT_DATA } from '@/store/mutation-types'
import { getProductInfoList } from '../../../api/product/index'

export default {
  name: 'StockOutTpl',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    MateriaChooseModal,
    StockOutTplEditModal
  },
  data() {
    return {
      title: '出库耗材包',
      width: 1280,
      visible: false,
      footer: null,
      disableSubmit: false,
      dis: false,
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      form: {
        planName: '',
        cancerType: '',
        productRecognition: '',
        remark: ''
      },
      rules: {
        planName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        cancerType: [{ required: true, message: '请选择癌种名称', trigger: 'change' }],
        productRecognition: [{ required: true, message: '请选择产品名称', trigger: 'change' }]
      },
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'rowId',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        // {
        //   title: '耗材编码',
        //   align: 'center',
        //   dataIndex: 'materialCode'
        // },
        {
          title: '耗材名称',
          align: 'center',
          dataIndex: 'materialName',
          customRender: function(t, r, index) {
            return r.materialName ? r.materialName : r.materialCode_dictText
          }
        },
        {
          title: '样本类型',
          align: 'center',
          dataIndex: 'sampleType_dictText'
        },
        {
          title: '规格',
          align: 'center',
          dataIndex: 'units'
        },
        {
          title: '自定义后缀',
          align: 'center',
          dataIndex: 'suffix'
        },
        {
          title: '份数',
          align: 'center',
          dataIndex: 'pcs'
        },
        {
          title: '说明',
          align: 'center',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: ''
      },
      list: [],
      pId: undefined,
      state: null,
      id: undefined,
      sampleTypeList: [],
      productInfoList: [],
      buttonDisabledState: true
    }
  },
  methods: {
    show(record) {
      this.visible = true
      if (record && record.id) {
        this.buttonDisabledState = false
        this.loadData(record.id)
      } else {
        this.buttonDisabledState = true
        this.id = null
        this.dataSource = []
        this.form.planName = ''
        this.form.cancerType = undefined
        this.form.productRecognition = undefined
        this.form.remark = ''
      }
    },
    submitCallback(selectRow) {
      if (!Array.isArray(selectRow)) return false
      selectRow.forEach(item => {
        item.suffix = ''
        item.pcs = ''
        this.dataSource.push(item)
      })
    },
    editCallback(record, index) {
      // const sampleTypeList = this.getDictItemsFromCache('sample_type')
      // newDataSource[index].sampleTypeName = sampleTypeList[record.sampleType].text
      // newDataSource[index].materialId = newDataSource[index].id
      // newDataSource[index].id = null
      const newDataSource = [...this.dataSource]
      newDataSource[index] = record
      this.dataSource = newDataSource
    },
    handleDelete(index) {
      const newDataSource = [...this.dataSource]
      newDataSource.splice(index, 1)
      this.dataSource = newDataSource
    },
    handleCancel() {
      console.log(`取消`)
      this.visible = false
    },
    handleOk() {
      this.submitSave()
    },
    handleOkAndCommitCheck() {
      this.submitSave(true)
    },
    submitSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.dataSource.length === 0) {
            this.$message.error(`请选择耗材`)
            return
          }
          const postData = {
            id: this.id ? this.id : null,
            planName: this.form.planName,
            cancerType: this.form.cancerType,
            productRecognition: this.form.productRecognition,
            remark: this.form.remark,
            materialPlanItemList: []
          }

          for (let i = 0; i < this.dataSource.length; i++) {
            if (!this.dataSource[i].pcs) {
              this.$message.error(`请输入份数`)
              return false
            }

            if (!this.dataSource[i].sampleType) {
              this.$message.error(`请选择样本类别`)
              return false
            }

            if (!this.dataSource[i].units) {
              this.$message.error(`请输入规格`)
              return false
            }

            // if (this.dataSource[i].suffix === '') {
            //   this.$message.error(`请输入自定义后缀`)
            //   return
            // }

            if (this.id) {
              postData.materialPlanItemList.push({
                ...this.dataSource[i],
                planId: this.id,
                materialId: this.dataSource[i].materialId,
                planType: 1
              })
            } else {
              postData.materialPlanItemList.push({
                ...this.dataSource[i],
                materialId: this.dataSource[i].materialId
              })
            }
          }

          if (this.id) {
            updateMaterialPlan(postData).then(res => {
              if (res.success) {
                this.$message.success(res.result)
                this.visible = false
                this.$emit('ok')
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            addMaterialList(postData).then(res => {
              if (res.success) {
                this.$message.success(res.result)
                this.visible = false
                this.$emit('ok')
              } else {
                this.$message.error(res.message)
              }
            })
          }
        }
      })
    },
    handleChange(value) {
      if (value) {
        this.buttonDisabledState = false
      } else {
        this.buttonDisabledState = true
      }
    },
    handleAddMaterial() {
      this.$refs.materiaChooseModal.show(this.form.productRecognition)
      this.$refs.materiaChooseModal.title = '耗材列表'
    },
    handleSelectionRows(val) {
      this.list = val
    },
    loadData(id) {
      if (id) {
        this.id = id
        const that = this
        const query = {
          id: id
        }
        queryMaterialPlan(query).then(res => {
          if (res.success) {
            that.dataSource = res.result.materialPlanItemList
            that.form.planName = res.result.planName
            that.form.cancerType = res.result.cancerType
            that.form.productRecognition = res.result.productRecognition
            that.form.remark = res.result.remark
          } else {
            that.$message.warning(res.message)
          }
        })
      }
    },
    handleEdit(record, index) {
      this.$refs.stockOutTplEditModal.show(record, index)
    },
    getDictItemsFromCache(dictCode) {
      if (Vue.ls.get(UI_CACHE_DB_DICT_DATA) && Vue.ls.get(UI_CACHE_DB_DICT_DATA)[dictCode]) {
        let dictItems = Vue.ls.get(UI_CACHE_DB_DICT_DATA)[dictCode]
        return dictItems
      }
    },
    loadProductInfoList() {
      const that = this
      getProductInfoList().then(res => {
        if (res.success) {
          that.productInfoList = res.result.records
          console.log(that.productInfoList)
        } else {
          that.$message.warning(res.message)
        }
      })
    }
  },
  mounted() {
    this.loadProductInfoList()
  }
}
</script>

<style lang="less" scoped>
.add-btn {
  margin-right: 15px;
}

.form-state {
  position: absolute;
  top: 70px;
  right: 35px;
}

.footer-bar {
  margin-top: 10px;
  padding: 10px 30px;
  text-align: right;
  background: transparent;
  border-top: 1px solid #e8e8e8;
  border-radius: 0 0 4px 4px;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
}

.footer-bar .ant-btn {
  margin-right: 15px;
}

.footer-bar .flex-1 {
  flex: 1;
}

.tool-bar {
  margin-bottom: 15px;
}

.action-btn {
  padding: 5px 10px;
}
</style>
