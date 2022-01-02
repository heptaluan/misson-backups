<template>
  <a-card :bordered="false">
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAddStock" type="primary" icon="plus" v-has="'stockAdd'">新增基础耗材</a-button>
      <a-button @click="handleStockIn" type="primary" icon="plus" v-has="'mStockIn'">耗材入库</a-button>
      <a-button @click="handleStockOut" type="primary" icon="download" v-has="'mStockOut'">耗材出库</a-button>
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
        <a @click="handleEdit(record)" v-has="'stockAdd'">编辑</a>

        <a-divider type="vertical" v-has="'stockAdd'" />
        <a-dropdown>
          <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a @click="handleDetail(record)">详情</a>
            </a-menu-item>
            <a-menu-item v-has="'stockAdd'">
              <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                <a>删除</a>
              </a-popconfirm>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </a-table>

    <!-- 新增耗材 -->
    <!-- <AddStockModal ref="addStockModal" @ok="modalFormOk" /> -->

    <!-- 编辑表单 -->
    <AddStockModal ref="modalForm" @ok="modalFormOk" />

    <!-- 耗材入库 -->
    <StockInModal ref="stockInModal" />

    <!-- 耗材出库 -->
    <StockOutModal ref="stockOutModal" />

    <!--  -->
    <ModelManagementModal ref="addStockModal" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import StockInModal from '../materialManagement/StockInModal'
import StockOutModal from '../materialManagement/StockOutModal'
// import AddStockModal from '../materialManagement/AddStockModal'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import ModelManagementModal from '../../mission/materialManagement/ModelManagementModal'

export default {
  name: 'MaterialManagementList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    StockInModal,
    StockOutModal,
    ModelManagementModal
  },
  data() {
    return {
      description: '耗材管理管理页面',
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
          title: '耗材包名称',
          align: 'center',
          dataIndex: 'materialName'
        },
        {
          title: '耗材包编码',
          align: 'center',
          dataIndex: 'materialCode'
        },
        {
          title: '所属产品',
          align: 'center',
          dataIndex: '1'
        },
        {
          title: '耗材类型',
          align: 'center',
          dataIndex: 'materialType_dictText'
        },
        {
          title: '总库存数量',
          align: 'center',
          dataIndex: 'currentAmount',
          customRender: function(text) {
            return text ? text : 0
          }
        },
        {
          title: '入库数量',
          align: 'center',
          dataIndex: 'comeAmount',
          customRender: function(text) {
            return text ? text : 0
          }
        },
        {
          title: '出库数量',
          align: 'center',
          dataIndex: 'leaveAmount',
          customRender: function(text) {
            return text ? text : 0
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
        list: '/mission/materialManagement/list',
        delete: '/mission/materialManagement/delete',
        deleteBatch: '/mission/materialManagement/deleteBatch',
        exportXlsUrl: '/mission/materialManagement/exportXls',
        importExcelUrl: 'mission/materialManagement/importExcel'
      },
      dictOptions: {},
      superFieldList: []
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    handleEdit(record) {
      this.$refs.modalForm.edit(record, 'edit')
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.disableSubmit = true
    },
    handleDetail(record) {
      this.$refs.modalForm.edit(record, 'detail')
      this.$refs.modalForm.title = '详情'
      this.$refs.modalForm.disableSubmit = true
    },
    handleAddStock() {
      this.$refs.addStockModal.add()
      this.$refs.addStockModal.title = '新增'
      this.$refs.addStockModal.disableSubmit = false
    },
    handleStockIn() {
      this.$refs.stockInModal.show()
    },
    handleStockOut() {
      this.$refs.stockOutModal.show()
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
