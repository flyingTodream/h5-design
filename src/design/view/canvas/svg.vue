<template>
  <div
    class="editor-element editor-element-svg"
    @mouseup.left="transfromHandler"
    @mouseover.left="hoverHandler"
    :style="elementStyles"
  >
    <div class="element-main" v-html="html"></div>
    <i class="border-before"></i>
  </div>
</template>
<script>
import { log } from 'src/design/utils'
export default {
  name: 'vx-editor-svg',
  props: {
    data: {},
    zoom: {
      type: Number,
      default: 0
    },
    index: Number,
    parent: {
      type: Number,
      default: -1
    },
    cutable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      svg: ''
    }
  },
  computed: {
    elementStyles() {
      let transform = this.data.transform || { a: 0, b: 0, c: 0, tx: 0, ty: 0 }
      return {
        opacity: this.data.opacity,
        transform: `matrix(${transform.a},${transform.b},${transform.c},${transform.d},${transform.tx},${transform.ty})`,
        width: this.data.width * this.zoom + 'px',
        height: this.data.height * this.zoom + 'px',
        top: this.data.top * this.zoom + 'px',
        left: this.data.left * this.zoom + 'px',
        'z-index': `${this.index}`
      }
    },
    mainStyles() {
      return {
        borderRadius: this.data.borderRadius,
        overflow: this.data.hidden ? 'hidden' : 'visible',
        opacity: this.data.opacity,
        padding: this.data.padding.join('px ')
      }
    },
    imageStyles() {
      let clip = this.data.clip || {}
      return {
        position: 'absolute',
        top: (clip.top || 0) + 'px',
        left: (clip.left || 0) + 'px',
        width: (clip.width || this.data.width) * this.zoom + 'px',
        height: (clip.height || this.data.height) * this.zoom + 'px'
      }
    },
    html() {
      let html = this.svg
      if (this.data.colors.length >= 0) {
        this.data.colors.forEach((color, i) => {
          html = html.replace(`{{colors[${i}]}}`, color)
        })
      }

      return html
    }
  },
  mounted() {
    this.getSvgHandler(this.data.url)
  },
  methods: {
    hoverHandler() {
      this.$emit('event', {
        index: this.index,
        type: 'hover',
        editable: false,
        parent: this.parent
      })
    },
    transfromHandler() {
      this.$emit('event', {
        index: this.index,
        type: 'transfrom',
        editable: false,
        parent: this.parent
      })
    },
    getSvgHandler(url) {
      this.$axios
        .get(url, {})
        .then(data => {
          this.svg = data
        })
        .catch(err => {
          log.danger(err)
        })
    }
  }
}
</script>