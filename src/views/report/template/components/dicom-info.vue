<template>
  <div class="dicom-item__content">
    <div class="item-content-image">
      <div class="title" v-html="title"></div>
      <div class="b-flex">
        <dicom-image :url="item.imageUrl1 || ''" footer="横断面" class="b-flex-2"></dicom-image>
        <dicom-image :url="item.imageUrl2 || ''" footer="局部细节" class="b-flex-1"></dicom-image>
      </div>
    </div>
    <div class="item-content-info">
      <div class="title">AI影像表观</div>
      <div class="item-info-row">
        <label>影像层:</label>
        <span v-html="item.imageIndex"></span>
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
        <span v-html="item.diameter"></span>
      </div>
      <div class="item-info-row">
        <label>体积:</label>
        <span v-html="item.noduleSize + 'mm³'"></span>
      </div>
      <div class="item-info-row">
        <label>形态类型:</label>
        <span v-html="item.featureLabel"></span>
      </div>
      <div class="item-info-row">
        <label>标准直径:</label>
        <span v-html="item.diameterNorm + 'mm'"></span>
      </div>
      <div class="item-info-row">
        <label>恶性风险:</label>
        <span v-html="item.scrynMaligant"></span>
      </div>
      <div class="item-info-row">
        <label>中心密度:</label>
        <span v-html="item.centerHu + 'HU'"></span>
      </div>
      <div class="item-info-row">
        <label>平均密度:</label>
        <span v-html="item.meanHu + 'HU'"></span>
      </div>
      <div class="item-info-row">
        <label>最大密度:</label>
        <span v-html="item.maxHu + 'HU'"></span>
      </div>
      <div class="item-info-row">
        <label>最小密度:</label>
        <span v-html="item.minHu + 'HU'"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import DicomImage from './dicomImage'
  export default {
    name: 'dicom-info',
    props: {
      item: {
        type: Object,
        require: true
      },
      title: {
        type: String,
        require: true
      }
    },
    components: { DicomImage },
  }
</script>
<style lang="less">
  .dicom-item__content {
    display: flex;
    padding-top: 15px;
    .item-content-image {
      flex: 2;

      .result-image {
        max-width: 100%;
      }
    }
    .title {
      color: rgba(0, 0, 0, .85);
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
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
