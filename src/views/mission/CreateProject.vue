<template>
  <a-card :bordered="false">
    <a-steps class="steps" :current="currentTab" @change="onChange">
      <a-step title="基本信息" />
      <a-step title="项目合作单位" />
      <a-step title="项目时间" />
      <a-step title="项目资料管理" />
      <a-step title="项目标准" />
      <a-step title="样本规划" />
      <a-step title="耗材规划" />
    </a-steps>
    <div class="title">{{ getCurrentTitle() }}</div>
    <div class="content">
      <step1 v-if="currentTab === 0" @nextStep="nextStep" @prevStep="prevStep" @activeProject="activeProject" />
      <step2 v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep" />
      <step3 v-if="currentTab === 2" @nextStep="nextStep" @prevStep="prevStep" />
      <step4 v-if="currentTab === 3" @nextStep="nextStep" @prevStep="prevStep" />
      <step5 v-if="currentTab === 4" @nextStep="nextStep" @prevStep="prevStep" />
      <step6 v-if="currentTab === 5" @nextStep="nextStep" @prevStep="prevStep" />
      <step7 v-if="currentTab === 6" @finish="finish" @prevStep="prevStep" />
    </div>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { queryById } from 'src/api/mission/project'

import Step1 from './step/Step1'
import Step2 from './step/Step2'
import Step3 from './step/Step3'
import Step4 from './step/Step4'
import Step5 from './step/Step5'
import Step6 from './step/Step6'
import Step7 from './step/Step7'

export default {
  name: 'CreateProject',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
    Step5,
    Step6,
    Step7
  },
  data() {
    return {
      description: '新建项目页面',
      title: '',
      currentTab: 0,
      form: null,
      // 表头
      columns: [],
      url: {
        list: '/mission/materialManagement/list',
        delete: '/mission/materialManagement/delete',
        deleteBatch: '/mission/materialManagement/deleteBatch',
        exportXlsUrl: '/mission/materialManagement/exportXls',
        importExcelUrl: 'mission/materialManagement/importExcel'
      },
      dictOptions: {},
      superFieldList: [],
      projectName: '',
      projectInfo: undefined
    }
  },
  created() {},
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    initDictConfig() {},
    getCurrentTitle() {
      switch (this.currentTab) {
        case 0:
          return '基本信息/Basic Infomation'
        case 1:
          return '项目合作单位/Project cooperation unit'
        case 2:
          return '项目时间/Project Schedule'
        case 3:
          return '项目资料管理/Project documents'
        case 4:
          return '项目标准/Project standard'
        case 5:
          return '样本规划/Project Sample Plan'
        case 6:
          return '耗材规划/Project supplies Plan'
        default:
          break
      }
    },
    onChange(current) {
      const projectId = this.getParams('id')
      if (!projectId) current = 0
      this.currentTab = current
      this.changeUrl(current)
    },
    prevStep() {
      console.log(this.currentTab)
      if (this.currentTab > 0) {
        this.currentTab -= 1
        this.changeUrl(this.currentTab)
      }
    },
    nextStep() {
      if (this.currentTab < 8) {
        this.currentTab += 1
        this.changeUrl(this.currentTab)
      }
    },
    activeProject (name) {
      this.projectName = name
    },
    finish() {
      this.$bus.$emit('projectEnd')
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
    getProjectInfo (id) {
      queryById({ id: id }).then(res => {
        if (res.success) {
          this.projectInfo = res.result
          const title = '编辑项目-' + this.projectInfo.projectName
          this.$route.meta.title = title
          // this.$set(this.$route.meta, 'title', title)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    changeUrl (step) {
      const projectId = this.$route.query.id
      if (projectId) {
        window.history.replaceState({}, window.document.title, '?id=' + projectId + '&step=' + step)
      }
    }
  },
  mounted() {
    if (this.getParams('step')) {
      this.currentTab = Number(this.getParams('step')) || 0
    }
    if (this.$route.query.id) {
      this.getProjectInfo(this.$route.query.id)
      this.$route.meta.title = '编辑项目'
    } else {
      this.$route.meta.title = '新建项目'
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/less/common.less';
.steps {
  max-width: 1280px;
  margin: 16px auto;
}

.title {
  text-align: center;
  font-size: 24px;
  color: #424242;
  border-top: 1px solid #e8e8e8;
  margin-top: 20px;
  padding-top: 30px;
}
</style>
