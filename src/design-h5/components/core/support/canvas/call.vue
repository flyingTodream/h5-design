<template>
  <a :href="`tel:${element.pluginProps.phone}`" :style="commonStyle">一键拨号</a>
</template>
<script>
export default {
  name: 'vx-h5-call',
  props: {
    element: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    commonStyle() {
      return {
        backgroundColor: `${this.element.commonStyle.backgroundColor}`,
        color: `${this.element.commonStyle.color}`,
        fontSize: `${this.element.commonStyle.fontSize}px`,
        height: `100%`,
        textAlign: `${this.element.commonStyle.textAlign}`,
        width: `100%`,
        zIndex: `${this.element.commonStyle.zindex}`,
        fontWeight: `${this.element.commonStyle.fontWeight}`,
        lineHeight: `${this.element.commonStyle.height}px`,
        textDecoration: 'none'
      }
    }
  }
}
</script>