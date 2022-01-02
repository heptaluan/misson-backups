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
              <j-dict-select-tag type="list" v-model="model.sampleType" dictCode="sample_type" placeholder="请选择样本类型" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="批次号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="batchNo">
              <a-input v-model="model.batchNo" placeholder="请输入批次号"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="检测指导手册" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="testingFileId">
              <a-input v-model="model.testingFileId" placeholder="请输入检测指导手册"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="检测执行时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="testingTime">
              <j-date placeholder="请选择检测执行时间" v-model="model.testingTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="检测报告时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="testingReportTime">
              <j-date placeholder="请选择检测报告时间" v-model="model.testingReportTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="检测报告" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="testingReportfileId">
              <a-input v-model="model.testingReportfileId" placeholder="请输入检测报告"  ></a-input>
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
    name: 'SampleTestingForm',
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
          add: "/mission/sampleTesting/add",
          edit: "/mission/sampleTesting/edit",
          queryById: "/mission/sampleTesting/queryById"
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