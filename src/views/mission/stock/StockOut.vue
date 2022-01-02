<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <!-- 搜索区域 -->
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group">
          <a-col class="group">
            <a-form-item label="创建人">
              <a-input allowClear v-model="queryParam.createBy" placeholder="请输入创建人名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col class="group md">
            <a-form-item label="销售:" :labelCol="{ span: 6 }">
              <a-select
                show-search
                allow-clear
                :value="sellUserId"
                placeholder="输入关联销售进行检索"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleSellSearch"
                @change="handleSellChange"
              >
                <a-select-option v-for="item in sellData" :key="item.id" :value="item.username">
                  {{ item.realname }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="group sm">
            <a-form-model-item label="订单客户" prop="leaveAgency" class="order-label"  :labelCol="{ span: 6 }">
              <a-select v-model="queryParam.leaveAgency" placeholder="请选择订单客户">
                <a-select-option v-for="item in cooperationList" :key="item.id" :value="item.shortName">
                  {{ item.accessName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col class="group sm">
            <a-form-model-item label="出库仓库" prop="warehouseId" :labelCol="{ span: 6 }">
              <j-dict-select-tag
                type="list"
                v-model="queryParam.warehouseId"
                dictCode="warehouse_manage, name, id"
                placeholder="请选择出库仓库"
                change="onChange"
              />
            </a-form-model-item>
          </a-col>
          <a-col class="group sm">
            <a-form-item label="订单时间" :labelCol="{ span: 5 }">
              <j-date
                v-model="queryParam.createTime_begin"
                :showTime="true"
                date-format="YYYY-MM-DD"
                placeholder="请选择开始时间"
              ></j-date>
              <span style="margin: 0 10px;">~</span>
              <j-date
                v-model="queryParam.createTime_end"
                :showTime="true"
                date-format="YYYY-MM-DD"
                placeholder="请选择结束时间"
              ></j-date>
            </a-form-item>
          </a-col>
          <a-col class="group btn">
            <a-button type="primary" @click="searchQuery">查询</a-button>
            <a-button @click="resetQuery">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator" style="margin: 5px 0 10px 2px">
      <a-button @click="handleStockOut" type="primary" icon="download" v-has="'stockOut'">创建耗材订单</a-button>
      <!--      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
      <!--        <a-button type="primary" icon="import">导入</a-button>-->
      <!--      </a-upload>-->
      <a-button type="primary" icon="download" @click="handleExportXls(`导出耗材订单${currentTime}`)"
        >导出Excel</a-button
      >
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

      <span slot="action" slot-scope="text, record" style="display: flex;justify-content: space-evenly;">
        <a @click="handleShowDetail(record)">详情</a>
        <a v-if="record.status === 3" @click="showCodeControl(record)">查看编号</a>
      </span>
    </a-table>

    <!-- 出库表单 -->
    <StockOutModal ref="stockOutModal" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import StockOutModal from 'src/views/mission/materialManagement/StockOutModal'
import { getDistributorList } from '../../../api/product'
import { queryRoleUsers } from '../../../api/material'

function sellFetch(value, callback) {
  let timeout
  let currentValue

  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value

  function fake() {
    queryRoleUsers({
      role: 'sales_omics',
      name: value
    }).then(res => {
      if (res.success) {
        if (currentValue === value) {
          const result = res.result
          const data = []
          result.forEach(r => {
            data.push({
              key: r.id,
              realname: r.realname,
              username: r.username,
              id: r.id
            })
          })
          callback(data)
        }
      } else {
        console.log(res.message)
      }
    })
  }

  timeout = setTimeout(fake, 300)
}

export default {
  name: 'StockOut',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    StockOutModal
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
          title: '仓库',
          align: 'center',
          dataIndex: 'warehouseId_dictText'
        },
        {
          title: '订单客户',
          align: 'center',
          dataIndex: 'leaveAgency_dictText'
        },
        {
          title: '销售人员',
          align: 'center',
          dataIndex: 'sellUserId_dictText'
        },
        {
          title: '病例数',
          align: 'center',
          dataIndex: 'caseAmount'
        },
        {
          title: '空白编号数',
          align: 'center',
          dataIndex: 'caseCodeAmount'
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
          title: '备注',
          align: 'center',
          dataIndex: 'remark'
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
        list: '/mission/materialManagement/stock/leaveApply/list',
        delete: '/mission/materialManagement/stock/leaveApply/delete',
        deleteBatch: '/mission/materialManagement/stock/leaveApply/deleteBatch',
        exportXlsUrl: '/mission/materialManagement/exportLeaveApply',
      },
      cooperationList: null,
      currentTime: '',
      sellData: [],
      user: null,
      sellUserId: undefined,
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    handleShowDetail(record) {
      this.$refs.stockOutModal.show(record)
      this.$refs.stockOutModal.title = '查看详情'
    },
    showCodeControl(record) {
      this.$router.push({
        path: `/mission/codeControl?leaveApplyId=${record.id}`
      })
    },
    handleStockOut() {
      this.$refs.stockOutModal.show()
    },
    handleSellSearch(value) {
      if (!(this.user.role.includes('sales_omics') && !this.user.role.includes('sales_super_omics'))) {
        sellFetch(value, data => (this.sellData = data))
      }
    },
    handleSellChange(value) {
      this.sellUserId = value
      if (!(this.user.role.includes('sales_omics') && !this.user.role.includes('sales_super_omics'))) {
        sellFetch(value, data => (this.sellData = data))
      }
      this.$set(this.queryParam, 'leaveAgency', undefined)
      if (value) {
        this.queryParam.sellUserId = value
        this.loadDistributorList(value)
      }
    },
    loadDistributorList() {
      const that = this
      getDistributorList().then(res => {
        if (res.success) {
          that.cooperationList = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    getCurrentTime() {
      let yy = new Date().getFullYear()
      let mm = new Date().getMonth() + 1 < 10 ? '0' + new Date().getMonth() + 1 : new Date().getMonth() + 1
      let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
      let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      yy = yy.toString()
      mm = mm.toString()
      dd = dd.toString()
      hh = hh.toString()
      mf = mf.toString()
      ss = ss.toString()
      this.currentTime = yy + mm + dd + hh + mf + ss
    },
    resetQuery() {
      this.queryParam = {}
      this.sellUserId = null;
      this.loadData()
    }
  },
  mounted() {
    this.getCurrentTime();
    this.user = this.$store.state.user.info;
    this.loadDistributorList();
    if (this.user.role.includes('sales_omics') && !this.user.role.includes('sales_super_omics')) {
      this.sellData = [this.user]
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
