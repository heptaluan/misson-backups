<template>
<a-card :bordered="false" class="report-detail">
  <a-descriptions title="用户信息">
    <a-descriptions-item label="用户姓名">{{patientInfo.name}}</a-descriptions-item>
    <a-descriptions-item label="年龄">{{patientInfo.age}}</a-descriptions-item>
    <a-descriptions-item label="样本编号">{{patientInfo.orderCode}}</a-descriptions-item>
    <a-descriptions-item label="性别">{{patientInfo.sex}}</a-descriptions-item>
    <a-descriptions-item label="住 院 号">{{patientInfo.patientId}}</a-descriptions-item>
    <a-descriptions-item label="送检医师">{{patientInfo.sendDoctor}}</a-descriptions-item>
    <a-descriptions-item label="临床诊断">{{patientInfo.clinical}}</a-descriptions-item>
    <a-descriptions-item label="送检单位">{{patientInfo.sendHospital_dictText}}</a-descriptions-item>
    <a-descriptions-item label="送检日期">{{patientInfo.createTime}}</a-descriptions-item>
    <a-descriptions-item label="检测方法">血液蛋白组学/代谢组学，以及医学影像等多组学技术</a-descriptions-item>
  </a-descriptions>
  <a-divider style="margin-bottom: 32px"/>
  <a-descriptions title="订单信息">
    <a-descriptions-item label="订单号">{{report.orderId}}</a-descriptions-item>
    <a-descriptions-item label="病例编号">{{patientInfo.orderCode}}</a-descriptions-item>
    <a-descriptions-item label="状态">已出报告</a-descriptions-item>
    <a-descriptions-item label="代谢组结果">{{report.ananpanReportValue}}</a-descriptions-item>
    <a-descriptions-item label="代谢组状态">{{report.ananpanReportValue ? '已完成': '-'}}</a-descriptions-item>
    <a-descriptions-item label="完成日期">{{report.ananpanTime}}</a-descriptions-item>
    <a-descriptions-item label="基因组结果">{{report.geneReportValue}}</a-descriptions-item>
    <a-descriptions-item label="基因组状态">{{report.geneReportValue ? '已完成': '-'}}</a-descriptions-item>
    <a-descriptions-item label="完成日期">{{report.geneTime}}</a-descriptions-item>
    <a-descriptions-item label="影像组结果">{{report.imageReportValue}}</a-descriptions-item>
    <a-descriptions-item label="影像组状态">{{report.imageReportValue ? '已完成': '-'}}</a-descriptions-item>
    <a-descriptions-item label="完成日期">{{report.imageTime}}</a-descriptions-item>
  </a-descriptions>
  <a-divider style="margin-bottom: 32px"/>
  <div class="report-result">
<!--    <span class="status-label">中风险</span>-->
    <a-descriptions title="代谢结果" >
      <a-descriptions-item label="代谢得分">{{report.ananpanReportValue}}</a-descriptions-item>
    </a-descriptions>
  </div>
  <div class="report-result" v-if="report.geneReportValue">
    <a-descriptions title="基因结果">
      <a-descriptions-item label="基因得分">{{report.geneReportValue}}</a-descriptions-item>
    </a-descriptions>
  </div>
  <a-divider style="margin-bottom: 32px"/>
  <a-descriptions title="影像结果" >
    <a-descriptions-item label="影像结果">{{report.imageReportValue}}</a-descriptions-item>
  </a-descriptions>
  <div class="image-result">
    <div class="edit-toolbar-save" v-if="false">
      <a-button @click="handleComplete()">保存</a-button>
    </div>
    <div class="image-result-list">
      <div class="image-result-item" v-for="(item, index) in dicomResult.nodulesList" :key="index">
        <span class="status-label" v-if="item.invisable === '1'"></span>
        <a-card :class="{'hight-risk': calcMaligant(item.scrynMaligant)}">
          <div class="image-result-item__content">
            <div class="edit-toolbar" v-if="false">
              <a-button-group>
                <a-button @click="handleEditImage(item, index)">编辑</a-button>
                <a-button @click="handleDeleteImage(item, index)">
                  删除
                </a-button>
              </a-button-group>
            </div>
            <dicom-info :item="item" :title="modelTitle"></dicom-info>
          </div>
        </a-card>
      </div>
    </div>
  </div>
  <a-modal
    v-model="ModifyVisible"
    class="report-detail-modal"
    width="1096px"
    title="AI影像表观--修改"
    @ok="handleOk"
  >
    <a-spin :spinning="confirmLoading">
      <div class="image-result">
        <div class="item-content-image">
          <div class="title" v-html="modelTitle"></div>
          <div class="b-flex">
            <dicom-image :url="mForm.imageUrl1" footer="横断面" class="b-flex-5 margin-right-sm"></dicom-image>
            <dicom-image :url="mForm.imageUrl2" footer="局部细节" class="b-flex-3"></dicom-image>
          </div>
        </div>
        <div class="item-content-info">
          <div class="item-info-row">
            <label>影像层:</label>
            <span v-html="mForm.iamgeNumber"></span>
          </div>
          <a-form-model ref="editFrom" :model="mForm" :rules="validatorRules" slot="detail">
            <a-form-model-item label="肺" prop="lung" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
              <span v-html="mForm.lungLocation" v-if="false"></span>
              <a-input v-model="mForm.lungLocation" placeholder="请输入肺"></a-input>
            </a-form-model-item>
            <a-form-model-item label="肺叶" prop="lungLobe" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
              <span v-html="mForm.lobeLocation" v-if="false"></span>
              <a-input v-model="mForm.lobeLocation" placeholder="请输入肺叶"></a-input>
            </a-form-model-item>
            <a-form-model-item label="大小" prop="size" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
              <div class="item-info-row">
                <span v-html="mForm.diameter"></span>
              </div>
            </a-form-model-item>
            <a-form-model-item label="体积" prop="size" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
              <a-input v-model="mForm.noduleSize" placeholder="请输入结节体积" suffix="mm³" v-if="false"></a-input>
              <span v-html="mForm.noduleSize + ' mm³'"></span>
            </a-form-model-item>
            <a-form-model-item label="形态类型" prop="featureLabel" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
              <a-select v-model="mForm.featureLabel" placeholder="请选择形态类型">
                <a-select-option v-for="item in featureLabelOption" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="标准直径" prop="diameter" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
              <a-input v-model="mForm.diameterNorm" placeholder="请输入标准直径" suffix="mm" v-if="false"></a-input>
              <span v-html="mForm.diameterNorm + ' mm'"></span>
            </a-form-model-item>
            <a-form-model-item label="恶性风险" prop="scrynMaligant" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
              <a-input v-model="mForm.scrynMaligant" placeholder="请输入风险系数" suffix="%"></a-input>
            </a-form-model-item>
            <a-form-model-item label="中心密度" prop="centerDensity" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
              <a-input v-model="mForm.centerHu" placeholder="请输入中心密度" suffix="HU" v-if="false"></a-input>
              <span v-html="mForm.centerHu + ' HU'"></span>
            </a-form-model-item>
            <a-form-model-item label="平均密度" prop="avgDensity" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
              <a-input v-model="mForm.meanHu" placeholder="请输入平均密度" suffix="HU" v-if="false"></a-input>
              <span v-html="mForm.meanHu + ' HU'"></span>
            </a-form-model-item>
            <a-form-model-item label="最大密度" prop="maxDensity" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
              <a-input v-model="mForm.maxHu" placeholder="请输入最大密度" suffix="HU" v-if="false"></a-input>
              <span v-html="mForm.maxHu + ' HU'"></span>
            </a-form-model-item>
            <a-form-model-item label="最小密度" prop="minDensity" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
              <a-input v-model="mForm.minHu" placeholder="请输入最小密度" suffix="HU" v-if="false"></a-input>
              <span v-html="mForm.minHu + ' HU'"></span>
            </a-form-model-item>
          </a-form-model>
        </div>
    </div>
    </a-spin>
  </a-modal>
</a-card>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import DicomInfo from './template/components/dicom-info'
import DicomImage from './template/components/dicomImage'
import { Patient, singature } from './template/resource/constant'
export default {
  name: 'sampleReportDetail',
  components: {
    DicomImage,
    DicomInfo
    // STable
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      imageColumns: [
        {
          title: '结节编号',
          dataIndex: 'index',
          key: 'index'
        },
        {
          title: '影像编号',
          dataIndex: 'iamgeNumber',
          key: 'iamgeNumber'
        },
        {
          title: '结节形状',
          dataIndex: 'shape',
          key: 'shape'
        },
        {
          title: '结节大小',
          dataIndex: 'size',
          key: 'size'
        },
        {
          title: '位置',
          dataIndex: 'lung',
          key: 'lung'
        },
        {
          title: '直径',
          dataIndex: 'diameter',
          key: 'diameter'
        },
        {
          title: '平均密度',
          dataIndex: 'avgDensity',
          key: 'avgDensity'
        }
      ],
      patientInfo: {
        sendDate: '20210915',
        detectionMethod: '血液蛋白组学/代谢组学，以及医学影像等多组学技术'
      },
      Inspector: singature.Inspector,
      Reviewer: singature.Reviewer,
      clinical: Patient.clinical,
      detectionMethod: Patient.detectionMethod,
      dicomResult: {},
      report: {},
      ModifyVisible: false,
      mForm: {

      },
      url: {
        edit: '/report/sampleReportHistory/edit',
        queryById: '/report/sampleReportHistory/queryById',
        getPatient: '/multiomics/productOrder/orderStepInfo'
      },
      validatorRules: {
        lungLocation: [{ required: true, message: '请选择肺!' }],
        lobeLocation: [{ required: true, message: '请输入肺叶!' }],
        // diameter: [{ required: true, message: '请输入大小!' }],
        // noduleSize: [
        //   { required: true, message: '请输入体积!' },
        //   { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
        // ],
        featureLabel: [{ required: true, message: '请选择形态类型!' }],
        scrynMaligant: [{ required: true, message: '请输入风险!' }],
        // diameterNorm: [
        //   { required: true, message: '请输入直径!' },
        //   { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
        // ],
        // centerHu: [
        //   { required: true, message: '请输入中心密度!' },
        //   { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
        // ],
        // meanHu: [
        //   { required: true, message: '请输入平均密度!' },
        //   { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
        // ],
        // maxHu: [
        //   { required: true, message: '请输入最大密度!' },
        //   { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
        // ],
        // minHu: [
        //   { required: true, message: '请输入最小密度!' },
        //   { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
        // ]
      },
      currImage: null,
      confirmLoading: false,
      modelTitle: '',
      featureLabelOption: [
        { label: '肺内实性', value: '肺内实性' },
        { label: '部分实性', value: '部分实性' },
        { label: '磨玻璃', value: '磨玻璃' },
        { label: '肺内钙化', value: '肺内钙化' },
        { label: '胸膜实性', value: '胸膜实性' },
        { label: '胸膜钙化', value: '胸膜钙化' }
      ]
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        'processing': '进行中',
        'success': '完成',
        'failed': '失败'
      }
      return statusMap[status]
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.dicomResult.imageList = []
      this.getSourceDatail()
    },
    handleEditImage (image) {
      const { diameter } = image
      const { dicomResult } = this
      this.mForm = image
      this.mForm.scrynMaligant = this.mForm.scrynMaligant.replace('%', '')
      this.currImage = image
      this.ModifyVisible = true
    },
    handleDeleteImage (image, index) {
      this.$confirm({
        title: '确认是否删除该结节影像?',
        content: '将从结果列表中永久删除该结节影像, 请确认！',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          this.dicomResult.nodulesList.splice(index, 1)
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    handleComplete () {
      this.commitComplete()
    },
    async commitComplete () {
      const id = this.$route.params.id
      const that = this
      that.confirmLoading = true
      let httpurl = that.url.edit
      let method = 'put'
      const postData = {
        id: id,
        imageReportAll: JSON.stringify(that.dicomResult)
      }
      httpAction(httpurl, postData, method).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.$emit('ok')
        } else {
          that.$message.warning(res.message)
        }
      }).finally(() => {
        that.confirmLoading = false
      })
    },
    async getSourceDatail () {
      const id = this.$route.params.id
      const url = this.url.queryById
      try {
        const postData = {
          id: id
        }
        const res = await getAction(url, postData)
        if (res.code === 200) {
          this.report = res.result.reportInfo
          this.dicomResult = JSON.parse(this.report.imageReportAll)
          this.modelTitle = `窗宽：${this.dicomResult.windowing}  窗位： ${this.dicomResult.windowLevel}`
          this.patientInfo = res.result
          this.patientInfo.sex = res.result.sex ? (res.result.sex === '0' ? '女' : '男') : '-'
        } else {
          this.$message.error(res.message)
        }
      } catch (e) {
        this.$message.warning(e.message)
      }
    },
    handleOk () {
      this.mForm.scrynMaligant = this.mForm.scrynMaligant
      const id = this.$route.params.id
      const that = this
      this.$refs.editFrom.validate(valid => {
        if (valid) {
          // that.currImage = {
          //   ...that.mForm
          // }
          that.ModifyVisible = false
        }
      })
    },
    async getPatient(id, step) {
      const url = this.url.getPatient
      try {
        const postData = {
          orderId: id,
          step: step
        }
        const res = await getAction(url, postData)
        if (res.code === 200) {
          if (step === 0) {
            const { caseName, age, sendHospital, sendDoctor, liveHospitalNumber, gender_dictText } = res.result
            this.patientInfo.name = caseName
            this.patientInfo.age = age
            this.patientInfo.sendAgency = sendHospital
            this.patientInfo.sendDoctor = sendDoctor
            this.patientInfo.sex = gender_dictText
            this.patientInfo.patientId = liveHospitalNumber
          } else if (step === 1)  {
            const { medicalCaseCode } = res.result
            this.patientInfo.sampleCode = medicalCaseCode
          }
          //   <a-descriptions-item label="临床诊断">{{patientInfo.clinical}}</a-descriptions-item>
          //   <a-descriptions-item label="送检日期">{{patientInfo.sendDate}}</a-descriptions-item>
        } else {
          this.$message.error(res.message)
        }
      } catch (e) {
        this.$message.warning(e.message)
      }
    },
    calcMaligant(value) {
      let retValue = false
      try {
        const numberValue = value.replace('%', '')
        retValue = parseFloat(numberValue) > 60 ? true : false
      } catch (e) {
        console.log(e)
      }
      return retValue
    }
  }
}
</script>
<style lang="less">
  .result-image {
    max-width: 100%;
  }
</style>
