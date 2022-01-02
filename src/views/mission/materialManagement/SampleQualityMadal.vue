<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    okText="导出excel"
    cancelText="关闭"
    :footer="footer"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="b-flex b-form-row">
      <div class="b-flex-1 b-form-item">
        <div class="form-label">
          <label class="form-label-text">批次号：</label>
        </div>
        <span v-html="form.batchNo"></span>
      </div>
    </div>
    <!-- <div class="b-flex b-form-row">
      <div class="b-flex-1 b-form-item">
        <div class="form-label">
          <label class="form-label-text">入库仓库：</label>
        </div>
        <span v-html="form.storeIn"></span>
      </div>
      <div class="b-flex-1 b-form-item">
        <div class="form-label">
          <label class="form-label-text">入库人：</label>
        </div>
        <span v-html="form.createBy"></span>
      </div>
      <div class="b-flex-1 b-form-item">
        <div class="form-label">
          <label class="form-label-text">入库时间：</label>
        </div>
        <span v-html="form.createTime"></span>
      </div>
    </div> -->
    <div class="b-flex b-form-row">
      <div class="b-flex-1 b-form-item">
        <div class="form-label">
          <label class="form-label-text">总数：</label>
        </div>
        <span v-html="form.totalAmount"></span>
      </div>
      <div class="b-flex-1 b-form-item">
        <div class="form-label">
          <label class="form-label-text">合格：</label>
        </div>
        <span v-html="form.qualifyAmount"></span>
      </div>
      <div class="b-flex-1 b-form-item">
        <div class="form-label">
          <label class="form-label-text">不合格：</label>
        </div>
        <span v-html="form.unQualifyAmount"></span>
      </div>
    </div>
    <div class="title b-form-row text-weight">质检反馈短信内容：</div>

    <div class="b-flex b-form-row">
      <a-textarea
        placeholder="反馈短信内容"
        :auto-size="{ minRows: 6, maxRows: 6 }"
        allowClear
        v-model.trim="form.content"
      />
    </div>
    <div class="b-flex b-form-row" style="margin-bottom: 55px;align-items: center;justify-content: flex-end;">
      <label class="form-label-text">结果反馈对象：</label>
      <a-select allowClear style="width:200px;" v-model="form.informUser" placeholder="请选择质控责任人">
        <a-select-option v-for="item in userList" :key="item.id" :value="item.id">
          {{ item.realname }}
        </a-select-option>
      </a-select>
    </div>
    <div class="footer-bar b-flex feedback">
      <span class="b-flex-1"></span>
      <a-button key="back" @click="handleCancel">关闭</a-button>
      <!-- <a-button key="submit" type="primary" :loading="loading" @click="handleOk">保存</a-button> -->
      <a-button :disabled="!editState" key="submitAndCheck" type="primary" @click="handleOkAndCommitCheck"
        >提交结果并发送短信</a-button
      >
    </div>
  </j-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'
import { qcBrief, stockApplyFeedback, getUserList } from 'src/api/mission/project'

export default {
  name: 'sample-quality-madal',
  mixins: [mixinDevice],
  data() {
    return {
      title: '',
      width: 800,
      visible: false,
      footer: null,
      disableSubmit: false,
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
      form: {
        id: '',
        batchNo: '',
        createBy: '',
        createTime: '',
        content: '',
        informUser: undefined
      },
      rules: {},
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
          title: '耗材序号',
          align: 'center',
          dataIndex: 'materialCode'
        },
        {
          title: '耗材名称',
          align: 'center',
          dataIndex: 'materialName'
        },
        {
          title: '耗材数量',
          align: 'center',
          dataIndex: 'materialTotal'
        }
      ],
      url: {},
      userList: [],
      editState: true
    }
  },
  methods: {
    show(state) {
      this.editState = state
      this.loadData()
      this.getUserList()
      this.visible = true
    },
    handleCancel() {
      console.log(`关闭`)
      this.visible = false
    },
    handleOk() {
      this.visible = false
    },
    getUserList() {
      const that = this
      getUserList().then(res => {
        if (res.success) {
          that.userList = res.result
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleOkAndCommitCheck() {
      const that = this
      if (!this.form.content) {
        that.$message.warning(`请输入反馈短信内容`)
        return
      }
      if (!this.form.informUser) {
        that.$message.warning(`请选择结果反馈对象`)
        return
      }
      const data = {
        autoInform: 1,
        content: this.form.content,
        id: this.form.id,
        informUser: this.form.informUser
      }
      stockApplyFeedback(data).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          this.$emit('ok')
          this.visible = false
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    loadData() {
      const that = this
      qcBrief(this.$route.query.id).then(res => {
        if (res.success) {
          that.form.id = res.result.id
          that.form.batchNo = res.result.batchNo
          that.form.totalAmount = res.result.totalAmount
          that.form.qualifyAmount = res.result.qualifyAmount
          that.form.unQualifyAmount = res.result.unQualifyAmount
          that.form.content = res.result.qcReportContent
          that.form.informUser = res.result.informContactId ? res.result.informContactId : undefined
        } else {
          that.$message.warning(res.message)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.feedback .ant-btn:last-child {
  margin-right: 10px;
}
</style>
