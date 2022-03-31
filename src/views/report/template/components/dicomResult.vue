<template>
  <div class="dicom-result">
    <p v-for="(item, index) in pulmonaryNodules" :key="index" v-html="getContent(item)" v-if="pulmonaryNodules" class="text-indent"></p>
    <p class="text-indent padding-top-bottom-xs" v-html="interpretation" v-if="data.showTips"></p>
    <div class="dicom-result-item" v-for="(item, index) in data.image" :key="index">
      <div class="item-content-image">
        <div class="title" v-html="item.title"></div>
        <div class="b-flex">
          <dicom-image :url="item.imageUrl1" footer="横断面" style="margin-right: 2px"></dicom-image>
          <dicom-image :url="item.imageUrl2" footer="局部细节"></dicom-image>
        </div>
      </div>
      <div class="item-content-info">
        <div class="title">AI影像表现</div>
        <div class="item-info-row">
          <label>影像层:</label>
          <span v-html="item.imageIndex" class="font-TimesRoman"></span>
        </div>
        <div class="item-info-row">
          <label>肺:</label>
          <span v-html="item.lungLocation"></span>
        </div>
        <div class="item-info-row">
          <label>肺叶:</label>
          <span v-html="item.lobeLocation"></span>
        </div>
        <div class="item-info-row">
          <label>大小:</label>
          <span v-html="fixDiameter(item.diameter)" class="font-TimesRoman"></span>
        </div>
        <div class="item-info-row">
          <label>体积:</label>
          <span v-html="item.noduleSize + ' mm³'" class="font-TimesRoman"></span>
        </div>
        <div class="item-info-row">
          <label>形态类型:</label>
          <span v-html="item.featureLabel"></span>
        </div>
        <div class="item-info-row">
          <label>标准直径:</label>
          <span v-html="item.diameterNorm + ' mm'" class="font-TimesRoman"></span>
        </div>
        <div class="item-info-row">
          <label>恶性风险:</label>
          <span v-html="fixMaligant(item.scrynMaligant)" class="font-TimesRoman"></span>
        </div>
        <div class="item-info-row">
          <label>中心密度:</label>
          <span v-html="item.centerHu + ' HU'" class="font-TimesRoman"></span>
        </div>
        <div class="item-info-row">
          <label>平均密度:</label>
          <span v-html="item.meanHu + ' HU'" class="font-TimesRoman"></span>
        </div>
        <div class="item-info-row">
          <label>最大密度:</label>
          <span v-html="item.maxHu + ' HU'" class="font-TimesRoman"></span>
        </div>
        <div class="item-info-row">
          <label>最小密度:</label>
          <span v-html="item.minHu + ' HU'" class="font-TimesRoman"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { dicomResult } from '../resource/constant'
  import DicomImage from './dicomImage'
  export default {
    name: 'dicom-result',
    components: { DicomImage },
    props: {
      data: {
        type: Object,
        require: true
      },
      pulmonaryNodules: {
        type: Array,
        require: true
      },
      pageConfig: {
        type: Object,
        require: true
      },
      imageReportValue: {
        type: Number,
        require: true
      }
    },
    data () {
      return {
      }
    },
    computed: {
      interpretation () {
        const { imageReportValue } = this
        return imageReportValue >= 60 ? dicomResult.interpretation : dicomResult.low
      }
    },
    methods: {
      getContent (item) {
        const { index, imageIndex, diameter, noduleSize, centerHu, scrynMaligant, featureLabel, lobeLocation, lungLocation } = item
        const diameterText = this.fixDiameter(diameter)
        return `结节${index}：于${lungLocation}${lobeLocation}影像（IMG ${imageIndex}）可见一${featureLabel}结节，大小约 ${diameterText}，CT值约 ${centerHu} HU，体积约 ${noduleSize} mm³, 结节恶性风险为：${scrynMaligant} %。`
      },
      fixMaligant (value) {
        let retValue = 0
        try {
          const numberValue = value.replace('%', '')
          retValue = parseFloat(numberValue).toFixed(0)
        } catch (e) {
          console.log(e)
        }
        return retValue + ' %'
      },
      fixDiameter (value) {
        return value.replace('mm*', ' mm* ')
      }
    }
  }
</script>
<style lang="less">
  .dicom-result-item {
    display: flex;
    padding-bottom: 10px;
    padding-top: 5px;
    border-bottom: 1px solid #0000003b;

    .item-content-image {
      flex: 2;

      .result-image {
        max-width: 100%;
      }
    }
    .title {
      color: rgba(0, 0, 0, .85);
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .item-content-info {
      flex: 1;
      padding: 0 1.2cm;
    }
    .item-info-row {
      margin-bottom: 0;

      > label {
        font-weight: bold;
        margin-right: 10px;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>
