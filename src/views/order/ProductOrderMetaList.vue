<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group order-list">
<!--          <div class="group">-->
<!--            <div class="title">批量任务编号：</div>-->
<!--            <a-input v-model="queryParam.importTaskId" placeholder="请输入批量任务编号"></a-input>-->
<!--          </div>-->
<!--          <div class="group">-->
<!--            <div class="title">病例编号：</div>-->
<!--            <a-input allowClear v-model="queryParam.medicalCaseCode" placeholder="请输入病例编号"></a-input>-->
<!--          </div>-->
          <a-col class="group sm">
            <a-form-item label="姓名:" :labelCol="{ span: 6 }">
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
          <a-col class="group sm">
            <a-form-item label="产品:" :labelCol="{ span: 6 }">
              <a-select v-model="queryParam.choseProduct" placeholder="请选择产品">
                <a-select-option v-for="item in productInfoList" :key="item.id" :value="item.productRecognition">
                  {{ item.productName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="group md">
            <a-form-item label="医院:" :labelCol="{ span: 6 }">
              <a-select v-model="queryParam.sendHospital" placeholder="请选择医院">
                <a-select-option v-for="item in hospitalList" :key="item.id" :value="item.hospitalName">
                  {{ item.hospitalName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col class="group md">
            <a-form-item label="状态:" :labelCol="{ span: 6 }">
              <j-dict-select-tag
                allowClear
                type="list"
                dictCode="product_order_state_enum"
                placeholder="请选择状态"
                v-model="queryParam.orderState"
              />
            </a-form-item>
          </a-col>
          <a-col class="group md">
            <a-form-item label="订单创建时间" :labelCol="{ span: 5 }" >
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
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="addNewOrder" type="primary" icon="plus">创建订单</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls(`导出订单列表${currentTime}`)">导出Excel</a-button>
<!--      <a-upload :showUploadList="false" :before-upload="beforeUpload" :customRequest="handleUpload">-->
<!--        <a-button type="primary" icon="upload">批量导入订单</a-button>-->
<!--      </a-upload>-->
      <a-button type='primary' @click='batchImport'>批量导入订单</a-button>

      <!-- <a-button type="primary" icon="download" @click="handleExportXls(`导出基因订单列表${currentTime}`)">导出基因Excel</a-button> -->
      <!-- <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <j-super-query
        :fieldList="superFieldList"
        ref="superQueryModal"
        @handleSuperQuery="handleSuperQuery"
      ></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
      </a-dropdown> -->
    </div>

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
        <template slot="check" slot-scope="text">
          <span v-if='!text'>
            <a-icon type="check" />
          </span>
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
          <a v-if="record.orderState === 1000" @click="editOrder(record)">编辑</a>
          <a v-if="record.orderState !== 1000" @click="handleDetail(record)">详情</a>
          <a-popconfirm
            v-if="record.orderState === 1000"
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
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import '@/assets/less/TableExpand.less'
import { deleteTempleOrder } from 'src/api/order/index'
import { getHospitalList, getProductInfoList, productAnalysisStepRelation } from '../../api/product/index'
import { queryRoleUsers } from '../../api/material'
import { CommonSingleUpload, startOrderImportTask } from 'src/api/order/index'
import {ajaxGetDictItems} from '@/api/api'
import OrderBatchImportModal from './modules/orderBatchImportModal'

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

const fakeList = {
  dx: {
    status: 2,
    list: [
      {code: 'dxrk', dic: 0},
      {code: 'dxzk', dic: 1},
      {code: 'dxsj', dic: 2},
      {code: 'dxjg', dic: 3},
    ]
  },
  bg: {
    status: 2,
    list: [
      {code: 'bgtq', dic: 0},
      {code: 'bgsce', dic: 1},
      {code: 'bgjg', dic: 2},
      {code: 'bgno', dic: 3},
    ]
  },
  yx: {
    status: 0,
    list: [
      {code: 'yxsc', dic: 0},
      {code: 'yxfx', dic: 1},
      {code: 'yxjg', dic: 2},
    ]
  }
}

export default {
  name: 'ProductOrderMetaList',
  mixins: [JeecgListMixin],
  components: {
    OrderBatchImportModal,
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
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '病例编号',
          align: 'center',
          dataIndex: 'medicalCaseCode',
          sorter: (a, b) => a.medicalCaseCode - b.medicalCaseCode,
          medicalCaseCode: ['descend', 'ascend'],
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'caseName'
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
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.age - b.age,
        },
        {
          title: '产品',
          align: 'center',
          dataIndex: 'choseProduct_dictText'
        },
        // {
        //   title: '身份份证号',
        //   align: 'center',
        //   dataIndex: 'identityNumber'
        // },
        // {
        //   title: '销售人员',
        //   align: 'center',
        //   dataIndex: 'seller_dictText'
        // },
        {
          title: '渠道商',
          align: 'center',
          dataIndex: 'sendAccess_dictText'
        },
        {
          title: '医院',
          align: 'center',
          dataIndex: 'sendHospital'
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
          children: [
            // {
            //   title: '入库',
            //   align: 'center',
            //   dataIndex: 'dxrk',
            //   customRender: (t, r) => this.checkMark('dx','dxrk',  r)
            // },
            // {
            //   title: '质控',
            //   align: 'center',
            //   dataIndex: 'dxzk',
            //   customRender: (t, r) => this.checkMark('dx','dxzk',  r)
            // },
            // {
            //   title: '上机',
            //   align: 'center',
            //   dataIndex: 'dxsj',
            //   customRender: (t, r) => this.checkMark('dx','dxsj',  r)
            // },
            // {
            //   title: '报告',
            //   align: 'center',
            //   dataIndex: 'dxjg',
            //   customRender: (t, r) => this.checkMark('dx','dxjg',  r)
            // },
          ]
        },
        {
          title: '表观组',
          children: [
            // {
            //   title: '提取',
            //   align: 'center',
            //   dataIndex: 'bgtq',
            //   customRender: (t, r) => this.checkMark('bg','bgtq',  r)
            // },
            // {
            //   title: '送测',
            //   align: 'center',
            //   dataIndex: 'bgsce',
            //   customRender: (t, r) => this.checkMark('bg','bgsce',  r)
            // },
            // {
            //   title: '数据',
            //   align: 'center',
            //   dataIndex: 'bgjg',
            //   customRender: (t, r) => this.checkMark('bg','bgjg',  r)
            // },
            // {
            //   title: '报告',
            //   align: 'center',
            //   dataIndex: 'bgno',
            //   customRender: (t, r) => this.checkMark('bg','bgno',  r)
            // },
          ]
        },
        {
          title: '影像组',
          children: [
            // {
            //   title: '上传',
            //   align: 'center',
            //   dataIndex: 'yxsc',
            //   customRender: (t, r) => this.checkMark('yx','yxsc',  r)
            // },
            // {
            //   title: '分析',
            //   align: 'center',
            //   dataIndex: 'yxfx',
            //   customRender: (t, r) => this.checkMark('yx','yxfx',  r)
            // },
            // {
            //   title: '报告',
            //   align: 'center',
            //   dataIndex: 'yxjg',
            //   customRender: (t, r) => this.checkMark('yx','yxjg',  r)
            // },
          ]
        },
        {
          title: '订单报告',
          children: [
            {
              title: '生成',
              align: 'center',
              dataIndex: 'bgsc'
            },
            {
              title: '审核',
              align: 'center',
              dataIndex: 'bgsh'
            }
          ]
        },
        {
          title: '预计完成时间',
          align: 'center',
          dataIndex: 'exceptTime'
        },
        {
          title: '实际完成时间',
          align: 'center',
          dataIndex: 'reportTime'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
          sorter: (a, b) => a.createTime - b.createTime,
          medicalCaseCode: ['descend', 'ascend'],
        },
        // {
        //   title: '完成时间',
        //   align: 'center',
        //   dataIndex: 'completeTime'
        // },
        // {
        //   title: '订单状态',
        //   align: 'center',
        //   dataIndex: 'orderState_dictText',
        //   customCell: this.statusBackground
        // },
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
      dictOptions: {},
      superFieldList: [],
      productInfoList: [],
      hospitalList: [],
      stepRelation: null,
      user: null,
      sellData: [],
      sellValue: undefined,
      fakeList: fakeList,
      orderStateList: [
        {key: '临时订单', value: 1000},
        {key: '未知订单', value: 2000},
        {key: '正式订单', value: 3000},
      ],
      currentTime: ''
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
    handleDetail(record) {
      this.$router.push({ name: 'orderDetail', params: { id: record.id } })
    },
    resetQuery() {
      this.queryParam = {}
      this.sellValue = null;
      this.loadData()
    },
    modalFormClose() {
      // 当用户关闭时候 也刷新列表
      this.modalFormOk()
    },
    addNewOrder() {
      this.$router.push({
        path: '/orderList/addNewOrder'
      })
    },
    editOrder(record) {
      const step = record.lastEditStep ? record.lastEditStep : 0
      this.$router.push({
        path: `/orderList/editNewOrder?orderId=${record.id}&currentTab=${step}`
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
    loadHospitalList() {
      getHospitalList().then(res => {
        if (res.success) {
          this.hospitalList = res.result.records
          // console.log(this.hospitalList)
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
        this.queryParam.seller = value
      }
    },
    statusBackground(record) {
      return {
        style: record.orderState_dictText === '报告完结' ? {
          'background-color': 'green',
          'color': 'white'
        } : {}
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
    // loadOrderStateEnum() {
    //   ajaxGetDictItems('omics_order_state_enum', null).then((res) => {
    //     if (res.success) {
    //       // console.log(res.result);
    //       this.dictOptions = res.result;
    //     }
    //   })
    // },
    checkMark(category, stepName, record) {
      // console.log(stepName,record);
      const status = this.fakeList[category].status;
      for (let i = 0; i < this.fakeList[category].list.length; i ++) {
        if(stepName == this.fakeList[category].list[i].code) {
          if(this.fakeList[category].list[i].dic <= status) {
            return <a-icon type="check-circle" class='green'/>
          }
        }
      }
    },
    loadProductAnalysisStepRelation() {
      productAnalysisStepRelation().then( res => {
        console.log('res: ', res)
        this.stepRelation = res.result
        const st = res.result
        const tt = [
          {omics: 0, title: '代谢组'},
          {omics: 1, title: '表观组'},
          {omics: 2, title: '影像组'}
        ]
        let insertTableItem = []
        // Object.for
        for (let i = 0; i < st['FK'].length; i ++) {
          insertTableItem[i]['title'] = tt[i]['title'];
          insertTableItem[i]['omics'] = tt[i]['omics'];
          for (let j = 0; j < st['FK'][i].length; j ++) {
            insertTableItem[i][j] = {
              title: st['FK'][i][j]['stepDictText'],
              align: 'center',
              dataIndex: st['FK'][i][j]['omicsStep'],
              customRender: (t, r) => this.checkMark(st['FK'][i]['omics'], st['FK'][i][j]['omicsStep'], r)
            }
          }
        }
        for (let i = 0; i < this.columns.length; i ++) {
          for (let j = 0; j < insertTableItem.length; j ++) {
            if (this.columns[i].title == insertTableItem[j]['title']) {
              this.columns[i].children = insertTableItem[j];
            }
          }
        }
      }).catch(e => {
        console.log(e)
      })
    }
  },
  mounted() {
    this.user = this.$store.state.user.info;
    // this.loadOrderStateEnum();
    this.loadHospitalList();
    this.loadProductInfoList();
    this.loadProductAnalysisStepRelation();
    this.getCurrentTime();
    if (this.user.role.includes('sales_omics') && !this.user.role.includes('sales_super_omics')) {
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
  color: #00DB00;
  /deep/ svg {
    font-size: 20px;
  }
}
</style>
