<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="单位角色" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialId">
                <j-dict-select-tag
                  type="list"
                  v-model="model.corporationType"
                  dictCode="agency_cooperate_type"
                  placeholder="请选择单位角色"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item label="合作单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialType">
                <a-select v-model="model.agencyId" placeholder="请选择合作单位">
                  <a-select-option v-for="item in subCenterList" :key="item.id" :value="item.id">
                    {{ item.departName }}
                  </a-select-option>
                </a-select>
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
import { getCooperationUnitList } from 'src/api/mission/project'

export default {
  name: 'AddCooperationForm',
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
      model: {
        agencyId: undefined,
        corporationType: undefined
      },
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
      subCenterList: [],
      url: {
        add: '/mission/cooperationAgency/project'
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
      const newModal = Object.assign(
        {},
        {
          projectId: this.getParams('id')
        },
        this.model
      )
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!newModal.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          httpAction(httpurl, newModal, method)
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
    loadData() {
      const that = this
      getCooperationUnitList().then(res => {
        if (res.success) {
          that.subCenterList = res.result
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    getParams(key) {
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
  },
  mounted() {
    this.loadData()
  }
}
</script>
