<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="合作单位类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="caType">
              <j-dict-select-tag type="list" v-model="model.caType" dictCode="ca_type" placeholder="请选择合作单位类型" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="合作单位名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="caName">
              <a-input v-model="model.caName" placeholder="请输入合作单位名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-model-item label="合作单位编码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="caCode">
              <a-input v-model="model.caCode" placeholder="请输入合作单位编码"  ></a-input>
            </a-form-model-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-model-item label="地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="caAddress">
              <a-input v-model="model.caAddress" placeholder="请输入地址"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="统一信用代码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="caSocialCode">
              <a-input v-model="model.caSocialCode" placeholder="请输入统一信用代码"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="网站" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="caWebsite">
              <a-input v-model="model.caWebsite" placeholder="请输入网站"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="对接人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="caDockingId">
              <j-dict-select-tag type="list" v-model="model.caDockingId" dictCode="contact_manage,full_name,id" placeholder="请选择对接人" />
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-model-item label="负责人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="caHeadId">
              <j-dict-select-tag type="list" v-model="model.caHeadId" dictCode="contact_manage,full_name,id" placeholder="请选择负责人" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="科室/部门" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="caDep">
              <a-input v-model="model.caDep" placeholder="请输入科室/部门"  ></a-input>
            </a-form-model-item>
          </a-col> -->
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'
 // const rexp = /^(?:http(s)??\/)?[\w.-]+(?:.[\w.-]+)+[\w-._~:/?#[]@!$&’*+,;=.]+$/
  export default {
    name: 'CooperationAgencyForm',
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
          caType: [{ required: true, message: '请选择合作单位类型', trigger: 'change' }],
          caName: [{ required: true, message: '请输入合作单位名称', trigger: 'blur' }],
          // caCode: [{ required: true, message: '请输入合作单位编码', trigger: 'blur' }],
          caAddress: [{ required: true, message: '请输入地址', trigger: 'blur' }],
          caSocialCode: [{ required: true, message: '请输入统一信用代码', trigger: 'blur', pattern: /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/}],
          caWebsite: [{ pattern: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/, message: '请输入正确的网址', trigger: 'blur' }],
          caDockingId: [{ required: true, message: '请选择对接人', trigger: 'change' }],
          caHeadId: [{ required: true, message: '请选择负责人', trigger: 'change' }]
        },
        url: {
          add: "/mission/cooperationAgency/add",
          edit: "/mission/cooperationAgency/edit",
          queryById: "/mission/cooperationAgency/queryById"
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