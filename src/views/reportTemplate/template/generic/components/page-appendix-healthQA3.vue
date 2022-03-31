<template>
  <page-common :pageConfig="pageConfig" :isChrome="isChrome" :pageIndex="pageIndex" :noTitle="true">
    <div class="container">
      <page-title :page-config="pageConfig"></page-title>
      <div class="content">
        <div class="sub-title">
          4）肺结节病理诊断结果
        </div>
        <div class="detail intend">
          部分炎症结节、良性肿瘤、不典型腺瘤样增生（AAH）、原位腺癌（AIS）、微浸润腺癌（
          MIA）、浸润性腺癌（IAC）在CT上均呈现为肺结节的影像学形态，因此对于肺结节的良恶性 鉴别诊断尤为关键。
        </div>
        <div class="detail intend">
          ①不典型腺瘤样增生（AAH）：属于肺腺癌的浸润前病变，为肺泡上皮细胞局限性轻到
          中度不典型增生，直径通常＜5mm，只有小部分不典型腺瘤样增生会进一步发展成浸润性
          腺癌。CT影像学上一般表现为特别小的纯磨玻璃结节，很难辨认，需定期随访。
        </div>
        <div class="detail intend">
          ②原位腺癌（AIS）：为肺腺癌的浸润前病变。尽管肺泡上皮细胞已经进展恶性肿瘤，但
          不具有侵袭能力，生长缓慢，局限在支气管黏膜上皮细胞层内，没有穿破基底膜。CT上表现
          一般为磨玻璃结节，相比AAH，结节可能会稍大，密度相对较高。完全切除后可完全治愈。
        </div>
        <div class="detail intend">
          ③微浸润腺癌（MIA）：当原位癌继续发展，突破了上皮细胞基底膜，开始具有浸润周围
          的组织的能力，即原位癌向浸润性腺癌（IAC）发展的过程中浸润间质最大直径≤5mm的局
          限性腺癌病灶。只要手术完整切除，术后5年生存率几乎100%。
        </div>
        <div class="detail intend">
          ④浸润性腺癌（IAC）：当微浸润腺癌进一步进展，微浸润癌进一步发展，其对周围组织
          的浸润超过了5mm，由于有了相对丰富的血管的供应，肿瘤迅速增长，不仅体积逐渐增大，
          具有侵袭性的腺癌还有可能发生远处转移。CT影像上表现为边界不清、周围有分叶征、毛
          刺征、血管集束征等恶性特征。手术后生存预后依据分期而定。
        </div>
      </div>
    </div>
  </page-common>
</template>

<script>
import PageCommon from './page-common'
import PageTitle from './page-title'

export default {
  name: 'page-appendix-healthQA3',
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
