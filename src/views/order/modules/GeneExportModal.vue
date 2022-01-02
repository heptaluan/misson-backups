<template>
  <j-modal
    :title="title"
    :width="800"
    :visible="visible"
    :maskClosable="false"
    switchFullscreen
    @ok="submitCallback"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
  >
    <a-form-model ref="ruleForm" :model="form" :rules="validatorRules" style="width: 300px; margin: 20px auto 0;">
      <a-form-model-item label="批次号" prop="batchId">
        <a-input v-model="form.batchId" />
      </a-form-model-item>
      <a-form-model-item label="用户名" prop="userName">
        <a-input v-model="form.userName" />
      </a-form-model-item>
      <a-form-model-item label="密码" prop="password">
        <a-input v-model="form.password" />
      </a-form-model-item>
    </a-form-model>
  </j-modal>
</template>

<script>
export default {
  name: 'Gene-Export-Modal',

  data() {
    return {
      title: '基因下载信息',
      width: 800,
      visible: false,
      disableSubmit: false,
      form: {
        batchId: '',
        userName: '',
        password: ''
      },
      validatorRules: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    add() {
      this.visible = true
    },
    edit(record) {
      this.form = {
        ...record
      }
      this.visible = true
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    submitCallback() {
      this.$emit('ok')
      this.visible = false
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>
