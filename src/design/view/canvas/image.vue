<template>
  <div
    class="editor-element editor-element-image"
    @mousedown.left="transfromHandler"
    :style="elementStyles"
  >
    <div class="element-main" :style="mainStyles">
      <img draggable="false" v-show="!cutable" :src="data.url" :style="imageStyles" />
      <!-- <canvas ref="canvas" v-show="!cutable" :width="width" :height="height"></canvas> -->
    </div>
    <i class="border-before"></i>
  </div>
</template>
<script>
export default {
  name: 'vx-editor-image',
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
  computed: {
    elementStyles() {
      let transform = this.data.transform || { a: 0, b: 0, c: 0, tx: 0, ty: 0 }
      return {
        opacity: this.data.opacity,
        transform: `matrix(${transform.a},${transform.b},${transform.c},${transform.d},${transform.tx},${transform.ty})`,
        width: this.data.width * this.zoom + 'px',
        height: this.data.height * this.zoom + 'px',
        top: this.data.top * this.zoom + 'px',
        left: this.data.left * this.zoom + 'px'
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
      let style = {
        position: 'absolute',
        top: (clip.top || 0) + 'px',
        left: (clip.left || 0) + 'px',
        width: (clip.width || this.data.width) * this.zoom + 'px',
        height: (clip.height || this.data.height) * this.zoom + 'px',
        display: 'none',
      }
      return style
    }
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
        editable: true,
        parent: this.parent
      })
    }
  }
}
</script>