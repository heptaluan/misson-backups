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
<!--      <a-button type="primary" icon="download" @click="handleExportXls('报告最终结果')">导出</a-button>-->
<!--      <a-upload-->
<!--        name="file"-->
<!--        :showUploadList="false"-->
<!--        :multiple="false"-->
<!--        :headers="tokenHeader"-->
<!--        :action="importExcelUrl"-->
<!--        @change="handleImportExcel"-->
<!--      >-->
<!--        <a-button type="primary" icon="import">导入</a-button>-->
<!--      </a-upload>-->
<!--      <j-super-query-->
<!--        :fieldList="superFieldList"-->
<!--        ref="superQueryModal"-->
<!--        @handleSuperQuery="handleSuperQuery"-->
<!--      ></j-super-query>-->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDownLoadExport"><a-icon type="export" />批量下载报告</a-menu-item>
          <a-menu-item key="2" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
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
<!--          <a @click="handleBack(record)">退回</a>-->
          <a-popconfirm title="确定退回吗?" @confirm="() => handleBack(record)">
            <a>退回</a>
          </a-popconfirm>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">预览</a>
              </a-menu-item>
<!--              <a-menu-item>-->
<!--                <a @click="handleDetailSD(record)">预览(山东)</a>-->
<!--              </a-menu-item>-->
<!--              <a-menu-item>-->
<!--                <a @click="handleDetailT800(record)">预览(T800)</a>-->
<!--              </a-menu-item>-->
              <!-- <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item> -->
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
import { getAction } from '@/api/manage'
import { selectorFilterMixin } from '@/mixins/selectorFilterMixin'
import { reportMixin } from '@/mixins/reportMixin'

export default {
  name: 'SampleReportResultList',
  mixins: [JeecgListMixin, mixinDevice, selectorFilterMixin, reportMixin],
  components: {},
  data() {
    return {
      description: '报告最终结果管理页面',
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
          scopedSlots: { customRender: 'geneColorText' }, // choseProduct
          // customRender: function(t, r, index) {
          //   let text = t
          //   if (r.choseProduct === 'FA') {
          //     text ='-'
          //   }
          //   return text
          // }
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
          title: '审核人',
          align: 'center',
          dataIndex: 'checkerName'
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
        list: '/report/sampleReportResult/list',
        delete: '/report/sampleReportResult/delete',
        deleteBatch: '/report/sampleReportResult/deleteBatch',
        exportXlsUrl: '/report/sampleReportResult/exportXls',
        importExcelUrl: 'report/sampleReportResult/importExcel',
        return: '/report/sampleReportResult/goBack'
      },
      dictOptions: {},
      superFieldList: [],
      distributorList: [],
      hospitalList: []
    }
  },
  created() {
    this.getSuperFieldList()
    this.loadDistributorList()
    this.loadHospitalList()
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    initDictConfig() {},
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'double', value: 'ananpanReportValue', text: '代谢结果', dictCode: '' })
      fieldList.push({ type: 'Text', value: 'ananpanReportAll', text: '代谢总览', dictCode: '' })
      fieldList.push({ type: 'date', value: 'ananpanTime', text: '代谢报告时间' })
      fieldList.push({ type: 'double', value: 'imageReportValue', text: '影像结果', dictCode: '' })
      fieldList.push({ type: 'Text', value: 'imageReportAll', text: '影像结果总览', dictCode: '' })
      fieldList.push({ type: 'date', value: 'imageTime', text: '影像报告时间' })
      fieldList.push({ type: 'double', value: 'geneReportValue', text: '基因结果', dictCode: '' })
      fieldList.push({ type: 'Text', value: 'geneReportAll', text: '基因结果总览', dictCode: '' })
      fieldList.push({ type: 'date', value: 'geneTime', text: '基因结果时间' })
      fieldList.push({ type: 'int', value: 'reportValue', text: '报告总结果', dictCode: '' })
      fieldList.push({ type: 'int', value: 'reportType', text: '报告状态', dictCode: '' })
      fieldList.push({ type: 'Text', value: 'remark', text: '备注', dictCode: '' })
      fieldList.push({ type: 'date', value: 'resultTime', text: '最终报告时间' })
      fieldList.push({ type: 'string', value: 'checkerId', text: '审核人ID', dictCode: '' })
      fieldList.push({ type: 'string', value: 'checkerName', text: '审核人', dictCode: '' })
      fieldList.push({ type: 'string', value: 'reportHistoryId', text: '报告版本ID', dictCode: '' })
      fieldList.push({ type: 'string', value: 'orderId', text: '订单编号', dictCode: '' })
      this.superFieldList = fieldList
    },
    handleDetailSD(record) {
      const router = this.$router.resolve({
        name: 'PagePreview',
        params:{
          reportId: record.id,
          template: 'sd'
        }
      })
      window.open(router.href, '_blank')
    },
    handleDetail (record) {
      const rooterName = record.templateUrl || 'PagePreview'
      const router = this.$router.resolve({
        name: rooterName,
        params:{
          reportId: record.orderId
        }
      })
      window.open(router.href, '_blank')
    },
    handleDetailT800(record) {
      const router = this.$router.resolve({
        name: 'PagePrintT800',
        params:{
          reportId: record.orderId
        }
      })
      window.open(router.href, '_blank')
    },
    handleBack (record) {
      this.reportReturn(record.id)
    },
    async reportReturn (id) {
      try {
        const url = this.url.return
        const postData = {
          id: id
        }
        const res = await getAction(url, postData)
        if (res.code === 200) {
          this.$message.success('退回成功！')
          this.loadData()
        } else {
          this.$message.error(res.message)
        }
      } catch (e) {
        this.$message.warning(e.message)
      }
    },
    batchDownLoadExport () {
      console.log(this.selectedRowKeys)
    }
  }
}
</script>
<style lang="less">
@import '~@assets/less/common.less';
</style>
