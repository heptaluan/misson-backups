<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <CaseControlForm ref="realForm" @ok="submitCallback" :disabled="disableSubmit" />
  </j-modal>
</template>

<script>
import CaseControlForm from './CaseControlForm'

export default {
  name: 'CaseControlModal',
  components: {
    CaseControlForm
  },
  data() {
    return {
      title: '编辑',
      width: 800,
      visible: false,
      disableSubmit: false
    }
  },
  methods: {
    add(record) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.add(record)
      })
    },
    edit(record) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.edit(record)
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      this.$refs.realForm.submitForm()
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
