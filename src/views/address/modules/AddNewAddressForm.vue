<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="rules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="地址名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="addressName">
              <a-input v-model="model.addressName" placeholder="请输入地址名称"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="地址详情" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="address">
              <a-input v-model="model.address" placeholder="请输入地址详情" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="地址类别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="catalog">
              <j-dict-select-tag
                type="list"
                v-model="model.catalog"
                dictCode="address_catalog"
                placeholder="请选择地址类别"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'

export default {
  name: 'AddNewAddressForm',
  components: {},
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      validatorRules: {},
      url: {
        add: '/tailai-system/mission/addressInfo/add',
        edit: '/tailai-system/mission/addressInfo/edit',
        queryById: '/tailai-system/mission/addressInfo/queryById'
      },
      rules: {
        addressName: [{ required: true, message: '请输入地址名称', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址详情', trigger: 'blur' }],
        catalog: [{ required: true, message: '请选择地址类别', trigger: 'change' }],
      }
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    }
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  methods: {
    add() {
      this.edit(this.modelDefault)
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.visible = true
    },
    submitForm() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          httpAction(httpurl, this.model, method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
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
</script>
