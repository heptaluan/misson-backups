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
      <div class="form-state">
        <a-tag v-if="state === 2" color="#108ee9">待审核</a-tag>
        <a-tag v-if="state === 3" color="#87d068">通过</a-tag>
        <a-tag v-if="state === 4" color="#f50">已退回</a-tag>
      </div>
      <a-form-model
        style="max-width: 1080px; margin: 20px auto 0;"
        ref="ruleForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :model="form"
        :rules="rules"
      >
        <a-form-model-item ref="code" label="批次号" prop="code">
          <a-input
            :disabled="true"
            placeholder="请输入批次号"
            v-model="form.code"
            @blur="
              () => {
                $refs.code.onFieldBlur()
              }
            "
          />
        </a-form-model-item>

        <a-form-model-item label="入库仓库" prop="type">
          <j-dict-select-tag
            :disabled="dis"
            type="list"
            v-model="form.type"
            dictCode="mms_warehouse_manage, name, id"
            placeholder="请选择入库仓库"
          />
        </a-form-model-item>

        <a-form-model-item ref="code" label="入库时间">
          <div>{{ currentTime }}</div>
        </a-form-model-item>

        <div class="tool-bar" style="text-align: right"></div>

        <!-- table区域-begin -->
        <a-table
          ref="table"
          size="middle"
          :scroll="{ x: true }"
          bordered
          rowKey="id"
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
        </a-table>
      </a-form-model>
      <div style="margin-top: 60px"></div>
      <div class="footer-bar">
        <a-button class="add-btn" @click="handleAddMaterial" type="primary" icon="plus" v-if="!dis" v-has="'stockInAdd'"
          >新增</a-button
        >
        <span v-has="'stockInAdd'">
          <a-button class="add-btn" @click="handleCommitMaterial" type="primary" v-if="state === 1 && dis"
            >提交审核</a-button
          >
          <a-button class="add-btn" @click="handleRetractMaterial" type="primary" v-if="state === 1 && dis"
            >撤回</a-button
          >
        </span>
        <!-- <span v-has="'stockInCheck'"> -->
        <span v-has="'stockInSuper'">
          <a-button class="add-btn" @click="handlePassMaterial" type="primary" v-if="state === 2 && dis">通过</a-button>
          <a-button class="add-btn" @click="handleRetractMaterial" type="primary" v-if="state === 2 && dis"
            >退回</a-button
          >
        </span>
        <span class="flex-1"></span>
        <template v-if="state !== 3 && state !== 2 && state !== 1">
          <!-- <a-button key="submit" type="primary" :loading="loading" @click="handleOk">保存</a-button> -->
          <a-button
            key="submitAndCheck"
            :disabled="commitButtonState"
            type="primary"
            :loading="loading"
            @click="handleOkAndCommitCheck"
            >保存并提交审核</a-button
          >
        </template>
        <a-button key="back" @click="handleCancel">取消</a-button>
      </div>
    </j-modal>

    <MaterialFilterModal ref="materialFilterModal" @ok="submitCallback" />
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'
import MaterialFilterModal from './MaterialFilterModal'
import EditableCell from './editCell'
import { stockComeApply, queryByIdStockIn, approve, submit } from 'src/api/mission/project'
import { putAction } from '@api/manage'

export default {
  name: 'StockInModal',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    MaterialFilterModal,
    EditableCell
  },
  data() {
    return {
      title: '入库单',
      width: 1280,
      visible: false,
      footer: null,
      disableSubmit: false,
      dis: false,
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
      form: {
        code: '',
        type: undefined
      },
      rules: {
        code: [{ required: true, message: '请输入批次号', trigger: 'blur' }],
        type: [{ required: true, message: '请选择入库仓库', trigger: 'change' }]
      },
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '耗材包名称',
          align: 'center',
          dataIndex: 'planName',
          customRender: function(t, r, index) {
            return r.planName ? r.planName : r.packageId_dictText
          }
        },
        {
          title: '创建人',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '耗材数量',
          align: 'center',
          dataIndex: 'amount',
          scopedSlots: { customRender: 'amount' },
          width: 200
        }
      ],
      url: {
        list: ''
      },
      list: [],
      pId: undefined,
      state: null,
      isLeading: undefined,
      currentTime: '',
      commitButtonState: false
    }
  },
  methods: {
    getBatchNo() {
      const that = this
      putAction('/sys/fillRule/executeRuleByCode/' + 'sample_archive_code_rule', { prefix: 'MA' }).then(res => {
        if (res.success) {
          that.form.code = res.result
        }
      })
    },
    show(record) {
      if (record && record.id) {
        this.pId = record.id
        this.loadData(record.id)
        this.dis = true
      } else {
        this.getBatchNo()
        this.form.type = undefined
        this.dataSource = []
        this.dis = false
        this.state = -1
      }
      this.visible = true
    },
    submitCallback(selectRow) {
      this.dataSource = []
      if (!Array.isArray(selectRow)) return false
      selectRow.forEach(row => {
        row.amount = '0'
        this.dataSource.push(row)
      })
      console.log(this.dataSource)
    },
    handleCancel() {
      console.log(`取消`)
      this.visible = false
      this.title = '入库单'
    },
    handleOk() {
      this.submitSave()
    },
    handleOkAndCommitCheck() {
      this.submitSave(true)
    },
    submitSave(commit) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.commitButtonState = true
          const postData = {
            batchNo: this.form.code,
            comeStocks: [],
            warehouseId: this.form.type,
            isAutoSubmitApprove: commit ? 1 : 0,
            id: this.pId ? this.pId : null
          }
          this.dataSource.forEach(row => {
            if (parseInt(row.amount) > 0) {
              postData.comeStocks.push({
                amount: parseInt(row.amount),
                packageId: row.id
              })
            }
          })
          stockComeApply(postData)
            .then(res => {
              if (res.success) {
                this.$message.success(res.message)
                this.visible = false
                this.$emit('ok')
                this.commitButtonState = false
                this.title = '入库单'
              } else {
                this.$message.error(res.message)
                this.commitButtonState = false
              }
            })
            .finally(() => {
              // that.confirmLoading = false
            })
        }
      })
    },
    handleAddMaterial() {
      this.$refs.materialFilterModal.show()
    },
    handleCommitMaterial() {
      const that = this
      const query = {
        applyId: this.pId,
        applyType: 1,
        status: 2
      }
      approve(query).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.$emit('ok')
          that.visible = false
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handlePassMaterial() {
      this.commitState(1)
    },
    commitState(status) {
      const that = this
      const query = {
        applyId: this.pId,
        applyType: 1,
        status: status
      }
      approve(query).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.$emit('ok')
          that.visible = false
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleRetractMaterial() {
      const that = this
      const query = {
        applyId: this.pId,
        applyType: 1,
        status: 0
      }
      approve(query).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.$emit('ok')
          that.visible = false
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleSelectionRows(val) {
      this.list = val
    },
    onCellChange(id, dataIndex, value) {
      const dataSource = [...this.dataSource]
      const target = dataSource.find(item => item.id === id)
      if (target) {
        target[dataIndex] = value
        this.dataSource = dataSource
      }
    },
    loadData(id) {
      if (id) {
        const that = this
        const query = {
          applyId: id,
          applyType: 1
        }
        queryByIdStockIn(query).then(res => {
          if (res.success) {
            that.dataSource = res.result.applyDetail.records
            that.dataSource[0].planName = that.dataSource[0].packageId_dictText
            that.form.code = res.result.batchNo
            that.form.type = res.result.warehouseId
            that.state = res.result.status
          } else {
            that.$message.warning(res.message)
          }
        })
      }
    },
    getCurrentTime() {
      let yy = new Date().getFullYear()
      let mm = new Date().getMonth() + 1
      let dd = new Date().getDate()
      let hh = new Date().getHours()
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      this.currentTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
    }
  },
  mounted() {
    this.getCurrentTime()
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
</style>
