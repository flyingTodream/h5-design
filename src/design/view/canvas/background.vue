<template>
  <div class="editor-background" :style="backStyle" @click.stop="selectHandler">
    <div class="editor-background__main" :style="mainStyle">
      <img v-if="bgImg" :src="bgImg" :style="imgStyle" />
    </div>
  </div>
</template>
<script>
import { getter } from 'src/design/store'
export default {
  name: 'vx-editor-bg',
  props: {
    zoom: {
      type: Number
      // default: getter.zoom()
    }
  },
  computed: {
    w() {
      return getter.layout().width * getter.global().zoom
    },
    h() {
      return getter.layout().height * getter.global().zoom
    },
    widget() {
      return getter.cutImage()
    },
    cutZoom() {
      return getter.cutZoom() / 100
    },
    layoutZoom() {
      return getter.zoom()
    },
    bgColor() {
      return getter.layout().backgroundColor
    },
    bgImg() {
      return getter.layout().backgroundImage
    },
    bgImgInfo() {
      return getter.layout().backgroundImageInfo
    },
    bgSize() {
      return getter.layout().backgroundSize
    },
    bgPosition() {
      return getter.layout().backgroundPosition
    },
    mainStyle() {
      let style = {}
      if (this.bgImgInfo) {
        style.left = `${this.bgImgInfo.left}px`
        style.top = `${this.bgImgInfo.top}px`
        style.width = `${this.bgImgInfo.width * this.cutZoom * this.zoom}px`  
        style.height = `${this.bgImgInfo.height * this.cutZoom * this.zoom}px`
        // style.width = `${this.bgImgInfo.width}px`
        // style.height = `${this.bgImgInfo.height}px`
      }

      return style 
    },
    backStyle() {
      let style = {}
      style.backgroundColor = this.bgColor
      let transform = this.bgImgInfo
        ? this.bgImgInfo.transform || { a: 0, b: 0, c: 0, tx: 0, ty: 0 }
        : { a: 0, b: 0, c: 0, tx: 0, ty: 0 }
      style.transform = `matrix(${transform.a},${transform.b},${transform.c},${transform.d},${transform.tx},${transform.ty})`

      return style
    },
    imgStyle() {
      // let w = this.w+'px';
      // let h = this.h+'px';
      // if(this.bgSize && Array.isArray(this.bgSize)){
      //     w = this.bgSize[0] + 'px';
      //     h = this.bgSize[1] + 'px';
      // }
      let style = {
        // width: w,
        // height: h,
        // width: this.bgImgInfo.width + 'px',
        // height: this.bgImgInfo.height + 'px',
        opacity: this.bgImgInfo.opacity
      }
      // let _w = this.w / this.bgImgInfo.width
      // let _h = this.h / this.bgImgInfo.height
      // if (_w > _h) {
      //   style.width = `${this.w}px`
      //   style.height = `${this.bgImgInfo.height * _w}px`
      // } else {
      //   style.height = `${this.h}px`
      //   style.width = `${this.bgImgInfo.width * _h}px`
      // }
      // let scale = (this.bgImgInfo.width) / (this.bgImgInfo.height)
      console.log(this.bgImgInfo)
      console.log(state.cutInfo.zoom)


      style.width = `${this.bgImgInfo.width * this.cutZoom * this.zoom * state.cutInfo.zoom / 100}px`
      style.height = `${this.bgImgInfo.height * this.cutZoom * this.zoom * state.cutInfo.zoom / 100} px`

      return style
    }
  },
  methods: {
    selectHandler() {
      this.$emit('select')
    }
  }
}
</script>