
<template>
  <div class="vx-spin vx-spin-lg vx-spin-spinning">
    <span class="vx-spin-dot vx-spin-dot-spin">
      <i></i>
      <i></i>
      <i></i>
      <i></i>
    </span>
    <span class="vx-loading-text">{{msg}}...</span>
  </div>
</template>
<script>
export default {
  name: 'vx-loading',
  props: {
    msg: {
      type: String,
      default: '正在加载'
    }
  }
}
</script>