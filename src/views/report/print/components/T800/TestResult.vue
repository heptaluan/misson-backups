<template>
<div class="test-result test-result-t800">
 <h3>二、检测结果</h3>
 <h4 v-html="title"></h4>
  <div class="test-result-content">
    <div class="content-mask"></div>
    <p>{{result.content}}
      <a-checkbox @change="onChange" v-model="riskLevel.high"></a-checkbox>高风险（70-100分）<a-checkbox @change="onChange" v-model="riskLevel.mid"></a-checkbox>中风险（50-70分）<a-checkbox @change="onChange" v-model="riskLevel.low"></a-checkbox>低风险（0-50分）
    </p>
    <div class="hot-pic">
      <img :src="result.hotpointPic" class="hot-pic-image">
    </div>
    <p v-html="result.interpretation" class="pic-tips"></p>
  </div>
</div>
</template>

<script>
import { proteinResult, dicomResult as dicom } from '../../../template/resource/constant'
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
        interpretation: '上图结果为肺癌发生发展中某些显著性差异的内源性分子物质的含量情况，每个格子表示一种肿瘤生化分子，'
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
      return this.$route.params.template
    },
    title () {
      return '1. 生化分子组学检测结果'
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
      const text = '生化分子是生物功能的终端产物，其改变可反映生物体某一特定生理时期内的活动情况，与疾病表型关系也最为密切。'
      this.result.content = `${text} 该样本结节良恶性评分为${this.data.ananpanReportValue}分，肺结节恶性程度为:`
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
<style lang="less">
.preview-container {
  .test-result-t800 {
    &.test-result {
      margin-top: 25px;
      .pic-tips {
        font-size: 12px;
      }
    }

    .hot-pic {
      width: 70%;
      margin: 0 auto;
    }
  }
}
</style>
