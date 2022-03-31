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
            <a-form-item label="状态:" :labelCol="{ span: 6 }">
              <a-select v-model="taskStatus" placeholder="请选择状态" style="width:180px;">
                <a-select-option v-for="item in dicomtaskStatus" :key="item.value" :value="item.value">
                  {{ item.key }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col class="group" v-if="this.$store.getters.userRole.includes('admin')">
            <a-form-item label="分配医生:" :labelCol="{ span: 6 }">
              <a-select allowClear v-model="doctor" placeholder="请选择分配医生" style="width:180px;">
                <a-select-option v-for="item in doctorList" :key="item.id" :value="item.username">
                  {{ item.realname }}
                </a-select-option>
              </a-select>
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
        rowKey="id"
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
          <a @click="handleShowDetail(record)">查看详情</a>
        </span>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getReportDoctorList, getDoctorList } from 'src/api/viewport/index'

export default {
  name: 'viewportReviewPackage',
  mixins: [JeecgListMixin],
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
          dataIndex: 'taskName'
        },
        {
          title: '预计完成时间',
          align: 'center',
          dataIndex: 'finishTime'
        },
        {
          title: '分配时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '完成时间',
          align: 'center',
          dataIndex: 'completeTime'
        },
        {
          title: '分配医生',
          align: 'center',
          dataIndex: 'doctor'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'taskStatus',
          customRender: function(t, r, index) {
            if (r.taskStatus === 0) {
              return <span style="color:#ff4d4f;">未检阅</span>
            } else if (r.taskStatus === 1) {
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
        list: 'report/doctorTask/list'
      },
      dicomtaskStatus: [
        { key: '未检阅', value: 0 },
        { key: '已检阅', value: 1 }
      ],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      taskStatus: undefined,
      createTime_begin: '',
      createTime_end: '',
      datePick: [],
      doctor: undefined,
      doctorList: []
    }
  },
  methods: {
    onTimeChange(date, dateString) {
      this.createTime_begin = dateString[0]
      this.createTime_end = dateString[1]
      console.log(dateString)
    },
    loadData() {
      const that = this
      getReportDoctorList({
        // doctor: that.$store.getters.userInfo.username === 'doctor_test' ? that.$store.getters.userInfo.username : null,
        pageNo: that.ipagination.current,
        pageSize: that.ipagination.pageSize,
        column: 'createTime',
        order: 'desc',
        orderId: that.orderId,
        taskStatus: that.taskStatus,
        createTime_begin: that.createTime_begin,
        createTime_end: that.createTime_end,
        doctor: that.doctor
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
    resetQuery() {
      this.taskStatus = undefined
      this.doctor = undefined
      this.createTime_begin = ''
      this.createTime_end = ''
      this.datePick = []
      this.loadData()
    },
    handleShowDetail(record) {
      this.$router.push({
        path: `/viewportReviewPackageDetail?id=${record.id}`
      })
    },
    getDoctorList() {
      getDoctorList({
        role: 'doctor_test'
      }).then(res => {
        if (res.code === 200) {
          this.doctorList = res.result
        }
      })
    }
  },
  mounted() {
    this.getDoctorList()
  }
}
</script>
