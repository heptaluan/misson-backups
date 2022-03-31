<template>
  <page-common :pageConfig='pageConfig' :isChrome='isChrome' :pageIndex='pageIndex' :noTitle='true'>
    <div class='container'>
      <page-title :page-config='pageConfig'></page-title>
      <div class='content'>
        <div class='contentBox'>
          <div class='subtitle'>
            <span class='ball'></span>公司简介
          </div>
          <div class='detail intend'>
            泰莱生物是提供基于专有生物多组学技术的新一代液体活检服务的生物科技公司，在泛肿瘤普早筛、肿瘤临床辅助诊断等领域有丰富的科研及商业化产品管线，旨在帮助人们更早发现健康隐患，降低救治难度，提高患者生存率和生活质量，期待实现“防大于治”。
          </div>
          <div class='detail intend'>
            泰莱生物与国家生物医学材料工程技术研究中心、武汉大学等高校科研机构，以及四川大学华西医院、复旦大学附属中山医院、上海市肺科医院等顶尖三甲医院进行联合研究，已与国家生物医学材料工程技术研究中心联合设立基质辅助飞行质谱实验室，与武汉大学联合设立武汉大学·泰莱生物生命健康大数据研究中心，推进与肿瘤相关的液体活检组学技术研究进展和产品转化。
          </div>
        </div>
        <div class='contentBox'>
          <div class='subtitle'>
            <span class='ball'></span>MISSION计划
          </div>
          <div class='detail intend'>
            泰莱生物与上海市肺科医院共同发起 MISSION (Multi-omIcs claSSIfier for pulmOnary Nodules)计划 ⸺
            暨基于多组学的肺小结节良恶性鉴别诊断前瞻性多中心临床研究，并与武汉大学建立武汉大学-泰莱生物生命健康大数据研究中心，由上海市肺科医院任牵头单位，四川大学华西医院、山东省公共卫生临床中心（原山东省胸科医院）、中国科学院大学宁波华美医院、兰州大学第一医院、遵义医科大学附属医院等全国数十家三甲医院共同参与，利用多组学融合技术(以代谢组学、表观基因组学、影像组学为主)，结合临床表型，解决临床上肺结节(尤其是
            ≤30mm 的肺小结节)良恶性鉴别诊断的难题，辅助完善肺结节手术规划、术后治疗方案指定、药物疗效预测等各类需求。
          </div>
          <div class='detail intend'>
            MISSION计划是我国在肺结节（获手术病理）领域内研究队列最大的超万例前瞻性多中心临床研究，结合了人工智能、影像阅片、NGS-based 液体活检、MS-based 液体活检等多项自主研发及全球首创的技术手段。
          </div>
          <div class='detail intend'>
            斐盼安™和斐盼康™是MISSION计划的科研成果结晶，利用无创液体活检技术以及人工智能技术，分别通过 影像组学+代谢组学、影像组学+代谢组学+表观基因组学
            多组学联合分析比对的方式，对患者肺小结节良恶性的初筛或进一步诊断提供高效、可靠的参照。
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
  name: 'page-introduction',
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

<style lang='less' scoped>
@import "../../../common/less/common.less";
</style>