<template>
  <div class="editor-toolbar" :style="styles" v-show="isShow">
    <div class="editor-toolbar-content">
      <span class="editor-toolbar__label">缩放</span>
      <span class="editor-toolbar__zoom">
        <el-slider v-model="zoom" :min="5" :max="200" :format-tooltip="formatZoom"></el-slider>
      </span>
      <span @click="okHandler" class="editor-toolbar__ok btn-tip" aria-label="确定">
        <vx-icon name="ok" />
      </span>
      <span @click="cancelHandler" class="editor-toolbar__cancel btn-tip" aria-label="取消">
        <vx-icon name="cancel" />
      </span>
    </div>
  </div>
</template>
<script>
import { getter, mitation } from 'src/design/store'
export default {
  name: 'vx-editor-toolbar',
  computed: {
    zoom: {
      get() {
        return getter.cutZoom()
      },
      set(val) {
        mitation.setCutZoom(val)
      }
    },
    isShow() {
      return getter.cutable()
    },
    styles() {
      if (!this.isShow) return {}
      return {
        top: `${getter.toolbarPos().top - 45}px`,
        left: `${getter.toolbarPos().left}px`
      }
    }
  },
  methods: {
    formatZoom(val) {
      return `${val}%`
    },
    okHandler() {
      mitation.setCutOk()
    },
    cancelHandler() {
      mitation.setCutCancel()
    }
  }
}
</script>