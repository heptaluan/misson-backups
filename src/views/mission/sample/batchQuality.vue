<template>
  <a-card :bordered="false">
    <a-form layout="inline" @keyup.enter.native="searchQuery">
      <a-row class="search-group">
        <a-col class="group md">
          <a-form-item label="入库时间">
            <j-date
              v-model="queryParam.createTime_begin"
              :showTime="true"
              date-format="YYYY-MM-DD"
              style="width:45%"
              placeholder="请选择开始时间"
            ></j-date>
            <span style="width: 10px;"> - </span>
            <j-date
              v-model="queryParam.createTime_end"
              :showTime="true"
              date-format="YYYY-MM-DD"
              style="width:45%"
              placeholder="请选择结束时间"
            ></j-date>
          </a-form-item>
        </a-col>
        <a-col class="group md">
          <a-form-item label="状态" :labelCol="{ span: 4 }">
            <j-dict-select-tag
              allowClear
              type="list"
              dictCode="sample_qc_status"
              placeholder="请选择样本状态"
              v-model="queryParam.status"
            />
          </a-form-item>
        </a-col>
        <a-col class="group">
          <a-button @click="searchQuery" type="primary">查询</a-button>
          <a-button @click="resetQuery">重置</a-button>
        </a-col>
      </a-row>
    </a-form>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="text-align: right">
      <a-button :disabled="feedBack" @click="handleStockIn" type="primary" icon="plus" v-has="'sampleIn'"
        >生成/查看质控报告</a-button
      >
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

        <span slot="action" slot-scope="text, record">
          <a-radio-group :disabled="!editState" v-model="record.status" @change="handleQualityChange(record, $event)">
            <a-radio :value="1">
              合格
            </a-radio>
            <a-radio :value="0">
              不合格
            </a-radio>
          </a-radio-group>
        </span>
      </a-table>
    </div>

    <SampleQualityMadal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SampleQualityMadal from 'src/views/mission/materialManagement/SampleQualityMadal'
import { caseSampleQc, getStockApplyList } from 'src/api/mission/project'

export default {
  name: 'batchQuality',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    SampleQualityMadal
  },
  data() {
    return {
      description: '样本管理页面',
      batchNo: '',
      qcContactId: undefined,
      dataList: [],
      userList: [],
      currentCircuit: undefined,
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
          title: '样本编号',
          align: 'center',
          dataIndex: 'sampleBarcode'
        },
        {
          title: '样本类型',
          align: 'center',
          dataIndex: 'sampleType_dictText'
        },
        {
          title: '签收人',
          align: 'center',
          dataIndex: 'archiveUser'
        },
        {
          title: '入库时间',
          align: 'center',
          dataIndex: 'archiveTime'
        },

        {
          title: '质检负责人',
          align: 'center',
          dataIndex: 'qcUser'
        },
        {
          title: '质检时间',
          align: 'center',
          dataIndex: 'updateTime'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          customRender: function(t, r, index) {
            if (r.status === 0) {
              return '不合格'
            } else if (r.status === 1) {
              return '合格'
            } else {
              return '未开始'
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
        list: `/tailai-system/mission/caseSample/list?stockApplyId=${this.$route.query.id}`
      },
      isTestLeader: false,
      isRcLeader: false,
      editState: true,
      feedBack: false
    }
  },
  methods: {
    handleStockIn() {
      this.$refs.modalForm.show(this.editState)
      this.$refs.modalForm.title = '批次质控结果'
      this.$refs.modalForm.disableSubmit = false
    },
    resetQuery() {
      this.queryParam = {}
      this.loadData()
    },
    modalFormOk() {
      this.getStockApplyState()
    },
    handleQualityChange(record, e) {
      const that = this
      const query = {
        id: record.id,
        status: Number(e.target.value)
      }
      caseSampleQc(query).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadData()
          that.getStockApplyState()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    getStockApplyState() {
      const that = this
      getStockApplyList({
        id: this.$route.query.id
      }).then(res => {
        if (res.success) {
          const state = res.result.records[0].status
          console.log(state)
          if (state === 5) {
            that.editState = false
          } else if (state === 2) {
            that.feedBack = true
          } else {
            that.feedBack = false
            that.editState = true
          }
        } else {
          that.$message.warning(res.message)
        }
      })
    }
  },
  mounted() {
    this.getStockApplyState()
  }
}
</script>
<style scoped lang="less">
.btn-group {
  display: flex;
  justify-content: space-evenly;
}

.ant-radio-group {
  padding-left: 15px;
}
</style>
