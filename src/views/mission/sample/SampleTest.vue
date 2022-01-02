<template>
  <a-card :bordered="false">
    <a-form-model style="margin-bottom: 40px;" ref="ruleForm" :label-col="labelCol" :wrapper-col="wrapperCol">
      <div class="search-group">
        <div class="group">
          <div class="title">项目名</div>
          <j-dict-select-tag
            allowClear
            style="width:150px;"
            type="list"
            dictCode="project_info, project_name, id, logical_state=1"
            placeholder="请选择项目"
            v-model="searchData.project"
          />
        </div>
        <div class="group">
          <div class="title">样本编号</div>
          <a-input v-model="searchData.sampleIdentity" allowClear style="width: 150px" placeholder="请输入样本编号" />
        </div>
        <div class="group">
          <div class="title">批次号</div>
          <a-input v-model="searchData.batchNo" style="width: 150px" allowClear placeholder="请输入批次号"></a-input>
        </div>
        <div class="group">
          <div class="title">质控责任人</div>
          <a-select
            allowClear
            style="width:200px;"
            v-model="searchData.qcContactId"
            placeholder="请选择质控责任人"
            @change="handleSelectChange"
          >
            <a-select-option v-for="item in userList" :key="item.id" :value="item.id">
              {{ item.realname }}
            </a-select-option>
          </a-select>
        </div>

        <a-button @click="handleSearch" type="primary">筛选</a-button>
      </div>

      <!-- 项目资料 -->
      <div class="project-list">
        <div class="title">项目资料</div>
        <FileList :id="searchData.project" />
      </div>

      <div class="project-list">
        <div class="title">样本详情</div>
        <!-- table区域-begin -->
        <a-table
          ref="table"
          size="middle"
          :scroll="{ x: true }"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataList"
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
            <a @click="executeTest(record)" v-if="isTestLeader">检测</a>
          </span>
        </a-table>
      </div>
    </a-form-model>

    <SampleTestModal ref="sampleTestModal" @ok="submitCallback" />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SampleTestModal from '../modules/sample/SampleTestModal'
import FileList from './FileList'
import { getCaseSampleList, getUserList, getAuthForTest } from 'src/api/mission/project'

export default {
  name: 'SampleTest',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    SampleTestModal,
    FileList
  },
  data() {
    return {
      title: '',
      labelCol: { span: 2 },
      wrapperCol: { span: 10 },
      searchData: {
        project: undefined,
        sampleIdentity: '',
        batchNo: '',
        qcContactId: undefined
      },
      userList: [],
      dataList: [],
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
          title: '批次号',
          align: 'center',
          dataIndex: 'batchNo'
        },
        {
          title: '项目名',
          align: 'center',
          dataIndex: 'projectId_dictText'
        },
        {
          title: '性质',
          align: 'center',
          dataIndex: 'researchType_dictText'
        },

        {
          title: '样本编号',
          align: 'center',
          dataIndex: 'sampleIdentity',
          customRender: function(t, r, index) {
            return `${r.caseIdentity}-${r.sampleIdentity}`
          }
        },
        {
          title: '样本类型',
          align: 'center',
          dataIndex: 'sampleType_dictText'
        },
        {
          title: '质检责任人',
          align: 'center',
          dataIndex: 'qcBy'
        },
        {
          title: '质检时间',
          align: 'center',
          dataIndex: 'qcTime'
        },
        {
          title: '检测责任人',
          align: 'center',
          dataIndex: 'detectBy'
        },
        {
          title: '检测时间',
          align: 'center',
          dataIndex: 'detectTime'
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
        list: ''
      },
      isTestLeader: false
    }
  },
  methods: {
    loadData() {
      const that = this
      const query = {
        currentCircuit: 4,
        project: this.searchData.batchNo,
        sampleIdentity: this.searchData.sampleIdentity,
        batchNo: this.searchData.batchNo,
        qcContactId: this.searchData.qcContactId
      }
      getCaseSampleList(query).then(res => {
        if (res.success) {
          that.dataList = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleSearch() {
      this.loadData()
    },
    executeTest(record) {
      this.$refs.sampleTestModal.show(record)
    },
    submitCallback() {
      this.loadData()
    },
    handleSelectChange(value) {
      this.qcContactId = value
    },
    getUserList() {
      const that = this
      getUserList().then(res => {
        if (res.success) {
          that.userList = res.result
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    getAuth() {
      getAuthForTest().then(res => {
        if (res.success) {
          this.isTestLeader = res.result
        }
      })
    }
  },
  mounted() {
    this.getAuth()
    this.getUserList()
  }
}
</script>
<style scoped lang="less">
@import '~@assets/less/common.less';

.project-list {
  margin: 20px 0;

  .title {
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 20px;
  }
}

.search-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  .group {
    display: flex;
    align-items: center;

    .title {
      min-width: 45px;
      color: rgba(0, 0, 0, 0.85);
      margin-right: 10px;
    }
  }
}
</style>
