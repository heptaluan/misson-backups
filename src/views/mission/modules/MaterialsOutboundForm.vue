<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="耗材ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialId">
              <a-input v-model="model.materialId" placeholder="请输入耗材ID"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="耗材编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialCode">
              <a-input v-model="model.materialCode" placeholder="请输入耗材编号"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="耗材名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialName">
              <a-input v-model="model.materialName" placeholder="请输入耗材名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="出库数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="materialPcs">
              <a-input-number v-model="model.materialPcs" placeholder="请输入出库数量" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="出库时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="outTime">
              <j-date placeholder="请选择出库时间" v-model="model.outTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="出库状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="maStatus">
              <a-input v-model="model.maStatus" placeholder="请输入出库状态"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="审核时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="auditTime">
              <j-date placeholder="请选择审核时间" v-model="model.auditTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="审核人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="auditId">
              <a-input v-model="model.auditId" placeholder="请输入审核人"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="仓库" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="warehouseId">
              <j-dict-select-tag type="list" v-model="model.warehouseId" dictCode="warehouse_manage,name,id" placeholder="请选择仓库" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="所属项目" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectId">
              <j-dict-select-tag type="list" v-model="model.projectId" dictCode="project_info,project_name,id" placeholder="请选择所属项目" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="出库类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="outboundType">
              <j-dict-select-tag type="list" v-model="model.outboundType" dictCode="outband_type" placeholder="请选择出库类型" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="出库对象" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="outboundObject">
              <j-dict-select-tag type="list" v-model="model.outboundObject" dictCode="" placeholder="请选择出库对象" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="快递单号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="emsNo">
              <a-input v-model="model.emsNo" placeholder="请输入快递单号"  ></a-input>
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
    name: 'MaterialsOutboundForm',
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
          add: "/mission/materialsOutbound/add",
          edit: "/mission/materialsOutbound/edit",
          queryById: "/mission/materialsOutbound/queryById"
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