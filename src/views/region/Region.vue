<template>
  <div>
    <a-cascader :options='originalRegion' placeholder='请选择地区'
                change-on-select :disabled='disabled'
                @change='onChange'
                v-model='form' :value='form' />
  </div>
</template>

<script>
import { getRegionAll, getRegion } from '@/api/api'

export default {
  name: 'Region',
  data() {
    return {
      level: 1,
      form: null,
      originalRegion: [],
      region: null,
      finalZone: null
    }
  },
  props: {
    value: {
      type: Array
    },
    // regionData: {
    //   type: Array
    // },
    disabled: {
      type: Boolean
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  methods: {
    initRegion() {
      getRegionAll().then(res => {
        let tempRegion = res.result
        for (let i = 0; i < tempRegion.length; i++) {
          if (tempRegion[i] != null && tempRegion[i].level == 1) {
            tempRegion[i].children = []
            this.reFormatRegionData(tempRegion[i], false)
            this.originalRegion.push(tempRegion[i])
            tempRegion[i] = null
            for (let j = i + 1; j < tempRegion.length; j++) {
              if (tempRegion[j] != null && this.originalRegion.at(-1).code == tempRegion[j].pcode && tempRegion[j].level == 2) {
                tempRegion[j].children = []
                this.reFormatRegionData(tempRegion[j], false)
                this.originalRegion.at(-1).children.push(tempRegion[j])
                tempRegion[j] = null
                for (let k = j + 1; k < tempRegion.length; k++) {
                  if (tempRegion[k] != null && this.originalRegion.at(-1).children.at(-1).code == tempRegion[k].pcode && tempRegion[k].level == 3) {
                    this.reFormatRegionData(tempRegion[k], true)
                    this.originalRegion.at(-1).children.at(-1).children.push(tempRegion[k])
                    tempRegion[k] = null
                  }
                }
              }
            }
          }
        }
        // console.log('o', this.originalRegion)
      })
    },
    reFormatRegionData(item, isLeaf) {
      if (!isLeaf) {
        item.isLeaf = false
        item.label = item.name
        item.value = item.code
      } else {
        item.label = item.name
        item.value = item.code
      }
    },
    // **************************************
    //  Observe the value in async
    // **************************************
    // loadRegion(level, pCode) {
    //   console.log('l: ', level, 'p_c:', pCode)
    //   const params = {level, pCode, pageSize: 100}
    //    return getRegion(params).then(res => {
    //      let tempRegion = null
    //      tempRegion = res.result.records
    //      tempRegion.forEach(ele => {
    //       ele.isLeaf = false
    //       ele.label = ele.name
    //       ele.value = ele.code
    //     })
    //      return Promise.resolve(tempRegion)
    //   })
    // },
    onChange(value) {
      // let data = {level: null, code: null}
      // data.level = value.length
      // data.code = value[value.length-1]
      // this.$emit('change', data)
      this.$emit('change', value)
    }
    // loadData(selectedOptions) {
    //   const targetOption = selectedOptions[selectedOptions.length - 1];
    //   // targetOption.loading = true;
    //   this.loadRegion(targetOption.level + 1, targetOption.code).then(res => {
    //
    //     console.log('level: ', targetOption.level, ', name: ', targetOption.name, ', children: ', res)
    //     // targetOption.loading = false;
    //     if (res.length > 0) {
    //       targetOption.children = res
    //       this.region = [...this.region];
    //     }
    //     // console.log(this.form)
    //   })
    // },
  },
  mounted() {
    if (this.originalRegion.length <= 0) {
      this.initRegion()
    }
    // this.loadRegion(1).then(res => {
    //   // console.log('start: ',res);
    //   this.region = res
    // })
    // console.log(this.value)
    if (this.value) {
      this.form = this.value
      // this.form= ['北京市','市辖区','东城区']
    }
  },
  watch: {
    value(n, o) {
      this.form = n
    }
  }
}
</script>

<style scoped>

</style>