<template>
  <div class="editor-selector">
    <div class="editor-selector-content" ref="selector" v-if="selected" :style="styles"></div>
  </div>
</template>
<script>
import { getter, mitation } from 'src/design/store'
export default {
  name: 'vx-editor-selector',
  data() {
    return {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      selected: false,
      l: 0,
      t: 0,

      canvasT: 0,
      canvasL: 0,
      canvasW: 0,
      canvasH: 0,

      selectItem: []
    }
  },
  computed: {
    zoom() {
      return getter.zoom()
    },
    styles() {
      let t = this.top
      let l = this.left
      let w = this.width
      let h = this.height
      if (this.width < 0) {
        l = this.left + this.width
        w = Math.abs(this.width)
      }
      if (this.height < 0) {
        t = this.top + this.height
        h = Math.abs(this.height)
      }
      return {
        top: t + 'px',
        left: l + 'px',
        width: w + 'px',
        height: h + 'px'
      }
    },
    selectedArea() {
      let t = this.top
      let l = this.left
      let w = this.width
      let h = this.height
      if (this.width < 0) {
        l = this.left + this.width
        w = Math.abs(this.width)
      }
      if (this.height < 0) {
        t = this.top + this.height
        h = Math.abs(this.height)
      }
      return {
        l: l - this.canvasL,
        t: t - this.canvasT,
        b: t + h - this.canvasT,
        r: l + w - this.canvasL
      }
    }
  },
  mounted() {
    // document.querySelector('#js-container').addEventListener('mousedown', this.selected_mousedown_Handler, false);
    // // window.addEventListener('mouseup', this.selected_mouseup_Handler, false);
  },
  methods: {
    initStyle() {
      this.top = 0
      this.left = 0
      this.width = 0
      this.height = 0
    },
    selected_mousedown_Handler(e) {
      let pos = document.querySelector('#js-container').getBoundingClientRect()
      pos.x && (this.l = pos.x)
      pos.y && (this.t = pos.y)
      let canvasSize = document
        .querySelector('#js-container .editor-canvas')
        .getBoundingClientRect()
      canvasSize.left && (this.canvasL = canvasSize.left - this.l)
      canvasSize.top && (this.canvasT = canvasSize.top - this.t)
      this.initStyle()
      this.left = e.pageX - this.l
      this.top = e.pageY - this.t
      this.selectItem = []
      window.addEventListener('mousemove', this.selected_mousemove_Handler)
    },
    selected_mousemove_Handler(e) {
      e.preventDefault()
      mitation.setMulSelected(true)
      this.selected = true
      this.height = e.pageY - this.t - this.top
      this.width = e.pageX - this.l - this.left
      this.selectElementHandler()
    },
    selected_mouseup_Handler() {
      window.removeEventListener('mousemove', this.selected_mousemove_Handler)
      this.selected = false
      mitation.setMulSelected(false)
      mitation.setSelectedItem(this.selectItem)
      this.initStyle()
    },
    selectElementHandler() {
      getter.layout().elements.forEach((item, i) => {
        let item_t = item.top * this.zoom,
          item_r = (item.left + item.width) * this.zoom,
          item_b = (item.top + item.height) * this.zoom,
          item_l = item.left * this.zoom
        if (
          item_r < this.selectedArea.r &&
          item_l > this.selectedArea.l &&
          item_b < this.selectedArea.b &&
          item_t > this.selectedArea.t
        ) {
          !this.selectItem.includes(i) && this.selectItem.push(i)
        } else {
          let index = this.selectItem.indexOf(i)
          if (index !== -1) {
            this.selectItem.splice(index, 1)
          }
        }
      })
      mitation.setSelectedItem(this.selectItem)
    }
  }
}
</script>