<template>
  <div class="conclusion-result padding-top-bottom-xs">
    <div class="result-table b-flex text-center result-table-common">
      <div class="result-table-col b-flex flex-col item-number">
        <div class="result-table-item item-header">序号</div>
        <div class="result-table-item">1</div>
        <div class="result-table-item">2</div>
      </div>
      <div class="result-table-col b-flex-4 b-flex flex-col">
        <div class="result-table-item item-header">项目</div>
        <div class="result-table-item">生化分子组学检测</div>
        <div class="result-table-item padding-left-right-xs">
          <p>医学影像分析</p>
        </div>
      </div>
      <div class="result-table-col b-flex-4 b-flex flex-col">
        <div class="result-table-item item-header">分项结果</div>
        <div class="result-table-item">{{ananpanText}}</div>
        <div class="result-table-item padding-left-right-xs">
          <p>{{imageReportText}}</p>
        </div>
      </div>
      <div class="result-table-col b-flex-2 b-flex flex-col">
        <div class="result-table-item item-header">综合评估</div>
        <div class="result-table-item text-h80">{{conclusionText}}</div>
      </div>
    </div>
    <div class="result-table b-flex text-center result-table-common" v-if = "false" >
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
      <div class="result-table-col b-flex-4 b-flex flex-col" v-if="false">
        <div class="result-table-item item-header">参考值（评分范围）</div>
        <div class="result-table-item text-h120 flex-evenly">
          <p class="margin-bottom-xs">低风险：0~50分（不含50分）</p>
          <p class="margin-bottom-xs">中风险：50~70分（含50分）</p>
          <p class="margin-bottom-xs">高风险：70~100分（含70分）</p>
        </div>
      </div>
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
        return `${text}`
      },
      ananpanText () {
        const { ananpanReportValue } = this.data
        const text = ananpanReportValue >= 70 ? '高风险' : (ananpanReportValue >= 50 ? '中风险' : '低风险')
        return text
      },
      imageReportText () {
        const { imageReportValue } = this.data
        const text = imageReportValue >= 60 ? '高风险' :  '低风险'
        return text
      },
      template () {
        return this.$route.params.template
      },
      choseProduct () {
        return this.data.choseProduct
      }
    },
  }
</script>
