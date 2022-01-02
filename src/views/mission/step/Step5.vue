<template>
  <div>
    <a-form-model
      style="max-width: 1080px; margin: 40px auto 0;"
      ref="ruleForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <div class="edit-wrap">
        <div class="title">项目纳入标准/Project inclusion criteria</div>
        <div class="edit-box">
          <Editor :content.sync="inclusionContent" />
        </div>
      </div>

      <div class="edit-wrap">
        <div class="title">项目排除标准/Project Exclusion criteria</div>
        <div class="edit-box">
          <Editor :content.sync="exclusionContent" />
        </div>
      </div>
      <div class="btn-group">
        <a-button @click="save">保存</a-button>
        <a-button type="primary" class="prev-btn" @click="prevStep">上一步</a-button>
        <a-button type="primary" @click="nextStep">下一步</a-button>
      </div>
    </a-form-model>
  </div>
</template>

<script>
import Editor from './Editor'
import { queryById, putProjectStep } from 'src/api/mission/project'

export default {
  name: 'Step5',
  components: {
    Editor
  },
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
      inclusionContent: '',
      exclusionContent: ''
    }
  },
  methods: {
    prevStep() {
      this.$emit('prevStep')
    },
    nextStep() {
      const cb = ()=> this.$emit('nextStep')
      this.save(cb)
      // this.$emit('nextStep')
      // this.$refs.ruleForm.validate(valid => {
      //   if (valid) {
      //     this.$emit('nextStep')
      //   } else {
      //     return false
      //   }
      // })
    },
    loadData() {
      const that = this
      queryById({
        id: this.projectId
      }).then(res => {
        if (res.success) {
          this.exclusionContent = res.result.excludeStandard ? res.result.excludeStandard : ''
          this.inclusionContent = res.result.followingInclusionStandard ? res.result.followingInclusionStandard : ''
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
    save(cb) {
      const that = this
      const step = 'Standards'
      const valid = this.validate()
      if (valid) {
        const postData = {
          id: this.projectId,
          excludeStandard: this.exclusionContent,
          followingInclusionStandard: this.inclusionContent
        }
        putProjectStep(step, postData)
          .then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.$emit('ok')
              if (typeof cb === 'function') cb()
            } else {
              that.$message.warning(res.message)
            }
          })
          .finally(() => {
            that.confirmLoading = false
          })
      }
    },
    // 暂时不用验证
    validate () {
      // if (this.exclusionContent)
      return true
    }
  },
  mounted() {
    this.projectId = this.getParams('id')
    this.loadData()
  }
}
</script>

<style lang="less" scoped>
.btn-group {
  text-align: right;

  .prev-btn {
    margin: 0 15px;
  }
}

.edit-wrap {
  margin-bottom: 40px;

  .title {
    font-size: 16px;
    color: #424242;
    margin-bottom: 20px;
  }
}
</style>
