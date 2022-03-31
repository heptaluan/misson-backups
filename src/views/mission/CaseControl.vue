<template>
  <a-card :bordered="false">
    <a-form-model style="margin-bottom: 40px;" ref="ruleForm" :label-col="labelCol" :wrapper-col="wrapperCol">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24" class="search-group">
            <a-col class="group">
              <a-form-item label="姓名">
                <a-input allowClear v-model="queryParam.caseName" placeholder="请输入姓名"></a-input>
              </a-form-item>
            </a-col>
            <a-col class="group">
              <a-form-item label="病例号">
                <a-input allowClear v-model="queryParam.identifyCode" placeholder="请输入病例号"></a-input>
              </a-form-item>
            </a-col>
            <a-col class="group btn">
              <a-button @click="searchQuery" type="primary">查询</a-button>
              <a-button @click="resetQuery" style="margin-left:10px;">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 查询区域-END -->

      <!-- 高级查询区域 -->
      <!-- <div class="table-operator" style="margin-bottom:20px;">
        <j-super-query
          :fieldList="superFieldList"
          ref="superQueryModal"
          @handleSuperQuery="handleSuperQuery"
        ></j-super-query>
        <a-dropdown v-if="selectedRowKeys.length > 0" v-has="'caseEdit'">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
        </a-dropdown>
      </div> -->

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

        <span slot="action" slot-scope="text, record" style="display:flex;justify-content: space-evenly;">
          <a @click="handleEdit(record)" v-has="'caseEdit'">编辑</a>
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </a-form-model>

    <CaseControlModal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import CaseControlModal from './modules/sample/CaseControlModal'

export default {
  name: 'CaseControl',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    CaseControlModal
  },
  data() {
    return {
      title: '',
      labelCol: { span: 3 },
      wrapperCol: { span: 9 },
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
        // {
        //   title: '病例编号',
        //   align: 'center',
        //   dataIndex: 'identifyCode'
        // },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'caseName'
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'gender',
          customRender: function(text) {
            if (text == 1) {
              return '男'
            } else {
              return '女'
            }
          }
        },
        {
          title: '年龄',
          align: 'center',
          dataIndex: 'age'
        },
        {
          title: '手机号',
          align: 'center',
          dataIndex: 'phoneNumber'
        },
        {
          title: '身份证号',
          align: 'center',
          dataIndex: 'identityNumber'
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
        list: 'multiomics//medicalCase/list',
        delete: 'multiomics/medicalCase/delete'
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
    resetQuery() {
      this.queryParam = {}
      this.loadData()
    },
    initDictConfig() {},
    search() {},
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'code', text: '编号', dictCode: '' })
      fieldList.push({ type: 'string', value: 'hoName', text: '医院名称', dictCode: '' })
      fieldList.push({ type: 'string', value: 'hoId', text: '医院ID', dictCode: '' })
      fieldList.push({ type: 'string', value: 'codeQuality', text: '性质', dictCode: '' })
      fieldList.push({ type: 'string', value: 'typesCancer', text: '癌种', dictCode: '' })
      this.superFieldList = fieldList
    }
  }
}
</script>
<style scoped lang="less">
/*@import '~@assets/less/common.less';*/
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
      flex: 0 0 60px;
    }
  }
}

.btn-group {
  margin-top: 20px;
  text-align: right;
}
</style>
