<template>
  <a-card :bordered="false">
    <a-steps class="steps" :current="currentTab">
      <a-step title="申请人信息" />
      <a-step title="检测项目" />
      <a-step title="临床信息" />
    </a-steps>
    <div class="content">
      <base-info ref="stepOne" :order="form" v-if="currentTab === 0" @nextStep="nextStep" />
      <order-info ref="stepTwo" :order="form" v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep" />
      <clinical-info ref="stepThree" :order="form" v-if="currentTab === 2" @prevStep="prevStep" @finish="finish" />
    </div>
  </a-card>
</template>

<script>

import BaseInfo from './modules/baseInfo'
import ClinicalInfo from './modules/clinicalInfo'
import OrderInfo from './modules/orderInfo'

export default {
  name: 'AddNewOrder',
  components: {
    BaseInfo,
    ClinicalInfo,
    OrderInfo
  },
  data() {
    return {
      currentTab: 0,
      form: {}
    }
  },
  methods: {
    // handler
    nextStep(data) {
      if (this.currentTab < 2) {
        this.currentTab += 1
      }
      if (data) {
        this.form.id = data
      }
      this.$nextTick(type => {
        switch (type) {
          case 0:
            this.$refs.stepTwo.initForm()
            break
          case 1:
            this.$refs.stepThree.initForm()
          default:
            break
        }
      })
    },
    prevStep(type) {
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
      this.$nextTick(type => {
        switch (type) {
          case 1:
            this.$refs.stepOne.initForm()
            break
          case 2:
            this.$refs.stepTwo.initForm()
          default:
            break
        }
      })
    },
    finish() {
      this.$router.push({
        path: '/order/orderList'
      })
    },
    add() {
      this.form = {}
      // this.$bus.$emit('init-order-info')
    },
    edit(record) {
      this.form = {
        ...record
      }
      this.currentTab = record.lastEditStep + 1
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler: function(val, oldVal) {
        if (this.$route.query.orderId) {
          this.$nextTick(() => {
            this.currentTab = Number(this.$route.query.currentTab) ? Number(this.$route.query.currentTab) : 0
            history.pushState({}, '', `${this.$route.path}?orderId=${this.$route.query.orderId}`)
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.steps {
  max-width: 750px;
  margin: 16px auto;
}
</style>
