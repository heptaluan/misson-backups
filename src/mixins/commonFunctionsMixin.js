import { checkAbbrUnique, getRegionAll } from '../api/api'


export const commonFunctionsMixin = {
  data() {
    return {
      // originalRegion: []
    }
  },
  created() {
  },
  methods: {
    checkAbbr(val, modelForm) {
      const params = {
        abbr: val.toUpperCase(),
        catalog: this.selectType
      }
      checkAbbrUnique(params).then((res) => {
        if (res.success) {
          console.log('good')
        } else {
          this.$message.warning(`简称已存在`)
          modelForm.departNameAbbr = undefined
        }
      })
    },
    // initRegion() {
    //   getRegionAll().then(res => {
    //     let tempRegion = res.result
    //     for (let i = 0; i < tempRegion.length; i++) {
    //       if (tempRegion[i] != null && tempRegion[i].level == 1) {
    //         tempRegion[i].children = []
    //         this.reFormatRegionData(tempRegion[i], false)
    //         this.originalRegion.push(tempRegion[i])
    //         tempRegion[i] = null
    //         for (let j = i + 1; j < tempRegion.length; j++) {
    //           if (tempRegion[j] != null && this.originalRegion.at(-1).code == tempRegion[j].pcode && tempRegion[j].level == 2) {
    //             tempRegion[j].children = []
    //             this.reFormatRegionData(tempRegion[j], false)
    //             this.originalRegion.at(-1).children.push(tempRegion[j])
    //             tempRegion[j] = null
    //             for (let k = j + 1; k < tempRegion.length; k++) {
    //               if (tempRegion[k] != null && this.originalRegion.at(-1).children.at(-1).code == tempRegion[k].pcode && tempRegion[k].level == 3) {
    //                 this.reFormatRegionData(tempRegion[k], true)
    //                 this.originalRegion.at(-1).children.at(-1).children.push(tempRegion[k])
    //                 tempRegion[k] = null
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //     console.log('extra region: ', this.originalRegion)
    //   })
    // },
    // reFormatRegionData(item, isLeaf) {
    //   if (!isLeaf) {
    //     item.isLeaf = false
    //     item.label = item.name
    //     item.value = item.code
    //   } else {
    //     item.label = item.name
    //     item.value = item.code
    //   }
    // },
  }
}