<template>
  <div class="main-container">
    <vx-editor-tip-bar />
    <div
      class="design-container"
      id="js-container"
      ref="container"
      @click.right.stop.exact="pointerRightDown($event)"
      @click.self.exact="selectCanvasHandler"
    >
      <div class="design-canvas" :style="canvasStyles">
        <div class="editor-shell" :style="canvasStyles">
          <div class="editor-canvas" ref="canvas">
            <div class="editor-layout" @mouseout="clearHoverHandler">
              <vx-Editor-bg :zoom="global.zoom" @select="selectBgHandler" />
              <vx-water-mark />
              <template v-for="(item, index) in layout.elements">
                <vx-editor-text
                  :class="{'editor-element-selected':selectedItem.includes(index)}"
                  v-model="item.content"
                  :index="index"
                  :zoom="global.zoom"
                  :editor="editorParent === -1 && editor === index"
                  @event="selectWidgetHandler"
                  v-if="item.type==='text'"
                  :data.sync="item"
                  :key="item.id"
                />
                <vx-editor-three-text
                  :class="{'editor-element-selected':selectedItem.includes(index)}"
                  v-model="item.content"
                  :index="index"
                  :zoom="global.zoom"
                  :editor="editorParent === -1 && editor === index"
                  @event="selectWidgetHandler"
                  v-if="item.type==='threeText'"
                  :data.sync="item"
                  :key="item.id"
                />
                <vx-editor-image
                  :class="{'editor-element-selected':selectedItem.includes(index)}"
                  :zoom="global.zoom"
                  :index="index"
                  @event="selectWidgetHandler"
                  :cutable="cutable&&selectWidget.id === index"
                  v-if="['image', 'mask'].includes(item.type)"
                  :data.sync="item"
                  :key="item.id"
                />
                <!-- v-if="item.type==='image'" :data.sync="item" :key="item.id" -->
                <!-- <vx-editor-mask 
                            :zoom="global.zoom"
                            :index="index"
                            @event="selectWidgetHandler"
                v-if="item.type==='mask'" :data.sync="item" :key="item.id" />-->
                <vx-editor-svg
                  :class="{'editor-element-selected':selectedItem.includes(index)}"
                  :zoom="global.zoom"
                  :index="index"
                  @event="selectWidgetHandler"
                  v-if="['svg'].includes(item.type)"
                  :data.sync="item"
                  :key="item.id"
                />
                <vx-editor-group
                  :class="{'editor-element-selected':selectedItem.includes(index)}"
                  :zoom="global.zoom"
                  :index="index"
                  @event="selectWidgetHandler"
                  :editor="`${editorParent}-${editor}`"
                  :selected="transformStyle"
                  :cutable="cutable"
                  v-if="item.type==='group'"
                  :data.sync="item"
                  :key="item.id"
                />
                <!-- :item-selected="groupItemSelected" -->
              </template>
            </div>
          </div>
          <div
            class="editor-hover"
            :class="[`hover-${type}`, {'hover-lock': lock}]"
            :style="hoverStyle"
          ></div>

          <!-- 删除该属性 :widget="transformStyle" 解决撤销时选中样式位置错误的bug。2019-10-11 09:22 -->
          <vx-transform
            @group-select="groupSelectHandler"
            :selectedItem="selectedItem"
            @editor="editorHandler"
          />
          <vx-editor-guider />
          <vx-image-cut />
          <vx-toolbar />
        </div>
      </div>
      <vx-selector />
      <vx-contextmenu
        :selectWidget="selectWidget"
        v-model="contextmenuShow"
        :top="contextmenuTop"
        :left="contextmenuleft"
      />
    </div>
  </div>
</template>
<script>
import { getter, mitation } from 'src/design/store'
import { mixin, log } from 'src/design/utils'

import VxEditorTipBar from 'src/design/components/tipBar'

import VxEditorBg from './background'
import VxEditorText from './text'
import VxEditorThreeText from './threeText'
import VxEditorImage from './image'
// import VxEditorMask from './mask';
import VxEditorGroup from './group'
import VxEditorSvg from './svg'

import VxWaterMark from './watermark'

import VxTransform from './transform'
import VxEditorGuider from './guider'
import VxImageCut from './imageCut'
import VxToolbar from './toolbar'
import vxSelector from './selector'
import VxContextmenu from './contentMenu'

export default {
  name: 'vx-canvas',
  mixins: [mixin],
  // props:{
  //     value: {}
  // },
  components: {
    VxEditorTipBar,
    VxEditorBg,
    VxEditorText, // 文本
    VxEditorThreeText, // 3D文字
    VxEditorImage, // 图片
    // VxEditorMask, // mask
    VxEditorGroup, // 组
    VxEditorSvg, // svg
    VxWaterMark, // 水印
    VxTransform, // 拖拽、缩放、旋转
    VxEditorGuider, // 辅助线
    VxImageCut, // 裁剪图片
    VxToolbar, // 工具条
    vxSelector, // 多选
    VxContextmenu // 上下文菜单
  },
  data() {
    return {
      hoverStyle: {},
      transformStyle: {},
      timer: null,
      editor: -1,
      editorParent: -1,
      type: null,
      over: {},
      lock: false,
      contextmenuTop: 0,
      contextmenuleft: 0,
      // index: -1,
      container: { y: 99 },
      contextmenuShow: false,
      groupItemSelected: '', // 组元素选中
      isMultipleSelect: false
    }
  },
  computed: {
    global() {
      return getter.global()
    },
    layout() {
      return getter.layout()
    },
    selectWidget() {
      return getter.current()
    },

    canvasStyles() {
      let { height } = document.body.getBoundingClientRect()
      let top =
        (height - this.container.y - this.layout.height * this.global.zoom) / 2
      return {
        width: `${this.layout.width * this.global.zoom}px`,
        height: `${this.layout.height * this.global.zoom}px`,
        marginTop: `${top > 0 ? top : 10}px`,
        marginBottom: `10px`
      }
    },
    cutable() {
      return getter.cutable()
    },
    mulSelected() {
      return getter.mulSelected()
    },
    selectedItem() {
      return getter.selectedItem()
    }
  },
  methods: {
    selectWidgetHandler(data) {
      if (this.mulSelected) return
      let index = data.parent !== -1 ? data.parent : data.index,
        type = data.type
      this.editorParent = data.parent
      if (type === 'hover') {
        this.hoverHandler(index)
      } else if (type === 'transfrom') {
        this.contextmenuShow = false
        this.over = this.overlap(index)
        mitation.setCutable(false)
        mitation.setCurrent({
          id: index,
          index: data.index,
          type: 'widget',
          parent: data.parent,
          over: this.over
        })
        this.transformHandler(index)
      }
    },
    hoverHandler(index) {
      let data = this.layout.elements[index]
      this.type = data.type
      let transform = data.transform || { a: 0, b: 0, c: 0, tx: 0, ty: 0 }
      this.$set(this, 'hoverStyle', {
        transform: `matrix(${transform.a},${transform.b},${transform.c},${transform.d},${transform.tx},${transform.ty})`,
        width: data.width * getter.zoom() + 'px',
        height: data.height * getter.zoom() + 'px',
        top: data.top * getter.zoom() + 'px',
        left: data.left * getter.zoom() + 'px',
        display: 'block'
      })
      // }

      this.lock = data.lock
    },
    transformHandler(index) {
      this.over = this.overlap(index)
      let data = this.layout.elements[index]
      let pos = {
        w: data.width,
        h: data.height,
        l: data.left,
        t: data.top
      }
      let transform = data.transform || { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 }
      this.$set(this, 'transformStyle', {
        transform: transform,
        width: pos.w,
        height: pos.h,
        top: pos.t,
        left: pos.l,
        draggable: data.dragable,
        rotatable: data.rotatable,
        type: data.type,
        display: 'block',
        index: index,
        editor: false
      })
    },
    clearHoverHandler() {
      this.$set(this, 'hoverStyle', {})
      this.lock = false
    },
    cleartransformHandler() {
      this.$set(this, 'transformStyle', {})
      this.editor = -1
      this.editorParent = -1
      this.over = {}
      this.contextmenuShow = false
      this.groupItemSelected = ''
      mitation.setCutable(false)
    },
    selectCanvasHandler() {
      this.cleartransformHandler()
      mitation.setCurrent({ id: -1, type: 'canvas' })
      // mitation.setSelectedItem([]);
    },
    editorHandler(type, index, parent = -1) {
      if (type === 'edit') {
        this.editor = index
        this.editorParent = parent
      } else {
        // 图片上传
        this.$upload()
          .then(data => {
            mitation.updateImg(parent, index, data.data.url)
          })
          .catch(err => {
            log.danger(err)
          })
      }
    },
    selectBgHandler() {
      this.cleartransformHandler()
      mitation.setCurrent({ id: -1, type: 'background' })
    },
    // 获取上下文菜单位置
    pointerRightDown(e) {
      e.preventDefault()
      this.contextmenuShow = true
      let top = e.pageY - this.container.y
      let left = e.pageX - this.container.x
      let _h = this.container.height - top
      let _w = this.container.width - left
      if (_h < 200) {
        top = -_h
      }
      if (_w < 200) {
        left = -_w
      }
      this.contextmenuTop = top
      this.contextmenuleft = left
    },

    getContainerSize() {
      let size = document.querySelector('#js-container').getBoundingClientRect()
      this.container = size
    },

    groupSelectHandler() {
      this.groupItemSelected = `${this.selectWidget.id}-${this.selectWidget.index}`
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        let el = this.$refs.container
        if (!el) return
        let h = el.clientHeight,
          w = el.clientWidth
        if (h > 0 && w > 0) {
          this.updateZoom(h, w)
        }
        this.getContainerSize()
      }, 100)
    })

    this.getContainerSize()
  },
  watch: {
    'selectWidget.id': function(val) {
      this.index = val
      if (val >= 0) {
        this.transformHandler(val)
      } else {
        this.cleartransformHandler()
      }
    }
  }
}
</script>