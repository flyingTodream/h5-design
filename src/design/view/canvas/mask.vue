<template>
  <div
    class="editor-element editor-element-mask"
    @mouseup.left="transfromHandler"
    :style="elementStyles"
  >
    <div class="element-main" :style="mainStyles">
      <img :src="data.url" :style="imageStyles" />
    </div>
    <i class="border-before"></i>
  </div>
</template>
<script>
export default {
  name: 'vx-editor-mask',
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
    }
  },
  computed: {
    elementStyles() {
      let transform = this.data.transform || { a: 0, b: 0, c: 0, tx: 0, ty: 0 }
      return {
        opacity: this.data.opacity,
        transform: `matrix(${transform.a},${transform.b},${transform.c},${transform.d},${transform.tx},${transform.ty})`,
        width: this.data.originWidth * this.zoom + 'px',
        height: this.data.originHeight * this.zoom + 'px',
        top: this.data.top * this.zoom + 'px',
        left: this.data.left * this.zoom + 'px'
      }
    },
    mainStyles() {
      return {
        borderRadius: this.data.borderRadius,
        overflow: this.data.hidden ? 'hidden' : 'visible',
        opacity: 0,
        padding: this.data.padding.join('px ')
      }
    },
    imageStyles() {
      return {
        display: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        width: this.data.width * this.zoom + 'px',
        height: this.data.height * this.zoom + 'px'
      }
    }
  },
  methods: {
    // hoverHandler(){
    //     this.$emit('hover', this.index);
    // },
    // transfromHandler(){
    //     this.$emit('transfrom', this.index);
    // },
    hoverHandler() {
      // this.$emit('hover', this.index);
      this.$emit('event', {
        index: this.index,
        type: 'hover',
        parent: this.parent
        // editable: false,
      })
    },
    transfromHandler() {
      // this.$emit('transfrom', this.index);
      this.$emit('event', {
        index: this.index,
        type: 'transfrom',
        parent: this.parent
        // editable: false,
      })
    }
    // editableHandler(){
    //     this.editable = true;
    //     this.$emit('event', {
    //         index: this.index,
    //         type: 'transfrom',
    //         editable: true,
    //     })
    // }
  }
}
</script>