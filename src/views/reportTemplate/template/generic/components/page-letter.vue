<template>
  <page-common :pageConfig='pageConfig' :isChrome='isChrome' :pageIndex='pageIndex' :noTitle='true'>
    <div class='container letter'>
      <div class='line'></div>
      <div class='content'>
        <div class='title'>尊敬的_________先生/女士：</div>
        <div class='detail intend'>
          您好！感谢您对我们的信任，选择肺结节良恶性辅助鉴别多组学检测产品⸺斐盼安™(影像组+生化分子组)。泰莱生物是一家提供专有多组学肿瘤检测技术的生物科技公司，成都泰莱医学检验实验室是泰莱生物下设的独立第三方医学检验机构，具有《医疗机构执业许可证》，旨在为广大患者提供专业化的肿瘤早期筛查与诊断服务。
        </div>
        <div class='detail intend'>
          肺癌是严重影响人类健康的重大疾病，其发病率和死亡率均位于我国恶性肿瘤首位。早期肺癌及时诊治，五年生存率可达 80%~100%，但当前的肺癌五年生存率仅 19.7%，早期（I期）肺癌诊断率仅 19%，约 80%
          肺癌患者发现时已处于中晚期而丧失手术根治机会。临床上，绝大多数早期肺癌临床表现为肺结节，近 95%
          的肺结节是良性结节。目前在进行肺结节良恶性鉴别诊断时，低剂量螺旋CT（LDCT）的临床判读经验要求较高，且缺乏形态影像信息以外的生物学信息补充。据相关研究报道，肺结节术后为良性病灶率高达 30-40%。
        </div>
        <div class='detail intend'>
          液体活检和人工智能技术等更多维度的数据结果已被广泛用于疾病筛查、辅助诊断、治疗参考。基于血液样本检测的液体活检技术可从基因、蛋白、代谢等层面剖析疾病信息，医学影像AI分析工具可对肺部结节参数和征象进行测量和识别，两者联用极大提高肺部结节良恶性鉴别能力。泰莱生物经过分析超万例的肺结节患者胸部
          CT影像数据、血液中代谢物质及cfDNA羟甲基化水平数据结果，创新地构建出了“影像组+生化分子组+表观基因组”的多组学技术融合的肺结节诊断模型产品。该产品经临床验证，无论对于单发性结节还是多发性结节均具有极高的准确率。肺结节早筛早诊的准确性直接关系到早期临床干预，有效提高生存率及降低肿瘤死亡率。泰莱生物信奉“防大于治，普惠大众”，期望这份报告能为您辅助肺结节良恶性的鉴别，制定更合理的临床治疗方案，尽早为您解决健康隐患，让您减少对病情的担忧。
        </div>
        <div class='detail intend' style='margin-top: 24px'>
          泰莱生物祝您早日康复！
        </div>
      </div>
    </div>
  </page-common>
</template>

<script>
import PageCommon from './page-common'

export default {
  name: 'page-letter',
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