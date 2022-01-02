<template>
  <div>
    <a-form-model
      style="max-width: 1080px; margin: 40px auto 0;"
      ref="ruleForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <!-- <a-form-model-item label="绑定组长单位/leader cooperation" prop="cooperation">
        <a-select v-model="form.cooperation" placeholder="请选择组长单位" @change="handleChange">
          <a-select-option v-for="item in cooperationList" :key="item.id" :value="item.id">
            {{ item.caName }}
          </a-select-option>
        </a-select>
        <a-button class="add-btn" type="primary" @click="addCooperation">
          新增合作单位
        </a-button>
      </a-form-model-item>
      <a-form-model-item label="添加分中心/leader cooperation" prop="cooperation">
        <a-select mode="tags" placeholder="请选择合作单位作为分中心">
          <a-select-option v-for="item in subCenterList" :key="item.id" :value="item.id" @change="handleAddSubCenter">
            {{ item.caName }}
          </a-select-option>
        </a-select>
      </a-form-model-item> -->

      <a-button class="add-btn" type="primary" @click="handleAdd" icon="plus">
        新增合作单位
      </a-button>

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
        <span slot="action" slot-scope="text, record">
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDeleteItem(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>

      <a-form-item :wrapperCol="{ span: 14, offset: 10 }">
        <div class="btn-group">
          <a-button type="primary" class="prev-btn" @click="prevStep">上一步</a-button>
          <a-button type="primary" @click="nextStep">下一步</a-button>
        </div>
      </a-form-item>
    </a-form-model>

    <AddCooperationModal ref="modalForm" @ok="modalFormOk" />
  </div>
</template>

<script>
import { queryProjectCooperationAgency } from 'src/api/mission/project'
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AddCooperationModal from '../modules/project/AddCooperationModal'
import { deleteAction } from '@/api/manage'

export default {
  name: 'Step2',
  components: {
    AddCooperationModal
  },
  mixins: [JeecgListMixin, mixinDevice],
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 10 },
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
          title: '合作单位',
          align: 'center',
          dataIndex: 'departName'
        },
        {
          title: '合作类型',
          align: 'center',
          dataIndex: 'corporationType_dictText'
        },
        {
          title: '合作开始时间',
          align: 'center',
          dataIndex: 'createTime',
          customRender: function(text) {
            return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
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
        list: '/mission/cooperationAgency/project',
        delete: '/mission/cooperationAgency/project/delete'
      }
    }
  },
  methods: {
    prevStep() {
      this.$emit('prevStep')
    },
    nextStep() {
      this.$emit('nextStep')
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
    loadData() {
      const that = this
      const params = {
        projectId: this.getParams('id'),
        page: 1,
        size: 20
      }
      queryProjectCooperationAgency(params).then(res => {
        if (res.success) {
          that.dataSource = res.result.records
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleDeleteItem(id) {
      const that = this
      deleteAction(that.url.delete, {
        agencyId: id,
        projectId: this.getParams('id')
      }).then(res => {
        if (res.success) {
          that.reCalculatePage(1)
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.warning(res.message)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.add-btn {
  margin-bottom: 20px;
}

.btn-group {
  text-align: right;
  margin-top: 20px;

  .prev-btn {
    margin: 0 15px;
  }
}
</style>
