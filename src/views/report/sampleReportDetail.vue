<template>
<a-card :bordered="false" class="report-detail">
  <a-descriptions title="用户信息">
    <a-descriptions-item label="用户姓名">{{patientInfo.name}}</a-descriptions-item>
    <a-descriptions-item label="年龄">{{patientInfo.age}}</a-descriptions-item>
    <a-descriptions-item label="样本编号">{{patientInfo.sampleCode}}</a-descriptions-item>
    <a-descriptions-item label="性别">{{patientInfo.sex}}</a-descriptions-item>
    <a-descriptions-item label="住 院 号">{{patientInfo.patientId}}</a-descriptions-item>
    <a-descriptions-item label="送检医师">{{patientInfo.sendDoctor}}</a-descriptions-item>
    <a-descriptions-item label="临床诊断">{{patientInfo.clinical}}</a-descriptions-item>
    <a-descriptions-item label="送检单位">{{patientInfo.sendAgency}}</a-descriptions-item>
    <a-descriptions-item label="送检日期">{{patientInfo.sendDate}}</a-descriptions-item>
    <a-descriptions-item label="检测方法">{{patientInfo.detectionMethod}}</a-descriptions-item>
  </a-descriptions>
  <a-divider style="margin-bottom: 32px"/>
  <a-descriptions title="订单信息">
    <a-descriptions-item label="订单号">{{report.orderId}}</a-descriptions-item>
    <a-descriptions-item label="病例编号">1000000000</a-descriptions-item>
    <a-descriptions-item label="状态">已出报告</a-descriptions-item>
    <a-descriptions-item label="代谢组结果">{{report.ananpanReportValue}}</a-descriptions-item>
    <a-descriptions-item label="代谢组进度">已出报告</a-descriptions-item>
    <a-descriptions-item label="报告日期">{{report.ananpanTime}}</a-descriptions-item>
    <a-descriptions-item label="基因组结果">中风险</a-descriptions-item>
    <a-descriptions-item label="基因组状态">已出报告</a-descriptions-item>
    <a-descriptions-item label="报告日期">{{report.geneTime}}</a-descriptions-item>
    <a-descriptions-item label="影像组结果">{{report.imageReportValue}}</a-descriptions-item>
    <a-descriptions-item label="影像组状态">已出报告</a-descriptions-item>
    <a-descriptions-item label="报告日期">{{report.imageTime}}</a-descriptions-item>
  </a-descriptions>
  <a-divider style="margin-bottom: 32px"/>
  <div class="report-result">
    <span class="status-label">中风险</span>
    <a-descriptions title="代谢结果" >
      <a-descriptions-item label="肺癌">{{report.ananpanReportValue}}</a-descriptions-item>
    </a-descriptions>
  </div>
  <a-divider style="margin-bottom: 32px"/>
  <div class="title">影像结果</div>
  <div class="image-result">
    <div class="edit-toolbar-save">
      <a-button @click="handleComplete()">保存</a-button>
    </div>
    <div class="image-result-list">
      <div class="image-result-item" v-for="(item, index) in dicomResult.nodulesList" :key="index">
        <a-card :class="{'hight-risk': item.scrynMaligant >= 60}">
          <div class="image-result-item__content">
            <div class="edit-toolbar">
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
    width="1024px"
    title="AI影像表观--修改"
    @ok="handleOk"
  >
    <a-spin :spinning="confirmLoading">
      <div class="image-result">
      <div class="item-content-image">
        <div class="title" v-html="modelTitle"></div>
        <div class="b-flex">
          <dicom-image :url="mForm.imageUrl1" footer="横断面" class="b-flex-2"></dicom-image>
          <dicom-image :url="mForm.imageUrl2" footer="局部细节" class="b-flex-1"></dicom-image>
        </div>
      </div>
      <div class="item-content-info">
        <div class="item-info-row">
          <label>影像层:</label>
          <span v-html="mForm.iamgeNumber"></span>
        </div>
        <a-form-model ref="editFrom" :model="mForm" :rules="validatorRules" slot="detail">
          <a-form-model-item label="肺" prop="lung" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
            <a-input v-model="mForm.lungLocation" placeholder="请选择"></a-input>
          </a-form-model-item>
          <a-form-model-item label="肺叶" prop="lungLobe" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
            <a-input v-model="mForm.lobeLocation" placeholder="请输入肺叶"></a-input>
          </a-form-model-item>
          <a-form-model-item label="大小" prop="size" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
            <div class="item-info-row">
              <a-input v-model="mForm.sizeW" placeholder="请输入" suffix="mm"></a-input>
              *
              <a-input v-model="mForm.sizeH" placeholder="请输入" suffix="mm"></a-input>
            </div>
          </a-form-model-item>
          <a-form-model-item label="体积" prop="size" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
            <a-input v-model="mForm.noduleSize" placeholder="请输入结节体积" suffix="mm³"></a-input>
          </a-form-model-item>
          <a-form-model-item label="形态类型" prop="shape" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
            <a-input v-model="mForm.featureLabel" placeholder="请选择形态类型"></a-input>
          </a-form-model-item>
          <a-form-model-item label="标准直径" prop="diameter" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
            <a-input v-model="mForm.diameterNorm" placeholder="请输入标准直径" suffix="mm"></a-input>
          </a-form-model-item>
          <a-form-model-item label="恶性风险" prop="risk" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
            <a-input v-model="mForm.scrynMaligant" placeholder="请输入风险系数" suffix="%"></a-input>
          </a-form-model-item>
          <a-form-model-item label="中心密度" prop="centerDensity" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
            <a-input v-model="mForm.centerHu" placeholder="请输入中心密度" suffix="HU"></a-input>
          </a-form-model-item>
          <a-form-model-item label="平均密度" prop="avgDensity" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
            <a-input v-model="mForm.meanHu" placeholder="请输入平均密度" suffix="HU"></a-input>
          </a-form-model-item>
          <a-form-model-item label="最大密度" prop="maxDensity" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
            <a-input v-model="mForm.maxHu" placeholder="请输入最大密度" suffix="HU"></a-input>
          </a-form-model-item>
          <a-form-model-item label="最小密度" prop="minDensity" :labelCol="labelCol" :wrapperCol="wrapperCol" class="item-info-row">
            <a-input v-model="mForm.minHu" placeholder="请输入最小密度" suffix="HU"></a-input>
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
        sm: { span: 6 },
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
        name: '曹湧',
        age: '52',
        sampleCode: 'P02LA336',
        sex: '女',
        patientId: 'PCT0002145',
        sendDoctor: '张伞',
        clinical: '肺结节',
        sendAgency: '山东省胸科医院',
        sendDate: '20210915',
        detectionMethod: '血液蛋白组学/代谢组学，以及医学影像等多组学技术'
      },
      singature: {
        Inspector: '杨清婷',
        Reviewer: '夏文军',
        reportDate: '2021年9月22日'
      },
      dicomResult: {},
      report: {},
      ModifyVisible: false,
      mForm: {

      },
      url: {
        edit: '/report/sampleReportHistory/edit',
        queryById: '/report/sampleReportHistory/queryById'
      },
      validatorRules: {
        lungLocation: [{ required: true, message: '请选择肺!' }],
        lobeLocation: [{ required: true, message: '请输入肺叶!' }],
        diameter: [{ required: true, message: '请输入大小!' }],
        noduleSize: [
          { required: true, message: '请输入体积!' },
          { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
        ],
        featureLabel: [{ required: true, message: '请选择形态类型!' }],
        scrynMaligant: [{ required: true, message: '请输入风险!' }],
        diameterNorm: [
          { required: true, message: '请输入直径!' },
          { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
        ],
        centerHu: [
          { required: true, message: '请输入中心密度!' },
          { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
        ],
        meanHu: [
          { required: true, message: '请输入平均密度!' },
          { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
        ],
        maxHu: [
          { required: true, message: '请输入最大密度!' },
          { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
        ],
        minHu: [
          { required: true, message: '请输入最小密度!' },
          { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!'},
        ]
      },
      currImage: null,
      confirmLoading: false,
      modelTitle: ''
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
      let sizeArr = diameter.split('*')
      const sizeW = sizeArr[0].substring(0, sizeArr[0].length - 2)
      const sizeH = sizeArr[1].substring(0, sizeArr[0].length - 2)
      this.mForm = image
      this.mForm.sizeW = sizeW
      this.mForm.sizeH = sizeH
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
          this.dicomResult.imageList.splice(index, 1)
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
          this.report = res.result
          this.dicomResult = JSON.parse(this.report.imageReportAll)
          this.modelTitle = `窗宽：${this.dicomResult.windowing}  窗位： ${this.dicomResult.windowLevel}`
        } else {
          this.$message.error(res.message)
        }
      } catch (e) {
        this.$message.warning(e.message)
      }
    },
    handleOk () {
      this.mForm.diameter = this.mForm.sizeW + 'mm *' + this.mForm.sizeH + 'mm'
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

  }
}
</script>
<style lang="less">
  .report-detail {
    .title {
      color: rgba(0, 0, 0, .85);
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 16px;
    }

    .status-label {
      width: 100px;
      text-align: center;
      font-size: 13px;
      line-height: 32px;
      background: #dc5f0d;
      position: absolute;
      right: 0;
      top: 0;
      z-Index: 2;
      padding: 0 2em;
      -webkit-transform-origin: left bottom;
      -moz-transform-origin: left bottom;
      transform-origin: left bottom;
      -webkit-transform: translate(29.29%, -100%) rotate(45deg);
      -moz-transform: translate(29.29%, -100%) rotate(45deg);
      transform: translate(29.29%, -100%) rotate(45deg);
      text-indent: 0;

      &.low-risk {
        background: #5fb679;
      }

      &.hight-risk {
        background: #fe0100;
      }
    }
  }
  .report-result {
    position: relative;
    overflow: hidden;
    height: 75px;
  }

  .image-result {
    position: relative;
    &-list {
      display: flex;
      flex-wrap: wrap;
    }

    &-item {
      min-height: 45px;
      flex: 0 0 50%;

      &__content {
        position: relative;
        border: 2px solid transparent;
      }

      padding-right: 30px;
      margin-bottom: 30px;

      &:hover, &:active {
        .edit-toolbar {
          display: block;
        }
      }

      .ant-card {
        border: 2px solid #e8e8e8;

        &.hight-risk {
          border-color: #fe0100;
        }
      }
    }

    .item-content-image {
      flex: 2;

      .result-image {
        max-width: 100%;
      }
    }

    .item-content-info {
      flex: 1;
      padding: 15px;
    }

    .edit-toolbar {
      position: absolute;
      top: 15px;
      right: 15px;
      display: none;
    }
    .edit-toolbar-save {
      position: absolute;
      top: -45px;
      right: 30px;
    }
  }

  .item-info-row {
    margin-bottom: 10px;

    > label {
      font-weight: bold;
      margin-right: 10px;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  .result-image {
    max-width: 100%;
  }
  .ant-modal-body {
    .image-result {
      display: flex;

      .result-image {
        margin-top: 45px;
      }
    }

    .item-info-row {
      display: flex;
      align-items: center;
    }
  }
</style>
