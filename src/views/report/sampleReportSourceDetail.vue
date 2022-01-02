<template>
  <a-card :bordered="false" class="report-detail">
    <div class="edit-toolbar">
      <a-button @click="setResult" class="margin-right-sm">选中为结果</a-button>
      <a-dropdown-button>
        报告结果版本
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item key="1"> <a-icon type="appstore" /> 点内报告结果 </a-menu-item>
          <a-menu-item key="2"> <a-icon type="appstore" /> 医院报告结果 </a-menu-item>
          <a-menu-item key="3"> <a-icon type="appstore" /> 内部报告结果 </a-menu-item>
        </a-menu>
      </a-dropdown-button>
    </div>
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
      <div class="image-result-list">
        <div class="image-result-item" v-for="(item, index) in dicomResult.nodulesList" :key="index">
          <a-card :class="{'hight-risk': item.scrynMaligant >= 60}">
            <dicom-info :item = "item" :title="modelTitle"></dicom-info>
          </a-card>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
import { getAction, putAction } from '@/api/manage'
import DicomInfo from './template/components/dicom-info'
export default {
  name: 'sampleReportDetail',
  components: {
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
      dicomResult: {
        total: 11,
        imageList: []
      },
      report: {},
      ModifyVisible: false,
      mForm: {

      },
      url: {
        commit: '/report/sampleReportSource/Commit',
        queryById: '/report/sampleReportSource/queryById',
        setResult: '/report/sampleReportSource/setResult'
      },
      currImage: null,
      confirmLoading: false,
      defaultImage: require('/src/views/report/template/resource/result.jpg'),
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
      this.getSourceDatail()
    },
    handleMenuClick(e) {
      console.log('click', e)
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
    async setResult () {
      if (!this.report.id) {
        return false
      }
      const url = this.url.commit
      try {
        const postData = {
          ...this.report
        }
        const res = await putAction(url, postData)
        if (res.code === 200) {
          this.$message.success('确认成功！')
        } else {
          this.$message.error(res.message)
        }
      } catch (e) {
        this.$message.warning(e.message)
      }
    }
  }
}
</script>
<style lang="less">
  .report-detail {
    position: relative;
    .edit-toolbar {
      position: absolute;
      top: 15px;
      right: 15px;
    }
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

    .report-result {
      position: relative;
      overflow: hidden;
      height: 75px;
    }

    .image-result {
      &-list {
        display: flex;
        flex-wrap: wrap;
      }

      &-item {
        min-height: 45px;
        flex: 0 0 50%;

        &__content {
          display: flex;
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
  }
</style>
