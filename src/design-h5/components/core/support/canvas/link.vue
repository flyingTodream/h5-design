<template>
  <div :style="commonStyle" @click.stop="linkHandler">{{element.pluginProps.text}}</div>
</template>
<script>
export default {
  name: 'vx-h5-link',
  props: {
    element: {
      type: Object,
      default: () => {}
    },
    preview: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    linkHandler() {
      if (this.preview) {
        window.location.href = this.element.pluginProps.url
      }
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