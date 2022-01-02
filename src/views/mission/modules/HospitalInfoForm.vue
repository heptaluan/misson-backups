<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="全称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hoName">
              <a-input v-model="model.hoName" placeholder="请输入全称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="简称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hoShortName">
              <a-input v-model="model.hoShortName" placeholder="请输入简称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="地区" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-cascader
                :options="areaOptions"
                v-model = "defaultArea"
                :field-names="{ label: 'name', value: 'name', children: 'children' }"
                placeholder="请选择地区"
                change-on-select
                @change="onChange"
              />
            </a-form-model-item>
          </a-col>
<!--          <a-col :span="12">-->
<!--            <a-form-model-item label="省" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hoProvince">-->
<!--              <a-input v-model="model.hoProvince" placeholder="请输入省"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="12">-->
<!--            <a-form-model-item label="市" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hoCity">-->
<!--              <a-input v-model="model.hoCity" placeholder="请输入市"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="12">-->
<!--            <a-form-model-item label="区" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hoDistrict">-->
<!--              <a-input v-model="model.hoDistrict" placeholder="请输入区"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
          <a-col :span="12">
            <a-form-model-item label="地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hoAddress">
              <a-input v-model="model.hoAddress" placeholder="请输入地址"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="负责人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="chargePeople">
              <a-input v-model="model.chargePeople" placeholder="请输入负责人"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="contractPeople">
              <a-input v-model="model.contractPeople" placeholder="请输入联系人"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="mobile">
              <a-input v-model="model.mobile" placeholder="请输入联系电话"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="email">
              <a-input v-model="model.email" placeholder="请输入邮箱"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="医院代码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="code">
              <a-input v-model="model.code" placeholder="请输入医院代码"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isActive">
              <a-input-number v-model="model.isActive" placeholder="请输入是否启用" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-input v-model="model.remark" placeholder="请输入备注"  ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
  import api from 'src/api/mission/hospital'
  import { queryTreeListForRegion } from 'src/api/api'

  export default {
    name: 'HospitalInfoForm',
    components: {
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
         },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
        },
        url: {
          add: api.add,
          edit: api.put,
          queryById: api.detail,
          getRegions: api.getRegions
        },
        areaOptions: [],
        defaultArea: []
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model))
      this.initData()
    },
    methods: {
      initData () {
        const that = this
        queryTreeListForRegion().then(res => {
          if (res.success) {
            that.areaOptions = res.result
          } else {
            this.$message.warning(res.message)
          }
        })
      },
      add () {
        this.edit(this.modelDefault);
        this.defaultArea = []
      },
      edit (record) {
        this.model = Object.assign({}, record)
        let { hoProvince, hoCity, hoDistrict} = this.model
        this.defaultArea = [hoProvince, hoCity, hoDistrict]
        this.visible = true
      },
      submitForm () {
        const that = this;
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
            httpAction(httpurl, this.model, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            }).finally(() => {
              that.confirmLoading = false
            })
          }

        })
      },
      onChange (val) {
        if (!Array.isArray(val)) return false
        const length = val.length
        if (length === 1) {
          this.model.hoProvince = val[0]
        } else if (length === 2) {
          this.model.hoProvince = val[0]
          this.model.hoCity = val[1]
        } else if (length === 3) {
          this.model.hoProvince = val[0]
          this.model.hoCity = val[1]
          this.model.hoDistrict = val[2]
        }
      }
    }
  }
</script>