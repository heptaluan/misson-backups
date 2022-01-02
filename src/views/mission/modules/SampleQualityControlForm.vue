<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="项目" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectId">
              <a-input v-model="model.projectId" placeholder="请输入项目"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="样本编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sampleCode">
              <a-input v-model="model.sampleCode" placeholder="请输入样本编号"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="样本类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sampleType">
              <a-input-number v-model="model.sampleType" placeholder="请输入样本类型" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="批次号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="batchNo">
              <a-input v-model="model.batchNo" placeholder="请输入批次号"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="样本质控指导手册" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="qcFileId">
              <a-input v-model="model.qcFileId" placeholder="请输入样本质控指导手册"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="质控责任人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="qcContactId">
              <a-input v-model="model.qcContactId" placeholder="请输入质控责任人"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="执行时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="qcPerformTime">
              <j-date placeholder="请选择执行时间" v-model="model.qcPerformTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="报告时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="qcReportTime">
              <j-date placeholder="请选择报告时间" v-model="model.qcReportTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否合格" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isPass">
              <a-input-number v-model="model.isPass" placeholder="请输入是否合格" style="width: 100%" />
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
    name: 'SampleQualityControlForm',
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
          add: "/mission/sampleQualityControl/add",
          edit: "/mission/sampleQualityControl/edit",
          queryById: "/mission/sampleQualityControl/queryById"
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