<template>
  <div class="vx-mobile">
    <VxHead />
    <div class="vx-mobile-content">
      <div class="mobile-center"></div>
    </div>
  </div>
</template>
<script>
const VxHead = () => import('./head')
export default {
  components: {
    VxHead,
  },
}
</script>