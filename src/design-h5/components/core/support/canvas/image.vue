<template>
  <img style="height:100%;width:100%" :src="pluginProps.imgSrc" />
</template>
<script>
export default {
  props: {
    element: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    // console.log(this.element)
  },
  computed: {
    pluginProps() {
      return this.element.pluginProps
    }
  }
}
</script>