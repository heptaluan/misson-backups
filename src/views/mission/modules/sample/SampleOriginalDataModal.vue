<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="detail-title">原始数据详情</div>
    <a-table
      ref="table"
      size="middle"
      :scroll="{ x: true }"
      bordered
      rowKey="index"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      class="j-table-force-nowrap"
      @change="handleTableChange"
    ></a-table>

    <a-descriptions style="marginTop: 20px;" title="错误日志" bordered>
      <a-descriptions-item label="错误类型">
        {{ result.log }}
      </a-descriptions-item>
    </a-descriptions>
  </j-modal>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'
import { getCaseSampleOrigin } from 'src/api/mission/project'

export default {
  name: 'SampleOriginalDataModal',
  mixins: [JeecgListMixin, mixinDevice],
  data() {
    return {
      title: '原始数据',
      width: 1280,
      visible: false,
      disableSubmit: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
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
          title: '编号',
          align: 'center',
          dataIndex: '0'
        },
        {
          title: '机构名称',
          align: 'center',
          dataIndex: '1'
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: '2'
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: '3'
        },
        {
          title: '年龄',
          align: 'center',
          dataIndex: '4'
        },
        {
          title: '身份证号',
          align: 'center',
          dataIndex: '5'
        },
        {
          title: '样本类别',
          align: 'center',
          dataIndex: '7'
        },
        {
          title: '研究性质',
          align: 'center',
          dataIndex: '8'
        },
        {
          title: '冰箱',
          align: 'center',
          dataIndex: '9'
        },
        {
          title: '层数',
          align: 'center',
          dataIndex: '10'
        },
        {
          title: '格子编号',
          align: 'center',
          dataIndex: '11'
        },
        {
          title: '抽屉编号',
          align: 'center',
          dataIndex: '12'
        },
        {
          title: '盒子编号',
          align: 'center',
          dataIndex: '13'
        },
        {
          title: '行数',
          align: 'center',
          dataIndex: '14'
        },
        {
          title: '列数',
          align: 'center',
          dataIndex: '15'
        }
      ],
      result: {},
      url: {
        list: '/mission/caseSample/origin'
      }
    }
  },
  methods: {
    show(record) {
      console.log(record)
      this.loadOriginalData(record)
      this.visible = true
    },
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      this.visible = false
    },
    loadOriginalData(record) {
      const that = this
      const query = {
        id: record.id
      }
      getCaseSampleOrigin(query).then(res => {
        if (res.success) {
          that.result = res.result
          that.dataSource = [res.result.originJsonMap]
        } else {
          that.$message.warning(res.message)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.detail-title {
  margin-bottom: 20px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;
  font-size: 16px;
  line-height: 1.5;
}
</style>
