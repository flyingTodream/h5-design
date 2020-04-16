<template>
  <div
    class="editor-image-cut"
    v-show="cutable"
    :style="styles"
    ref="cut"
    @mousedown.stop="mousedownHandler"
  >
    <img class="editor-image-cut-mask" :src="widget.url" :style="imageStyles" />
    <div class="editor-image-cut-inner" ref="inner" :style="innerStyles">
      <img :src="widget.url" :style="innerImageStyles" style="position: relative;" />
      <div class="editor-image-cut-grid" :class="{active: dragging}">
        <i class="editor-cut-grid-x1"></i>
        <i class="editor-cut-grid-x2"></i>
        <i class="editor-cut-grid-y1"></i>
        <i class="editor-cut-grid-y2"></i>
      </div>
    </div>
  </div>
</template>
<script>
import { getter, mitation } from 'src/design/store'
export default {
  name: 'vx-image-cut',
  data() {
    return {
      dragging: false,
      l: 0,
      t: 0
    }
  },
  computed: {
    zoom() {
      return getter.zoom()
    },
    widget() {
      return getter.cutImage()
    },
    cutZoom() {
      return getter.cutZoom() / 100
    },
    cutable() {
      return getter.cutable()
    },
    styles() {
      let style = {}
      style.left = `${this.widget.l * this.zoom + this.widget.left}px`
      style.top = `${this.widget.t * this.zoom + this.widget.top}px`
      style.width = `${this.widget.width * this.cutZoom * this.zoom || 0}px`
      style.height = `${this.widget.height * this.cutZoom * this.zoom || 0}px`
      return style
    },
    innerStyles() {
      let style = {}
      style.left = `${-this.widget.left}px`
      style.top = `${-this.widget.top}px`
      style.width = `${this.widget.w * this.zoom || 0}px`
      style.height = `${this.widget.h * this.zoom || 0}px`
      return style
    },
    imageStyles() {
      let style = {}
      style.width = `${this.widget.width * this.cutZoom * this.zoom || 0}px`
      style.height = `${this.widget.height * this.cutZoom * this.zoom || 0}px`
      return style
    },
    innerImageStyles() {
      let style = {}
      style.left = `${this.widget.left}px`
      style.top = `${this.widget.top}px`
      style.width = `${this.widget.width * this.cutZoom * this.zoom || 0}px`
      style.height = `${this.widget.height * this.cutZoom * this.zoom || 0}px`
      return style
    },
    gridStyles() {
      let style = {}
      style.left = `${this.widget.left}px`
      style.top = `${this.widget.top}px`
      return style
    }
  },
  mounted() {
    window.addEventListener('mouseup', () => {
      this.dragging = false
      window.removeEventListener('mousemove', this.mouseMoveHandler)
    })
  },
  methods: {
    mousedownHandler() {
      this.dragging = true
      this.l = event.clientX - event.target.offsetLeft
      this.t = event.clientY - event.target.offsetTop
      window.addEventListener('mousemove', this.mouseMoveHandler)
    },
    mouseMoveHandler(event) {
      if (this.dragging) {
        let left = this.widget.left
        let top = this.widget.top
        left = event.clientX - this.l
        top = event.clientY - this.t
        mitation.setCutImageInfo({
          left: left,
          top: top
        })
      }
    }
  }
}
</script>