<template>
  <div class="design-container" :class="[type]">
    <div class="design-canvas" :style="canvasStyles" >
      <div class="editor-shell" :style="canvasStyles">
        <div class="editor-canvas" id="canvas">
          <div class="editor-layout">
            <template>
              <vx-Editor-bg
                :w="bgW"
                :h="bgH"
                :zoom="zoom"
                :bgColor="bgColor"
                :bgImg="bgImg"
                :bgImgInfo="bgImgInfo"
                :bgSize="bgSize"
              />
            </template>
            <vx-water-mark />
           
            <template v-for="(item, index) in layout.elements">
              <vx-editor-text
                :index="index"
                :zoom="zoom"
                v-if="item.type==='text'"
                :data.sync="item"
                :key="item.id"
              />
              <vx-editor-image
                :zoom="zoom"
                :index="index"
                v-if="['image', 'mask'].includes(item.type)"
                :data.sync="item"
                :key="item.id"
              />
              <vx-editor-svg
                :zoom="zoom"
                v-show="type !== 'print'"
                :index="index"
                v-if="['svg'].includes(item.type)"
                :data.sync="item"
                :key="item.id"
                ref="svg"
              />
              <vx-editor-group
                :zoom="zoom"
                ref="group"
                :index="index"
                v-if="item.type==='group'"
                :data.sync="item"
                :type="type"
                :key="item.id"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getter, state } from 'src/design/store'
import VxWaterMark from './watermark'
import Canvas2Image from 'src/design/utils/canvas2image'
import VxEditorBg from './background'
import VxEditorText from './text'
import VxEditorImage from './image'
import VxEditorGroup from './group'
import VxEditorSvg from './svg'
import Canvg from 'canvg'

export default {
  name: 'vx-canvas-preview',
  props: {
    height: Number, // 容器(父级)的高度
    width: Number, // 容器(父级)的宽度
    w: Number,
    h: Number,
    print: {
      type: Boolean,
      default: false
    },
    type: {
      validator: function(val) {
        return ['preview', 'print'].includes(val)
      },
      default: 'preview'
    }
  },
  components: {
    VxEditorBg,
    VxEditorText, // 文本
    VxEditorImage, // 图片
    VxEditorGroup,
    VxEditorSvg,
    VxWaterMark
  },
  data() {
    return {
      hoverStyle: {},
      transformStyle: {},
      output: null,
      timer: null,
      size: 0,
      zoom: this.type === 'print' ? 1 : 0
      // zoom: getter.zoom()
      // print: true
    }
  },
  computed: {
    layoutZoom() {
      return getter.zoom()
    },
    global() {
      return getter.global()
    },
    layout() {
      return getter.layout()
    },
    canvasStyles() {
      return this.type === 'preview'
        ? {
            width: `${this.w * this.size}px`,
            height: `${this.h * this.size}px`
          }
        : this.type === 'print'
        ? {
            width: `${this.layout.width * this.zoom}px`,
            height: `${this.layout.height * this.zoom}px`
          }
        : {}
    },
    canvasW() {
      return this.w * this.size
    },
    canvasH() {
      return this.h * this.size
    },
    // 背景图层
    bgW() {
      return this.layout.width * this.zoom
    },
    bgH() {
      return this.layout.height * this.zoom
    },
    bgColor() {
      return this.layout.backgroundColor || '#fff'
    },
    bgImg() {
      return this.layout.backgroundImage
    },
    bgImgInfo() {
      return this.layout.backgroundImageInfo
    },
    bgSize() {
      return this.layout.backgroundSize
    }
  },
  mounted() {
    this.type === 'preview' && this.updateSizeHandler()
  },
  methods: {
    updateSizeHandler() {
      let zoomX = this.width / this.w
      let zoomY = this.height / this.h
      if (zoomX > zoomY) {
        this.size = zoomY
      } else {
        this.size = zoomX
      }
      this.updateZoomHandler()
    },
    updateZoomHandler() {
      let zoomX = this.canvasW / this.layout.width
      let zoomY = this.canvasH / this.layout.height
      if (zoomX > zoomY) {
        this.zoom = zoomY
      } else {
        this.zoom = zoomX
      }
    },
    async printImageHandler() {
      const el = document.querySelector('#canvas')
      //处理svg图标
      if (this.$refs.svg && this.$refs.svg.length > 0) {
        this.$refs.svg.forEach(node => {
          this.svgHandler(el, node)
        })
      }

      //处理组里面的svg图标
      if (this.$refs.group && this.$refs.group.length > 0) {
        this.$refs.group.forEach(element => {
          if (element.data.elements && element.data.elements.length > 0) {
            element.data.elements.forEach(node => {
              if (node.type === 'svg') {
                this.svgHandler(
                  el,
                  node,
                  element.index,
                  element.data.top,
                  element.data.left
                )
              }
            })
          }
        })
      }
      if (this.type === 'print') {
        const options = {
          type: 'dataURL',
          logging: false,
          scale: 1,
          allowTaint: false,
          scrollY: 0,
          taintTest: true, //检测每张图片都已经加载完成
          useCORS: true, //使用跨域
          backgroundColor: null
        }
        return await this.$html2canvas(el, options).then(canvas => {
          return canvas
        })
      } else {
        throw new Error('当前不是生成图片模式')
      }
    },
    getSvgHandler(url) {
      return new Promise((resolve, reject) => {
        this.$axios
          .get(url, {})
          .then(data => {
            resolve(data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    async svgHandler(parentDom, node, index, top, left) {
      var svg = ''
      var canvas = document.createElement('canvas')
      if (node.html) {
        svg = node.html.trim()
        canvas.style.position = 'absolute'
        canvas.style.left = node.data.left + 'px'
        canvas.style.top = node.data.top + 'px'
        canvas.style.width = node.data.width + 'px'
        canvas.style.height = node.data.height + 'px'
        state.layout.elements[node.index]
        canvas.style.zIndex = node.index
      } else if (node.content) {
        svg = node.content.trim()
        canvas.style.position = 'absolute'
        canvas.style.left = left + 'px'
        canvas.style.top = top + 'px'
        canvas.style.width = node.width + 'px'
        canvas.style.height = node.height + 'px'
        state.layout.elements[node.index]
        canvas.style.zIndex = index
      } else {
        await this.getSvgHandler(node.url).then(res => {
          svg = res.trim()
        })
        canvas.style.position = 'absolute'
        canvas.style.left = left + 'px'
        canvas.style.top = top + 'px'
        canvas.style.width = node.width + 'px'
        canvas.style.height = node.height + 'px'
        state.layout.elements[node.index]
        canvas.style.zIndex = index
      }
      Canvg(canvas, svg)
      parentDom.appendChild(canvas)
      canvas = null
    },
    async downLoad(type, compress) {
      let imgZoom = 1
      if (type == 'PNG') {
        imgZoom = 1
      } else if (type == 'JPG') {
        imgZoom = compress
      }
      var shareContent = document.querySelector('#canvas')
      //处理svg图标
      if (this.$refs.svg && this.$refs.svg.length > 0) {
        this.$refs.svg.forEach(node => {
          this.svgHandler(shareContent, node)
        })
      }

      //处理组里面的svg图标
      if (this.$refs.group && this.$refs.group.length > 0) {
        this.$refs.group.forEach(element => {
          if (element.data.elements && element.data.elements.length > 0) {
            element.data.elements.forEach(node => {
              if (node.type === 'svg') {
                this.svgHandler(
                  shareContent,
                  node,
                  element.index,
                  element.data.top,
                  element.data.left
                )
              }
            })
          }
        })
      }
      var width = shareContent.offsetWidth //获取dom 宽度
      var height = shareContent.offsetHeight //获取dom 高度
      var canvas = document.createElement('canvas') //创建一个canvas节点
      var scale = imgZoom //定义任意放大倍数 支持小数
      canvas.width = width * scale //定义canvas 宽度 * 缩放
      canvas.height = height * scale //定义canvas高度 *缩放
      canvas.getContext('2d').scale(scale, scale) //获取context,设置scale
      var opts = {
        scale: scale, // 添加的scale 参数
        canvas: canvas, //自定义 canvas
        logging: false, //日志开关，便于查看html2canvas的内部执行流程
        width: width, //dom 原始宽度
        height: height,
        useCORS: true // 【重要】开启跨域配置
      }
      return await this.$html2canvas(shareContent, opts).then(function(canvas) {
        var context = canvas.getContext('2d')
        // 【重要】关闭抗锯齿
        context.mozImageSmoothingEnabled = false
        context.webkitImageSmoothingEnabled = false
        context.msImageSmoothingEnabled = false
        context.imageSmoothingEnabled = false
        //
        if (type == 'PNG') {
          var pngImg = Canvas2Image.convertToPNG(
            canvas,
            canvas.width,
            canvas.height
          )
          return pngImg.src
        } else {
          var jpgImg = Canvas2Image.convertToJPEG(
            canvas,
            canvas.width,
            canvas.height
          )
          return jpgImg.src
        }
      })
    }
  },
  watch: {
    w: function() {
      this.type === 'preview' && this.updateSizeHandler()
    },
    h: function() {
      this.type === 'preview' && this.updateSizeHandler()
    }
  }
}
</script>