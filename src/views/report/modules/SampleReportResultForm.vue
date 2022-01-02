<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="代谢结果" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ananpanReportValue">
              <j-dict-select-tag type="list" v-model="model.ananpanReportValue" dictCode="" placeholder="请选择代谢结果" />
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
              <j-dict-select-tag type="list" v-model="model.imageReportValue" dictCode="" placeholder="请选择影像结果" />
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
              <j-dict-select-tag type="list" v-model="model.geneReportValue" dictCode="" placeholder="请选择基因结果" />
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
              <j-dict-select-tag type="list" v-model="model.reportValue" dictCode="" placeholder="请选择报告总结果" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="报告状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportType">
              <j-dict-select-tag type="list" v-model="model.reportType" dictCode="" placeholder="请选择报告状态" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-textarea v-model="model.remark" rows="4" placeholder="请输入备注" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="最终报告时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="resultTime">
              <j-date placeholder="请选择最终报告时间" v-model="model.resultTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="审核人ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="checkerId">
              <a-input v-model="model.checkerId" placeholder="请输入审核人ID"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="审核人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="checkerName">
              <a-input v-model="model.checkerName" placeholder="请输入审核人"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="报告版本ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportHistoryId">
              <a-input v-model="model.reportHistoryId" placeholder="请输入报告版本ID"  ></a-input>
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
    name: 'SampleReportResultForm',
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
          add: "/report/sampleReportResult/add",
          edit: "/report/sampleReportResult/edit",
          queryById: "/report/sampleReportResult/queryById"
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