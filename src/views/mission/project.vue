<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24"> </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="toCreateProject" type="primary" icon="plus" v-has="'proAdd'">新建项目</a-button>
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('项目')">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button> -->
      <!-- </a-upload> -->
      <!-- 高级查询区域 -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" v-has="'proAdd'" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

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
          <a @click="toCreateProject(record)" v-has="'proAdd'">编辑</a>

          <a-divider type="vertical" v-has="'proAdd'" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item v-has="'proAdd'">
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>

    <project-info-modal ref="modalForm" @ok="modalFormOk"></project-info-modal>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from 'src/utils/mixin'
import { JeecgListMixin } from 'src/mixins/JeecgListMixin'
import ProjectInfoModal from './modules/ProjectInfoModal'
import api from 'src/api/mission/project'

export default {
  name: 'ProjectInfoList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    ProjectInfoModal
  },
  data() {
    return {
      description: '项目管理页面',
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
          title: '项目名称',
          align: 'center',
          dataIndex: 'projectName'
        },
        {
          title: '项目编码',
          align: 'center',
          dataIndex: 'projectCode'
        },
        {
          title: '项目类型',
          align: 'center',
          dataIndex: 'physicalProperty_dictText'
        },
        {
          title: '项目设计',
          align: 'center',
          dataIndex: 'projectDesign_dictText'
        },

        {
          title: '项目研究所处阶段',
          align: 'center',
          dataIndex: 'projectStage_dictText'
        },
        {
          title: '项目组',
          align: 'center',
          dataIndex: 'projectGroupId_dictText'
        },
        {
          title: '项目内部负责人',
          align: 'center',
          dataIndex: 'chargePeopleId_dictText'
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
        list: api.list,
        delete: api.delete,
        deleteBatch: api.deleteBatch,
        exportXlsUrl: api.exportXlsUrl,
        importExcelUrl: api.importExcelUrl
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
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'projectName', text: '项目名称', dictCode: '' })
      fieldList.push({ type: 'string', value: 'physicalProperty', text: '性质', dictCode: 'physical_property' })
      fieldList.push({ type: 'string', value: 'hoId', text: '医院ID', dictCode: 'hospital_info,ho_name,id' })
      fieldList.push({ type: 'string', value: 'hoName', text: '合作医院', dictCode: '' })
      fieldList.push({ type: 'string', value: 'typesCancer', text: '癌种', dictCode: 'types_cancer' })
      fieldList.push({ type: 'int', value: 'numberSamples', text: '样本数', dictCode: '' })
      fieldList.push({ type: 'int', value: 'numberQualifi', text: '合格数', dictCode: '' })
      fieldList.push({ type: 'date', value: 'startDate', text: '开始日期' })
      fieldList.push({ type: 'date', value: 'preEndDate', text: '预计结束日期' })
      fieldList.push({ type: 'date', value: 'endDate', text: '实际结束日期' })
      this.superFieldList = fieldList
    },
    toCreateProject(record) {
      if (record.id) {
        this.$router.push({
          path: `createProject?id=${record.id}&step=${record.editStep}`
        })
      } else {
        this.$router.push({
          path: '/createProject'
        })
      }
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
