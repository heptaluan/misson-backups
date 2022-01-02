<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="文件存放位置" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="fileUrl">
              <a-input v-model="model.fileUrl" placeholder="请输入文件存放位置"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="归属类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ownershipType">
              <j-dict-select-tag type="list" v-model="model.ownershipType" dictCode="	ownership_type" placeholder="请选择归属类型" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="归属ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ownerId">
              <a-input v-model="model.ownerId" placeholder="请输入归属ID"  disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="原文件名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="fileName">
              <a-input v-model="model.fileName" placeholder="请输入原文件名称" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="文件后缀" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="fileSuffix">
              <a-input v-model="model.fileSuffix" placeholder="请输入文件后缀" ></a-input>
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
    name: 'FileInfoForm',
    components: {
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      },
      fileType: {
        type: String,
        default: '1',
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
      this.modelDefault.ownershipType = this.fileType
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
                that.$emit('ok', res.result);
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }

        })
      }
    }
  }
</script>