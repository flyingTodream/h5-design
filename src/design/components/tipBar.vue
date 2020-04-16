<template>
  <div class="editor-tip-bar">
    <div class="editor-slot-tipbar__watermark">
      <el-switch class="watermark-tips__switch" @change="changeWatermask" v-model="watermark" />
      <span
        @click.self="changeWatermask"
        class="watermark-tips__content"
      >{{watermark?'已':'点击'}}开启模板无水印编辑</span>
    </div>
  </div>
</template>
<script>
import { mitation, getter } from 'src/design/store'
export default {
  name: 'vx-editor-tip-bar',
  data() {
    return {
      watermark: getter.global().showWatermark
    }
  },
  methods: {
    changeWatermask() {
      mitation.setWaterMask(this.watermark)
    }
  }
}
</script>