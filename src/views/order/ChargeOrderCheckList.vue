<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group order-list">
          <a-col class="group sm">
            <a-form-item label="病例编号:" :labelCol="{ span: 6 }">
              <a-input allowClear v-model="queryParam.medicalCaseCode" placeholder="请输入病例编号"></a-input>
            </a-form-item>
          </a-col>
          <a-col class="group sm">
            <a-form-item label="姓名:" :labelCol="{ span: 6 }">
              <a-input allowClear v-model="queryParam.caseName" placeholder="请输入姓名"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col class="group tiny">
              <a-form-item label="性别:" :labelCol="{ span: 6 }">
                <a-select v-model="queryParam.gender" placeholder="请选择性别" allowClear>
                  <a-select-option v-for="item in genderOption" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="group md">
              <a-form-item label="证件号码:" :labelCol="{ span: 6 }">
                <a-input allowClear v-model="queryParam.identityNumber" placeholder="请输入证件号码"></a-input>
              </a-form-item>
            </a-col>
            <a-col class="group md">
              <a-form-item label="渠道商:" :labelCol="{ span: 6 }">
                <a-select
                  v-model="queryParam.sendAccess"
                  placeholder="请选择渠道商"
                  allowClear
                  show-search
                  :value="channelValue"
                  :default-active-first-option="false"
                  :filter-option="false"
                  :not-found-content="null"
                  @search="handleChannelSearch"
                  @change="handleChannelChange"
                >
                  <a-select-option v-for="item in distributorList" :key="item.id" :value="item.departNameAbbr">
                    {{ item.departName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="group md">
              <a-form-item label="医院:" :labelCol="{ span: 6 }">
                <a-select v-model="queryParam.sendHospital" placeholder="请选择医院">
                  <a-select-option v-for="item in hospitalList" :key="item.id" :value="item.departNameAbbr">
                    {{ item.departName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="group sm">
              <a-form-item label="产品:" :labelCol="{ span: 6 }">
                <a-select v-model="queryParam.choseProduct" placeholder="请选择产品" allowClear>
                  <a-select-option v-for="item in productInfoList" :key="item.id" :value="item.productRecognition">
                    {{ item.productName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>

          <a-col class="group btn">
            <a-button @click="searchQuery" type="primary">搜索</a-button>
            <a-button @click="resetQuery">重置</a-button>
            <a @click="handleToggleSearch" style="margin-left: 8px">
              {{ toggleSearchStatus ? '收起' : '展开' }}
              <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
            </a>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- <div class="table-operator">
      <a-button type="primary" icon="download" @click="handleExport(`导出订单列表${currentTime}`)">导出Excel</a-button>
    </div> -->

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
        <span slot="action" slot-scope="text, record" style="display: flex;justify-content: space-evenly;">
          <a @click="handleCheckReport(record)">查看报告</a>
        </span>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import '@/assets/less/TableExpand.less'
import { getProductInfoList } from '../../api/product/index'
import { selectorFilterMixin } from '@/mixins/selectorFilterMixin'
import { getTemplate } from 'src/api/order/index'

export default {
  name: 'ChargeOrderCheckList',
  mixins: [JeecgListMixin, selectorFilterMixin],
  data() {
    return {
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          fixed: 'left',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '病例编号',
          align: 'center',
          dataIndex: 'medicalCaseCode',
          fixed: 'left',
          width: 140,
          sorter: (a, b) => a.medicalCaseCode - b.medicalCaseCode,
          medicalCaseCode: ['descend', 'ascend']
        },
        {
          title: '姓名',
          align: 'center',
          width: 140,
          dataIndex: 'caseName',
          fixed: 'left'
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'sex',
          customRender: function(t, r, index) {
            if (r.gender === 1) {
              return '男'
            } else {
              return '女'
            }
          }
        },
        {
          title: '年龄',
          align: 'center',
          dataIndex: 'age',
          sorter: (a, b) => a.age - b.age
        },
        {
          title: '证件号码',
          align: 'center',
          dataIndex: 'identityNumber'
        },
        {
          title: '产品',
          align: 'center',
          dataIndex: 'choseProduct_dictText'
        },
        {
          title: '渠道商',
          align: 'center',
          dataIndex: 'sendAccess_dictText'
        },
        {
          title: '医院',
          align: 'center',
          dataIndex: 'sendHospital_dictText'
        },
        {
          title: '实际完成时间',
          align: 'center',
          dataIndex: 'actualCompletionTime'
        },
        {
          title: '是否收费',
          align: 'center',
          dataIndex: 'chargeType',
          customRender: function(t, r, index) {
            if (r.chargeType === 0) {
              return '免费'
            } else if (r.chargeType === 1) {
              return '收费'
            }
          }
        },
        {
          title: '核实状态',
          align: 'center',
          dataIndex: 'auditIssue',
          customRender: function(t, r, index) {
            if (r.auditIssue === 0) {
              return '核实无误'
            } else if (r.auditIssue === 1) {
              return '核实有误'
            }
          }
        },
        {
          title: '核实修正',
          align: 'center',
          dataIndex: 'auditCharge',
          customRender: function(t, r, index) {
            if (r.auditCharge === 0) {
              return '免费'
            } else if (r.auditCharge === 1) {
              return '收费'
            } else if (r.auditCharge === 2) {
              return '待定'
            }
          }
        },
        {
          title: '审核人',
          align: 'center',
          dataIndex: 'auditUser'
        },
        {
          title: '审核时间',
          align: 'center',
          dataIndex: 'auditTime'
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
        list: 'multiomics/productOrder/orderUserView?orderState=9000&sourceType=1&queryState=0&auditState=1',
        exportXlsUrl: 'multiomics/productOrder/exportOrderUserView'
      },
      productInfoList: [],
      hospitalList: [],
      distributorList: [],
      channelValue: undefined
    }
  },
  methods: {
    handleCheckReport(record) {
      const that = this
      getTemplate({
        orderId: record.id
      }).then(res => {
        if (res.success) {
          const rooterName = res.result.templateUrl || 'PagePreview'
          const router = that.$router.resolve({
            name: rooterName,
            params: {
              reportId: record.id
            }
          })
          window.open(router.href, '_blank')
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    resetQuery() {
      this.queryParam = {}
      this.loadDistributorList()
      this.loadData()
    },
    loadProductInfoList() {
      const that = this
      getProductInfoList().then(res => {
        if (res.success) {
          that.productInfoList = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    }
  },
  mounted() {
    this.loadHospitalList()
    this.loadProductInfoList()
    this.loadDistributorList()
  }
}
</script>
<style lang="less" scoped>
.search-group.order-list {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 0;

  .group {
    display: flex;
    justify-items: center;
    align-items: center;
    margin-right: 15px;

    .title {
      color: rgba(0, 0, 0, 0.85);
      margin-right: 10px;
      text-align: right;
      width: 80px;
      flex: 0 0 100px;
    }

    .search-label {
      color: rgba(0, 0, 0, 0.85);
      margin-right: 10px;
      text-align: right;
      min-width: 45px;
    }
  }

  .ant-btn {
    margin-right: 15px;
  }
}

.green {
  color: #00db00;

  /deep/ svg {
    font-size: 20px;
  }
}

.red {
  color: #db0054;

  /deep/ svg {
    font-size: 20px;
  }
}
</style>
