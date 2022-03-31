<template>
  <page-common :pageConfig='pageConfig' :isChrome='isChrome' :pageIndex='pageIndex' :noTitle='true'>
    <div class='container '>
      <page-title :page-config='pageConfig'></page-title>
      <div class='content'>

        <div class='ref'>
          1.Song, C.X., et al. 5-Hydroxymethylcytosine signatures in cell-free DNA provide information about tumor types
          and stages. Cell Res 27, 1231-1242 (2017).
        </div>
        <div class='ref'>
          2.Zhao, W., et al. 3D Deep Learning from CT Scans Predicts Tumor Invasiveness of Subcentimeter Pulmonary
          Adenocarcinomas. Cancer Res 78, 6881-6889 (2018).
        </div>
        <div class='ref'>
          3.Chen, R., et al. Longitudinal personal DNA methylome dynamics in a human with a chronic condition. Nat Med
          24, 1930-1939 (2018).
        </div>
        <div class='ref'>
          4.Wang, Z., et al. The Open Chromatin Landscape of Non-Small Cell Lung Carcinoma. Cancer Res 79, 4840-4854
          (2019).
        </div>
        <div class='ref'>
          5.Zhou, J., et al. Nanomaterials augmented LDI-TOF-MS for hepatocellular carcinoma. Annals of Oncology (2019).
        </div>
        <div class='ref'>
          6.Cao, F., et al. Integrated epigenetic biomarkers in circulating cell-free DNA as a robust classifier for
          pancreatic cancer. Clin Epigenetics 12, 112 (2020).
        </div>
        <div class='ref'>
          7.Zhong, Y., et al. Deep Learning for Prediction of N2 Metastasis and Survival for Clinical Stage I Non-Small
          Cell Lung Cancer. Radiology 302, 200-211 (2022).
        </div>
        <div class='ref'>
          8.Wang, T., et al. Radiomics for Survival Risk Stratification of Clinical and Pathologic Stage IA Pure-Solid
          Non-Small Cell Lung Cancer. Radiology, 210109 (2021).
        </div>
        <div class='ref'>
          9.Deng, J., et al. Implementation of artificial intelligence in the histological assessment of pulmonary
          subsolid nodules. Translational Lung Cancer Research 10, 4574-4586 (2021).
        </div>
        <div class='ref'>
          10.Hou, L., et al. Prognostic and predictive value of the newly proposed grading system of invasive pulmonary
          adenocarcinoma in Chinese patients: a retrospective multicohort study. Modern Pathology (2022).
        </div>
        <div class='ref'>
          11.Deng, J., et al. Lung cancer with PET/CT-defined occult nodal metastasis yields favourable prognosis and
          benefits from adjuvant therapy: a multicentre study. European Journal of Nuclear Medicine and Molecular
          Imaging (2022).
        </div>
        <div class='ref'>
          12.Hu, X., et al. Integrated 5-hydroxymethylcytosine and fragmentation signatures as enhanced biomarkers in
          lung cancer. Clinical Epigenetics 14(2022).
        </div>
        <div class='ref'>
          13.Zhang, H., et al. Multiplexed nanomaterial-assisted laser desorption/ionization for pan-cancer diagnosis
          and classification. Nature Communications 13(2022).
        </div>
        <div class='ref'>
          14.Cai, Z., et al. Liquid biopsy by combining 5-hydroxymethylcytosine signatures of plasma cell-free DNA and
          protein biomarkers for diagnosis and prognosis of hepatocellular carcinoma. ESMO Open 6, 100021 (2021).
        </div>
        <div class='ref'>
          15.Silvestri, G.A., et al. A Bronchial Genomic Classifier for the Diagnostic Evaluation of Lung Cancer. N Engl
          J
          Med 373, 243-251 (2015).
        </div>
        <div class='ref'>
          16.Jonas, D.E., et al. Screening for Lung Cancer With Low-Dose Computed Tomography. Jama 325(2021).
        </div>
        <div class='ref'>
          17.中华医学会肿瘤学分会,中华医学会杂志社. 中华医学会肿瘤学分会肺癌临床诊疗指南(2021版)[J]. 中华肿瘤杂志 ,2021(6).
          DOI:10.3760/cma.j.cn112152-20210207-00118.
        </div>
        <div class='ref'>
          18.赫捷,李霓,陈万青,等.中国肺癌筛查与早诊早治指南(2021,北京)[J].中华肿瘤杂志,2021(3).DOI:10.3760/cma.j.cn112152-20210119-00060.
        </div>
        <div class='ref'>
          19.中国肺癌防治联盟,中华医学会呼吸病学分会肺癌学组,中国医师协会呼吸医师分会肺癌工作委员会. 肺癌筛查与管理中国专家共识[J]. 国际呼吸杂志,2019(21).
          DOI:10.3760/cma.j.issn.1673-436X.2019.21.002.
        </div>
      </div>
    </div>
  </page-common>
</template>

<script>
import PageCommon from './page-common'
import PageTitle from './page-title'

export default {
  name: 'page-explain',
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