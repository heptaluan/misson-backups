<template>
  <page-common :pageConfig="pageConfig" :isChrome="isChrome" :pageIndex="pageIndex" :noTitle="true">
    <div class="container">
      <page-title :page-config="pageConfig"></page-title>
      <div class="content">
        <div class="subtitle">
          1.技术介绍
        </div>
        <div class="sub-title">
          1）生化分子组学（代谢组学）
        </div>
        <div class="detail intend">
          肺癌的发生、发展是一个受多基因、环境调控的动态过程，最终导致肿瘤的代谢组
          发生变化，采用代谢组学技术对肺结节恶性患者与良性受试者的外周血样本进行检测，
          来评估肺结节的性状。代谢组学是研究生物体系受外部刺激或扰动后所产生的代谢物整
          体及其变化规律的一门科学，是探明生物体系代谢途径的研究方法（如图1）。细胞内许多
          生命活动发生于代谢层面，如细胞信号释放、能量传递、细胞间通讯等，机体内任何生
          理或病理改变都离不开代谢过程及其组分的变化。常见的研究对象是相对分子质量在
          1000Da以下的小分子物质，包括：糖类、氨基酸、脂类、有机酸、肉碱及相关衍生物等。
        </div>
        <div class="detail intend">
          现阶段斐盼安™中所涉及的生化分子风险评估模型是基于机器学习模型筛选得到的能
          够有效区分肺结节良恶性的早期生物标志物，标志物中既包含了已被报道的多个与肿瘤
          相关的代谢异常分子，也有新型的生物学标志物。2010年，Maeda(Maeda et al.)等通过
          非小细胞肺癌和健康者的血浆氨基酸水平的研究发现：丙氨酸、缬氨酸、异亮氨酸、组氨
          酸、色氨酸和鸟氨酸，可以有效区分非小细胞肺癌患者和健康人。2011年， Duarte(Carrola et al.)等采用
          NMR的代谢组学方法，检测发现初期肺癌患者的外周血中
          葡萄糖、柠檬酸盐、甲酸盐、醋酸盐、丙氨酸、谷氨酰胺、组氨酸、络氨酸、缬氨酸等
          代谢物含量降低，研究表明代谢物的改变出现在疾病的初期阶段，且可能与癌症生化过
          程相关，如增强性的糖酵解和糖异生以及受到抑制的三羧酸循环和脂代谢。其中部分代 谢分子物质罗列如下：
        </div>

        <div class="appendix-table" style="margin-top: 25px;">
          <table class="">
            <thead class="appendix-table-thead">
              <tr>
                <th width="80">
                  <span>中文名</span>
                </th>
                <th>
                  <span>功能注释</span>
                </th>
                <th width="130">
                  <span>参考文献（PMID）</span>
                </th>
              </tr>
            </thead>
            <tbody class="appendix-table-tbody">
              <tr class="appendix-table-row">
                <td>胆碱</td>
                <td>
                  乙酰胆碱的前体，在神经递质合成、同型半胱氨酸代谢和许多其他代谢过程中起一定作用。胆碱可以通过调控细胞凋亡，来参与肿瘤的发生及进展。
                </td>
                <td>22157537, <br /> 18953024, <br />25961003, <br />32500168</td>
              </tr>
              <tr class="appendix-table-row">
                <td>L-缬氨酸</td>
                <td>
                  缬氨酸是一种人体必需氨基酸和生糖氨基酸，它能促进身体正常生长，修复组织，调节血糖，并提供需要的能量；与其他两种高浓度氨基酸（异亮氨酸和亮氨酸）一起工作促进身体正常生长，修复组织，调节血糖，并提供需要的能量。在参加激烈体力活动时，缬氨酸可以给肌肉提供额外的能量产生葡萄糖，以防止肌肉衰弱。它还帮助从肝脏清除多余的氮（潜在的毒素），并将身体需要的氮运输到各个部位。
                </td>
                <td>22157537, <br /> 18953024, <br />25961003</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </page-common>
</template>

<script>
import PageCommon from './page-common'
import PageTitle from './page-title'

export default {
  name: 'page-appendix-1',
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
