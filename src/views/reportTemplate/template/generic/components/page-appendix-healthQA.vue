<template>
  <page-common :pageConfig="pageConfig" :isChrome="isChrome" :pageIndex="pageIndex" :noTitle="true">
    <div class="container">
      <page-title :page-config="pageConfig"></page-title>
      <div class="content">
        <div class="subtitle">
          2.健康问答
        </div>
        <div class="sub-title">
          1）什么是肺结节？
        </div>
        <div class="detail intend">
          肺结节是指影像学上表现为直径小于或等于30ｍ ｍ的局灶性、类圆形、密度增高的实
          性或亚实性肺部阴影，不伴肺不张、肺门淋巴结肿大或胸腔积液。根据病灶大小可分为微小 结节（直径≤5
          mm）、小结节（直径在5-10 mm）以及结节（直径在10-30 mm）。
        </div>
        <div class="detail intend">
          肺结节根据病灶数量可分为单发性结节（单个病灶）与多发性结节（2个及以上的病灶）。
        </div>

        <div class="detail intend">
          根据影像学上结节的密度，可以分为纯磨玻璃结节（非实性结节）、部分实性结节（混合 型磨玻璃样结节）和实性结节：
        </div>
        <div class="detail intend">
          ①磨玻璃结节：肺内模糊的结节影，结节密度较周围肺实质略增加，其内血管及支气管 轮廓可见；
        </div>
        <div class="detail intend">
          ②部分实性结节：既包含磨玻璃密度又包含实性软组织密度的结节，密度不均匀；
        </div>
        <div class="detail intend">
          ③实性结节：全部是软组织密度的结节，密度较均匀，其内血管及支气管影像被掩盖。
        </div>
        <div class="detail intend" style="margin-top:20px">
          部分实性结节恶性概率最高（63%），其次为磨玻璃结节（18%）及实性结节（7%）。
        </div>
        <div class="image-list">
          <div class="imgae-box">
            <img src="../../../common/image/image14.png" alt="" class="bg-img" />
            <span class="imgae-text">实性结节</span>
          </div>
          <div class="imgae-box">
            <img src="../../../common/image/image13.png" alt="" class="bg-img" />
            <span class="imgae-text">纯磨玻璃结节</span>
          </div>
          <div class="imgae-box">
            <img src="../../../common/image/image12.png" alt="" class="bg-img" />
            <span class="imgae-text">部分实性结节</span>
          </div>
        </div>
      </div>
    </div>
  </page-common>
</template>

<script>
import PageCommon from './page-common'
import PageTitle from './page-title'

export default {
  name: 'page-appendix-healthQA',
  mixins: [],
  props: {
    pageIndex: {
      type: Number
    },
    isChrome: {
      type: Boolean
    },
    data: {
      type: Object,
      require: true
    },
    pageConfig: {
      type: Object,
      require: true
    }
  },
  components: {
    PageTitle,
    PageCommon
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
@import '../../../common/less/common.less';
</style>
