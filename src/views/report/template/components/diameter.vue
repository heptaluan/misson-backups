<template>
 <div class="diameter">
   <div class="diameter-item" v-for="(item, index) in diameterList" :key="index" :class="{'active': isActive(item)}">
     <img :src="item.image" class="diameter-item-image">
     <p v-html="item.size" class="text-center text-Calibri"></p>
     <p v-html="item.text" class="text-center"></p>
   </div>
 </div>
</template>

<script>
export default {
  name: 'diameter',
  props: {
    diameter: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      diameterList: [{
        image: require('../resource/lung-small.png'),
        size: '<5mm',
        text: '微小结节',
        range: [0, 5]
      }, {
        image: require('../resource/lung-xs.png'),
        size: '5mm～10mm',
        text: '小结节',
        range: [5, 10]
      }, {
        image: require('../resource/lung-md.png'),
        size: '10mm～3cm',
        text: '结节',
        range: [10, 30]
      },{
        image: require('../resource/lung-large.png'),
        size: '>3cm',
        text: '肿块',
        range: [30, 100]
      },]
    }
  },
  methods: {
    isActive(item) {
      let bActive = false
      const diameter = 1 * this.diameter
      if(diameter >= item.range[0] && diameter < item.range[1]) {
        bActive = true
      }
      return bActive
    }
  }
}
</script>
<style lang="less">
  .diameter {
    display: flex;
    &-item {
      flex: 1;
      border-radius: 5px;
      border: 2px solid #cccccc;
      padding: 0.8cm 0.2cm;
      margin-left: 0.2cm;
      >p {
        line-height: 20px;
        font-size: 12px;
        font-weight: bold;
      }
      &.active {
        border-color: #dc5f0d;
      }
      &-image {
        width: 1.2cm;
        height: 1.2cm;
        margin: 0.1cm 0.4cm 0.6cm;
      }
    }
  }
</style>
