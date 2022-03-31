<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group order-list">
          <a-col class='group md'>
            <a-form-item label='病例编号:' :labelCol='{ span: 6 }'>
              <a-input allowClear v-model='queryParam.medicalCaseCode' placeholder='请输入病例编号'></a-input>
            </a-form-item>
          </a-col>
          <a-col class='group md'>
            <a-form-item label='姓名:' :labelCol='{ span: 6 }'>
              <a-input allowClear v-model='queryParam.caseName' placeholder='请输入姓名'></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col class='group md'>
              <a-form-item label='性别:' :labelCol='{ span: 6 }'>
                <a-select v-model='queryParam.gender' placeholder='请选择性别' allowClear>
                  <a-select-option v-for='item in genderOption' :key='item.value' :value='item.value'>
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
              <a-form-item label="电话:" :labelCol="{ span: 6 }">
                <a-input allowClear v-model="queryParam.phoneNumber" placeholder="请输入电话"></a-input>
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
            <a-col class="group md">
              <a-form-item label="销售:" :labelCol="{ span: 6 }">
                <a-select
                  show-search
                  allowClear
                  :value="sellValue"
                  placeholder="输入关联销售进行检索"
                  :default-active-first-option="false"
                  :filter-option="false"
                  :not-found-content='null'
                  @focus='handleSellSearch'
                  @search='handleSellSearch'
                  @change="handleSellChange"
                >
                  <a-select-option v-for="item in sellData" :key="item.id" :value="item.username">
                    {{ item.realname }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class='group md'>
              <a-form-item label='产品:' :labelCol='{ span: 6 }'>
                <a-select v-model='queryParam.choseProduct' placeholder='请选择产品' allowClear>
                  <a-select-option v-for='item in productInfoList' :key='item.id' :value='item.productRecognition'>
                    {{ item.productName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col class='group omicsSelect md'>
              <a-form-item label='组学:' :labelCol='{ span: 6 }'>
                <a-select @change='getOmics' mode='multiple' v-model='omicsController' placeholder='请选择组学状态'>
                  <a-select-opt-group v-for='(item, index) in omicsData'>
                    <span slot='label'>{{ omicsName[index] }}</span>
                    <a-select-option v-for='child in item'
                                     :value="child['omicsStep'] + '-' + child['omics'] + '-' + child['bitCode']">
                      {{ omicsName[index] }} - {{ child.stepDictText }}
                    </a-select-option>
                  </a-select-opt-group>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col class='group md'>
              <a-form-item label='状态:' :labelCol='{ span: 6 }'>
                <a-select v-model='queryParam.orderState' placeholder='请选择状态'>
                  <a-select-option v-for='item in orderStateList' :key='item.id' :value='item.productMilestone'>
                    {{ item.productMilestone_dictText }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col class='group md'>
              <a-form-item label='订单来源:' :labelCol='{ span: 6 }'>
                <j-dict-select-tag
                  type='list'
                  v-model='queryParam.sourceType'
                  dictCode='order_source_type'
                  placeholder='请选择来源'
                />
              </a-form-item>
            </a-col>
            <a-col class="group sm">
              <a-form-item label="订单创建时间" :labelCol="{ span: 5 }">
                <a-range-picker @change="onTimeChange" allowClear v-model="queryParam.datePick" />
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

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="addNewOrder" type="primary" icon="plus">创建订单</a-button>
      <a-button type="primary" icon="download" @click="handleExport(`导出订单列表${currentTime}`)">导出Excel</a-button>
      <a-button type="primary" @click="batchImport">批量导入订单</a-button>
    </div>

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
        <!--        <template slot="check" slot-scope="text">-->
        <!--          <span v-if="!text">-->
        <!--            <a-icon type="check" />-->
        <!--          </span>-->
        <!--        </template>-->
        <!--        <template slot="imgSlot" slot-scope="text">-->
        <!--          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>-->
        <!--          <img-->
        <!--            v-else-->
        <!--            :src="getImgView(text)"-->
        <!--            height="25px"-->
        <!--            alt=""-->
        <!--            style="max-width:80px;font-size: 12px;font-style: italic;"-->
        <!--          />-->
        <!--        </template>-->
        <!--        <template slot="fileSlot" slot-scope="text">-->
        <!--          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>-->
        <!--          <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">-->
        <!--            下载-->
        <!--          </a-button>-->
        <!--        </template>-->
        <span slot="action" slot-scope="text, record" style="display: flex;justify-content: space-evenly;">
          <a v-if="record.orderState === 1000" @click="editOrder(record)">编辑</a>
          <a v-if="record.orderState !== 1000" @click="handleDetail(record)">详情</a>
          <a v-if="record.orderState !== 1000" @click="reinspection(record)">重检</a>
          <a v-if='record.orderState === 9000 && record.checkReport === 1 && record.sourceType == 1'
             @click='handleCheckReport(record)'>查看报告</a>
          <a-popconfirm
            v-if="record.orderState === 1000 || !record['isAnyStatus']"
            title="确定删除吗?"
            @confirm="() => handleDeleteOrder(record.id)"
          >
            <a>删除</a>
          </a-popconfirm>

          <!-- <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item v-if="record">
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </span>
      </a-table>
    </div>
    <order-batch-import-modal ref="orderBatchImportModal" @ok="modalFormOk" />
    <reinspectionModal ref="reinspectionModal" @ok="modalFormOk" />
    <!--    <searchingModal ref="searchingModal" @sendOmicsData="getOmicsSearchingData"/>-->
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import '@/assets/less/TableExpand.less'
import { deleteTempleOrder, getTemplate } from 'src/api/order/index'
import {
  getHospitalList,
  getProductInfoList,
  getDistributorAllList,
  productAnalysisStepRelation
} from '../../api/product/index'
import { queryRoleUsers } from '../../api/material'
import { CommonSingleUpload, startOrderImportTask } from 'src/api/order/index'
import OrderBatchImportModal from './modules/orderBatchImportModal'
import reinspectionModal from './modules/reinspectionModal'
import { selectorFilterMixin } from '@/mixins/selectorFilterMixin'
import { downFile } from '@/api/manage'

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
  name: 'ProductOrderMetaList',
  mixins: [JeecgListMixin, selectorFilterMixin],
  components: {
    OrderBatchImportModal,
    reinspectionModal
  },
  data() {
    return {
      description: '产品订单元数据信息管理页面',
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 10,
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
          width: 10,
          sorter: (a, b) => a.medicalCaseCode - b.medicalCaseCode,
          medicalCaseCode: ['descend', 'ascend']
        },
        {
          title: '姓名',
          align: 'center',
          width: 10,
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
          title: '电话',
          align: 'center',
          dataIndex: 'phoneNumber'
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
          title: '销售人员',
          align: 'center',
          dataIndex: 'seller_dictText'
        },
        // {
        //   title: '送检科室',
        //   align: 'center',
        //   dataIndex: 'sendDepartment'
        // },
        // {
        //   title: '送检医生',
        //   align: 'center',
        //   dataIndex: 'sendDoctor'
        // },
        {
          title: '代谢组',
          children: []
        },
        {
          title: '影像组',
          children: []
        },
        {
          title: '表观组',
          children: []
        },
        {
          title: '订单报告',
          children: [
            {
              title: '生成',
              align: 'center',
              dataIndex: 'mainOrderStates1',
              customRender: function(t, r) {
                // this.orderStateHandler(r, 8000)
                if (r.mainOrderStates) {
                  for (let i = 0; i < r.mainOrderStates.length; i++) {
                    if (r.mainOrderStates[i].productMilestone === 8000) {
                      if (r.mainOrderStates[i].stateResult === 1) {
                        return <a-icon type="check-circle" class="green" />
                      } else if (r.mainOrderStates[i].stateResult == 0) {
                        return <a-icon type="close-circle" class="red" />
                      } else if (r.mainOrderStates[i].stateResult == -1) {
                        return ' '
                      }
                    }
                  }
                }
              }
            },
            {
              title: '审核',
              align: 'center',
              dataIndex: 'mainOrderStates2',
              customRender: function(t, r) {
                // this.orderStateHandler(r, 9000)
                if (r.mainOrderStates) {
                  for (let i = 0; i < r.mainOrderStates.length; i++) {
                    if (r.mainOrderStates[i].productMilestone === 9000) {
                      if (r.mainOrderStates[i].stateResult === 1) {
                        r.checkReport = 1
                        return <a-icon type="check-circle" class="green" />
                      } else if (r.mainOrderStates[i].stateResult == 0) {
                        r.checkReport = 0
                        return <a-icon type="close-circle" class="red" />
                      } else if (r.mainOrderStates[i].stateResult == -1) {
                        r.checkReport = -1
                        return ' '
                      }
                    }
                  }
                }
              }
            }
          ]
        },
        {
          title: '预计完成时间',
          align: 'center',
          dataIndex: 'planCompletionTime'
        },
        {
          title: '实际完成时间',
          align: 'center',
          dataIndex: 'actualCompletionTime'
        },
        {
          title: () => {
            return (
              <div>
                剩余完
                <br />
                成时间
              </div>
            )
          },
          align: 'center',
          dataIndex: 'time',
          customRender: function(t, r) {
            const currentTime =
              new Date().getFullYear().toString() +
              '-' +
              (new Date().getMonth() + 1 < 10
                ? '0' + (new Date().getMonth() + 1)
                : new Date().getMonth() + 1
              ).toString() +
              '-' +
              (new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()).toString()
            const startTime = new Date(r.planCompletionTime)
            const endTime = new Date(currentTime)
            const diffTime = (startTime - endTime) / (1000 * 60 * 60 * 24)
            if (r.actualCompletionTime) {
              return '-'
            } else {
              return diffTime + '天'
            }
          }
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.createTime - b.createTime,
          medicalCaseCode: ['descend', 'ascend']
        },
        // {
        //   title: '完成时间',
        //   align: 'center',
        //   dataIndex: 'completeTime'
        // },
        {
          title: '订单状态',
          align: 'center',
          dataIndex: 'orderState_dictText'
        },
        {
          title: '来源',
          align: 'center',
          dataIndex: 'sourceType',
          customRender: function(text) {
            if (text === 0) {
              return '门诊'
            } else if (text === 1) {
              return '商检'
            } else if (text === 2) {
              return '科研'
            } else if (text === 3) {
              return '测试'
            } else {
              return ''
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
        list: 'multiomics/productOrder/orderUserView',
        exportXlsUrl: 'multiomics/productOrder/exportOrderUserView'
      },
      superFieldList: [],
      productInfoList: [],
      hospitalList: [],
      distributorList: [],
      channelValue: undefined,
      user: null,
      sellData: [],
      sellValue: undefined,
      omicsData: null,
      omicsController: undefined,
      orderStateList: [
        { productMilestone_dictText: '临时订单', productMilestone: 1000 },
        { productMilestone_dictText: '正式订单', productMilestone: 3000 },
        { productMilestone_dictText: '报告生成', productMilestone: 8000 },
        { productMilestone_dictText: '报告审核', productMilestone: 9000 }
      ],
      currentTime: '',
      omicsName: ['表观组', '代谢组', '影像组']
      // orderResource: [
      //   { key: 0, value: '门诊' },
      //   { key: 1, value: '商检' },
      //   { key: 2, value: '科研' }
      // ]
      // orderStateList: [
      //   { key: 0, value: '已生成' },
      //   { key: 1, value: '待审核' }
      // ]
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
    onTimeChange(date, dateString) {
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
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
    handleDetail(record) {
      this.$router.push({ name: 'orderDetail', params: { id: record.id } })
    },
    reinspection(record) {
      this.$refs.reinspectionModal.show(record)
    },
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
      this.omicsController = undefined
      this.sellValue = undefined
      this.loadDistributorList()
      this.loadData()
    },
    modalFormClose() {
      // 当用户关闭时候 也刷新列表
      this.modalFormOk()
    },
    addNewOrder() {
      this.$router.push({
        path: '/orderList/singleNewOrder'
      })
    },
    editOrder(record) {
      this.$router.push({
        path: `/orderList/singleNewOrder?orderId=${record.id}`
      })
    },
    handleDeleteOrder(id) {
      const that = this
      deleteTempleOrder(id).then(res => {
        if (res.code === 200) {
          that.$message.success(res.message)
          this.loadData()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    loadProductInfoList() {
      const that = this
      getProductInfoList().then(res => {
        if (res.success) {
          that.productInfoList = res.result.records
          // console.log(that.productInfoList)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleUploadList() {
      console.log(`批量上传`)
    },
    batchImport(record) {
      this.$refs.orderBatchImportModal.show(record)
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
      // this.$set(this.queryParam, 'sendAccess', undefined) // clean the previous data if the sellUser or sellUserId changed
      // this.$set(this.queryParam, 'sendHospital', undefined) // clean the previous data if the sellUser or sellUserId changed
      // this.loadHospitalList()
      if (value) {
        this.queryParam.seller = value
        this.loadDistributorList(null, value)
      } else {
        this.loadDistributorList()
      }
    },
    statusBackground(record) {
      return {
        style:
          record.orderState_dictText === '报告完结'
            ? {
                'background-color': 'green',
                color: 'white'
              }
            : {}
      }
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
                that.$router.push({
                  path: `/order/orderHistory`
                })
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
    checkMark(category, stepValue, record) {
      for (let i = 0; i < record['omicsOrders'].length; i++) {
        if (
          category == record['omicsOrders'][i].omicsAnalysisType &&
          stepValue === record['omicsOrders'][i].omicsMilestone
        ) {
          // the state of order should be larger than the step value of cell, then the icon will show up
          if (record['omicsOrders'][i]['stateResult'] == 1) {
            record['isAnyStatus'] = true
            return <a-icon type="check-circle" class="green" />
          } else if (record['omicsOrders'][i]['stateResult'] == 0) {
            record['isAnyStatus'] = true
            return <a-icon type="close-circle" class="red" />
          } else if (record['omicsOrders'][i]['stateResult'] == -1) {
            record['isAnyStatus'] = true
            return ' '
          }
        } else if (category === 0 && record.choseProduct === 'FA') {
          return '——'
        }
      }
    },
    loadProductAnalysisStepRelation() {
      productAnalysisStepRelation()
        .then(res => {
          const stepRelation = res.result['FK']
          this.omicsData = res.result['FK']
          const columnTitles = ['表观组', '代谢组', '影像组']
          let insertTableItem = {}
          const that = this
          Object.keys(stepRelation).forEach(field => {
            insertTableItem[field] = {}
            insertTableItem[field]['title'] = columnTitles[field]
            insertTableItem[field]['list'] = []
            // connect the omics columns with dictionary
            for (let i = 0; i < that.columns.length; i++) {
              if (that.columns[i].title == insertTableItem[field]['title']) {
                that.columns[i].children = insertTableItem[field]['list']
              }
            }
            // set the mark check method of omics columns' cells
            for (let i = 0; i < stepRelation[field].length; i++) {
              insertTableItem[field]['list'][i] = {
                title: stepRelation[field][i]['stepDictText'],
                align: 'center',
                dataIndex: stepRelation[field][i]['omicsStep'] + stepRelation[field][i]['omics'],
                customRender: (t, r) =>
                  this.checkMark(stepRelation[field][i]['omics'], stepRelation[field][i]['omicsStep'], r)
              }
            }
          })
        })
        .catch(e => {
          console.log(e)
        })
    },
    getOmics(data) {
      // console.log(data)
      let sum = [0, 0, 0]
      data.forEach(ele => {
        const index = Number(ele.split('-')[1])
        sum[index] += Number(ele.split('-')[2])
      })
      // console.log(sum)
      this.queryParam.omicsGeneState = sum[0] !== 0 ? sum[0] + '&' : null
      this.queryParam.omicsMetabolismState = sum[1] !== 0 ? sum[1] + '&' : null
      this.queryParam.omicsImageState = sum[2] !== 0 ? sum[2] + '&' : null
    },
    handleExport(fileName) {
      const that = this
      if (!fileName || typeof fileName != 'string') {
        fileName = '导出文件'
      }
      let param = this.getQueryParams()

      if (this.selectedRowKeys.length === 0) {
        this.$confirm({
          title: '导出订单',
          content: h => <div>是否导出全部订单？</div>,
          onOk() {
            that.downLoadFile(param, fileName)
          },
          onCancel() {
            console.log('Cancel')
          },
          class: 'test'
        })
      } else {
        const ids = []
        this.selectionRows.forEach(item => ids.push(item.id))
        if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
          param['selections'] = ids.join(',')
        }
        this.downLoadFile(param, fileName)
      }
    },
    downLoadFile(param, fileName) {
      downFile(this.url.exportXlsUrl, param).then(data => {
        if (!data) {
          this.$message.warning('文件下载失败')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data], { type: 'application/vnd.ms-excel' }), fileName + '.xls')
        } else {
          let url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) //下载完成移除元素
          window.URL.revokeObjectURL(url) //释放掉blob对象
        }
      })
    }
  },
  mounted() {
    this.user = this.$store.getters.userRole
    this.loadHospitalList()
    this.loadProductInfoList()
    this.loadProductAnalysisStepRelation()
    this.loadDistributorList()
    this.getCurrentTime()
    if (this.user.includes('sales_omics') && !this.user.includes('sales_super_omics')) {
      this.sellData = [this.user]
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler: function(val, oldVal) {
        if (this.$route.query.importTaskId) {
          this.queryParam.importTaskId = this.$route.query.importTaskId
          this.searchQuery()
          history.pushState({}, '', '/order/orderList')
        } else {
          this.loadData()
        }
      }
    }
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
    max-width: 86%;

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

  .omicsSelect {
    .ant-select {
      width: initial !important;
      min-width: 200px;
      //max-width: 600px;
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

//.ant-table-body-inner {
//  max-height: calc(100vh - 390px) !important;
//}
</style>
