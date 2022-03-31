<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group">
          <a-col class="group sm">
            <a-form-item label="入库单号" :labelCol="{ span: 8 }">
              <a-input placeholder="请输入入库单号" v-model="queryParam.batchNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col class='group sm'>
            <a-form-item label='状态' :labelCol='{ span: 5 }'>
              <a-select v-model='queryParam.status' placeholder='请选择产品状态'>
                <a-select-option
                  v-for='item in productStatus'
                  :key='item.key'
                  :value='item.key'
                >
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class='group md'>
            <a-form-item label='入库时间' :labelCol='{ span: 5 }'>
              <a-range-picker @change='onTimeChange' allowClear v-model='queryParam.datePick' />
            </a-form-item>
          </a-col>
          <a-col class='group btn'>
            <a-button type='primary' @click='searchQuery'>查询</a-button>
            <a-button @click='searchReset'>重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator" style="margin: 5px 0 10px 2px">
      <a-button @click="handleStockIn" type="primary" icon="plus" v-has="'stockIn'">耗材包入库</a-button>
      <!--      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
      <!--        <a-button type="primary" icon="import">导入</a-button>-->
      <!--      </a-upload>-->
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('入库管理')">导出Excel</a-button> -->
    </div>
    <!-- table区域-begin -->
    <a-table
      ref="table"
      size="middle"
      :scroll="{ x: true }"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      class="j-table-force-nowrap"
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

      <span slot="action" slot-scope="text, record">
        <a @click="handleShowDetail(record)">查看详情</a>
      </span>
    </a-table>

    <StockInModal ref="stockInModal" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import StockInModal from 'src/views/mission/materialManagement/StockInModal'

export default {
  name: 'StockIn',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    StockInModal
  },
  data() {
    return {
      description: '耗材管理页面',
      title: '',
      width: 1280,
      disableSubmit: false,
      stockInVisible: false,
      stockOutVisible: false,
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
          title: '入库单号',
          align: 'center',
          dataIndex: 'batchNo'
        },
        {
          title: '仓库名称',
          align: 'center',
          dataIndex: 'warehouseId_dictText'
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
          title: '状态',
          align: 'center',
          dataIndex: 'status_dictText'
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
        list: '/mission/materialManagement/stock/comeApply/list',
        delete: '/mission/materialManagement/stock/comeApply/delete',
        deleteBatch: '/mission/materialManagement/stock/comeApply/deleteBatch',
        exportXlsUrl: '/mission/materialManagement/stock/comeApply/exportXls',
        importExcelUrl: 'mission/materialManagement/stock/comeApply/importExcel'
      },
      productStatus: [
        // {key: 0, value: '启用'},
        {key: 1, value: '已创建'},
        {key: 2, value: '待审核'},
        {key: 3, value: '通过'},
        {key: 4, value: '退回'},
      ]
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    handleShowDetail(record) {
      this.$refs.stockInModal.show(record)
      this.$refs.stockInModal.title = '查看详情'
    },
    handleStockIn() {
      this.$refs.stockInModal.show()
    },
    onTimeChange(date, dateString) {
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
.btn-group {
  display: flex;
  justify-content: space-evenly;
}
</style>
