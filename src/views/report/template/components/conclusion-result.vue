<template>
  <div class="conclusion-result padding-top-bottom-md">
    <div class="result-table b-flex text-center" v-if="template === 'sd'">
      <div class="result-table-col b-flex flex-col item-number">
        <div class="result-table-item item-header">序号</div>
        <div class="result-table-item">1</div>
        <div class="result-table-item">2</div>
        <div class="result-table-item">3</div>
      </div>
      <div class="result-table-col b-flex-4 b-flex flex-col">
        <div class="result-table-item item-header">项目</div>
        <div class="result-table-item">蛋白组学检测</div>
        <div class="result-table-item">代谢组学检测</div>
        <div class="result-table-item padding-left-right-xs">
          <p>医学影像人工智能阅片分析</p>
        </div>
      </div>
      <div class="result-table-col b-flex-3 b-flex flex-col">
        <div class="result-table-item item-header">结果（综合评分）</div>
        <div class="result-table-item text-h120">{{conclusionText}}</div>
      </div>
      <div class="result-table-col b-flex-4 b-flex flex-col">
        <div class="result-table-item item-header">参考值（评分范围）</div>
        <div class="result-table-item text-h120 flex-evenly">
          <p class="margin-bottom-xs">低风险：0~50分（不含50分）</p>
          <p class="margin-bottom-xs">中风险：50~70分（含50分）</p>
          <p class="margin-bottom-xs">高风险：70~100分（含70分）</p>
        </div>
      </div>
    </div>
    <div class="result-table b-flex text-center result-table-common" v-if = "template !== 'sd' && choseProduct === 'FA'" >
      <div class="result-table-col b-flex flex-col item-number">
        <div class="result-table-item item-header">序号</div>
        <div class="result-table-item">1</div>
        <div class="result-table-item">2</div>
      </div>
      <div class="result-table-col b-flex-4 b-flex flex-col">
        <div class="result-table-item item-header">项目</div>
        <div class="result-table-item">生化分子组学检测</div>
        <div class="result-table-item padding-left-right-xs">
          <p>医学影像人工智能阅片分析</p>
        </div>
      </div>
      <div class="result-table-col b-flex-2 b-flex flex-col">
        <div class="result-table-item item-header">综合评估</div>
        <div class="result-table-item text-h80">{{conclusionText}}</div>
      </div>
      <div class="result-table-col b-flex-4 b-flex flex-col">
        <div class="result-table-item item-header">参考值（评分范围）</div>
        <div class="result-table-item text-h80 flex-evenly">
          <p class="margin-bottom-xs">低风险：0~50分（不含50分）</p>
          <p class="margin-bottom-xs">中风险：50~70分（含50分）</p>
          <p class="margin-bottom-xs">高风险：70~100分（含70分）</p>
        </div>
      </div>
    </div>
    <div class="result-table b-flex text-center result-table-common" v-if = "template !== 'sd' && choseProduct === 'FK'" >
      <div class="result-table-col b-flex flex-col item-number">
        <div class="result-table-item item-header">序号</div>
        <div class="result-table-item">1</div>
        <div class="result-table-item">2</div>
        <div class="result-table-item">3</div>
      </div>
      <div class="result-table-col b-flex-4 b-flex flex-col">
        <div class="result-table-item item-header">项目</div>
        <div class="result-table-item">生化分子组学检测</div>
        <div class="result-table-item padding-left-right-xs">
          <p>医学影像人工智能阅片分析</p>
        </div>
        <div class="result-table-item padding-left-right-xs">
          <p>表观遗传学检测</p>
        </div>
      </div>
      <div class="result-table-col b-flex-2 b-flex flex-col">
        <div class="result-table-item item-header">综合评估</div>
        <div class="result-table-item text-h120">{{conclusionText}}</div>
      </div>
      <div class="result-table-col b-flex-4 b-flex flex-col">
        <div class="result-table-item item-header">参考值（评分范围）</div>
        <div class="result-table-item text-h120 flex-evenly">
          <p class="margin-bottom-xs">低风险：0~50分（不含50分）</p>
          <p class="margin-bottom-xs">中风险：50~70分（含50分）</p>
          <p class="margin-bottom-xs">高风险：70~100分（含70分）</p>
        </div>
      </div>
    </div>
    <div class="result-tips">
      <p>注：</p>
      <p>①　“判分分值”和“综合评估结果”评分均为泰莱生物自主研发的评判模型计算获得，能有效进行肺结节良恶性区分。</p>
      <p>②　检测数值与肺结节恶变程度呈正相关，分值越大，表示受检者肺结节恶变的风险越大。</p>
      <p>③　检测结果仅针对当次送检的影像数据及血液样本，仅供临床参考，不作诊断。</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'conclusion-result',
    props: {
      data: {
        type: Object,
        require: true
      },
    },
    computed: {
      conclusionText () {
        const { reportValue } = this.data
        const text =  reportValue >= 70 ? '高风险' : (reportValue >= 50 ? '中风险' : '低风险')
        const reportText = reportValue ? reportValue.toFixed(1) : ''
        return `${text}(${ reportText })`
      },
      ananpanText () {
        const { ananpanReportValue } = this.data
        const text = ananpanReportValue >= 70 ? '高风险' : (ananpanReportValue >= 50 ? '中风险' : '低风险')
        return text
      },
      template () {
        return this.$route.name === 'PagePreviewSD' ? 'sd' : 'com'
      },
      choseProduct () {
        return this.data.choseProduct
      }
    },
  }
</script>
