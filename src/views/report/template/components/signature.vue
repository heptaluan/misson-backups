<template>
<div class="signature">
  <div class="signature-info b-flex">
    <div class="signature-info-item">
      <label>检 测 人：</label>
      <span v-html="data.Inspector"></span>
    </div>
    <div class="signature-info-item">
      <div class="info-row padding-bottom-xs">
        <label>复 核 人：</label>
        <span v-html="data.Reviewer"></span>
      </div>
      <div class="info-row">
        <label>报告日期：</label>
        <span v-html="data.reportDate"></span>
      </div>
    </div>
  </div>
  <img :src="imgSeal" alt="" class="img-seal">
</div>
</template>

<script>
  export default {
    name: 'signature',
    props: {
      data: {
        type: Object,
        require: true
      },
      pageConfig: {
        type: Object,
        require: true
      }
    },
    data () {
      return {
        imgSeal: require('../resource/img-seal.jpg')
      }
    }
  }
</script>
