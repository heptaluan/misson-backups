<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    cancelText="关闭"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-row>
        <a-col :span="24">
          <a-form-model-item label="耗材编码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialCode">
            <a-input :disabled="formDisabled" v-model="form.materialCode" placeholder="请输入耗材编码"></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item label="耗材名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialName">
            <a-input :disabled="formDisabled" v-model="form.materialName" placeholder="请输入耗材名称"></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item label="耗材型号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialModel">
            <j-dict-select-tag
              :disabled="formDisabled"
              type="list"
              v-model="form.materialModel"
              dictCode="model_management,model,id"
              placeholder="请输入耗材型号"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item label="耗材类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialType">
            <j-dict-select-tag
              :disabled="formDisabled"
              type="list"
              v-model="form.materialType"
              dictCode="supplies_name"
              placeholder="请输入耗材类型"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item label="供应商" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="factoryId">
            <j-dict-select-tag
              :disabled="formDisabled"
              type="list"
              v-model="form.factoryId"
              dictCode="third_company,ca_name,id,ca_type=2"
              placeholder="请选择供应商"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
            <a-input :disabled="formDisabled" v-model="form.remark" placeholder="请输入备注"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </j-modal>
</template>

<script>
import { mixinDevice } from '@/utils/mixin'
import { httpAction } from '@/api/manage'

export default {
  name: 'AddStockModal',
  mixins: [mixinDevice],
  data() {
    return {
      title: '新增耗材',
      width: 800,
      visible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
      form: {
        materialCode: '',
        materialName: '',
        materialModel: undefined,
        materialType: undefined,
        factoryId: undefined,
        remark: ''
      },
      rules: {
        materialCode: [{ required: true, message: '请输入耗材编码', trigger: 'blur' }],
        materialName: [{ required: true, message: '请输入耗材名称', trigger: 'blur' }],
        materialModel: [{ required: true, message: '请输入耗材型号', trigger: 'change' }],
        materialType: [{ required: true, message: '请输入耗材类型', trigger: 'change' }],
        factoryId: [{ required: true, message: '请选择供应商', trigger: 'change' }]
        // remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      // 表头
      columns: [],
      url: {
        edit: '/tailai-system/mission/materialManagement/edit'
      },
      formDisabled: false
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    edit(record, type) {
      if (type === 'detail') {
        this.formDisabled = true
      } else {
        this.formDisabled = false
      }
      this.visible = true
      this.$nextTick(() => {
        this.form = Object.assign({}, record)
      })
    },
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      if (this.formDisabled) {
        this.visible = false
      } else {
        const that = this
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true
            let httpurl = ''
            let method = ''
            if (!this.form.id) {
              httpurl += this.url.add
              method = 'post'
            } else {
              httpurl += this.url.edit
              method = 'put'
            }
            httpAction(httpurl, this.form, method)
              .then(res => {
                if (res.success) {
                  that.$message.success(res.message)
                  that.$emit('ok')
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
      }
    }
  }
}
</script>
