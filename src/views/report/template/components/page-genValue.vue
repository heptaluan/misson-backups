<template>
  <div class="gen-result padding-top-bottom-md">
    <h4>3. 表观遗传组学检测结果 </h4>
    <p class="text-indent">DNA 表观遗传修饰是基因调控过程的关键机制，其异常多与癌症等重大疾病的发生发展密切
      相关。基于血液样本 DNA 的甲基化、羟甲基化改变可用于癌症早期诊断、癌前病变管理以及预
      后。</p>
    <p class="text-indent">结合高通量 5hmC DNA 羟甲基化检测结果及自主研发模型综合评估，该样本肺癌病变风险数值
      为 {{data.geneReportValue.toFixed(1)}}（cut-off 值为 {{cutOff}}），评估为{{riskLevel}}。
    </p>
    <div class="hot-pic">
      <img :src="geneReportImage" class="hot-pic-image">
    </div>
<!--    <div>-->
<!--      <gen-chart :score="data.geneReportValue" ></gen-chart>-->
<!--    </div>-->
    <div class="result-tips">
      <p>判分数值：</p>
      <p>· 基于现有模型分析，人群中的肺癌羟甲基化判分阈值为：{{cutOff}}（判分阈值可能随样本的增加及模型优化更新）；</p>
      <p>· 判分数值越小，肺结节恶性可能性越低；判分数值越大，肺结节恶性可能性越高；</p>
      <p>· 建议结合患者病史、家族史及其他临床资料综合评估判断，适时跟踪监测。</p>
    </div>
  </div>
</template>

<script>
  import {cutOff} from '../resource/constant'
  import genChart from './genChart'
  export default {
    name: 'page-genValue',
    props: {
      data: {
        type: Object,
        require: true
      }
    },
    components: { genChart },
    computed:{
      riskLevel() {
        const { geneReportValue } = this.data
        const text =  geneReportValue >= 60 ? '高风险' :  '低风险'
        return text
      },
      geneReportImage () {
        const { geneReportAll } = this.data
        return geneReportAll
      }
    },
    data() {
      return {
        cutOff
      }
    }
  }
</script>
