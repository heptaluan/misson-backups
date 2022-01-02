<template>
  <j-modal :title="title" :width="width" :visible="visible" switchFullscreen @ok="handleOk" @cancel="handleCancel">
    <a-form-model ref="form" :label-col="labelCol" :wrapper-col="wrapperCol">
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
      </a-table>
    </a-form-model>
  </j-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'
import { getSampleBarcodeList } from 'src/api/mission/project'

export default {
  name: 'ShowCreateCodeModal',
  mixins: [JeecgListMixin, mixinDevice],
  data() {
    return {
      title: '查看编号',
      width: 1280,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      record: {},
      visible: false,
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
          title: '病例编号',
          align: 'center',
          dataIndex: 'caseBarcode'
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
          title: '编号使用状态',
          align: 'center',
          dataIndex: 'codeUsageStatus',
          customRender: function(t, r, index) {
            if (r.codeUsageStatus === 1) {
              return '已使用'
            } else {
              return '未使用'
            }
          }
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        }
      ],
      url: {
        list: ''
      },
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      }
    }
  },
  methods: {
    show(record) {
      this.record = record
      this.visible = true
      this.$nextTick(() => {
        this.loadData()
      })
    },
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      this.$emit('ok')
      this.visible = false
    },
    loadData() {
      const that = this
      getSampleBarcodeList({
        barcodeGenerateId: that.record.id,
        pageNo: that.ipagination.current,
        pageSize: that.ipagination.pageSize
      }).then(res => {
        if (res.success) {
          that.ipagination.total = res.result.total
          that.dataSource = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleTableChange(pagination) {
      this.ipagination = pagination
      this.loadData()
    }
  }
}
</script>
