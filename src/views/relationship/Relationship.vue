<template xmlns:background-color="http://www.w3.org/1999/xhtml">
  <a-row :gutter="10">
    <a-col :md="12" :sm="24">
      <a-card :bordered="false">
        <!-- 按钮操作区域 -->
        <a-row style="margin-left: 14px">
          <a-button @click="handleAdd(1)" type="primary">添加渠道商</a-button>
          <a-button @click="handleAdd(2)" type="primary" :disabled="selectedKeys.length <= 0">添加下级</a-button>
          <a-button title="删除多条数据" @click="batchDel" type="default">批量删除</a-button>
          <!--<a-button @click="refresh" type="default" icon="reload" :loading="loading">刷新</a-button>-->
        </a-row>
        <div style="background: #fff;padding-left:16px;height: 100%; margin-top: 5px">
          <a-alert type="info" :showIcon="true">
            <div slot="message">
              当前选择：<span v-if="this.currSelected.title">{{ getCurrSelectedTitle() }}</span>
              <a v-if="this.currSelected.title" style="margin-left: 10px" @click="onClearSelected">取消选择</a>
            </div>
          </a-alert>
          <a-input-search @search='onSearch' style='width:100%;margin-top: 10px' placeholder='请输入渠道商名称' />
          <!-- 树-->
          <a-col :md="10" :sm="24">
            <template>
              <a-dropdown :trigger="[this.dropTrigger]" @visibleChange="dropStatus">
                <span style="user-select: none">
                  <a-tree
                    checkable
                    multiple
                    @select="onSelect"
                    @check="onCheck"
                    @rightClick="rightHandle"
                    :selectedKeys="selectedKeys"
                    :checkedKeys="checkedKeys"
                    :treeData="departTree"
                    :checkStrictly="checkStrictly"
                    :expandedKeys="iExpandedKeys"
                    :autoExpandParent="autoExpandParent"
                    @expand="onExpand"
                  />
                </span>
                <!--新增右键点击事件,和增加添加和删除功能-->
                <a-menu slot="overlay">
                  <a-menu-item @click="handleAdd(3)" key="1">添加下级</a-menu-item>
                  <a-menu-item @click="handleDelete" key="2">删除</a-menu-item>
                  <a-menu-item @click="closeDrop" key="3">取消</a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>
          </a-col>
        </div>
      </a-card>
      <!---- author:os_chengtgen -- date:20190827 --  for:切换父子勾选模式 =======------>
      <div class="drawer-bootom-button">
        <a-dropdown :trigger="['click']" placement="topCenter">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="switchCheckStrictly(1)">父子关联</a-menu-item>
            <a-menu-item key="2" @click="switchCheckStrictly(2)">取消关联</a-menu-item>
            <a-menu-item key="3" @click="checkALL">全部勾选</a-menu-item>
            <a-menu-item key="4" @click="cancelCheckALL">取消全选</a-menu-item>
            <a-menu-item key="5" @click="expandAll">展开所有</a-menu-item>
            <a-menu-item key="6" @click="closeAll">合并所有</a-menu-item>
          </a-menu>
          <a-button>
            树操作
            <a-icon type="up" />
          </a-button>
        </a-dropdown>
      </div>
      <!---- author:os_chengtgen -- date:20190827 --  for:切换父子勾选模式 =======------>
    </a-col>
    <a-col :md='12' :sm='24'>
      <a-tabs defaultActiveKey='1'>

        <a-tab-pane tab='用户列表' key='1' forceRender>
          <RelationUserList ref='relationUser' />
        </a-tab-pane>
        <a-tab-pane tab="基本信息" key="2">
          <a-card :bordered='false' v-if='selectedKeys.length > 0'>
            <a-form-model ref='form' :model='model' :rules='validatorRules'>
              <a-form-model-item :labelCol='labelCol' :wrapperCol='wrapperCol' prop='departName' label='渠道商名称'>
                <a-input placeholder='请输入渠道商名称' v-model='model.departName' />
              </a-form-model-item>
              <a-form-model-item :labelCol='labelCol' :wrapperCol='wrapperCol' prop='departNameAbbr' label='渠道商简称'>
                <a-input
                  class='autoUppercase'
                  placeholder='请输入渠道商简称'
                  disabled
                  v-model='model.departNameAbbr'
                  @change='checkAbbr(model.departNameAbbr, model)'
                />
              </a-form-model-item>
              <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上级部门">
                <a-tree-select
                  style='width:100%'
                  :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
                  :treeData='treeData'
                  :disabled='disable'
                  v-model='model.parentId'
                  placeholder='无'
                >
                </a-tree-select>
              </a-form-model-item>
              <a-form-model-item :labelCol='labelCol' :wrapperCol='wrapperCol' prop='orgCode' label='渠道商编码'>
                <a-input disabled placeholder='请输入渠道商编码' v-model='model.orgCode' />
              </a-form-model-item>
              <a-form-model-item :labelCol='labelCol' :wrapperCol='wrapperCol' label='手机号'>
                <a-input placeholder='请输入手机号' v-model='model.mobile' />
              </a-form-model-item>
              <a-form-model-item :labelCol='labelCol' :wrapperCol='wrapperCol' label='地区' prop='zone'>
                <region v-model='model.zone' :value='model.zone' />
              </a-form-model-item>
              <a-form-model-item :labelCol='labelCol' :wrapperCol='wrapperCol' label='详细地址'>
                <a-input placeholder='请输入地址' v-model='model.address' />
              </a-form-model-item>
              <a-form-model-item :labelCol='labelCol' :wrapperCol='wrapperCol' label='统一信用码'>
                <a-input placeholder='请输入统一信用码' v-model='model.socialCode' />
              </a-form-model-item>
              <a-form-model-item :labelCol='labelCol' :wrapperCol='wrapperCol' label='网址'>
                <a-input placeholder='请输入网址' v-model='model.website' />
              </a-form-model-item>
            </a-form-model>
            <div class="anty-form-btn">
              <a-button @click="emptyCurrForm" type="default" htmlType="button" icon="sync">重置</a-button>
              <a-button @click="submitCurrForm" type="primary" htmlType="button" icon="form">保存</a-button>
            </div>
          </a-card>
          <a-card v-else>
            <a-empty>
              <span slot="description"> 请先选择一个部门! </span>
            </a-empty>
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </a-col>
    <relation-modal ref="departModal" @ok="loadTree"></relation-modal>
  </a-row>
</template>
<script>
import RelationModal from './modules/RelationModal'
import RelationUserList from './modules/RelationUserList'
import { queryDepartTreeList, queryDepartTreeListByOrgType, searchByKeywords, deleteByDepartId } from '@/api/api'
import { httpAction, deleteAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import Region from '../region/Region'
import { commonFunctionsMixin } from '@/mixins/commonFunctionsMixin'

// 表头
const columns = [
  {
    title: '渠道商名称',
    dataIndex: 'departName'
  },
  {
    title: '渠道商类型',
    align: 'center',
    dataIndex: 'orgType'
  },
  {
    title: '渠道商编码',
    dataIndex: 'orgCode'
  },
  {
    title: '手机号',
    dataIndex: 'mobile'
  },
  {
    title: '地址',
    dataIndex: 'address'
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'Relationship',
  mixins: [JeecgListMixin, commonFunctionsMixin],
  components: {
    RelationModal,
    RelationUserList,
    Region
  },
  data() {
    return {
      iExpandedKeys: [],
      loading: false,
      autoExpandParent: true,
      currFlowId: '',
      currFlowName: '',
      disable: true,
      treeData: [],
      visible: false,
      departTree: [],
      rightClickSelectedKey: '',
      rightClickSelectedOrgCode: '',
      hiding: true,
      model: {},
      dropTrigger: '',
      depart: {},
      columns: columns,
      disableSubmit: false,
      checkedKeys: [],
      selectedKeys: [],
      autoIncr: 1,
      currSelected: {},
      allTreeKeys: [],
      checkStrictly: true,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      graphDatasource: {
        nodes: [],
        edges: []
      },
      validatorRules: {
        departName: [{ required: true, message: '请输入渠道商名称!', trigger: 'blur' }],
        departNameAbbr: [
          {
            required: true,
            message: '请输入渠道商简称(3-8位大写字母)',
            trigger: 'blur',
            pattern: /^[a-zA-Z]{3,8}$/
          }
        ],
        orgCode: [{ required: true, message: '请输入渠道商编码!' }],
        // orgCategory:[{required: true, message: '请输入渠道商类型!'}],
        mobile: [{ validator: this.validateMobile }],
        zone: [{ required: true, message: '请选择地区', trigger: 'change' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      url: {
        delete: '/sys/sysDepart/delete',
        edit: '/sys/sysDepart/edit',
        deleteBatch: '/sys/sysDepart/deleteBatch',
        exportXlsUrl: 'sys/sysDepart/exportXls',
        importExcelUrl: 'sys/sysDepart/importExcel'
      },
      // departmentType: [
      //   { value: 1, txt: '公司' },
      //   { value: 3000, txt: '渠道商' },
      //   { value: 4000, txt: '医院' }
      // ],
      user: null,
      selectType: 3000
      // orgCategoryDisabled:false,
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    loadData() {
      this.refresh()
    },
    // orgTypeWithUserRole() {
    //   this.user = this.userInfo()
    //   if (this.user.includes('admin')) {
    //     return this.departmentType[0].value
    //   } else if (this.user.includes('channel_omics') && !this.user.includes('hospital')) {
    //     return this.departmentType[1].value
    //   } else if (!this.user.includes('channel_omics') && this.user.includes('hospital')) {
    //     return this.departmentType[2].value
    //   }
    // },
    loadTree() {
      var that = this
      that.treeData = []
      that.departTree = []
      // get all organizes with '公司' type
      const orgType = { catalog: 3000 }
      queryDepartTreeListByOrgType(orgType).then(res => {
        if (res.success) {
          //渠道商全选后，再添加渠道商，选中数量增多
          this.allTreeKeys = []
          for (let i = 0; i < res.result.length; i++) {
            let temp = res.result[i]
            that.treeData.push(temp)
            that.departTree.push(temp)
            that.setThisExpandedKeys(temp)
            that.getAllKeys(temp)
            // console.log(temp.id)
          }
          this.loading = false
        }
      })
    },
    setThisExpandedKeys(node) {
      if (node.children && node.children.length > 0) {
        this.iExpandedKeys.push(node.key)
        for (let a = 0; a < node.children.length; a++) {
          this.setThisExpandedKeys(node.children[a])
        }
      }
    },
    refresh() {
      this.loading = true
      this.loadTree()
    },
    // 右键操作方法
    rightHandle(node) {
      this.dropTrigger = 'contextmenu'
      console.log(node.node.eventKey)
      this.rightClickSelectedKey = node.node.eventKey
      this.rightClickSelectedOrgCode = node.node.dataRef.orgCode
    },
    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys)
      this.iExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    backFlowList() {
      this.$router.back(-1)
    },
    // 右键点击下拉框改变事件
    dropStatus(visible) {
      if (visible == false) {
        this.dropTrigger = ''
      }
    },
    // 右键下拉关闭下拉框
    closeDrop() {
      this.dropTrigger = ''
    },
    addRootNode() {
      this.$refs.nodeModal.add(this.currFlowId, '')
    },
    batchDel: function() {
      console.log(this.checkedKeys)
      if (this.checkedKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
      } else {
        var ids = ''
        for (var a = 0; a < this.checkedKeys.length; a++) {
          ids += this.checkedKeys[a] + ','
        }
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '确定要删除所选中的 ' + this.checkedKeys.length + ' 条数据，以及子节点数据吗?',
          onOk: function() {
            deleteAction(that.url.deleteBatch, { ids: ids }).then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadTree()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          }
        })
      }
    },
    onSearch(value) {
      let that = this
      if (value) {
        searchByKeywords({ keyWord: value }).then(res => {
          if (res.success) {
            that.departTree = []
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i]
              that.departTree.push(temp)
            }
          } else {
            that.$message.warning(res.message)
          }
        })
      } else {
        that.loadTree()
      }
    },
    nodeModalOk() {
      this.loadTree()
    },
    nodeModalClose() {},
    hide() {
      console.log(111)
      this.visible = false
    },
    onCheck(checkedKeys, info) {
      console.log('onCheck', checkedKeys, info)
      this.hiding = false
      //---- author:os_chengtgen -- date:20190827 --  for:切换父子勾选模式 =======------
      if (this.checkStrictly) {
        this.checkedKeys = checkedKeys.checked
      } else {
        this.checkedKeys = checkedKeys
      }
      //---- author:os_chengtgen -- date:20190827 --  for:切换父子勾选模式 =======------
    },
    onSelect(selectedKeys, e) {
      // console.log('selected', selectedKeys, e)
      this.model.zone = []
      this.hiding = false
      let record = e.node.dataRef
      console.log('onSelect-record', record)
      this.currSelected = Object.assign({}, record)
      this.model = this.currSelected
      this.selectedKeys = [record.key]
      this.model.parentId = record.parentId

      this.formatZone(this.model)
      // this.setValuesToForm(record)
      // this.$refs.relationUser.searchReset()
      this.$refs.relationUser.onClearSelected()
      this.$refs.relationUser.open(record)
    },
    // 触发onSelect事件时,为部门树右侧的form表单赋值
    // setValuesToForm(record) {
    //   if(record.orgCategory == '1'){
    //     this.orgCategoryDisabled = true;
    //   }else{
    //     this.orgCategoryDisabled = false;
    //   }
    // },
    getCurrSelectedTitle() {
      return !this.currSelected.title ? '' : this.currSelected.title
    },
    onClearSelected() {
      this.hiding = true
      this.checkedKeys = []
      this.currSelected = {}
      this.selectedKeys = []
      this.$refs.relationUser.currentDeptId = ''
    },
    submitCurrForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.currSelected.id) {
            this.$message.warning('请点击选择要修改部门!')
            return
          }
          this.currSelected.regionLevel = this.model.zone.length
          this.currSelected.regionCode = this.model.zone.at(-1)
          httpAction(this.url.edit, this.currSelected, 'put').then(res => {
            if (res.success) {
              this.$message.success('保存成功!')
              this.loadTree()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    emptyCurrForm() {
      this.$refs.form.resetFields()
      this.model = {}
    },
    handleAdd(num) {
      if (num == 1) {
        this.$refs.departModal.add()
        this.$refs.departModal.title = '新增'
      } else if (num == 2) {
        let key = this.currSelected.key
        if (!key) {
          this.$message.warning('请先点击选中上级部门！')
          return false
        }
        this.$refs.departModal.add(this.selectedKeys)
        this.$refs.departModal.title = '新增'
      } else {
        this.$refs.departModal.add(this.rightClickSelectedKey)
        this.$refs.departModal.title = '新增'
      }
    },
    handleDelete() {
      var that = this
      this.$confirm({
        title: '确认删除',
        content: '确定要删除此部门以及子节点数据吗?',
        onOk: function() {
          deleteByDepartId({ id: that.rightClickSelectedKey }).then(resp => {
            if (resp.success) {
              //删除成功后，去除已选中中的数据
              that.checkedKeys.splice(
                that.checkedKeys.findIndex(key => key === that.rightClickSelectedKey),
                1
              )
              that.$message.success('删除成功!')
              that.loadTree()
              //删除后同步清空右侧基本信息内容
              let orgCode = that.model.orgCode
              if (orgCode && orgCode === that.rightClickSelectedOrgCode) {
                that.onClearSelected()
              }
            } else {
              that.$message.warning('删除失败!')
            }
          })
        }
      })
    },
    getFlowGraphData(node) {
      // debugger
      this.graphDatasource.nodes.push({
        id: node.id,
        text: node.flowNodeName
      })
      if (node.children.length > 0) {
        for (let a = 0; a < node.children.length; a++) {
          let temp = node.children[a]
          this.graphDatasource.edges.push({
            source: node.id,
            target: temp.id
          })
          this.getFlowGraphData(temp)
        }
      }
    },

    expandAll() {
      this.iExpandedKeys = this.allTreeKeys
    },
    closeAll() {
      this.iExpandedKeys = []
    },
    checkALL() {
      this.checkStriccheckStrictlytly = false
      this.checkedKeys = this.allTreeKeys
    },
    cancelCheckALL() {
      //this.checkedKeys = this.defaultCheckedKeys
      this.checkedKeys = []
    },
    switchCheckStrictly(v) {
      if (v == 1) {
        this.checkStrictly = false
      } else if (v == 2) {
        this.checkStrictly = true
      }
    },
    getAllKeys(node) {
      // console.log('node',node);
      this.allTreeKeys.push(node.key)
      if (node.children && node.children.length > 0) {
        for (let a = 0; a < node.children.length; a++) {
          this.getAllKeys(node.children[a])
        }
      }
    },
    userInfo() {
      return this.$store.getters.userInfo
    },
    formatZone(form) {
      const zone = []
      zone.push(form.regionProvince, form.regionCity, form.regionCode)
      form.zone = zone
    }
  },
  created() {
    this.currFlowId = this.$route.params.id
    this.currFlowName = this.$route.params.name
    // this.loadTree()
  }
}
</script>
<style scoped>
.ant-card-body .table-operator {
  margin: 15px;
}

.anty-form-btn {
  width: 100%;
  text-align: center;
}

.anty-form-btn button {
  margin: 0 5px;
}

.anty-node-layout .ant-layout-header {
  padding-right: 0;
}

.header {
  padding: 0 8px;
}

.header button {
  margin: 0 3px;
}

.ant-modal-cust-warp {
  height: 100%;
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto;
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden;
}

#app .desktop {
  height: auto !important;
}

/** Button按钮间距 */
.ant-btn {
  margin-left: 3px;
}

.drawer-bootom-button {
  /*position: absolute;*/
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: left;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>
