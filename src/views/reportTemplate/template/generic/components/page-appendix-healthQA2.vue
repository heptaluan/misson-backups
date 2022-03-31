<template>
  <page-common :pageConfig="pageConfig" :isChrome="isChrome" :pageIndex="pageIndex" :noTitle="true">
    <div class="container">
      <page-title :page-config="pageConfig"></page-title>
      <div class="content">
        <div class="sub-title">
          2）为什么会得肺结节？
        </div>
        <div class="detail">
          肺部结节产生病因比较多，常见有以下几种情形：
        </div>
        <div class="detail">
          ①长期吸烟患者或空气污染（粉尘）所致碳末的沉着；
        </div>
        <div class="detail">
          ②细菌、病毒感染后会引起结节；
        </div>
        <div class="detail">
          ③既往有肺结核病史、蛔虫病以及细菌性囊肿疾病等致病菌感染肺部，导致结节产生；
        </div>
        <div class="detail">
          ④受过外伤后，肺内留下瘢痕，形成肺结节；
        </div>
        <div class="detail">
          ⑤肺部良性肿瘤，比如错构瘤、炎性假瘤、硬化性血管瘤等；
        </div>
        <div class="detail">
          ⑥肺腺癌浸润前期病变包括不典型腺瘤样增生、原位腺癌及早期肺癌影像学上表现为
          肺结节形态，具有不同恶性征象，需重点鉴别；
        </div>
        <div class="detail">
          ⑦其他部位恶性肿瘤（例如：乳腺癌、前列腺癌、肝癌以及胃肠恶性肿瘤等）经淋巴、血液
          转移到肺组织，也可表现为单发或多发的圆形或类圆形结节征象。
        </div>

        <div class="sub-title" style="margin-top:80px;">
          3）肺结节一定会癌变吗？
        </div>
        <div class="detail intend">
          肺结节的良恶性判断目前是影像科、胸外科、肿瘤科、及呼吸内科医生面临的巨大挑战。
          肺结节的性质大致分为三类：良性结节、肺腺癌浸润前期病变、肺癌。良性结节主要包括炎性
          结节及良性肿瘤，可根据医生的指导，进行必要的治疗及随访即可，不必担心；肺癌浸润前期
          病变需密切随访观察，必要时需临床干预；肺癌则需要早期手术治疗，如无周围肺组织浸润，
          手术切除后的5年无病生存率100%。
        </div>
        <div class="detail intend">
          肺结节不一定是早期肺癌的预警征兆，但绝大多数肺癌的早期临床表现为肺结节。90%
          以上肺结节性质都是良性范畴。当发现肺部存在结节后，要进行判断定性是临床中面对的难
          题，所以肺结节一定需要引起我们的高度重视和科学对待，也不需要为之过于忧虑，可根据
          低剂量螺旋CT（LDCT），并结合液体活检如基因组学、表观遗传组学、代谢组学等诊断新技
          术，进行综合评判，及时且准确地对肺结节进行良恶性鉴别，把握最佳的临床治疗时机。
        </div>
      </div>
    </div>
  </page-common>
</template>

<script>
import PageCommon from './page-common'
import PageTitle from './page-title'

export default {
  name: 'page-appendix-healthQA2',
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
