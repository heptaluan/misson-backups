<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group viewport-list">
          <a-col class="group">
            <a-form-item label="姓名" :labelCol="{ span: 5 }">
              <a-input allowClear v-model="queryParam.caseName" placeholder="请输入姓名"></a-input>
            </a-form-item>
          </a-col>
          <a-col class="group tiny">
            <a-form-item label="性别:" :labelCol="{ span: 6 }">
              <a-select v-model="queryParam.gender" placeholder="请选择性别">
                <a-select-option v-for="item in genderOption" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!--          <a-col class="group md">-->
          <!--            <a-form-item label="销售:" :labelCol="{ span: 6 }">-->
          <!--              <a-select-->
          <!--                show-search-->
          <!--                :value="sellValue"-->
          <!--                placeholder="输入关联销售进行检索"-->
          <!--                :default-active-first-option="false"-->
          <!--                :show-arrow="false"-->
          <!--                :filter-option="false"-->
          <!--                :not-found-content="null"-->
          <!--                @search="handleSellSearch"-->
          <!--                @change="handleSellChange"-->
          <!--              >-->
          <!--                <a-select-option v-for="item in sellData" :key="item.id" :value="item.username">-->
          <!--                  {{ item.realname }}-->
          <!--                </a-select-option>-->
          <!--              </a-select>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
          <a-col class="group md">
            <!--            <a-form-item label="渠道商" prop="sendAccess" v-show="showSendAccess || sellValue" class="order-label">-->
            <a-form-item label="渠道商" prop="sendAccess" class="order-label">
              <a-select style="width:200px;" v-model="queryParam.accessShortName" placeholder="请选择渠道商">
                <a-select-option v-for="item in distributorList" :key="item.id" :value="item.shortName">
                  {{ item.accessName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col class="group md">
            <a-form-item label="医院" :labelCol="{ span: 5 }">
              <a-select v-model="queryParam.hospitalShortName" placeholder="请选择医院">
                <a-select-option v-for="item in hospitalList" :key="item.id" :value="item.hospitalName">
                  {{ item.hospitalName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col class="group tiny">
            <a-form-item label="状态:" :labelCol="{ span: 6 }">
              <a-select v-model="queryParam.status" placeholder="请选择状态">
                <a-select-option v-for="item in dicomtaskStatus" :key="item.value" :value="item.value">
                  {{ item.key }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col class="group md">
            <a-form-item label="上传时间" :labelCol="{ span: 5 }">
              <j-date
                v-model="queryParam.createTime_begin"
                :showTime="true"
                date-format="YYYY-MM-DD"
                placeholder="请选择开始时间"
              ></j-date>
              <span style="width: 20px;"> - </span>
              <j-date
                v-model="queryParam.createTime_end"
                :showTime="true"
                date-format="YYYY-MM-DD"
                placeholder="请选择结束时间"
              ></j-date>
            </a-form-item>
          </a-col>
          <a-col class="group btn">
            <a-button @click="searchQuery" type="primary">搜索</a-button>
            <a-button @click="resetQuery">重置</a-button>
          </a-col>
          <!-- <a-button @click="handleDetail" type="primary">详情</a-button> -->
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <!-- <div class="table-operator">
      <a-button @click="handleShowViewportUploadModal" type="primary" icon="plus">影像上传</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('产品订单元数据信息')">导出Excel</a-button>
    </div> -->

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->

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
        <!-- <template slot="status" slot-scope="text, record">
          <div v-for="item in dicomtaskStatus" :key="item.value">
            <div v-if="record.status === item.value">
              {{ item.key }}
            </div>
          </div>
        </template> -->

        <span slot="action" slot-scope="text, record">
          <a v-if="record.status === 1" @click="handleShowDetail(record)">查看详情</a>
        </span>
      </a-table>
    </div>

    <ViewportUploadModal ref="viewportUploadModal" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import '@/assets/less/TableExpand.less'
import ViewportUploadModal from './modules/ViewportUploadModal.vue'
import { queryRoleUsers } from '../../api/material'
import { getHospitalList, getDistributorList } from '../../api/product/index'

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
  name: 'ViewportMetaList',
  mixins: [JeecgListMixin],
  components: {
    ViewportUploadModal
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
          title: '订单编号',
          align: 'center',
          dataIndex: 'orderId'
        },
        // {
        //   title: '住院号',
        //   align: 'center',
        //   dataIndex: 'patientUid'
        // },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'caseName'
        },
        {
          title: '姓名拼写',
          align: 'center',
          dataIndex: 'patientName'
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'gender_dictText'
        },
        {
          title: '年龄',
          align: 'center',
          dataIndex: 'age'
        },
        {
          title: '检查日期',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '上传时间',
          align: 'center',
          dataIndex: 'updateTime'
        },
        {
          title: '渠道商',
          align: 'center',
          dataIndex: 'accessShortName_dictText'
        },
        {
          title: '医院',
          align: 'center',
          dataIndex: 'hospitalShortName_dictText'
        },
        {
          title: '影像号',
          align: 'center',
          dataIndex: 'patientUid'
        },
        {
          title: '层厚(mm)',
          align: 'center',
          dataIndex: 'sliceThickness'
        },
        {
          title: '序列数',
          align: 'center',
          dataIndex: 'seriesCount'
        },
        {
          title: '总帧数',
          align: 'center',
          dataIndex: 'totalImageCount'
        },
        {
          title: '疑似结节数',
          align: 'center',
          dataIndex: 'noduleCount'
        },
        {
          title: '疑似恶性结节数',
          align: 'center',
          dataIndex: 'badNoduleCount'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          customRender: function(t, r, index) {
            if (r.status === 0) {
              return '已上传'
            } else if (r.status === 1) {
              return '归档成功'
            } else if (r.status === 2) {
              return '失败'
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
        list: 'multiomics/medicalImage/taskMedicalCaseView/list'
      },
      dictOptions: {},
      distributorList: [],
      sellData: [],
      user: null,
      hospitalList: [],
      sellValue: undefined,
      showSendAccess: false,
      dicomtaskStatus: [
        { key: '已上传', value: 0 },
        { key: '已归档', value: 1 },
        { key: '归档失败', value: 2 }
      ]
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    initDictConfig() {},
    resetQuery() {
      this.queryParam = {}
      this.sellValue = null
      this.loadData()
    },
    handleShowDetail(record) {
      this.$router.push({
        path: `/viewport/viewportDetail?resource=${record.patientId}&type=0`
      })
    },
    loadHospitalList() {
      getHospitalList().then(res => {
        if (res.success) {
          this.hospitalList = res.result.records
          console.log(this.hospitalList)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleShowViewportUploadModal() {
      this.$refs.viewportUploadModal.show()
    },
    handleSellSearch(value) {
      if (!(this.user.role.includes('sales_omics') && !this.user.role.includes('sales_super_omics'))) {
        sellFetch(value, data => (this.sellData = data))
      }
    },
    handleSellChange(value) {
      this.sellValue = value
      if (!(this.user.role.includes('sales_omics') && !this.user.role.includes('sales_super_omics'))) {
        sellFetch(value, data => (this.sellData = data))
      }
      this.$set(this.queryParam, 'sendAccess', undefined) // clean the previous data if the sellUser or sellUserId changed
      if (value) {
        this.showSendAccess = true
        this.queryParam.seller = value
        this.loadDistributorList(value)
      }
    },
    loadDistributorList(value) {
      const that = this
      getDistributorList({
        sellUser: value
      }).then(res => {
        if (res.success) {
          that.distributorList = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    }
  },
  mounted() {
    this.user = this.$store.state.user.info
    this.loadDistributorList()
    this.loadHospitalList()
    if (this.user.role.includes('sales_omics') && !this.user.role.includes('sales_super_omics')) {
      this.sellData = [this.user]
    }
  }
}
</script>
<style lang="less" scoped>
.viewport-list {
  padding-left: 12px;
  .group {
    .title {
      width: 50px;
      flex: 0 0 72px;
    }
  }
}
</style>
