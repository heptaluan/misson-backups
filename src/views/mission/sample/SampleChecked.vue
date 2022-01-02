<template>
  <a-card :bordered="false">
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
          <div class="btn-group">
            <a @click="handleEdit(record)">编辑</a>
            <a @click="showOriginalData(record)">原始数据</a>
          </div>
        </span>
      </a-table>
    </div>

    <SampleCheckedModal ref="sampleCheckedModal" @ok="modalFormOk" />
    <SampleOriginalDataModal ref="sampleOriginalDataModal" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SampleCheckedModal from '../modules/sample/SampleCheckedModal'
import SampleOriginalDataModal from '../modules/sample/SampleOriginalDataModal'
import { getCaseSampleList } from 'src/api/mission/project'

export default {
  name: 'SampleChecked',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    SampleCheckedModal,
    SampleOriginalDataModal
  },
  data() {
    return {
      description: '样本检查页面',
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
          title: '项目名称',
          align: 'center',
          dataIndex: 'projectId_dictText'
        },
        {
          title: '性质',
          align: 'center',
          dataIndex: 'researchType_dictText'
        },
        {
          title: '样本类型',
          align: 'center',
          dataIndex: 'sampleType_dictText'
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
          title: '入库人',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '冰箱',
          align: 'center',
          dataIndex: 'refrigeratorId'
        },
        {
          title: '层数',
          align: 'center',
          dataIndex: 'floor'
        },
        {
          title: '格子编号',
          align: 'center',
          dataIndex: 'grid'
        },
        {
          title: '抽屉编号',
          align: 'center',
          dataIndex: 'drawer'
        },

        {
          title: '盒子编号',
          align: 'center',
          dataIndex: 'box'
        },
        {
          title: '行数',
          align: 'center',
          dataIndex: 'row'
        },
        {
          title: '列数',
          align: 'center',
          dataIndex: 'col'
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
      }
    }
  },
  methods: {
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
    loadData() {
      const that = this
      const query = {
        stockApplyId: this.getParams('id'),
        currentCircuit: 2
      }
      getCaseSampleList(query).then(res => {
        if (res.success) {
          that.dataSource = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleEdit(record) {
      this.$refs.sampleCheckedModal.show(record)
    },
    showOriginalData(record) {
      this.$refs.sampleOriginalDataModal.show(record)
    }
  }
}
</script>
<style scoped lang="less">
@import '~@assets/less/common.less';
.btn-group {
  display: flex;
  justify-content: space-evenly;
}
</style>
