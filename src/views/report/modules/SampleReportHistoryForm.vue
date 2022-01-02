<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="代谢结果" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ananpanReportValue">
              <a-input-number v-model="model.ananpanReportValue" placeholder="请输入代谢结果" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="代谢总览" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ananpanReportAll">
              <a-textarea v-model="model.ananpanReportAll" rows="4" placeholder="请输入代谢总览" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="代谢报告时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ananpanTime">
              <j-date placeholder="请选择代谢报告时间" v-model="model.ananpanTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="影像结果" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="imageReportValue">
              <a-input-number v-model="model.imageReportValue" placeholder="请输入影像结果" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="影像结果总览" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="imageReportAll">
              <a-textarea v-model="model.imageReportAll" rows="4" placeholder="请输入影像结果总览" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="影像报告时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="imageTime">
              <j-date placeholder="请选择影像报告时间" v-model="model.imageTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="基因结果" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="geneReportValue">
              <a-input-number v-model="model.geneReportValue" placeholder="请输入基因结果" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="基因结果总览" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="geneReportAll">
              <a-textarea v-model="model.geneReportAll" rows="4" placeholder="请输入基因结果总览" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="基因结果时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="geneTime">
              <j-date placeholder="请选择基因结果时间" v-model="model.geneTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="报告总结果" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportValue">
              <a-input-number v-model="model.reportValue" placeholder="请输入报告总结果" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="报告状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportType">
              <a-input-number v-model="model.reportType" placeholder="请输入报告状态" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-textarea v-model="model.remark" rows="4" placeholder="请输入备注" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="修改人ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="editerId">
              <a-input v-model="model.editerId" placeholder="请输入修改人ID"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="修改人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="editer">
              <a-input v-model="model.editer" placeholder="请输入修改人"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="修改时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="editTime">
              <j-date placeholder="请选择修改时间" v-model="model.editTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="修改备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="editRemark">
              <a-input v-model="model.editRemark" placeholder="请输入修改备注"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="报告来源" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportSourceId">
              <a-input v-model="model.reportSourceId" placeholder="请输入报告来源"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="报告历史来源" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportHistoryId">
              <a-input v-model="model.reportHistoryId" placeholder="请输入报告历史来源"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="报告版本" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportVersion">
              <a-input-number v-model="model.reportVersion" placeholder="请输入报告版本" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="订单编号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="orderId">
              <a-input v-model="model.orderId" placeholder="请输入订单编号"  ></a-input>
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
    name: 'SampleReportHistoryForm',
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
          add: "/report/sampleReportHistory/add",
          edit: "/report/sampleReportHistory/edit",
          queryById: "/report/sampleReportHistory/queryById"
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