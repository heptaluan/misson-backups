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
            <a-form-model-item label="批次号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="batchNo">
              <a-input v-model="model.batchNo" placeholder="请输入批次号"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="样本类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sampleType">
              <j-dict-select-tag type="list" v-model="model.sampleType" dictCode="sample_type" placeholder="请选择样本类型" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="样本编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sampleCode">
              <a-input v-model="model.sampleCode" placeholder="请输入样本编号"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="冰箱" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="refrigeratorId">
              <a-input v-model="model.refrigeratorId" placeholder="请输入冰箱"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="层数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="floor">
              <a-input-number v-model="model.floor" placeholder="请输入层数" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="格" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="place">
              <a-input-number v-model="model.place" placeholder="请输入格" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="行" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="row">
              <a-input v-model="model.row" placeholder="请输入行"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="列" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="col">
              <a-input v-model="model.col" placeholder="请输入列"  ></a-input>
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
    name: 'SamplePutinForm',
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
          add: "/mission/samplePutin/add",
          edit: "/mission/samplePutin/edit",
          queryById: "/mission/samplePutin/queryById"
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