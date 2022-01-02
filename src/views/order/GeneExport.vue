<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group">
          <div class="group">
            <div class="title">批次号：</div>
            <a-input allowClear v-model="queryParam.batchId" placeholder="请输入名称"></a-input>
          </div>
          <div class="group">
            <div class="title">状态：</div>
            <a-input allowClear v-model="queryParam.status" placeholder="请选择"></a-input>
          </div>
          <div class="group">
            <div class="title">导出人：</div>
            <a-input allowClear v-model="queryParam.sale" placeholder="请选择导出人"></a-input>
          </div>
          <div class="group">
            <div class="title">导出时间：</div>
            <j-date
              v-model="queryParam.createTime_begin"
              :showTime="true"
              date-format="YYYY-MM-DD"
              style="width:45%"
              placeholder="请选择开始时间"
            ></j-date>
            <span style="width: 10px;">-</span>
            <j-date
              v-model="queryParam.createTime_end"
              :showTime="true"
              date-format="YYYY-MM-DD"
              style="width:45%"
              placeholder="请选择结束时间"
            ></j-date>
          </div>
          <a-button @click="resetQuery">重置</a-button>
          <a-button @click="searchQuery" type="primary">搜索</a-button>
        </a-row>
      </a-form>
    </div>

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
        <a @click="handleView(record)" class="margin-right-xs">查看明细</a>
        <a @click="handleEdit(record)">编辑表单</a>
      </span>
    </a-table>

    <GeneExportModal ref="modalForm" @ok="modalFormOk" @close="modalFormClose" />
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import GeneExportModal from './modules/GeneExportModal'
import '@/assets/less/TableExpand.less'

export default {
  name: 'GeneExport',
  mixins: [JeecgListMixin],
  components: {
    GeneExportModal
  },
  data() {
    return {
      description: '基因导出记录',
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
          title: '批次号',
          align: 'center',
          dataIndex: 'batchId'
        },
        {
          title: '批次数量',
          align: 'center',
          dataIndex: 'batchCount'
        },
        {
          title: '导出人',
          align: 'center',
          dataIndex: 'sampleNo'
        },
        {
          title: '导出时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 240,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/multiomics/productOrder/list',
        delete: '/multiomics/productOrderMeta/delete',
        deleteBatch: '/multiomics/productOrderMeta/deleteBatch',
        exportXlsUrl: '/multiomics/productOrderMeta/exportXls',
        importExcelUrl: 'multiomics/productOrderMeta/importExcel'
      },
      dictOptions: {},
      superFieldList: []
    }
  },
  created() {
    this.getSuperFieldList()
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    initDictConfig() {},
    getData() {},
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'sampleNo', text: '样本编号', dictCode: '' })
      fieldList.push({ type: 'string', value: 'productId', text: '产品', dictCode: '' })
      fieldList.push({ type: 'string', value: 'companyId', text: '送检单位', dictCode: '' })
      fieldList.push({ type: 'string', value: 'cancerType', text: '癌种', dictCode: '' })
      fieldList.push({ type: 'string', value: 'emsId', text: '快递公司', dictCode: '' })
      fieldList.push({ type: 'string', value: 'emsNo', text: '快递单号', dictCode: '' })
      fieldList.push({ type: 'string', value: 'deliveryAddressId', text: '收件地址', dictCode: '' })
      fieldList.push({ type: 'string', value: 'sendDepartment', text: '送检科室', dictCode: '' })
      fieldList.push({ type: 'string', value: 'sendDoctor', text: '送检医生', dictCode: '' })
      this.superFieldList = fieldList
    },
    handleView(record) {
      // this.$router.push({name:'orderDetail', params: { id: record.id}})
    },
    resetQuery() {
      this.queryParam = {}
    },
    modalFormClose() {
      // 当用户关闭时候 也刷新列表
      this.modalFormOk()
    }
  }
}
</script>
<style lang="less">
.search-group {
  padding-left: 12px;
  .group {
    .title {
      width: 50px;
      flex: 0 0 50px;
    }
  }
}
</style>
