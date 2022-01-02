<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="项目组" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectGroupId">
              <j-dict-select-tag type="list" v-model="model.projectGroupId" dictCode="project_group,group_name,id" placeholder="请选择项目组" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="项目编码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectCode">
              <a-input v-model="model.projectCode" placeholder="请输入项目编码"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="项目类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="physicalProperty">
              <j-dict-select-tag type="list" v-model="model.physicalProperty" dictCode="project_type" placeholder="请选择项目类型" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="项目设计" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectDesign">
              <j-dict-select-tag type="list" v-model="model.projectDesign" dictCode="project_design" placeholder="请选择项目设计" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="项目英文名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectEnName">
              <a-input v-model="model.projectEnName" placeholder="请输入项目英文名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="项目研究所处阶段" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectStage">
              <j-dict-select-tag type="list" v-model="model.projectStage" dictCode="study_phase" placeholder="请选择项目研究所处阶段" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="项目中文名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectName">
              <a-input v-model="model.projectName" placeholder="请输入项目中文名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="项目目的" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="projectGoal">
              <a-input v-model="model.projectGoal" placeholder="请输入项目目的"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="内部负责人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="chargePeopleId">
              <j-dict-select-tag type="list" v-model="model.chargePeopleId" dictCode="contact_manage,full_name,id" placeholder="请选择内部负责人" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="开始日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="startDate">
              <j-date placeholder="请选择开始日期" v-model="model.startDate"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="预计结束日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="preEndDate">
              <j-date placeholder="请选择预计结束日期" v-model="model.preEndDate"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="实际结束日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="endDate">
              <j-date placeholder="请选择实际结束日期" v-model="model.endDate"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="周期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="cycleTime">
              <a-input v-model="model.cycleTime" placeholder="请输入周期"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="项目纳入标准" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="followingInclusionStandard">
              <a-input v-model="model.followingInclusionStandard" placeholder="请输入项目纳入标准"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="项目排除标准" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="excludeStandard">
              <a-input v-model="model.excludeStandard" placeholder="请输入项目排除标准"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="样本去向" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sampleDispositon">
              <a-input v-model="model.sampleDispositon" placeholder="请输入样本去向"  ></a-input>
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
    name: 'ProjectInfoForm',
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
          add: "/mission/projectInfo/add",
          edit: "/mission/projectInfo/edit",
          queryById: "/mission/projectInfo/queryById"
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