<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="行政区名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="请输入行政区名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="上级行政区划" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="parentId">
              <a-input v-model="model.parentId" placeholder="请输入上级行政区划"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="地区名称简称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="shortName">
              <a-input v-model="model.shortName" placeholder="请输入地区名称简称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="行政级别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="levelType">
              <a-input-number v-model="model.levelType" placeholder="请输入行政级别" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="区号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="cityCode">
              <a-input v-model="model.cityCode" placeholder="请输入区号"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="邮编" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="zipCode">
              <a-input v-model="model.zipCode" placeholder="请输入邮编"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="合并路径名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="mergerName">
              <a-input v-model="model.mergerName" placeholder="请输入合并路径名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="经度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="lng">
              <a-input v-model="model.lng" placeholder="请输入经度"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="纬度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="lat">
              <a-input v-model="model.lat" placeholder="请输入纬度"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="地区拼音" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="pinyin">
              <a-input v-model="model.pinyin" placeholder="请输入地区拼音"  ></a-input>
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
    name: 'SyRegionsForm',
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
           name: [
              { required: true, message: '请输入行政区名称!'},
           ],
           parentId: [
              { required: true, message: '请输入上级行政区划!'},
           ],
           levelType: [
              { required: true, message: '请输入行政级别!'},
           ],
        },
        url: {
          add: "/system/syRegions/add",
          edit: "/system/syRegions/edit",
          queryById: "/system/syRegions/queryById"
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