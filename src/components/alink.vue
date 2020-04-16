<!-- —————————————↓HTML————————分界线———————————————————————— -->
<template lang="pug">
a.alink(@click.stop="goPage(id)")
  slot
</template>

<!-- ——————————————↓JS—————————分界线———————————————————————— -->
<script>
//import XXX from './components/XXX'x
export default {
  name: 'alink',
  props: {
    id: {
      type: Number,
      default: null
    }
  },
  // data() {
  //   // return {
  //   //   msg: 'this is from alink.vue'
  //   // }
  // },
  methods: {
    goPage(id) {
      const { href } = this.$router.resolve({
        path: '/mall/preview/' + id,
        query: {
          // true 从模板中心的模板 进入预览页 显示预览页面包屑模板中心
          whereFrom: true
        }
      })
      window.open(href, '_blank')
    }
  }
}
</script>
