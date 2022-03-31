<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group">
          <a-col class="group md">
            <a-form-item label="耗材订单编号">
              <a-input
                allowClear
                v-model="queryParam.leaveApplyId"
                placeholder="请输入耗材订单编号"
                @change="onChange"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col class="group md">
            <a-form-item label="创建时间">
              <a-range-picker @change='onTimeChange' allowClear v-model='queryParam.datePick' />
            </a-form-item>
          </a-col>
          <a-col class="group md">
            <a-form-item label="销售:" :labelCol="{ span: 6 }">
              <a-select
                show-search
                :value="sellValue"
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
          <a-col class="group md">
            <a-form-item label='渠道商' prop='sendAccess' class='order-label'>
              <a-select v-model='queryParam.agencyShortName' placeholder='请选择渠道商'
                        style='width:200px'
                        show-search
                        :value='channelValue'
                        :default-active-first-option='false'
                        :filter-option='false'
                        :not-found-content='null'
                        @search='handleChannelSearch'
                        @change='handleChannelChange'>
                <a-select-option v-for='item in distributorList' :key='item.id' :value='item.departNameAbbr'>
                  {{ item.departName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="group btn">
            <a-button @click="searchQuery" type="primary">查询</a-button>
            <a-button @click="resetQuery">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" icon="upload" @click="handleImportHistorical">历史编号导入</a-button>
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
        <div class="btn-group" style="display: flex;">
          <a v-if="record.status === 1" @click="preview(record)">查看编号</a>
          <a v-if="record.status === 1" @click="downloadCode(record)" v-has="'codeEdit'">下载编号</a>
          <a v-if="record.status !== 1" @click="handleShowLog(record)" v-has="'codeEdit'">查看日志</a>
          <!-- <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="downloadCode(record)" v-has="'codeEdit'">下载编号</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </div>
      </span>
    </a-table>

    <ShowCreateCodeModal ref="showCreateCodeModal" @ok="modalFormOk" />
    <ShowImportCodeModal ref="showImportCodeModal" @ok="modalFormOk" />

    <ImportHistoricalCodeModal ref="importHistoricalCodeModal" @ok="modalFormOk" />
    <OrderHistoryModal ref="orderHistoryModal" @ok="modalFormOk" />

  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixinForMount'
import { selectorFilterMixin } from '@/mixins/selectorFilterMixin'
import ShowCreateCodeModal from './modules/sample/ShowCreateCodeModal'
import ShowImportCodeModal from './modules/sample/ShowImportCodeModal'
import ImportHistoricalCodeModal from './modules/sample/ImportHistoricalCodeModal'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { queryRoleUsers } from '../../api/material'
import OrderHistoryModal from '../order/modules/OrderHistoryModal.vue'

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
  name: 'CodeControl',
  mixins: [JeecgListMixin, mixinDevice, selectorFilterMixin],
  components: {
    ShowCreateCodeModal,
    ShowImportCodeModal,
    ImportHistoricalCodeModal,
    OrderHistoryModal
  },
  data() {
    return {
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
          title: '耗材订单编号',
          align: 'center',
          dataIndex: 'leaveApplyId',
          customRender: function(t, r, index) {
            if (r.leaveApplyId) {
              return t
            } else {
              return '-'
            }
          }
        },
        {
          title: '渠道商',
          align: 'center',
          dataIndex: 'agencyShortName_dictText'
        },
        {
          title: '编号数量',
          align: 'center',
          dataIndex: 'codeAmount'
          // customRender: function(t, r, index) {
          //   if (r.status !== 10000) {
          //     return '-'
          //   } else {
          //     return t
          //   }
          // }
        },
        {
          title: '病例数量',
          align: 'center',
          dataIndex: 'caseAmount'
          // customRender: function(t, r, index) {
          //   if (r.circuitResult !== 10000) {
          //     return '-'
          //   } else {
          //     return t
          //   }
          // }
        },

        {
          title: '状态',
          align: 'center',
          dataIndex: 'status_dictText'
          // customRender: function(t, r, index) {
          //   if (r.circuitResult === 20000) {
          //     return '进行中'
          //   } else {
          //     return t
          //   }
          // }
        },
        {
          title: '类别',
          align: 'center',
          dataIndex: 'taskType',
          customRender: function(t, r, index) {
            if (r.taskType === 1) {
              return '外部导入'
            } else {
              return '系统生成'
            }
          }
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
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
        list: `mission/codeManagement/list`,
        delete: 'mission/codeManagement/delete'
      },
      distributorList: [],
      sellData: [],
      user: null,
      hospitalList: [],
      sellValue: undefined,
      channelValue: undefined
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    preview(record) {
      if (record.taskType === 1) {
        this.$refs.showImportCodeModal.show(record)
      } else if (record.taskType === 0) {
        this.$refs.showCreateCodeModal.show(record)
      }
    },
    downloadCode(record) {
      const token = Vue.ls.get(ACCESS_TOKEN)
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = `${Vue.prototype.API_BASE_URL}/mission/fileInfo/download?id=${record.fileInfoId}&token=${token}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    resetQuery() {
      this.queryParam = {}
      this.sellValue = null
      this.loadData()
    },
    onChange(e) {
      if (e.target.value === '') {
        this.loadData()
      }
    },
    handleShowViewportUploadModal() {
      this.$refs.viewportUploadModal.show()
    },
    handleSellSearch(value) {
      if (!(this.user.includes('sales_omics') && !this.user.includes('sales_super_omics'))) {
        sellFetch(value, data => (this.sellData = data))
      }
    },
    handleSellChange(value) {
      this.sellValue = value
      if (!(this.user.includes('sales_omics') && !this.user.includes('sales_super_omics'))) {
        sellFetch(value, data => (this.sellData = data))
      }
      this.$set(this.queryParam, 'agencyId', undefined) // clean the previous data if the sellUser or sellUserId changed
      if (value) {
        // this.showSendAccess = true
        this.queryParam.seller = value
        this.loadDistributorList(value)
      }
    },
    handleImportHistorical() {
      this.$refs.importHistoricalCodeModal.show()
    },
    handleShowLog(record) {
      this.$refs.orderHistoryModal.show(record)
    },
    onTimeChange(date, dateString) {
      this.queryParam.updateTime_begin = dateString[0]
      this.queryParam.updateTime_end = dateString[1]
    }
  },
  mounted() {
    this.user = this.$store.getters.userRole
    this.loadDistributorList()
    if (this.user.includes('sales_omics') && !this.user.includes('sales_super_omics')) {
      this.sellData = [this.user]
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler: function(val, oldVal) {
        console.log(this.$route.query.leaveApplyId)
        if (this.$route.query.leaveApplyId) {
          console.log(this.$route.query.leaveApplyId)
          this.queryParam.leaveApplyId = this.$route.query.leaveApplyId
          this.searchQuery()
          history.pushState({}, '', '/codeControl')
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
.search-group {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
  margin-left: 0 !important;

  .group {
    display: flex;
    justify-items: center;
    align-items: center;
    margin-right: 15px;

    .title {
      color: rgba(0, 0, 0, 0.85);
      margin-right: 10px;
      text-align: right;
      flex: 0 0 88px;
    }
  }

  .ant-btn {
    margin-right: 15px;
  }
}

.btn-group {
  display: flex;
  justify-content: space-evenly;
}
</style>
