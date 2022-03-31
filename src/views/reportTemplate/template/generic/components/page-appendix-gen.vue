<template>
  <page-common :pageConfig="pageConfig" :isChrome="isChrome" :pageIndex="pageIndex" :noTitle="true">
    <div class="container">
      <page-title :page-config="pageConfig"></page-title>
      <div class="content">
        <div class="subtitle">
          2）表观基因组学
          <span class="tips">（本检测不包含此项目，如有需求，可升级至斐盼康™检测）</span>
        </div>
        <div class="detail intend">
          肿瘤是一种复杂因素导致的疾病，细胞异常增殖、分化以及免疫失衡等在其发生发展
          过程中都起着重要作用。本阶段的斐盼安™中所涉及的cfDNA表观风险预测模型使用了
          5hmC（5-羟甲基胞嘧啶）标志物，经过优化机器学习筛选得到的能够有效区分良性肺结节
          与早期恶性肺结节的标志物。这些标志物中既包含了已被报道的多个与肿瘤相关的基因区
          段，也有新型的生物学标志物，这些标志物多参与细胞增殖，细胞分化，粘附因子表达以及
          免疫应答等（如图2）。其中包含了肺癌的相关基因区段，如MET、F2RL3, 、NOVA1, 、TFAP2B
          等；与肿瘤细胞增殖相关的基因区段，如NELL2, 、NOX4 ,、BMP5、CASP9等；与肿瘤发生、发
          展相关的RAS通路基因，如RASAL3, 、ARHGAP45等；与免疫相关的基因区段，如DCC等；此
          外还有与神经发育相关的基因，如CNTN5、PRRT2等。所有检测基因区段根据建立的预测模
          型被赋予不同的权重，最终计算得到表观层面的肺结节良恶性风险评估值。其中部分代表 性标志物罗列如下：
        </div>

        <div class="appendix-table" style="margin-top: 25px;">
          <table class="">
            <thead class="appendix-table-thead">
              <tr>
                <th width="90">
                  <span>基因名</span>
                </th>
                <th>
                  <span>基因号</span>
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
                <td>F2RL3</td>
                <td>ENSG00000127533</td>
                <td>
                  蛋白酶激活受体亚家族的一个成员，是g蛋白偶联 受体1家族的一部分。这种受体在凝血、炎症和疼痛
                  反应中发挥作用。该基因的低甲基化可能与人类患 者的肺癌有关。
                </td>
                <td>25821117</td>
              </tr>

              <tr class="appendix-table-row">
                <td>NOVA1</td>
                <td>ENSG00000139910</td>
                <td>
                  该基因编码一种神经元特异性RNA结合蛋白，可被 癌旁组织中免疫细胞释放的特异抗体识别，抑制肿
                  瘤生产。该基因抗体在肺癌中存在超表达。
                </td>
                <td>30568224</td>
              </tr>
              <tr class="appendix-table-row">
                <td>TFAP2B</td>
                <td>ENSG00000008196</td>
                <td>
                  这个基因编码AP-2转录因子家族的一个成员。能够 刺激细胞增殖和抑制特定细胞类型的终端分化。此
                  基因低表达癌症患者的生存期短。
                </td>
                <td>24766673</td>
              </tr>
              <tr class="appendix-table-row">
                <td>NELL2</td>
                <td>ENSG00000184613</td>
                <td>
                  由这个基因编码的蛋白质是一个包含表皮生长因 子(EGF)结构域。研究表明，该蛋白在神经细胞生长
                  和分化以及肿瘤发生中发挥作用。
                </td>
                <td>34169146</td>
              </tr>
              <tr class="appendix-table-row">
                <td>NOX4</td>
                <td>ENSG00000086991</td>
                <td>
                  作为NADPH氧化酶复合体的催化亚基。作为一个 氧传感器，并催化分子氧还原为各种活性氧(ROS)。
                  该蛋白产生的ROS参与信号转导、细胞分化和肿瘤 细胞生长等多种生物学功能。
                </td>
                <td>32441762</td>
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
  name: 'page-appendix-gen',
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
