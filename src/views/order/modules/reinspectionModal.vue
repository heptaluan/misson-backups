<template>
  <j-modal
    :title='title'
    :width='width'
    :visible='visible'
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit, 'hideBtn': reinspected === -1 } }"
    :cancelButtonProps="{ class: { 'hideBtn': reinspected === 1 } }"
    @ok='handleOk'
    @cancel='handleCancel'
  >
    <a-form-model ref='form' :model='model' :rules='validatorRules' v-if='reinspected === 0'>

      <a-form-model-item label='重检类别' :labelCol='labelCol' :wrapperCol='wrapperCol' prop='reDetectType'>
        <a-radio-group v-model='model.reDetectType' read-only>
          <a-radio :value='0'>
            组学再分析
          </a-radio>
          <a-radio :value='1'>
            重寄样本
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label='重检的组学' :labelCol='labelCol' :wrapperCol='wrapperCol' prop='affectOmics'>
        <a-checkbox-group v-model='model.affectOmics'>
          <a-checkbox :value='2'>影像组</a-checkbox>
          <a-checkbox :value='0' disabled v-if="record && record.choseProduct === 'FK'">表观组</a-checkbox>
          <a-checkbox :value='1' disabled>代谢组</a-checkbox>
        </a-checkbox-group>
      </a-form-model-item>
    </a-form-model>
    <a-result
      status='success'
      title='重检已结束'
      v-if='reinspected === 1'
    >
      <template #extra>
        <a-button key='console' type='primary' @click='viewDetail'>
          查看重检结果详情
        </a-button>
      </template>
    </a-result>
    <a-result
      status='error'
      title='重检失败'
      v-if='reinspected === -1'
    >
      <template #extra>
        <a-button key='console' type='primary' @click='reinspected = 0'>
          重新重检
        </a-button>
      </template>
    </a-result>
  </j-modal>
</template>

<script>
import { reDetectInstance } from 'src/api/order/index'

export default {
  name: 'reinspectionModal',
  data() {
    return {
      title: '重检项',
      width: 500,
      visible: false,
      disableSubmit: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      model: {},
      validatorRules: {
        affectOmics: [{ required: true, message: '请选择重检组学!' }],
        reDetectType: [{ required: true, message: '请选择重检类别!' }]
      },
      reinspected: 0,
      record: null
    }
  },
  methods: {
    show(record) {
      this.visible = true
      console.log(record)
      this.record = record
    },
    handleCancel() {
      this.visible = false
      this.reinspected = 0
      this.cleanData()
    },
    handleOk() {
      // console.log(this.model.affectOmics, ' - ', this.model.reDetectType)
      if (this.reinspected === 0) {
        this.$refs.form.validate(valid => {
          if (valid) {
            const data = {
              affectOmics: this.model.affectOmics,
              orderId: this.record.id,
              reDetectType: this.model.reDetectType
            }
            console.log(data)
            reDetectInstance(data).then(res => {
              // console.log(res)
              this.checkResult(res.code)
            }, err => {
              console.log(err)
            })
          } else {
            return false
          }
        })
      } else {
        this.visible = false
        this.reinspected = 0
        this.$emit('ok')
      }
    },
    checkResult(res) {
      if (res == 200) {
        this.reinspected = 1
        this.cleanData()
      } else {
        this.reinspected = -1
        this.cleanData()
      }
    },
    viewDetail() {
      this.visible = false
      if (this.$route.fullPath.includes('/orderDetail')) {
        this.handleOk()
      } else {
        this.$router.push({ name: 'orderDetail', params: { id: this.record.id } })
      }
      this.record = null
    },
    cleanData() {
      this.model.affectOmics = null
      this.model.reDetectType = null
    }
  }
}
</script>

<style scoped lang='less'>
.label-title {
  margin-bottom: 20px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;
  font-size: 16px;
  line-height: 1.5;
}

.checkBox {
  text-align: center;
}

/deep/ .hideBtn {
  display: none !important;
}
</style>