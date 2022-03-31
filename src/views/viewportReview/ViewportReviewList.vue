<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group viewport-list">
          <a-col class="group">
            <a-form-item label="状态:" :labelCol="{ span: 6 }">
              <a-select style="width:180px;" v-model="resultType" placeholder="请选择状态">
                <a-select-option v-for="item in dicomtaskStatus" :key="item.value" :value="item.value">
                  {{ item.key }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="group">
            <a-form-item label="订单编号:" :labelCol="{ span: 6 }">
              <a-input style="width:180px;" v-model="orderId" placeholder="请输入订单编号" />
            </a-form-item>
          </a-col>
          <a-col class="group">
            <a-form-item label="patientId:" :labelCol="{ span: 6 }">
              <a-input v-model="medicalCaseId" placeholder="请输入patientId" />
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

    <div style="margin-bottom: 24px;" v-if="showReview">
      <a-button @click="handleBindPatients" type="primary">校验包分配</a-button>
      <a-button @click="handleReview" type="primary" style="margin-left: 15px;">一键审阅</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="orderId"
        class="j-table-force-nowrap"
        :scroll="{ x: true }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, onSelect: onSelect }"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a v-if="record.resultType !== 2" @click="handleShowDetail(record)">检阅</a>
          <a v-if="record.resultType === 2" @click="handleShowDetail(record)">查看详情</a>
        </span>
      </a-table>

      <ViewportReviewModal ref="modalForm" @ok="modalFormOk" />
    </div>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { setDoctorUpdate } from 'src/api/viewport/index'
import { getDnResultList } from 'src/api/viewport/index'
import ViewportReviewModal from './modules/ViewportReviewModal.vue'

export default {
  name: 'ViewportMetaList',
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
          title: '姓名',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'sex_dictText'
        },
        {
          title: '年龄',
          align: 'center',
          dataIndex: 'age'
        },
        {
          title: '订单编号',
          align: 'center',
          dataIndex: 'orderId'
        },
        {
          title: 'patientId',
          align: 'center',
          dataIndex: 'medicalCaseId'
        },
        {
          title: '结节数',
          align: 'center',
          dataIndex: 'imageNodulesCount'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'resultType',
          customRender: function(t, r, index) {
            if (r.resultType === 0) {
              return <span style="color:#ff4d4f;">未分配</span>
            } else if (r.resultType === 1) {
              return '未检阅'
            } else if (r.resultType === 2) {
              return <span style="color:#73d13d;">已检阅</span>
            } else if (r.resultType === 9) {
              return <span style="color:#73d13d;">AI完成</span>
            }
          }
        },
        {
          title: '完成日期',
          align: 'center',
          dataIndex: 'planCompletionTime',
          customRender: function(t, r, index) {
            if (r.planCompletionTime) {
              return r.planCompletionTime
            } else {
              return '-'
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
        list: 'tailai-report/report/image/getDnResultList'
      },
      isorter: {
        column: 'createTime'
        // order: 'asc'
      },
      dicomtaskStatus: [
        { key: '未分配', value: 0 },
        { key: '未检阅', value: 1 },
        { key: '已检阅', value: 2 },
        { key: 'AI完成', value: 9 }
      ],
      showReview: false,
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      resultType: undefined,
      orderId: '',
      selectedRowKeys: [],
      type: '',
      allRecords: [],
      medicalCaseId: ''
    }
  },
  methods: {
    handleShowDetail(record) {
      if (this.$store.getters.userRole.includes('admin')) {
        this.$router.push({
          path: `/viewportReviewDetail?id=${record.dnResultId}&orderId=${record.orderId}&resource=${record.dicomGroupId}&state=admin`
        })
      } else {
        this.$router.push({
          path: `/viewportReviewDetail?id=${record.dnResultId}&orderId=${record.orderId}&resource=${record.dicomGroupId}`
        })
      }
    },
    handleBindPatients() {
      const selectedRows = []
      const newRecords = this.unique(this.allRecords.flat())

      for (let i = 0; i < newRecords.length; i++) {
        for (let j = 0; j < this.selectedRowKeys.length; j++) {
          if (this.selectedRowKeys[j] === newRecords[i].orderId) {
            selectedRows.push(newRecords[i])
          }
        }
      }

      if (selectedRows.length === 0) {
        this.$message.warning(`请选择需要分配的病人列表`)
        return false
      }

      for (let i = 0; i < selectedRows.length; i++) {
        if (selectedRows[i].resultType === 2 || selectedRows[i].resultType === 9) {
          this.$message.warning(`已检阅的病人无法再次进行分配`)
          return false
        }
      }

      const dnIds = []
      const nodeCounts = []
      const names = []
      selectedRows.forEach(item => {
        dnIds.push(item.dnResultId)
        nodeCounts.push(item.imageNodulesCount)
        names.push(item.name)
      })
      const countAll = nodeCounts.reduce((pre, next) => (pre += Number(next)), 0)

      const record = {
        length: dnIds.length,
        dnIds: dnIds.join(),
        names: names.join(),
        countAll: countAll
      }

      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '新增影像包'
      this.$refs.modalForm.disableSubmit = false
    },
    handleReview() {
      const that = this
      const selectedRows = []
      const newRecords = this.unique(this.allRecords.flat())

      for (let i = 0; i < newRecords.length; i++) {
        for (let j = 0; j < this.selectedRowKeys.length; j++) {
          if (this.selectedRowKeys[j] === newRecords[i].orderId) {
            selectedRows.push(newRecords[i])
          }
        }
      }

      if (selectedRows.length === 0) {
        this.$message.warning(`请选择需要分配的病人列表`)
        return false
      }

      const ids = []
      for (let i = 0; i < selectedRows.length; i++) {
        if (selectedRows[i].resultType === 0 || selectedRows[i].resultType === 1) {
          ids.push(selectedRows[i].dnResultId)
        } else {
          this.$message.warning(`不能审阅已经完成的列表`)
          return false
        }
      }

      const params = {
        ids: ids.join()
      }

      setDoctorUpdate(params).then(res => {
        if (res.success) {
          that.$message.success(`一键审阅成功`)
          that.loadData()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    loadData() {
      const that = this
      if (this.$store.getters.userRole.includes('admin')) {
        this.type = 'getAdminDnResultList'
      } else {
        this.type = 'getDnResultList'
      }
      console.log(that.$store.getters.userInfo.username)
      getDnResultList(this.type, {
        pageNo: that.ipagination.current,
        pageSize: that.ipagination.pageSize,
        // column: 'createTime',
        // order: 'desc',
        resultType: that.resultType,
        orderId: that.orderId,
        medicalCaseId: that.medicalCaseId
      }).then(res => {
        if (res.success) {
          that.ipagination.total = res.result.total
          that.dataSource = res.result.records
          that.allRecords.push([...res.result.records])
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter(arr => !res.has(arr.orderId) && res.set(arr.orderId, 1))
    },
    handleTableChange(pagination) {
      this.ipagination = pagination
      this.loadData()
    },
    searchQuery() {
      this.loadData()
    },
    resetQuery() {
      this.resultType = undefined
      this.orderId = ''
      this.medicalCaseId = ''
      this.loadData()
    },
    onSelect(record, selected, selectedRows) {
      // if (selected) {
      //   this.selectedRows.push(record)
      // }
      // if (!selected) {
      //   let delIndex = this.selectedRows.findIndex(val => {
      //     return val.id === record.id
      //   })
      //   this.selectedRows.splice(delIndex, 1)
      // }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
    },
    modalFormOk() {
      this.loadData()
      this.selectedRowKeys = []
      this.selectedRows = []
      this.ipagination.current = 1
    }
  },
  mounted() {
    this.user = this.$store.getters.userRole
    if (this.user.includes('admin')) {
      this.showReview = true
    } else {
      this.showReview = false
    }
  }
}
</script>
