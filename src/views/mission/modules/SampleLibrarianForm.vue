<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="样本编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sampleCode">
              <a-input v-model="model.sampleCode" placeholder="请输入样本编号"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="医院" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hoId">
              <a-input v-model="model.hoId" placeholder="请输入医院"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="性质" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="physicalProperty">
              <a-input v-model="model.physicalProperty" placeholder="请输入性质"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="癌种" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="typesCancer">
              <a-input v-model="model.typesCancer" placeholder="请输入癌种"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="被测试者姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="testName">
              <a-input v-model="model.testName" placeholder="请输入被测试者姓名"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="被测试者性别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="testSex">
              <a-input-number v-model="model.testSex" placeholder="请输入被测试者性别" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="年龄" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="testAge">
              <a-input-number v-model="model.testAge" placeholder="请输入年龄" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="身份证号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="testIdcard">
              <a-input v-model="model.testIdcard" placeholder="请输入身份证号"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="收录日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="collectionDate">
              <j-date placeholder="请选择收录日期" v-model="model.collectionDate"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="位置编号ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bloodPositionId">
              <a-input v-model="model.bloodPositionId" placeholder="请输入位置编号ID"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="影像ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="imageId">
              <a-input v-model="model.imageId" placeholder="请输入影像ID"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="报告ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportId">
              <a-input v-model="model.reportId" placeholder="请输入报告ID"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="样本扩展JSON" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sampleExt">
              <a-input v-model="model.sampleExt" placeholder="请输入样本扩展JSON"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="原始数据" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="rawData">
              <a-input v-model="model.rawData" placeholder="请输入原始数据"  ></a-input>
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
    name: 'SampleLibrarianForm',
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
          add: "/mission/sampleLibrarian/add",
          edit: "/mission/sampleLibrarian/edit",
          queryById: "/mission/sampleLibrarian/queryById"
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