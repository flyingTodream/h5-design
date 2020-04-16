<template>
  <div v-if="!showWatermark" :style="styles" class="editor-watermark">
    <img :src="url" ref="image" />
  </div>
</template>
<script>
import { getter } from 'src/design/store'
export default {
  name: 'vx-water-mark',
  data() {
    return {
      url: require('src/assets/image/waterMark.png')
    }
  },
  computed: {
    showWatermark() {
      return getter.global().showWatermark
    },
    zoom() {
      return getter.global().zoom
    },
    w() {
      return getter.layout().width
    },
    h() {
      return getter.layout().height
    },
    styles() {
      let zoom = 0
      if (this.w >= this.h) {
        zoom = this.h / this.w / 3
      } else {
        zoom = this.w / this.h / 3
      }
      return {
        width: `${642 * zoom}px`,
        right: `${10}px`,
        height: 'auto',
        bottom: `${0}px`,
        'z-index': `3000`
      }
    }
  }
}
</script>