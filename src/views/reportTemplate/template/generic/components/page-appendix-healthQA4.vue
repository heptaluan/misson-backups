<template>
  <page-common :pageConfig="pageConfig" :isChrome="isChrome" :pageIndex="pageIndex" :noTitle="true">
    <div class="container">
      <page-title :page-config="pageConfig"></page-title>
      <div class="content">
        <div class="sub-title">
          5）发现肺结节后该怎么办？
        </div>
        <div class="detail intend">
          ①发现肺部结节后需要结合自身情况具体选择诊疗方案，如果怀疑结节为恶性病变，建
          议可进行增强CT、支气管镜/穿刺活检或手术切除等诊疗手段，但活检具有创伤性，且组织
          存在异质性，会一定程度地造成漏检，对于1 cm以内的肺结节不推荐活检。目前部分肺结节
          临床诊断特异性不高，易造成不必要的过度治疗，据相关研究报道，肺结节术后经病理证实 有高达20-40%的为良性病变。
        </div>
        <div class="detail intend">
          ②若判断目前结节没有恶性征象，以定期随访为主，根据自身情况制定3~6个月，或者1
          年的随访间期。随访是目前肺结节的主要临床处理手段，但因为CT具有一定的辐射，尤其是
          哺乳期、孕妇和婴幼儿应该尽量避免CT或X线检查；成人一年以内可以接受多次CT检查，具
          体情况还要根据实际病情咨询医生。
        </div>
        <div class="detail intend">
          ③对于有明确恶性征象或已经过穿刺活检病理诊断后的恶性结节，通常采用手术治疗
          以及非手术治疗两大方式。其中手术治疗方式包括：胸腔镜下肺叶/亚肺叶/肺段/楔形切除+
          相应区域淋巴结采样/清扫；非手术方式主要包括：射频消融术和立体定向放射治疗。术后的
          随访管理依据个体情况而定，通常前2年内每六个月随访一次，以后则每年随访一次。
        </div>
      </div>
    </div>
  </page-common>
</template>

<script>
import PageCommon from './page-common'
import PageTitle from './page-title'

export default {
  name: 'page-appendix-healthQA4',
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
