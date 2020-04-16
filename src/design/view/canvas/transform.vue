<template>
  <div class="editor-transform-wrap">
    <div
      class="editor-transform"
      :class="{
            'editor-custorm': editor,
            'editor-min-w': widget.width * zoom < 42,
            'editor-min-h': widget.height * zoom < 42,
            'editor-lock': lock,
            'editor-transform-editing': cutable,
            'editor-transform-multiple': multiple
        }"
      ref="transform"
      @dblclick.self="editorHandler"
      @mousedown.self.stop="mousedownHandler($event)"
      :style="styles"
    >
      <i
        class="editor-grip editor-grip-n"
        v-if="!multiple"
        v-show="(!isMouseDown || resizeN)"
        @mousedown.self.stop="resizeN_down_Handler($event)"
      >
        <b></b>
      </i>
      <i
        class="editor-grip editor-grip-e"
        v-if="!multiple"
        v-show="!isMouseDown || resizeE"
        @mousedown.self.stop="resizeE_down_Handler($event)"
      >
        <b></b>
      </i>
      <i
        class="editor-grip editor-grip-s"
        v-if="!multiple"
        v-show="(!isMouseDown || resizeS)"
        @mousedown.self.stop="resizeS_down_Handler($event)"
      >
        <b></b>
      </i>
      <i
        class="editor-grip editor-grip-w"
        v-if="!multiple"
        v-show="!isMouseDown || resizeW"
        @mousedown.self.stop="resizeW_down_Handler($event)"
      >
        <b></b>
      </i>
      <i
        class="editor-grip editor-grip-nw"
        v-show="!isMouseDown || resizeNW"
        @mousedown.self.stop="resizeNW_down_Handler($event)"
      >
        <b></b>
      </i>
      <i
        class="editor-grip editor-grip-ne"
        v-show="!isMouseDown || resizeNE"
        @mousedown.self.stop="resizeNE_down_Handler($event)"
      >
        <b></b>
      </i>
      <i
        class="editor-grip editor-grip-se"
        v-show="!isMouseDown || resizeSE"
        @mousedown.self.stop="resizeSE_down_Handler($event)"
      >
        <b></b>
      </i>
      <i
        class="editor-grip editor-grip-sw"
        v-show="!isMouseDown || resizeSW"
        @mousedown.self.stop="resizeSW_down_Handler($event)"
      >
        <b></b>
      </i>
      <i
        class="editor-rotator"
        v-show="!isMouseDown || rotating"
        :style="{transform: `matrix(${transform.join(', ')})`}"
        @mousedown.stop="rotate_down_Handler($event)"
      >
        <b ref="rotate">
          <svg class="vx" aria-hidden="true">
            <use xlink:href="#vx-rotate" />
          </svg>
          <span class="deg" v-show="degShow">{{rotate}}°</span>
        </b>
      </i>
      <i v-if="lock" class="editor-grip-lock">
        <b>
          <svg class="vx" aria-hidden="true">
            <use xlink:href="#vx-lock" />
          </svg>
        </b>
      </i>
    </div>
  </div>
</template>
<script>
import { mitation, getter } from 'src/design/store'
import { mixin } from 'src/design/utils'
const _W = 29 // 补偿值
const _H = 36 // 补偿值
export default {
  name: 'vx-transform',
  mixins: [mixin],
  props: {
    /**
     * 删除该属性 widget 解决撤销时选中样式位置错误的bug。
     * 2019-10-11 09:22
     */
    // widget:{
    //     type: Object,
    //     required: true,
    //     default:()=>{
    //         return{index: -1}
    //     }
    // },
    selectedItem: {
      type: Array
    }
  },
  data() {
    return {
      logger: false,
      dragging: false,
      rotating: false,
      degShow: true,
      resizeN: false,
      resizeS: false,
      resizeE: false,
      resizeW: false,
      resizeSE: false,
      resizeSW: false,
      resizeNE: false,
      resizeNW: false,
      t: 0,
      l: 0,
      st: 0,
      el: 0,
      wl: 0,
      width: 0,
      left: 0,
      top: 0,
      height: 0,
      // set: 0,
      sel: 0,
      nel: 0,
      // net: 0
      nwl: 0,
      swl: 0,
      cx: 0, // 圆心x坐标
      cy: 0, // 圆心y坐标
      rotate: 0,
      transform: [],
      editor: false,
      isMouseDown: false,
      isSelected: false
    }
  },
  mounted() {
    window.addEventListener('mouseup', e => {
      this.dragging = false
      this.rotating = false
      this.degShow = false
      this.resizeS = false
      this.resizeE = false
      this.resizeW = false
      this.resizeN = false
      this.resizeNE = false
      this.resizeSE = false
      this.resizeSW = false
      this.resizeNW = false
      if (this.logger) {
        mitation.setLogger()
        this.logger = false
      }
      this.isMouseDown = false
      if (this.isSelected) {
        this.selected(e)
        this.$emit('group-select')
        this.isSelected = false
      }

      window.removeEventListener('mousemove', this.mouseMoveHandler)
      window.removeEventListener('mousemove', this.resizeS_move_Handler)
      window.removeEventListener('mousemove', this.resizeE_move_Handler)
      window.removeEventListener('mousemove', this.resizeW_move_Handler)
      window.removeEventListener('mousemove', this.resizeN_move_Handler)
      window.removeEventListener('mousemove', this.resizeSE_move_Handler)
      window.removeEventListener('mousemove', this.resizeNE_move_Handler)
      window.removeEventListener('mousemove', this.resizeNW_move_Handler)
      window.removeEventListener('mousemove', this.resizeSW_move_Handler)
      window.removeEventListener('mousemove', this.rotate_move_Handler)
    })
  },
  computed: {
    zoom() {
      return getter.zoom()
    },
    /**
     * 增加该计算属性
     * 2019-10-11 09:22
     */
    layout() {
      return getter.layout()
    },
    /**
     * 增加该计算属性
     * 2019-10-11 09:22
     */
    selectWidget() {
      return getter.current()
    },
    type() {
      let index = this.selectWidget.id
      if (index != null && index != -1) {
        return this.layout.elements[index].type == 'text'
      } else {
        return true
      }
    },
    /**
     * 增加该计算属性
     * 2019-10-11 09:22
     */
    widget() {
      let index = this.selectWidget.id
      if (index < 0) return { index: -1 }
      let data = this.layout.elements[index]
      if (data) {
        let pos = {
          w: data.width,
          h: data.height,
          l: data.left,
          t: data.top
        }
        let transform = data.transform || {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          tx: 0,
          ty: 0
        }
        return {
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
        }
      } else {
        return null
      }
    },
    styles() {
      mitation.setCutToolbar({
        top: this.widget.top,
        left: this.widget.left
      })
      if (this.widget.hasOwnProperty('transform')) {
        return {
          width: this.widget.width * this.zoom + 'px',
          height: this.widget.height * this.zoom + 'px',
          top: this.widget.top * this.zoom + 'px',
          left: this.widget.left * this.zoom + 'px',
          transform: `matrix(${this.widget.transform.a},${this.widget.transform.b},${this.widget.transform.c},${this.widget.transform.d},${this.widget.transform.tx},${this.widget.transform.ty})`,
          display: this.widget.display
        }
      }
      return {
        width: this.widget.width * this.zoom + 'px',
        height: this.widget.height * this.zoom + 'px',
        top: this.widget.top * this.zoom + 'px',
        left: this.widget.left * this.zoom + 'px',
        display: this.widget.display
      }
    },
    lock() {
      if (this.widget.index === undefined || this.widget.index === -1)
        return false
      return getter.layout().elements[this.widget.index].lock //this.widget.lock
    },
    cutable() {
      return !this.lock && getter.cutable()
    },
    multiple() {
      return this.widget.type === 'group' || this.selectedItem.length > 0
    }
  },
  methods: {
    _mousedownHandler() {
      this.logger = true
      this.isMouseDown = true
    },
    mousedownHandler(event) {
      if (this.lock || this.cutable) return
      this.dragging = true // 拖拽
      this.isSelected = true // 组中选择
      this.l = event.clientX - event.target.offsetLeft
      this.t = event.clientY - event.target.offsetTop
      window.addEventListener('mousemove', this.mouseMoveHandler)
    },
    mouseMoveHandler(event) {
      if (this.dragging) {
        this.isSelected = false // 组中选择
        this._mousedownHandler()
        this.guider(this.widget.index)
        this.widget.left = (event.clientX - this.l) / this.zoom
        this.widget.top = (event.clientY - this.t) / this.zoom
        mitation.updateTransformPosition(this.widget.index, {
          left: this.widget.left * this.zoom,
          top: this.widget.top * this.zoom
        })
      }
    },
    // s
    resizeS_down_Handler(event) {
      if (this.lock) return
      this._mousedownHandler()
      this.resizeS = true
      this.st = event.clientY - event.target.offsetTop
      window.addEventListener('mousemove', this.resizeS_move_Handler)
    },
    resizeS_move_Handler(event) {
      if (this.resizeS) {
        this.widget.height = (event.clientY - this.st + _H) / this.zoom
        mitation.updateWidgetSize(this.widget.index, 'transform', {
          width: this.widget.width * this.zoom,
          height: this.widget.height * this.zoom
        })
      }
    },
    // e
    resizeE_down_Handler(event) {
      if (this.lock) return
      this._mousedownHandler()
      this.resizeE = true
      this.el = event.clientX - event.target.offsetLeft
      window.addEventListener('mousemove', this.resizeE_move_Handler)
    },
    resizeE_move_Handler(event) {
      if (this.resizeE) {
        this.widget.width = (event.clientX - this.el + _W) / this.zoom
        mitation.updateWidgetSize(this.widget.index, 'transform', {
          width: this.widget.width * this.zoom,
          height: this.widget.height * this.zoom
        })
      }
    },
    // w
    resizeW_down_Handler(event) {
      if (this.lock) return
      this._mousedownHandler()
      this.resizeW = true
      this.wl = event.clientX - event.target.offsetLeft
      this.width = this.widget.width
      this.left = this.widget.left
      window.addEventListener('mousemove', this.resizeW_move_Handler)
    },
    resizeW_move_Handler(event) {
      if (this.resizeW) {
        this.widget.width =
          (this.width * this.zoom - (event.clientX - this.wl)) / this.zoom
        this.widget.left =
          (this.left * this.zoom + event.clientX - this.wl) / this.zoom
        mitation.updateWidgetSize(this.widget.index, 'transform', {
          width: this.widget.width * this.zoom,
          height: this.widget.height * this.zoom,
          left: this.widget.left * this.zoom
        })
      }
    },
    // n
    resizeN_down_Handler(event) {
      if (this.lock) return
      this._mousedownHandler()
      this.resizeN = true
      this.nt = event.clientY - event.target.offsetTop
      this.height = this.widget.height
      this.top = this.widget.top
      window.addEventListener('mousemove', this.resizeN_move_Handler)
    },
    resizeN_move_Handler(event) {
      if (this.resizeN) {
        this.widget.height =
          (this.height * this.zoom - (event.clientY - this.nt)) / this.zoom
        this.widget.top =
          (this.top * this.zoom + event.clientY - this.nt) / this.zoom
        mitation.updateWidgetSize(this.widget.index, 'transform', {
          width: this.widget.width * this.zoom,
          height: this.widget.height * this.zoom,
          top: this.widget.top * this.zoom
        })
      }
    },
    // se
    resizeSE_down_Handler(event) {
      if (this.lock) return
      this._mousedownHandler()
      this.resizeSE = true
      this.sel = event.clientX - event.target.offsetLeft
      // this.set = event.clientY - event.target.offsetTop; // 暂未用到
      window.addEventListener('mousemove', this.resizeSE_move_Handler)
    },
    resizeSE_move_Handler(event) {
      if (this.resizeSE) {
        this.widget.height =
          (this.widget.height * this.zoom +
            event.clientX -
            this.sel +
            _H -
            this.widget.width * this.zoom) /
          this.zoom
        this.widget.width = (event.clientX - this.sel + _H) / this.zoom
        // this.widget.height = (event.clientY - this.set + 28)/this.zoom; // 等比缩放
        mitation.updateWidgetSize(this.widget.index, 'transform', {
          width: this.widget.width * this.zoom,
          height: this.widget.height * this.zoom
        })
      }
    },
    // ne
    resizeNE_down_Handler(event) {
      if (this.lock) return
      this._mousedownHandler()
      this.resizeNE = true
      this.nel = event.clientX - event.target.offsetLeft
      this.width = this.widget.width
      this.height = this.widget.height
      this.left = this.widget.left
      this.top = this.widget.top
      window.addEventListener('mousemove', this.resizeNE_move_Handler)
    },
    resizeNE_move_Handler(event) {
      if (this.resizeNE) {
        this.widget.width = (event.clientX - this.nel + _W) / this.zoom
        this.widget.height =
          (this.height * this.zoom +
            event.clientX -
            this.nel +
            _W -
            this.width * this.zoom) /
          this.zoom
        this.widget.top =
          (this.top * this.zoom -
            (event.clientX - this.nel + _W - this.width * this.zoom)) /
          this.zoom
        mitation.updateWidgetSize(this.widget.index, 'transform', {
          width: this.widget.width * this.zoom,
          height: this.widget.height * this.zoom,
          left: this.widget.left * this.zoom,
          top: this.widget.top * this.zoom
        })
      }
    },
    // sw
    resizeSW_down_Handler(event) {
      if (this.lock) return
      this._mousedownHandler()
      this.resizeSW = true
      this.swl = event.clientX - event.target.offsetLeft
      this.width = this.widget.width
      this.height = this.widget.height
      this.left = this.widget.left
      this.top = this.widget.top

      window.addEventListener('mousemove', this.resizeSW_move_Handler)
    },
    resizeSW_move_Handler(event) {
      if (this.resizeSW) {
        this.widget.width =
          (this.width * this.zoom - (event.clientX - this.swl)) / this.zoom
        this.widget.height =
          (this.height * this.zoom - (event.clientX - this.swl)) / this.zoom
        this.widget.left =
          (this.left * this.zoom + event.clientX - this.swl) / this.zoom
        mitation.updateWidgetSize(this.widget.index, 'transform', {
          width: this.widget.width * this.zoom,
          height: this.widget.height * this.zoom,
          left: this.widget.left * this.zoom,
          top: this.widget.top * this.zoom
        })
      }
    },
    // nw
    resizeNW_down_Handler(event) {
      if (this.lock) return
      this._mousedownHandler()
      this.resizeNW = true
      this.nwl = event.clientX - event.target.offsetLeft
      this.width = this.widget.width
      this.height = this.widget.height
      this.left = this.widget.left
      this.top = this.widget.top
      window.addEventListener('mousemove', this.resizeNW_move_Handler)
    },
    resizeNW_move_Handler(event) {
      if (this.resizeNW) {
        this.widget.width =
          (this.width * this.zoom - (event.clientX - this.nwl)) / this.zoom
        this.widget.height =
          (this.height * this.zoom - (event.clientX - this.nwl)) / this.zoom
        this.widget.left =
          (this.left * this.zoom + event.clientX - this.nwl) / this.zoom
        this.widget.top =
          (this.top * this.zoom + event.clientX - this.nwl) / this.zoom
        mitation.updateWidgetSize(this.widget.index, 'transform', {
          width: this.widget.width * this.zoom,
          height: this.widget.height * this.zoom,
          left: this.widget.left * this.zoom,
          top: this.widget.top * this.zoom
        })
      }
    },
    // rotate
    rotate_down_Handler() {
      if (this.lock) return
      this._mousedownHandler()
      this.degShow = true
      this.rotating = true
      let {
        top,
        left,
        width,
        height
      } = this.$refs.transform.getBoundingClientRect()
      this.cx = window.pageXOffset + left + width / 2
      this.cy = window.pageYOffset + top + height / 2
      window.addEventListener('mousemove', this.rotate_move_Handler)
    },
    rotate_move_Handler(event) {
      if (this.rotating) {
        let { x: mouseX, y: mouseY } = this.getMouseCoordinate(event)
        let y = mouseY - this.cy
        let x = mouseX - this.cx
        this.rotate = this._adsorptionRotate((this.getAngle(x, y) + 90) % 360)

        let deg = (this.rotate * Math.PI) / 180
        let cos = Math.cos(deg)
        let sin = Math.sin(deg)
        this.widget.transform = {
          a: cos,
          b: sin,
          c: -sin,
          d: cos,
          tx: this.widget.transform.tx,
          ty: this.widget.transform.ty
        }
        // 旋转度数提示的旋转角度
        this.transform = [cos, -sin, sin, cos, -14, 0]
        mitation.updateTransformRotate(this.widget.index, this.widget.transform)
      }
    },
    // 处理双击事件
    editorHandler() {
      if (this.lock) return
      if (['text', 'threeText'].includes(this.widget.type)) {
        this.editor = true
        this.$emit('editor', 'edit', this.widget.index)
      } else if (['image', 'mask'].includes(this.widget.type)) {
        this.$emit('editor', 'upload', this.widget.index)
      } else if (this.widget.type === 'group') {
        let current = getter.current()
        if (current.index !== -1) {
          let widgets = getter.layout().elements[this.widget.index]
          switch (widgets.elements[current.index].type) {
            case 'text':
              this.editor = true
              this.$emit('editor', `edit`, current.index, current.parent)
              break
            case 'threeText':
              this.editor = true
              this.$emit('editor', `edit`, current.index, current.parent)
          }
        }
      }
    },
    // 获取鼠标位置
    getMouseCoordinate(e) {
      return {
        x: e.pageX || e.clientX + document.body.scrollLeft,
        y: e.pageY || e.clientY + document.body.scrollTop
      }
    },
    // 计算角度
    getAngle(x, y) {
      let theta = Math.atan2(y, x) // range (-PI, PI]
      theta = Math.round((180 / Math.PI) * theta) // rads to degs, range (-180, 180]
      if (theta < 0) theta = 360 + theta // range [0, 360)

      return theta
    },
    _adsorptionRotate(deg) {
      if (deg > 357) {
        return 360
      } else if (deg < 3) {
        return 0
      } else if (Math.abs(deg - 45) < 3) {
        return 45
      } else if (Math.abs(deg - 90) < 3) {
        return 90
      } else if (Math.abs(deg - 135) < 3) {
        return 135
      } else if (Math.abs(deg - 180) < 3) {
        return 180
      } else if (Math.abs(deg - 225) < 3) {
        return 225
      } else if (Math.abs(deg - 270) < 3) {
        return 270
      }
      return deg
    }
  },
  watch: {
    'widget.index': function() {
      this.editor = false
    }
  }
}
</script>