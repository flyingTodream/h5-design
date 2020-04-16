<template>
  <div class="app" id="app">
    <VxHead />
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
const VxHead = () => import('./head')
export default {
  name: 'vx-vxMall',
  components: {
    VxHead
  }
}
</script>
<style scoped>
#app {
  width: 100%;
  min-width: 1200px;
  overflow-x: hidden;
}
</style>


