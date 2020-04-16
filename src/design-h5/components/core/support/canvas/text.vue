<template>
  <div>
    <div>
      <div v-show="!edit" @dblclick="dblclickHandler" v-html="pluginProps.text"></div>
      <div
        @mousedown.stop="mousedownHandler"
        @input="inputHandler"
        v-click-outside="handleClickOutside"
        style="cursor: text;"
        ref="edit"
        v-show="edit"
        :contenteditable="edit"
        v-html="pluginProps.text"
      ></div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: {
    element: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      edit: false
    }
  },
  mounted() {},
  computed: {
    pluginProps() {
      return this.element.pluginProps
    }
  },
  methods: {
    ...mapActions('editor', ['updateElementText']),
    dblclickHandler(e) {
      this.edit = true
      e.stopPropagation()
    },
    mousedownHandler() {
      if (this.canEdit) {
        e.stopPropagation()
      }
    },
    handleClickOutside(e) {
      this.edit = false
      e.stopPropagation()
    },
    inputHandler() {
      let el = this.$refs.edit
      this.element.commonStyle = {
        ...this.element.commonStyle,
        height: el.offsetHeight,
        width: el.offsetWidth
      }
    }
  },
  watch: {
    edit(val) {
      if (!val) {
        let el = this.$refs.edit

        this.element.pluginProps = {
          ...this.element.pluginProps,
          text: el.innerHTML
        }
      } else {
        let el = this.$refs.edit
        this.$nextTick(() => {
          el.focus()
          if (document.selection) {
            let range = document.body.createTextRange()
            range.moveToElementText(el)
            range.select()
          } else if (window.getSelection) {
            let range = document.createRange()
            range.selectNodeContents(el)
            window.getSelection().removeAllRanges()
            window.getSelection().addRange(range)
          }
        })
      }
    }
  }
}
</script>