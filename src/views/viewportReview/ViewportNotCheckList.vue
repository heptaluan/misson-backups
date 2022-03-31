<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group viewport-list">
          <a-col class="group tiny">
            <a-form-item label="分配时间:" :labelCol="{ span: 6 }">
              <a-range-picker @change="onTimeChange" allowClear v-model="datePick" />
            </a-form-item>
          </a-col>
          <a-col class="group">
            <a-form-item label="patientId:" :labelCol="{ span: 6 }">
              <a-input v-model="hospitalPatientId" placeholder="请输入patientId" />
            </a-form-item>
          </a-col>
          <a-col class="group btn">
            <a-button @click="searchQuery" type="primary" style="margin-right:15px;">搜索</a-button>
            <a-button @click="resetQuery">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="taskId"
        class="j-table-force-nowrap"
        :scroll="{ x: true }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleShowDetail(record)">检阅</a>
        </span>
      </a-table>

      <ViewportReviewModal ref="modalForm" @ok="modalFormOk" />
    </div>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getTaskUnCheckList } from 'src/api/viewport/index'
import ViewportReviewModal from './modules/ViewportReviewModal.vue'

export default {
  name: 'ViewportNotCheckList',
  mixins: [JeecgListMixin],
  components: {
    ViewportReviewModal
  },
  data() {
    return {
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '校验包名称',
          align: 'center',
          dataIndex: 'packageName'
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'sex_dictText',
        },
        {
          title: '年龄',
          align: 'center',
          dataIndex: 'age'
        },
        {
          title: 'patientId',
          align: 'center',
          dataIndex: 'hospitalPatientId'
        },
        {
          title: '检查日期',
          align: 'center',
          dataIndex: 'hospitalImageTime',
        },
        {
          title: '结节数',
          align: 'center',
          dataIndex: 'nodeCount'
        },
        {
          title: '分配时间',
          align: 'center',
          dataIndex: 'taskCreateTime'
        },
        {
          title: '预计完成时间',
          align: 'center',
          dataIndex: 'taskPlanCompletionTime'
        },
        {
          title: '医生',
          align: 'center',
          dataIndex: 'doctor',
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'taskStatus',
          customRender: function(t, r, index) {
            if (Number(r.taskStatus) === 0) {
              return <span style="color:#ff4d4f;">未检阅</span>
            } else if (Number(r.taskStatus) === 1) {
              return <span style="color:#73d13d;">已检阅</span>
            }
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: 'tailai-report/report/image/getDoctorTaskList'
      },
      isorter: {
        column: 'createTime'
        // order: 'asc'
      },
      dicomtaskStatus: [
        { key: '未检阅', value: '0' },
        { key: '已检阅', value: '1' },
      ],
      doctorList: [],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      orderId: '',
      selectedRowKeys: [],
      selectedRows: [],
      type: '',
      createTime_begin: '',
      createTime_end: '',
      hospitalPatientId: '',
      datePick: []
    }
  },
  methods: {
    onTimeChange(date, dateString) {
      this.createTime_begin = dateString[0]
      this.createTime_end = dateString[1]
      console.log(dateString)
    },
    handleShowDetail(record) {
      this.$router.push({
        path: `/viewportReviewDetail?id=${record.taskId}&orderId=${record.orderId}&resource=${record.dicomGroupId}&taskId=${record.taskId}&doctorId=${record.taskId}&backType=check`
      })
    },
    loadData() {
      const that = this
      console.log(that.$store.getters.userInfo)
      getTaskUnCheckList({
        // doctor: that.$store.getters.userInfo.username,
        pageNo: that.ipagination.current,
        pageSize: that.ipagination.pageSize,
        // column: 'createTime',
        order: 'desc',
        createTime_begin: that.createTime_begin,
        createTime_end: that.createTime_end,
        hospitalPatientId: that.hospitalPatientId
      }).then(res => {
        if (res.success) {
          that.ipagination.total = res.result.total
          that.dataSource = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleTableChange(pagination) {
      this.ipagination = pagination
      this.loadData()
    },
    searchQuery() {
      this.loadData()
    },
    resetQuery() {
      this.hospitalPatientId = ''
      this.taskStatus = undefined
      this.createTime_begin = ''
      this.createTime_end = ''
      this.datePick = []
      this.loadData()
    },
  }
}
</script>
