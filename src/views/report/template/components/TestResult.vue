<template>
<div class="test-result">
 <h3>二、检测结果</h3>
 <h4 v-html="title"></h4>
  <div class="test-result-content">
    <div class="content-mask"></div>
    <p>{{result.content}}
      <a-checkbox @change="onChange" v-model="riskLevel.high"></a-checkbox>高风险（70-100分）<a-checkbox @change="onChange" v-model="riskLevel.mid"></a-checkbox>中风险（50-70分）<a-checkbox @change="onChange" v-model="riskLevel.low"></a-checkbox>低风险（0-50分）{{suggest}}
    </p>
    <div class="hot-pic">
      <img :src="result.hotpointPic" class="hot-pic-image">
    </div>
    <p v-html="result.interpretation" class="pic-tips"></p>
  </div>
  <h4>2. 医学影像人工智能阅片分析结果</h4>
  <p class="text-indent">人工智能肺结节筛查引擎，可根据受检者CT影像识别肺窗视图下肺内的结节（<strong>对于纵隔囊肿,肺壁的增厚等检出具有局限性</strong>），同时对检测到的结节进行大小，体积，位置，形态类型等进行判读，并综合分析结节良恶性概率，恶性概率越高，肺部结节恶性风险就越高。</p>
  <p class="text-indent" v-if="this.dicomResult.scrynMaligant >= 60">人工智能阅片分析，该受检者双肺共检出{{data.total}}个结节（具体信息详见下图），其中{{total}}个结节恶性程度评估为高风险（<span>结节恶性风险为：{{dicomResult.scrynMaligant}} %</span>）。<span v-if="total">具体信息为：</span></p>
  <p class="text-indent" v-if="this.dicomResult.scrynMaligant <60 && data.total">人工智能阅片分析，该受检者双肺共检出{{data.total}}个结节（具体信息详见下图），经人工智能肺结节筛查分析显示：结节恶性程度均为<strong>低风险</strong>。</p>
  <p class="text-indent" v-if="!data.total">人工智能阅片分析，该受检者双肺未检出结节。</p>
</div>
</template>

<script>
import { proteinResult, dicomResult as dicom } from '../resource/constant'
export default {
  name: 'test-result',
  props: {
    data: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      riskLevel: {
        high: false,
        mid: false,
        low: false
      },
      result: {
        content: '',
        hotpointPic: 'http://img.ananpan.com/report_img/-yv2VRFZfIN5U6-oVRMJHSgAtKw1QhBHmVbOjRnOjE-GVpkAqy862Kl0WQGszYLB.jpg?imageMogr2/thumbnail/1800x/format/jpg',
        interpretation: proteinResult.interpretation
      },
      dicomResult: {}
    }
  },
  computed: {
    suggest () {
      const { ananpanReportValue } = this.data
      const _suggest = ananpanReportValue >= 70 ? proteinResult.high.suggest : (ananpanReportValue >= 50 ? proteinResult.mid.suggest : proteinResult.low.suggest)
      return _suggest
    },
    total () {
      return this.data.pulmonaryNodules.length
    },
    template () {
      return this.$route.name === 'PagePreviewSD' ? 'sd' : 'com'
    },
    title () {
      return this.$route.name === 'PagePreviewSD' ? '1. 生化分子组学（蛋白组学/代谢组学）检测结果' : '1. 生化分子组学检测结果'
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.data.ananpanReportValue >= 70) {
        this.riskLevel.high = true
      } else if ((this.data.ananpanReportValue >= 50)) {
        this.riskLevel.mid = true
      } else {
        this.riskLevel.low = true
      }
      const text = this.$route.name === 'PagePreviewSD' ? '生化分子是生物功能的终端产物，其改变可反映生物体某一特定生理时期内的活动情况，与疾病表型关系也最为密切。蛋白大分子物质和代谢小分子物质都属于生物体内的生化分子。' : '生化分子是生物功能的终端产物，其改变可反映生物体某一特定生理时期内的活动情况，与疾病表型关系也最为密切。'
      this.result.content = `${text}通过对肺癌发生发展中某些显著性差异的内源性分子物质的含量检测，经综合评估，该样本结节良恶性评分为${this.data.ananpanReportValue.toFixed(1)}分，肺结节恶性程度为:`
      this.dicomResult = JSON.parse(this.data.imageReportAll)
      this.dicomResult.scrynMaligant = this.data.imageReportValue
      this.dicomResult.interpretation = this.dicomResult.scrynMaligant >= 60 ? dicom.interpretation : dicom.low
      this.result.hotpointPic = `http://${this.data.ananpanReportAll}`
    },
    onChange (checkedValue) {
      return false
    }
  }
}
</script>
