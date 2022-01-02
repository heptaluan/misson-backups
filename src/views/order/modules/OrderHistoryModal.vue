<template>
  <j-modal :title="title" :width="width" :visible="visible" switchFullscreen @ok="handleOk" @cancel="handleCancel">
    <a-form-model ref="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <div class="order-log">
        {{ record.log }}
      </div>
    </a-form-model>
  </j-modal>
</template>

<script>
import { mixinDevice } from '@/utils/mixin'

export default {
  name: 'OrderHistoryModal',
  mixins: [mixinDevice],
  data() {
    return {
      title: '订单错误日志',
      width: 800,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      record: {},
      visible: false
    }
  },
  methods: {
    show(record) {
      this.record = record
      this.visible = true
    },
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      this.visible = false
    }
  }
}
</script>
