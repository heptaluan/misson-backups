<template>
  <a-select style='width: 240px' placeholder='please pick one'>
    <!--            allowClear-->
    <!--            show-search-->
    <!--            :value='channelValue'-->
    <!--            :default-active-first-option='false'-->
    <!--            :filter-option='false'-->
    <!--            :not-found-content='null'-->
    <!--            @search='handleChannelSearch'-->
    <!--            @change='handleChannelChange'-->
    <div slot='dropdownRender' slot-scope='menu'>
      <v-nodes :vnodes='menu' />
      <a-divider style='margin: 4px 0;' />
      <div class='selectorP' @mousedown='e => e.preventDefault()'>
        <a-pagination size='small' :total='listObj.total' :defaultPageSize='listObj.size'
                      :defaultCurrent="listObj['current']" showLessItems @change='onChange' />
      </div>
    </div>
    <a-select-option v-for="item in listObj['records']" :key='item[dataFormat.id]' :value='item[dataFormat.value]'
                     @click='showSelectData(item)'>
      {{ item[dataFormat.showTxt] }}
    </a-select-option>
  </a-select>
</template>

<style lang='less' scoped>
.selectorP {
  .ant-pagination {
    padding-bottom: 4px;
    display: flex;
    justify-content: center;
  }
}
</style>

<script>
import { getDistributorAllList } from '@api/product/index'
import { getOrderImportTask, getproductOrderOrderUserView } from '../../api/order'

export default {
  name: 'SelectorFilter',
  props: ['dataFormat'],
  data() {
    return {
      visible: false,
      parentModel: undefined,
      channelValue: undefined,
      distributorList: [],
      listObj: {}
    }
  },
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  created() {
  },
  methods: {
    onChange(page, pageSize) {
      // debugger
      const pageData = {
        pageNo: page,
        pageSize: pageSize
      }
      this.loadTestData(pageData)
    },
    showSelectData(selectedData) {
      console.log('selected data: ', selectedData)
    },
    show() {
      this.visible = true
    },
    channelFetch(value, callback) {
      let timeout
      let currentValue

      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      currentValue = value

      function fake() {
        const that = this
        getDistributorAllList({
          departName: value != null ? '*' + value + '*' : undefined
        }).then(res => {
          if (res.success) {
            that.distributorList = res.result
            if (currentValue === value) {
              const result = res.result
              const data = []
              result.forEach(r => {
                data.push({
                  key: r.id,
                  departNameAbbr: r.departNameAbbr,
                  departName: r.departName,
                  id: r.id
                })
              })
              callback(data)
            }
          } else {
            console.log(res.message)
          }
        })
      }

      timeout = setTimeout(fake, 300)
    },
    handleChannelSearch(value) {
      this.channelFetch(value, data => (this.listObj = data))
    },
    handleChannelChange(value) {
      this.channelValue = value
      this.channelFetch(value, data => (this.listObj = data))
    },
    loadDistributorList(value) {
      const that = this
      getDistributorAllList({
        departName: value != null ? '*' + value + '*' : undefined
      }).then(res => {
        if (res.success) {
          that.distributorList = res.result
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    loadTestData(value) {
      getOrderImportTask(value).then(res => {
        // console.log(res)
        this.listObj = res.result
      })
    }
  },
  mounted() {
    this.loadDistributorList()
    this.loadTestData()
  }
  // watch: {
  //   dataFormat: function (newVal,oldVal) {
  //     console.log('n: ', newVal, ', o: ', oldVal)
  //   }
  // }
}
</script>

