import { getDistributorAllList } from '@api/product/index'


export const selectorFilterMixin = {
  data() {
    return {}
  },
  created() {
  },
  methods: {
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
      this.channelFetch(value, data => (this.distributorList = data))
    },
    handleChannelChange(value) {
      this.channelValue = value
      const that = this
      this.channelFetch(value, data => {
        this.distributorList = data
        if (this.queryParam != null && this.queryParam.sendHospital != null) {
          this.$set(this.queryParam, 'sendHospital', undefined) // clean the previous data if the sellUser or sellUserId changed
        }
        // that.loadHospitalList(value ? value : undefined)
      })
    },
    loadDistributorList(value, sellUser) {
      const that = this
      let data = {}
      if (sellUser) {
        // console.log('sell')
        data = {
          sellUser: sellUser != null ? '*' + sellUser + '*' : undefined
        }
      } else {
        // console.log('distribute')
        data = {
          departName: value != null ? '*' + value + '*' : undefined
        }
      }
      getDistributorAllList(data).then(res => {
        if (res.success) {
          that.distributorList = res.result
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    // loadHospitalList(distributor) {
    loadHospitalList() {
      let data = null
      // if (distributor) {
      //   data = {
      //     relateAccess: distributor != null ? '*' + distributor + '*' : undefined,
      //     pageNo: 1,
      //     pageSize: 9999
      //   }
      // } else {
      //   data = {
      //     pageNo: 1,
      //     pageSize: 9999
      //   }
      // }
      data = { orgCategory: 4000 }
      getDistributorAllList(data).then(res => {
        if (res.success) {
          this.hospitalList = res.result
        } else {
          this.$message.warning(res.message)
        }
      })
    }
  }
}