<template>
<page-common :pageConfig="pageConfig" :pageIndex="pageIndex">
 <div class="page-first">

 </div>
</page-common>
</template>

<script>
  import PageCommon from './page-common'
  export default {
    name: 'page-first',
    props: {
      pageIndex: {
        type: Number
      },
      pageConfig: {
        type: Object,
        require: true
      }
    },
    components: {
      PageCommon
    }
  }
</script>
