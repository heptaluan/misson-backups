<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search-group">
          <a-col class="group md">
            <a-form-item label="渠道商:" :labelCol="{ span: 6 }">
              <a-select
                v-model="queryParam.sendAccess"
                placeholder="请选择渠道商"
                allowClear
                show-search
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
            <a-form-item label="病例编号:" :labelCol="{ span: 6 }">
              <a-input allowClear v-model="queryParam.orderCode" placeholder="请输入病例编号"></a-input>
            </a-form-item>
          </a-col>
          <a-col class="group sm">
            <a-form-item label="姓名:" :labelCol="{ span: 6 }">
              <a-input allowClear v-model="queryParam.name" placeholder="请输入姓名"></a-input>
            </a-form-item>
          </a-col>
          <a-col class="group sm">
            <a-form-item label="产品">
              <a-select v-model="queryParam.choseProduct" placeholder="请选择产品类型" allowClear>
                <a-select-option v-for="item in productOption" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="group tiny">
            <a-form-item label="性别:" :labelCol="{ span: 6 }">
              <a-select v-model="queryParam.sex" placeholder="请选择性别" allowClear>
                <a-select-option v-for="item in genderOption" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="group md">
            <a-form-item label="报告时间" :labelCol="{ span: 5 }">
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
          <a-col class="group sm">
            <a-form-item label="身份证:" :labelCol="{ span: 6 }">
              <a-input allowClear v-model="queryParam.idCard" placeholder="请输入身份证"></a-input>
            </a-form-item>
          </a-col>
          <a-col class="group sm">
            <a-form-item label="订单编号:" :labelCol="{ span: 6 }">
              <a-input allowClear v-model="queryParam.orderId" placeholder="请输入订单编号"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col class="group sm">
              <a-form-item label="手机号:" :labelCol="{ span: 6 }">
                <a-input allowClear v-model="queryParam.phone" placeholder="请输入手机号"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col class="group sm">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
<!--      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
<!--      <a-button type="primary" icon="download" @click="handleExportXls('报告历史')">导出</a-button>-->
<!--      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
<!--        <a-button type="primary" icon="import">导入</a-button>-->
<!--      </a-upload>-->
<!--      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>-->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchCheck"><a-icon type="delete"/>批量审核</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->

      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="colorText" slot-scope="text">
          <span v-html="text" :style="calcStyle(text)"></span>
        </template>
        <template slot="colorTextImage" slot-scope="text">
          <span v-html="text" :style="calcStyleImage(text)"></span>
        </template>
        <template slot="geneColorText" slot-scope="text, record">
          <span v-html="geneText(text, record)" :style="calcStyleImage(text)"></span>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleCheck(record)" v-has="'report:check'">审核</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { putAction, postAction } from '@/api/manage'
  import { selectorFilterMixin } from '@/mixins/selectorFilterMixin'
  import { reportMixin } from '@/mixins/reportMixin'

  export default {
    name: 'SampleReportHistoryList',
    mixins: [JeecgListMixin, mixinDevice, selectorFilterMixin, reportMixin],
    data () {
      return {
        description: '报告历史管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
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
            title: '姓名',
            align: 'center',
            dataIndex: 'name'
          },
          {
            title: '年龄',
            align: 'center',
            dataIndex: 'age'
          },
          {
            title: '性别',
            align: 'center',
            dataIndex: 'sex',
            customRender: function(t, r, index) {
              let text = '-'
              if (t === '0') {
                text = '女'
              }
              if (t === '1') {
                text = '男'
              }
              return text
            }
          },
          {
            title: '身份证',
            align: 'center',
            dataIndex: 'idCard'
          },
          {
            title: '代谢结果',
            align: 'center',
            dataIndex: 'ananpanReportValue',
            key: 'ananpanReportValue',
            scopedSlots: { customRender: 'colorText' },
          },
          {
            title: '影像结果',
            align: 'center',
            dataIndex: 'imageReportValue',
            key: 'imageReportValue',
            scopedSlots: { customRender: 'colorTextImage' },
          },
          {
            title: '表观结果',
            align: 'center',
            dataIndex: 'geneReportValue',
            key: 'geneReportValue',
            scopedSlots: { customRender: 'geneColorText' },
          },
          {
            title: '报告总结果',
            align: 'center',
            dataIndex: 'reportValue',
            key: 'reportValue',
            scopedSlots: { customRender: 'colorText' },
          },
          {
            title: '产品',
            align: 'center',
            dataIndex: 'choseProduct_dictText'
          },
          {
            title:'订单编号',
            align:"center",
            dataIndex: 'orderId'
          },
          {
            title: '病例编号',
            align: 'center',
            dataIndex: 'orderCode'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: `/report/sampleReportHistory/list?reportType=1`,
          delete: "/report/sampleReportHistory/delete",
          deleteBatch: "/report/sampleReportHistory/deleteBatch",
          exportXlsUrl: "/report/sampleReportHistory/exportXls",
          check: "/report/sampleReportHistory/batchCommit",
          importExcelUrl: "report/sampleReportHistory/importExcel",

        },
        dictOptions:{},
        superFieldList:[],
        distributorList: [],
        hospitalList: [],
        ipagination: {
          pageSize: 10,
          pageSizeOptions: ['10', '20', '50'],
        },
      }
    },
    created() {
      this.getSuperFieldList();
      this.loadDistributorList()
      this.loadHospitalList()
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'double',value:'ananpanReportValue',text:'代谢结果',dictCode:''})
        fieldList.push({type:'Text',value:'ananpanReportAll',text:'代谢总览',dictCode:''})
        fieldList.push({type:'date',value:'ananpanTime',text:'代谢报告时间'})
        fieldList.push({type:'double',value:'imageReportValue',text:'影像结果',dictCode:''})
        fieldList.push({type:'Text',value:'imageReportAll',text:'影像结果总览',dictCode:''})
        fieldList.push({type:'date',value:'imageTime',text:'影像报告时间'})
        fieldList.push({type:'double',value:'geneReportValue',text:'基因结果',dictCode:''})
        fieldList.push({type:'Text',value:'geneReportAll',text:'基因结果总览',dictCode:''})
        fieldList.push({type:'date',value:'geneTime',text:'基因结果时间'})
        fieldList.push({type:'int',value:'reportValue',text:'报告总结果',dictCode:''})
        fieldList.push({type:'int',value:'reportType',text:'报告状态',dictCode:''})
        fieldList.push({type:'Text',value:'remark',text:'备注',dictCode:''})
        fieldList.push({type:'string',value:'editerId',text:'修改人ID',dictCode:''})
        fieldList.push({type:'string',value:'editer',text:'修改人',dictCode:''})
        fieldList.push({type:'date',value:'editTime',text:'修改时间'})
        fieldList.push({type:'Text',value:'editRemark',text:'修改备注',dictCode:''})
        fieldList.push({type:'string',value:'reportSourceId',text:'报告来源',dictCode:''})
        fieldList.push({type:'string',value:'reportHistoryId',text:'报告历史来源',dictCode:''})
        fieldList.push({type:'int',value:'reportVersion',text:'报告版本',dictCode:''})
        fieldList.push({type:'string',value:'orderId',text:'订单编号',dictCode:''})
        this.superFieldList = fieldList
      },
      handleDetail (record) {
        this.$router.push({name: 'reportDetail-@id', params: {
            id: record.id
          }})
        // this.$router.push({path: '/reportDetail/:id', params: {
        //     id: record.id
        //   }})
      },
      handleCheck (record) {
        this.reportCheck(record.id)
      },
      batchCheck () {
        if (this.selectedRowKeys.length > 0) {
          const ids = this.selectedRowKeys.toString()
          this.reportCheck(ids)
        }
      },
      async reportCheck (ids) {
        try {
          const url = this.url.check
          const postData = {
            ids: ids
          }
          const res = await postAction(url, postData)
          if (res.code === 200) {
            this.$message.success('审核成功！')
            this.loadData()
          } else {
            this.$message.error(res.message)
          }
        } catch (e) {
          this.$message.warning(e.message)
        }
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>