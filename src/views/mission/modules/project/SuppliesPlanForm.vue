<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <!-- <a-col :span="24">
          <a-form-model-item label="耗材编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialId">
            <a-input v-model="model.materialId" placeholder="请输入耗材编号"></a-input>
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
          <a-form-model-item label="耗材总需求量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="totalNo">
            <a-input v-model="model.totalNo" placeholder="请输入耗材总需求量"></a-input>
          </a-form-model-item>
        </a-col>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'

export default {
  name: 'SuppliesPlanForm',
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
      materialList: [],
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
        totalNo: [{ required: true, message: '请输入耗材总需求量', trigger: 'blur' }],
      },
      url: {
        add: '/mission/projectMaterial/add',
        edit: '/mission/projectMaterial/edit',
        queryById: '/mission/projectMaterial/queryById'
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
          let httpurl = ''
          let method = ''
          if (!newModel.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
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
