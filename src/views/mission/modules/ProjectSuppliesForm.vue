<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="项目ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectId">
              <j-dict-select-tag type="list" v-model="model.projectId" dictCode="project_info,project_name,id" placeholder="请选择项目ID" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="耗材ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialId">
              <j-dict-select-tag type="list" v-model="model.materialId" dictCode="material_management,material_name,id" placeholder="请选择耗材ID" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="耗材总量需求" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="totalNo">
              <a-input-number v-model="model.totalNo" placeholder="请输入耗材总量需求" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="耗材寄送总量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="totalEmsNo">
              <a-input-number v-model="model.totalEmsNo" placeholder="请输入耗材寄送总量" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="耗材剩余量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="totalStockNo">
              <a-input-number v-model="model.totalStockNo" placeholder="请输入耗材剩余量" style="width: 100%" />
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
    name: 'ProjectSuppliesForm',
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
          add: "/mission/projectSupplies/add",
          edit: "/mission/projectSupplies/edit",
          queryById: "/mission/projectSupplies/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
         
        })
      },
    }
  }
</script>