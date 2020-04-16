<template>
  <div v-show="isShow" class="editor-contextmenu" :style="styles">
    <ul class="editor-contextmenu__key">
      <li @click="copyHandler">
        <span>复制</span>
      </li>
      <li @click="cutHandler">
        <span>剪切</span>
      </li>
      <li @click="pasteHandler">
        <span>粘贴</span>
      </li>
    </ul>
    <!-- <div>图层切换</div> -->
  </div>
</template>
<script>
import { mitation } from 'src/design/store'
export default {
  name: 'vx-contextmenu',
  props: {
    selectWidget: {
      type: Object,
      default: () => {
        return {
          type: 'canvas',
          id: -1
        }
      }
    },
    top: Number,
    left: Number,
    value: Boolean
  },
  data() {
    return {
      isShow: this.value
    }
  },
  computed: {
    styles() {
      let style = {}
      if (this.left < 0) {
        style.right = Math.abs(this.left) + 'px'
      } else {
        style.left = this.left + 'px'
      }
      if (this.top < 0) {
        style.bottom = Math.abs(this.top) + 'px'
      } else {
        style.top = this.top + 'px'
      }
      return style
    }
  },
  methods: {
    resetSelect() {
      let selectOrg = {
        type: 'canvas',
        id: -1
      }
      mitation.setCurrent(selectOrg)
      //   this.selectWidget = Object.assign({}, selectOrg)
    },
    copyHandler() {
      mitation.copyEvent()
      this.resetSelect()
      this.isShow = false
    },
    cutHandler() {
      mitation.cutEvent()
      this.resetSelect()
      this.isShow = false
    },
    pasteHandler() {
      mitation.pasteEvent()
      this.isShow = false
    }
  },
  watch: {
    value(val) {
      this.$nextTick(() => {
        this.isShow = val
      })
    },
    isShow(val) {
      this.$nextTick(() => {
        this.$emit('input', val)
      })
    }
  }
}
</script>