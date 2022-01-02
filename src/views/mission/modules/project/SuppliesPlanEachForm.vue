<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-row>
            <!-- <a-col :span="24">
              <a-form-model-item label="序号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialCode">
                <a-input v-model="model.materialId" placeholder="请输入序号"></a-input>
              </a-form-model-item>
            </a-col> -->
            <a-col :span="24">
              <a-form-model-item label="耗材名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialId">
                <j-dict-select-tag
                  type="list"
                  v-model="model.materialId"
                  dictCode="material_management,material_name,id"
                  placeholder="请选择耗材名称"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="样本类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sampleId">
                <j-dict-select-tag
                  type="list"
                  v-model="model.sampleId"
                  dictCode="sample_type"
                  placeholder="请选择样本类型"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="规格" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="spec">
                <a-input v-model="model.spec" placeholder="请输入规格"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="自定义前缀" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="suffix">
                <a-input v-model="model.suffix" placeholder="请输入自定义前缀"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="份数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="pcs">
                <a-input v-model="model.pcs" placeholder="请输入份数"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="说明" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
                <a-input v-model="model.remark" placeholder="请输入说明"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'

export default {
  name: 'SuppliesPlanEachForm',
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
      validatorRules: {
        materialId: [{ required: true, message: '请选择耗材名称', trigger: 'change' }],
        sampleId: [{ required: true, message: '请选择样本类型', trigger: 'change' }],
        suffix: [{ min: 1, max: 1, message: '自定义前缀长度只有一位', trigger: 'blur' }],
        spec: [{ required: true, message: '请输入规格', trigger: 'blur' }],
        pcs: [{ required: true, message: '请输入份数', trigger: 'blur' }],
      },
      url: {
        add: '/mission/projectMaterial/plan/add',
        edit: '/mission/projectMaterial/plan/add',
        queryById: '/mission/projectMaterial/plan/queryById'
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
      const newModel = Object.assign({}, {
        projectId: this.getParams('id')
      }, this.model)
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true
          let httpurl = this.url.edit
          let method = 'post'
          httpAction(httpurl, newModel, method)
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
    },
    getParams (key) {
      const search = window.location.search.substring(1)
      const vars = search.split('&')
      for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=')
        if (pair[0] === key) {
          return pair[1]
        }
      }
      return false
    }
  }
}
</script>
