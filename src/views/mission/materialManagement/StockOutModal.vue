<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    :okButtonProps="{ class: { 'jee-hidden': dis } }"
    cancelText="关闭"
    @ok="handleOk"
    :footer="footer"
    @cancel="handleCancel"
  >
    <div class="form-state">
      <a-tag v-if="state === 2" color="#108ee9">待审核</a-tag>
      <a-tag v-if="state === 3" color="#87d068">已审核通过</a-tag>
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
      <a-form-model-item label="订单号" prop="id" v-if="form.id">
        <span v-html="form.id"></span>
      </a-form-model-item>

      <a-form-model-item label="出库仓库" prop="warehouseId">
        <j-dict-select-tag
          :disabled="dis"
          type="list"
          v-model="form.warehouseId"
          dictCode="mms_warehouse_manage, name, id"
          placeholder="请选择出库仓库"
          change="onChange"
        />
      </a-form-model-item>

      <a-form-model-item label="出库耗材包" prop="planId">
        <a-select :disabled="dis" v-model="form.planId" placeholder="请选择出库耗材包">
          <a-select-option v-for="item in toplList" :key="item.id" :value="item.id">
            {{ item.planName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="销售人员" v-if="form.id">
        <a-input disabled placeholder="请输入销售人员" :rows="4" allowClear v-model="sellUser" />
      </a-form-model-item>

      <a-form-model-item label="销售人员" prop="sellUserId" v-if="!form.id">
        <a-select
          show-search
          :value="value"
          placeholder="请输入姓名进行检索"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          @search="handleSearch"
          @change="handleChange"
          v-model="form.sellUserId"
        >
          <a-select-option v-for="item in data" :key="item.id" :value="item.username">
            {{ item.realname }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="订单客户" prop="leaveAgency" v-if="sellUser || form.sellUserId">
        <a-select :disabled="dis" v-model="form.leaveAgency" placeholder="请选择订单客户">
          <a-select-option v-for="item in cooperationList" :key="item.id" :value="item.shortName">
            {{ item.departName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <!-- <a-form-model-item label="出库数量" prop="caseCodeAmount">
        <a-input-number
          :disabled="dis"
          placeholder="请输入出库数量"
          allowClear
          v-model="form.caseCodeAmount"
          style="width: 100%"
        />
      </a-form-model-item> -->

      <a-form-model-item label="收件地址" prop="addressId">
        <a-select :disabled="dis" v-model="form.addressId" placeholder="请选择收件地址">
          <a-select-option v-for="item in addressList" :key="item.id" :value="item.id">
            {{ item.addressName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="病例数" prop="caseLoad">
        <a-input-number
          :disabled="dis"
          placeholder="请输入病例数"
          allowClear
          v-model="form.caseLoad"
          style="width: 100%"
          :min="1"
        />
      </a-form-model-item>

      <a-form-model-item label="空白编号数" prop="caseCodeAmount">
        <a-input-number
          :disabled="dis"
          placeholder="请输入病例编号数"
          allowClear
          v-model="form.caseCodeAmount"
          style="width: 100%"
          :min="1"
        />
      </a-form-model-item>

      <div v-if="form.status === 2">
        <a-form-model-item label="物流公司" prop="emsCompany">
          <j-dict-select-tag
            type="list"
            v-model="form.emsCompany"
            dictCode="ems_company_type"
            placeholder="请选择物流公司"
          />
        </a-form-model-item>

        <a-form-model-item label="物流编号" prop="emsNo">
          <a-input-number style="width:100%" placeholder="请输入物流编号" :rows="4" allowClear v-model="form.emsNo" />
        </a-form-model-item>

        <a-form-model-item label="备注" prop="remark">
          <a-textarea v-model="form.remark" placeholder="请输入备注" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
      </div>

      <h3 v-if="dis" style="margin-bottom: 20px">出库详情</h3>
      <a-table
        ref="table"
        size="middle"
        :scroll="{ x: true }"
        bordered
        rowKey="rowIndex"
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading"
        :pagination="ipagination"
        class="j-table-force-nowrap"
        @change="handleTableChange"
        v-if="dis"
      >
        <template slot="amount" slot-scope="text, record">
          <editable-cell :disabled="dis" :text="text" @change="onCellChange(record.id, 'amount', $event)" />
        </template>
      </a-table>

      <div style="margin-top: 60px"></div>
      <div class="footer-bar tool-bar">
        <span v-has="'stockOutAdd'">
          <a-button class="add-btn" @click="handleCommitMaterial" type="primary" v-if="form.status === 1"
            >提交审核</a-button
          >
          <!-- <a-button class="add-btn" @click="handleRetractMaterial" type="primary" v-if="form.status === 1">撤回</a-button> -->
        </span>
        <span v-has="'stockOutCheck'">
          <!-- <span> -->
          <a-button class="add-btn" @click="handlePassMaterial" type="primary" v-if="form.status === 2">通过</a-button>
          <a-button class="add-btn" @click="handleRetractMaterial" type="primary" v-if="form.status === 2"
            >退回</a-button
          >
        </span>
        <span class="flex-1"></span>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk" :disabled="dis">保存</a-button>
        <!--        <a-button key="submitAndCheck" type="primary" :loading="loading" @click="handleOkAndCommitCheck" :disabled="dis">保存并提交审核</a-button>-->
        <a-button key="back" @click="handleCancel">取消</a-button>
      </div>
    </a-form-model>
  </j-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'
import { getCooperationUnitList, leaveApply, approve, submit, queryByIdStockIn } from 'src/api/mission/project'
import { getMaterialPlanList, getAddressList, queryRoleUsers } from '../../../api/material/index'
import { getDistributorList } from '../../../api/product/index'

function fetch(value, callback) {
  let timeout
  let currentValue

  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value

  function fake() {
    queryRoleUsers({
      role: 'sales_omics',
      name: value
    }).then(res => {
      if (res.success) {
        if (currentValue === value) {
          const result = res.result
          const data = []
          result.forEach(r => {
            data.push({
              key: r.id,
              realname: r.realname,
              username: r.username,
              id: r.id
            })
          })
          callback(data)
        }
      } else {
        console.log(res.message)
      }
    })
  }

  timeout = setTimeout(fake, 300)
}

export default {
  name: 'StockOutModal',
  mixins: [JeecgListMixin, mixinDevice],
  data() {
    return {
      title: '出库单',
      width: 800,
      visible: false,
      disableSubmit: false,
      dis: false,
      footer: null,
      applyId: '',
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
      cooperationList: [],
      toplList: [],
      dataSource: [],
      addressList: [],
      data: [],
      value: undefined,
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
        {
          title: '名称',
          align: 'center',
          dataIndex: 'materialName',
          customRender: function(t, r, index) {
            return r.materialName ? r.materialName : r.packageId_dictText
          }
        },
        {
          title: '份数',
          align: 'center',
          dataIndex: 'amount'
        }
      ],
      form: {
        sellUserId: undefined,
        project: undefined,
        leaveAgency: undefined,
        caseLoad: '',
        planId: undefined,
        caseCodeAmount: '',
        status: undefined,
        remark: '',
        emsNo: '',
        emsCompany: undefined
      },
      rules: {
        warehouseId: [{ required: true, message: '请选择出库仓库', trigger: 'change' }],
        planId: [{ required: true, message: '请选择出库耗材包', trigger: 'change' }],
        leaveAgency: [{ required: true, message: '请选择订单客户', trigger: 'change' }],
        sellUserId: [{ required: true, message: '请输入销售人员', trigger: 'blur' }],
        addressId: [{ required: true, message: '请选择收件地址', trigger: 'change' }],
        caseLoad: [{ required: true, message: '请输入病例数（仅限正整数）', trigger: 'change', pattern: /^[1-9]\d*$/ }],
        caseCodeAmount: [{ required: true, message: '请输入病例编号数（仅限正整数）', trigger: 'change', pattern: /^[1-9]\d*$/ }]
      },
      url: {
        list: ''
      },
      pId: undefined,
      state: null,
      isLeading: undefined,
      sellUser: undefined
    }
  },
  methods: {
    show(record) {
      if (record && record.id) {
        this.pId = record.id
        this.loadData(record.id)
        this.dis = true
      } else {
        this.dis = false
        this.form = {}
      }
      this.visible = true
    },
    handleCancel() {
      this.visible = false;
      this.sellUser = null;
      // Object.assign(this.$data, this.$options.data()); 不能清空全部，因为有异步数据在打开此modal之前就已经生成，清楚之后不会继续生成
    },
    handleOkAndCommitCheck() {
      this.handleOk()
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const that = this
          const postData = {
            warehouseId: this.form.warehouseId,
            leaveAgency: this.form.leaveAgency,
            sellUserId: this.form.sellUserId,
            planId: this.form.planId,
            addressId: this.form.addressId,
            caseAmount: this.form.caseLoad,
            caseCodeAmount: this.form.caseCodeAmount,
            planType: 1
          }
          leaveApply(postData)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
                this.sellUser = null;
                that.visible = false
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    },
    loadCooperatorData(value) {
      const that = this
      getDistributorList(value ? {sellUser: value} : null).then(res => {
        if (res.success) {
          that.cooperationList = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    loadTplList() {
      const that = this
      getMaterialPlanList().then(res => {
        if (res.success) {
          that.toplList = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    loadAddressList() {
      const that = this
      getAddressList().then(res => {
        if (res.success) {
          that.addressList = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    loadData(id) {
      if (id) {
        const that = this
        const query = {
          applyId: id,
          applyType: 2
        }
        queryByIdStockIn(query).then(res => {
          if (res.success) {
            that.dataSource = res.result.applyDetailPage.records
            that.form.id = res.result.id
            that.form.addressId = res.result.addressId
            that.form.warehouseId = res.result.warehouseId
            that.form.caseCodeAmount = res.result.caseCodeAmount
            that.form.planId = res.result.planId
            that.form.leaveAgency = res.result.leaveAgency
            that.form.caseLoad = res.result.caseAmount
            that.form.status = res.result.status
            that.sellUser = res.result.sellUserId_dictText
          } else {
            that.$message.warning(res.message)
          }
        })
      }
    },
    handleCommitMaterial() {
      const that = this
      const query = {
        applyId: this.pId,
        applyType: 2,
        status: 2
      }
      submit(query).then(res => {
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
      const that = this
      // 触发表单验证
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const query = {
            applyId: this.pId,
            applyType: 2,
            status: 1,
            remark: this.form.remark,
            emsNo: this.form.emsNo,
            emsCompany: this.form.emsCompany
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
        }
      })
    },
    handleRetractMaterial() {
      const that = this

      if (!this.form.remark) {
        this.$message.warning(`请在备注当中填写退回原因`)
        return
      }

      const query = {
        applyId: this.pId,
        applyType: 2,
        status: 0,
        remark: this.form.remark
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
    handleSearch(value) {
      fetch(value, data => (this.data = data))
    },
    handleChange(value) {
      console.log(value)
      this.value = value
      const that = this;
      this.$set(this.form, 'leaveAgency', undefined); // clean the previous data if the sellUser or sellUserId changed
      fetch(value, data => {
          that.data = data;
          that.loadCooperatorData(value);
        }
      )
    }
  },
  mounted() {
    this.loadCooperatorData()
    this.loadTplList()
    this.loadAddressList()
  }
}
</script>
<style lang="less" scoped>
.form-state {
  position: absolute;
  top: 70px;
  right: 35px;
}

.add-btn {
  margin-right: 15px;
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
