<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <!-- <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group order-list">
          <div class="group">
            <div class="title">病例编号：</div>
            <a-input allowClear v-model="queryParam.medicalCaseCode" placeholder="请输入病例编号"></a-input>
          </div>
          <a-button @click="resetQuery">重置</a-button>
          <a-button @click="searchQuery" type="primary">搜索</a-button>
        </a-row>
      </a-form>
    </div> -->
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" @click="batchImport">批量导入订单</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey='id'
        class='j-table-force-nowrap'
        :scroll="{ x: true }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img
            v-else
            :src="getImgView(text)"
            height="25px"
            alt=""
            style="max-width:80px;font-size: 12px;font-style: italic;"
          />
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record" style="display: flex;justify-content: space-evenly;">
          <a v-if="record.taskStatus === 3 || record.taskStatus === 4" @click="handleShowLog(record)">查看日志</a>
          <a v-if="record.taskStatus === 2 || record.taskStatus === 4" @click="handlePreview(record)">查看订单</a>
        </span>
      </a-table>
    </div>

    <OrderHistoryModal ref="orderHistoryModal" @ok="modalFormOk" />
    <order-batch-import-modal ref="orderBatchImportModal" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import OrderHistoryModal from './modules/OrderHistoryModal'
import { CommonSingleUpload, startOrderImportTask } from 'src/api/order/index'
import OrderBatchImportModal from './modules/orderBatchImportModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

export default {
  name: 'OrderHistory',
  mixins: [JeecgListMixin],
  components: {
    OrderBatchImportModal,
    OrderHistoryModal
  },
  data() {
    return {
      description: '产品订单元数据信息管理页面',
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
          title: '任务名称',
          align: 'center',
          dataIndex: 'taskName'
        },
        {
          title: '文件名称',
          align: 'center',
          dataIndex: 'fileName'
        },
        {
          title: '渠道商',
          align: 'center',
          dataIndex: 'accessShortName_dictText'
        },
        {
          title: '创建人',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '订单状态',
          align: 'center',
          dataIndex: 'taskStatus',
          customRender: function(t, r, index) {
            switch (r.taskStatus) {
              case 0:
                return '未开始'
              case 1:
                return '进行中'
              case 2:
                return '成功'
              case 3:
                return '失败'
              case 4:
                return '部分成功'
              default:
                break
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
        list: '/multiomics/orderImportTask/list'
      },
      dictOptions: {},
      superFieldList: [],
      productInfoList: []
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    handleDetail(record) {
      this.$router.push({ name: 'orderDetail', params: { id: record.id } })
    },
    resetQuery() {
      this.queryParam = {}
      this.loadData()
    },
    beforeUpload(file) {
      const that = this
      const isExcel =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel'
      if (!isExcel) {
        this.$message.error('只能上传 Excel 文件!')
      }
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('文件大小必须小于 10MB!')
      }
      this.currentFile = file
      return isExcel && isLt10M
    },
    handleUpload(file) {
      const that = this
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('code', '4000')
      CommonSingleUpload(formData)
        .then(res => {
          if (res.success) {
            that.$message.success(res.message)
            const id = res.result.id
            startOrderImportTask({
              fileInfo: id
            }).then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadData()
              } else {
                that.$message.error(res.message)
              }
            })
          } else {
            that.$message.error(res.message)
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    handlePreview(record) {
      this.$router.push({
        path: `/order/orderList?importTaskId=${record.id}`
      })
    },
    handleShowLog(record) {
      this.$refs.orderHistoryModal.show(record)
    },
    batchImport(record) {
      this.$refs.orderBatchImportModal.show(record)
    }
  }
}
</script>

<style lang="less" scoped>
.table-operator {
  margin-bottom: 0;
}
</style>
