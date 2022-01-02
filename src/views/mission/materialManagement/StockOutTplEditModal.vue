<template>
  <div>
    <j-modal
      :width="width"
      :title="title"
      :visible="visible"
      switchFullscreen
      cancelText="关闭"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model ref="form" :model="model" :rules="rules">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialName">
              <a-input disabled v-model="model.materialName" placeholder="请输入名称"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="样本类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sampleType">
              <j-dict-select-tag
                type="list"
                v-model="model.sampleType"
                dictCode="sample_type"
                placeholder="请选择样本类型"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="规格" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="units">
              <a-input
                style="width:100%;"
                v-model="model.units"
                placeholder="请输入规格"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="自定义后缀" :labelCol="labelCol" :wrapperCol="wrapperCol" >
              <a-input v-model="model.suffix" placeholder="请输入自定义后缀"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="份数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="pcs">
              <a-input-number
                style="width: 100%"
                :min="1"
                :max="200"
                v-model="model.pcs"
                placeholder="请输入份数"
              ></a-input-number>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="说明" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-input v-model="model.remark" placeholder="请输入说明"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-modal>
  </div>
</template>

<script>
import { mixinDevice } from '@/utils/mixin'

export default {
  name: 'StockOutTplEditModal',
  mixins: [mixinDevice],
  components: {},
  data() {
    return {
      width: 800,
      title: '编辑',
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      model: {},
      rules: {
        sampleType: [{ required: true, message: '请选择样本类别', trigger: 'blur' }],
        units: [{ required: true, message: '请输入规格', trigger: 'blur'}],
        suffix: [
          {
            required: true,
            message: '请输入两位以内字符（仅限字母）的自定义后缀',
            trigger: 'blur',
            pattern: /^[a-zA-Z]{1,2}$/
          }
        ],
        pcs: [{ required: true, message: '请输入份数（仅限正整数）', trigger: 'blur', pattern: /^[1-9]\d*$/ }]
      },
      list: null,
      url: {
        list: 'unload'
      },
      index: ''
    }
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  methods: {
    show(record, index) {
      console.log(record)
      this.index = index
      this.visible = true
      if (record.sampleType === '') {
        record.sampleType = undefined
      }
      this.model = Object.assign({}, record)
    },
    handleCancel() {
      console.log(`取消`)
      this.visible = false
    },
    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('ok', this.model, this.index)
          this.visible = false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
