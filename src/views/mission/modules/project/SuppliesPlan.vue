<template>
  <div>
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">添加耗材规划</a-button>
    </div>

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
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <SuppliesPlanModal ref="modalForm" @ok="modalFormOk" />
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { mixinDevice } from '@/utils/mixin'
import SuppliesPlanModal from './SuppliesPlanModal'
import { getProjectMaterialList, getProjectMaterialPlanList } from 'src/api/mission/project'

export default {
  name: 'SuppliesPlanForm',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    SuppliesPlanModal
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
        // {
        //   title: '耗材编号',
        //   align: 'center',
        //   dataIndex: 'materialId'
        // },
        {
          title: '耗材名称',
          align: 'center',
          dataIndex: 'materialId_dictText'
        },
        {
          title: '耗材总需求量',
          align: 'center',
          dataIndex: 'totalNo'
        },
        {
          title: '创建人',
          align: 'center',
          dataIndex: 'createBy'
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
        list: '/mission/projectMaterial/list',
        delete: '/mission/projectMaterial/delete',
        deleteBatch: '/mission/projectMaterial/deleteBatch',
        exportXlsUrl: '/mission/projectMaterial/exportXls',
        importExcelUrl: 'mission/projectMaterial/importExcel'
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
      const params = {
        projectId: this.getParams('id'),
        page: 1,
        size: 20
      }
      getProjectMaterialList(params).then(res => {
        if (res.success) {
          this.dataSource = res.result.records
        }
      })
    },
  }
}
</script>

<style lang="less" scoped></style>
