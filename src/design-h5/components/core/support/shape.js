import animationMixin from '../../../mixins/animation.js'
// import VxH5Text from '@/design-h5/components/plugins/vxText.vue'
import VxH5Image from './canvas/image'
import VxH5Text from './canvas/text'
import VxH5Map from './canvas/map'
import VxH5Call from './canvas/call'
import VxH5Link from './canvas/link'
/**
 * #!zh: 上下左右 对应的 东南西北
 * #!en: top(north)、bottom(south)、left(west)、right(east)
 */
const directionKey = {
  t: 'n',
  b: 's',
  l: 'w',
  r: 'e'
}

// #!zh: 四个边角、两条中线上的点
const points = ['lt', 'rt', 'lb', 'rb', 'l', 'r', 't', 'b']

export default {
  mixins: [animationMixin],
  props: ['defaultPosition', 'active', 'handleMousedownProp', 'handleElementMoveProp', 'handlePointMoveProp', 'handleElementMouseUpProp', 'handlePointMouseUpProp', 'element'],
  computed: {
    position() {
      return {
        ...this.defaultPosition
      }
    }, commonStyle() {
      return {
        backgroundColor: `${this.defaultPosition.backgroundColor}`,
        color: `${this.defaultPosition.color}`,
        fontSize: `${this.defaultPosition.fontSize}px`,
        height: `${this.defaultPosition.height}px`,
        left: `${this.defaultPosition.left}px`,
        position: `${this.defaultPosition.position}`,
        textAlign: `${this.defaultPosition.textAlign}`,
        top: `${this.defaultPosition.top}px`,
        width: `${this.defaultPosition.width}px`,
        zIndex: `${this.defaultPosition.zindex}`,
        fontWeight: `${this.defaultPosition.fontWeight}`,
        borderWidth: `${this.defaultPosition.borderWidth}px`,
        borderColor: `${this.element.commonStyle.borderColor}`,
        borderRadius: `${this.element.commonStyle.borderRadius}`
      }
    }
  },
  methods: {

    /**
     * 通过方位计算样式，主要是 top、left、鼠标样式
     */
    getPointStyle(point, isWrapElement = true) {
      const pos = this.position
      const top = pos.top // !#zh 减4是为了让元素能够处于 border 的中间
      const left = pos.left
      const height = pos.height
      const width = pos.width
      let hasT = /t/.test(point)
      let hasB = /b/.test(point)
      let hasL = /l/.test(point)
      let hasR = /r/.test(point)
      let newLeft = 0
      let newTop = 0
      if (point.length === 2) {
        newLeft = hasL ? 0 : width
        newTop = hasT ? 0 : height
      } else {
        // !#zh 上下点，宽度固定在中间
        if (hasT || hasB) {
          newLeft = width / 2
          newTop = hasT ? 0 : height
        }
        // !#zh 左右点，高度固定在中间
        if (hasL || hasR) {
          newLeft = hasL ? 0 : width
          newTop = height / 2
        }
      }
      const style = {
        marginLeft: (hasL || hasR) ? '-3px' : 0,
        marginTop: (hasT || hasB) ? '-3px' : 0,
        left: `${newLeft + (isWrapElement ? 0 : left)}px`,
        top: `${newTop + (isWrapElement ? 0 : top)}px`,
        cursor: point.split('').reverse().map(m => directionKey[m]).join('') + '-resize'
      }
      return style
    },
    /**
     * !#zh 主要目的是：阻止冒泡
     */
    handleWrapperClick(e) {
      e.stopPropagation()
      e.preventDefault()
    },
    mousedownForMark(point, downEvent) {
      downEvent.stopPropagation()
      downEvent.preventDefault() // Let's stop this event.
      const pos = { ...this.position }
      let height = pos.height
      let width = pos.width
      let top = pos.top
      let left = pos.left
      let startX = downEvent.clientX
      let startY = downEvent.clientY
      let move = moveEvent => {
        let currX = moveEvent.clientX
        let currY = moveEvent.clientY
        let disY = currY - startY
        let disX = currX - startX
        let hasT = /t/.test(point)
        let hasB = /b/.test(point)
        let hasL = /l/.test(point)
        let hasR = /r/.test(point)
        let newHeight = +height + (hasT ? -disY : hasB ? disY : 0)
        let newWidth = +width + (hasL ? -disX : hasR ? disX : 0)
        pos.height = newHeight > 0 ? newHeight : 0
        pos.width = newWidth > 0 ? newWidth : 0
        pos.left = +left + (hasL ? disX : 0)
        pos.top = +top + (hasT ? disY : 0)
        this.handlePointMoveProp(pos)
      }
      let up = () => {
        this.handlePointMouseUpProp()
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    },
    /**
     * !#zh 给 当前选中元素 添加鼠标移动相关事件
     *
     * @param {mouseEvent} e
     */
    mousedownForElement(e) {
      const pos = { ...this.position }
      let startY = e.clientY
      let startX = e.clientX
      let startTop = pos.top
      let startLeft = pos.left

      let move = moveEvent => {
        // !#zh 移动的时候，不需要向后代元素传递事件，只需要单纯的移动就OK
        moveEvent.stopPropagation()
        moveEvent.preventDefault()

        let currX = moveEvent.clientX
        let currY = moveEvent.clientY
        pos.top = currY - startY + startTop
        pos.left = currX - startX + startLeft
        this.handleElementMoveProp(pos)
      }

      let up = () => {
        this.handleElementMouseUpProp()
        document.removeEventListener('mousemove', move, true)
        document.removeEventListener('mouseup', up, true)
      }
      document.addEventListener('mousemove', move, true)
      document.addEventListener('mouseup', up, true)
      // TODO add comment
      return true
    },
    handleMousedown(e) {
      if (this.handleMousedownProp) {
        this.handleMousedownProp()
        this.mousedownForElement(e, this.element)
      }
    }
  },
  render() {
    return (
      <div
        onClick={this.handleWrapperClick}
        style={this.commonStyle}
        onMousedown={this.handleMousedown}
        class={{ 'shape__wrapper-active': this.active }}
      >
        {

          this.active &&
          points.map(point => {
            const pointStyle = this.getPointStyle(point)
            return (
              <div
                key={point}
                data-point={point}
                style={pointStyle}
                class="shape__scale-point"
                onMousedown={this.mousedownForMark.bind(this, point)}
              >
              </div>
            )
          })
        }
        {
          this.element.name === 'vx-picture' &&
          <VxH5Image element={this.element} />
        }

        {

          this.element.name === 'vx-text' &&
          <VxH5Text element={this.element} />
        }

        {
          this.element.name === 'vx-map' &&
          <VxH5Map element={this.element} />
        }
        {
          this.element.name === 'vx-call' &&
          <VxH5Call element={this.element} />
        }
        {
          this.element.name === 'vx-link' &&
          <VxH5Link element={this.element} />
        }
      </div >
    )
  }
}
