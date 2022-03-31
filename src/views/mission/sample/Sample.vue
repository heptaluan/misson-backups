<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">

      <a-form layout="inline" @keyup.enter.native="searchQuery">
      <a-row :gutter="24" class="search-group">
        <a-col class="group">
          <a-form-item label="批次号" :labelCol="{ span: 5 }">
            <a-input allowClear v-model="queryParam.batchNo" placeholder="请输入批次号"></a-input>
          </a-form-item>
        </a-col>
        <a-col class="group md">
          <a-form-item label="状态" :labelCol="{ span: 4 }">
            <j-dict-select-tag
              allowClear
              type="list"
              dictCode="sample_apply_status"
              placeholder="请选择样本状态"
              v-model="queryParam.status"
            />
          </a-form-item>
        </a-col>
        <a-col class="group md">
          <a-form-item label="质控责任人" :labelCol="{ span: 7 }">
            <a-select allowClear v-model="queryParam.qcContactId" placeholder="请选择质控责任人">
              <a-select-option v-for="item in userList" :key="item.id" :value="item.username">
                {{ item.realname }}
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
      <a-button @click="handleStockIn" type="primary" icon="plus" v-has="'sampleIn'">发起样本入库</a-button>
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
          <div class="btn-group" v-if="record.status !== 6">
            <a @click="showDetail(record)">{{
              record.status === 5
                ? '查看'
                : record.status === 1 || record.status === 4 || record.status === 2 || record.status === 3
                ? '质控'
                : ''
            }}</a>
          </div>
          <div v-if="record.status === 6">
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
              <a>删除</a>
            </a-popconfirm>
          </div>
        </span>
      </a-table>
    </div>

    <SampleManagementModal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SampleManagementModal from '../modules/sample/SampleManagementModal'
import { getUserList, getAuthForQc, getAuthForTest } from 'src/api/mission/project'

export default {
  name: 'Sample',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    SampleManagementModal
  },
  data() {
    return {
      description: '样本管理页面',
      userList: [],
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
          title: '文件名称',
          align: 'center',
          dataIndex: 'fileName'
        },
        {
          title: '质控责任人',
          align: 'center',
          dataIndex: 'qcContactUser_dictText'
        },
        {
          title: '记录总数',
          align: 'center',
          dataIndex: 'totalAmount'
        },
        {
          title: '合格数',
          align: 'center',
          dataIndex: 'qualifyAmount'
        },
        {
          title: '不合格数',
          align: 'center',
          dataIndex: 'unQualifyAmount'
        },
        {
          title: '入库人',
          align: 'center',
          dataIndex: 'createBy_dictText'
        },
        {
          title: '入库时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '阶段状态',
          align: 'center',
          dataIndex: 'status_dictText'
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
        list: '/mission/caseSample/stockApply/list',
        delete: '/tailai-system/mission/caseSample/stockApply/delete'
      },
      isTestLeader: false,
      isRcLeader: false
    }
  },
  methods: {
    handleStockIn() {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '样本入库'
      this.$refs.modalForm.disableSubmit = false
    },
    resetQuery() {
      this.queryParam = {}
      this.loadData()
    },

    showDetail(record) {
      this.$router.push(`/mission/sample/batch-quality?id=${record.id}`)
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
      getAuthForQc().then(res => {
        if (res.success) {
          this.isRcLeader = res.result
        }
      })
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
/*@import '~@assets/less/common.less';*/

.search-group {
  display: flex;

  .group {
    display: flex;
    align-items: center;
    margin-right: 15px;

    .title {
      min-width: 45px;
      color: rgba(0, 0, 0, 0.85);
      margin-right: 10px;
      text-align: right;
      flex: 0 0 90px;
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
