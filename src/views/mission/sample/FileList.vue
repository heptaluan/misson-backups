<template>
  <div>
    <!-- table区域-begin -->
    <div class="table-wrap">
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
        <!-- 编辑区域 -->
        <span slot="action" slot-scope="text, record">
          <a @click="handlePreview(record)">预览</a>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'
import { getFileInfoList } from 'src/api/mission/project'

export default {
  name: 'FileList',
  mixins: [JeecgListMixin, mixinDevice],
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
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
          title: '文件名称',
          align: 'center',
          dataIndex: 'materialId_dictText'
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
        list: '/mission/projectMaterial/list'
      }
    }
  },
  watch: {
    id(newVal, oldVal) {
      this.loadData(newVal)
    }
  },
  methods: {
    loadData(id) {
      const that = this
      const query = {
        ownerId: id ? id : that.id,
        ownershipType: 6
      }
      getFileInfoList(query).then(res => {
        if (res.success) {
          that.dataSource = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handlePreview(record) {
      window.open(`https://www.baidu.com/`)
    }
  }
}
</script>

<style lang="less" scoped></style>
