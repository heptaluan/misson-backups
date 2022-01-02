<template>
  <a-card :bordered="false">
    <a-form-model
      style="max-width: 1080px; margin: 20px auto 0;"
      ref="ruleForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-descriptions title="样本质控结果">
        <a-descriptions-item label="批次号">
          {{ result.batchNo }}
        </a-descriptions-item>
        <a-descriptions-item label="总数">
          {{ result.totalRecordAmount }}
        </a-descriptions-item>
        <a-descriptions-item label="合格数">
          {{ result.qcPassAmount }}
        </a-descriptions-item>
        <a-descriptions-item label="不合格数">
          {{ result.qcRejectAmount }}
        </a-descriptions-item>
        <a-descriptions-item label="结果反馈对象">
          <div style="display:flex;">
            <a-select
              style="width: 180px;marginRight: 20px;"
              v-model="cooperator"
              placeholder="请选择合作单位"
              @change="handleCooperatorChange"
            >
              <a-select-option v-for="item in cooperatorList" :key="item.id" :value="item.id">
                {{ item.departName }}
              </a-select-option>
            </a-select>

            <div v-if="cooperator">
              <a-select
                style="width: 180px"
                v-model="feedbackUser"
                placeholder="请选择结果反馈对象"
                @change="handleFeedbackUserChange"
              >
                <a-select-option v-for="item in feedbackUserList" :key="item.id" :value="item.id">
                  {{ item.username }}
                </a-select-option>
              </a-select>
            </div>
          </div>
        </a-descriptions-item>
      </a-descriptions>

      <div class="edit-title">质控报告内容</div>

      <div class="edit-box">
        <Editor :content.sync="content" />

        <div class="btn-group">
          <a-button type="primary" @click="handleSave()">保存</a-button>
        </div>
      </div>

      <div class="search-group">
        <a-select allowClear style="width: 230px" placeholder="请选择条目进行筛选" @change="handleSearchChange">
          <a-select-option value="10000">
            合格
          </a-select-option>
          <a-select-option value="20000">
            不合格
          </a-select-option>
          <a-select-option value="0">
            未筛选
          </a-select-option>
        </a-select>
        <a-button @click="handleSearch" type="primary">筛选</a-button>
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

        <template slot="radio" slot-scope="text, record">
          <a-radio-group v-model="record.circuitResult" @change="onRadioChange(record, $event)">
            <a-radio :value="10000">
              合格
            </a-radio>
            <a-radio :value="20000">
              不合格
            </a-radio>
          </a-radio-group>
        </template>
      </a-table>

      <div class="btn-group">
        <a-button type="primary" @click="handleFinish()">质控完成</a-button>
      </div>
    </a-form-model>
  </a-card>
</template>

<script>
import Editor from '../step/Editor'
import api from 'src/api/mission/sampleInfo'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import {
  getStockApplyQc,
  caseSampleQc,
  putStockApplyQc,
  getCaseSampleList,
  getCooperationUnitList,
  queryUserByDepId,
  finishStockApplyQc
} from 'src/api/mission/project'

export default {
  name: 'SampleResult',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    Editor
  },
  data() {
    return {
      labelCol: { span: 3 },
      wrapperCol: { span: 17 },
      content: '',
      id: '',
      informContactId: '',
      searchCircuitResult: '',
      cooperator: undefined,
      feedbackUser: undefined,
      cooperatorList: [],
      feedbackUserList: [],
      result: {
        batchNo: '',
        totalRecordAmount: '',
        qcPassAmount: '',
        qcRejectAmount: '',
        applyId: ''
      },
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
          dataIndex: 'sampleCode',
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
          title: '导入时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '质检人员',
          align: 'center',
          dataIndex: 'qcBy'
        },
        {
          title: '质检时间',
          align: 'center',
          dataIndex: 'qcTime'
        },
        {
          title: '阶段',
          align: 'center',
          dataIndex: 'currentCircuit_dictText'
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'radio',
          scopedSlots: { customRender: 'radio' }
        }
      ],
      url: {
        list: '',
        delete: api.delete,
        deleteBatch: api.deleteBatch,
        exportXlsUrl: api.exportXlsUrl,
        importExcelUrl: api.importExcelUrl
      }
    }
  },
  methods: {
    handleSearchChange(value) {
      this.searchCircuitResult = value
    },
    handleSearch() {
      const that = this
      const query = {
        circuitResult: that.searchCircuitResult,
        currentCircuit: 3
      }
      getCaseSampleList(query).then(res => {
        if (res.success) {
          that.dataSource = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    onRadioChange(record, e) {
      const that = this
      const query = {
        id: record.id,
        code: e.target.value
      }
      caseSampleQc(query).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadFormData()
          that.loadData()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    getParams(key) {
      const search = window.location.search.substring(1)
      const vars = search.split('&')
      for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=')
        if (pair[0] === key) {
          return pair[1]
        }
      }
      return false
    },
    loadFormData() {
      const that = this
      const query = {
        id: this.getParams('id'),
        currentCircuit: 3
      }
      getStockApplyQc(query).then(res => {
        if (res.success) {
          that.result = res.result
          that.id = res.result.id
          that.content = res.result.qcReportContent
          that.informContactId = res.result.informContactId
          that.cooperator = res.result.informDepartId_text
          that.feedbackUser = res.result.informContactId_text
          if (res.result.informDepartId) {
            that.loadFeedbackUserList(res.result.informDepartId)
          }
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    loadData() {
      const that = this
      const query = {
        stockApplyId: this.getParams('id'),
        currentCircuit: 3
      }
      getCaseSampleList(query).then(res => {
        if (res.success) {
          that.dataSource = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleCooperatorChange(value) {
      this.loadFeedbackUserList(value)
    },
    handleFeedbackUserChange(value) {
      this.feedbackUser = value
    },
    loadCooperatorList() {
      const that = this
      getCooperationUnitList().then(res => {
        if (res.success) {
          that.cooperatorList = res.result
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    loadFeedbackUserList(id) {
      const that = this
      const query = {
        id: id
      }
      queryUserByDepId(query).then(res => {
        if (res.success) {
          that.feedbackUserList = res.result
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleSave() {
      if (!this.feedbackUser) {
        this.$message.warning(`请选择结果反馈对象`)
        return false
      }
      const query = {
        id: this.id,
        informDepartId: this.cooperator,
        informContactId: this.feedbackUser,
        qcReportContent: this.content ? this.content : ''
      }
      const that = this
      putStockApplyQc(query).then(res => {
        if (res.success) {
          that.$message.success(res.message)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleFinish() {
      const that = this
      const query = {
        apply: this.result.applyId
      }
      finishStockApplyQc(query).then(res => {
        if (res.success) {
          that.$message.success(res.message)
        } else {
          that.$message.warning(res.message)
        }
      })
    }
  },
  mounted() {
    this.loadFormData()
    this.loadCooperatorList()
  }
}
</script>

<style lang="less" scoped>
.edit-title {
  color: rgba(0, 0, 0, 0.85);
  font-weight: normal;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 20px;
}

.search-group {
  margin: 40px 0 20px;

  .ant-btn {
    margin-left: 20px;
  }
}

.btn-group {
  margin-top: 20px;
  text-align: right;
}
</style>
<style>
.ant-select-dropdown, .ant-message {
  z-index: 10002 !important;
}
</style>
