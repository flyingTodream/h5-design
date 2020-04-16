<template>
  <div class="tool-bar">
    <vx-icon
      :title="isLocked?'解锁图层':'锁定图层'"
      @click.native="lockHandler"
      :name="isLocked ? 'lock' : 'Unlocked'"
      :class="{'image-locked':isLocked}"
    ></vx-icon>
    <vx-icon
      title="图层顺序"
      @click.native="showDescHandler"
      :class="{'image-disable': isLocked}"
      name="layout"
    ></vx-icon>
    <div v-show="showDesc" class="layout-layer-pop">
      <ul>
        <li :class="{disable: isTop}" @click.stop="moveUpHandler">
          <vx-icon name="move-up"></vx-icon>上移一层
        </li>
        <li :class="{disable: isBottom}" @click.stop="moveDownHandler">
          <vx-icon name="move-down"></vx-icon>下移一层
        </li>
        <li :class="{disable: isTop}" @click.stop="moveTopHandler">
          <vx-icon name="move-top"></vx-icon>置于顶层
        </li>
        <li :class="{disable: isBottom}" class="tool-bar-line" @click.stop="moveBottomHandler">
          <vx-icon name="move-bottom"></vx-icon>置于底层
        </li>
        <li @click.stop="alignCenterHandler">
          <vx-icon name="align-center"></vx-icon>水平居中
        </li>
        <li @click.stop="alignMiddleHandler">
          <vx-icon name="align-middle"></vx-icon>垂直居中
        </li>
      </ul>
    </div>
    <vx-icon
      title="复制"
      @click.native="copyHandler"
      :class="{'image-disable': isLocked}"
      name="copy"
    ></vx-icon>
    <vx-icon
      title="删除"
      @click.native="deleteHandler"
      :class="{'image-disable': isLocked}"
      name="delete"
    ></vx-icon>
  </div>
</template>
<script>
import { state, mitation } from 'src/design/store'
export default {
  name: 'vx-toolBar',
  data() {
    return {
      showDesc: false, //图层顺序是否显示
      count: 1
    }
  },
  props: {
    index: {
      type: Number
    },
    over: {
      type: Object,
      default: () => {
        return {
          down: [],
          up: []
        }
      }
    }
  },
  computed: {
    isLocked() {
      return state.layout.elements[this.index].lock
    },
    isTop() {
      return this.over.up.length === 0
    },
    isBottom() {
      return this.over.down.length === 0
    }
  },
  watch: {
    index() {
      this.count = 1
    }
  },
  methods: {
    lockHandler() {
      // state.layout.elements[this.index].lock = !state.layout.elements[
      //   this.index
      // ].lock
      mitation.lockWidget(this.index)
      // this.$emit('isLock', this.locked)
    },
    hideDescHandler() {
      this.showDesc = false
      window.removeEventListener('click', this.hideDescHandler)
    },
    showDescHandler() {
      this.showDesc = !this.showDesc
      if (this.showDesc) {
        setTimeout(() => {
          window.addEventListener('click', this.hideDescHandler)
        }, 0)
      }
    },
    //向上一层
    moveUpHandler() {
      if (this.index < state.layout.elements.length - 1) {
        // state.layout.elements[this.index] = state.layout.elements.splice(
        //   this.index + 1,
        //   1,
        //   state.layout.elements[this.index]
        // )[0]
        this.$emit('moveUp')
      }
    }, //向下一层
    moveDownHandler() {
      if (this.index > 0) {
        // state.layout.elements[this.index] = state.layout.elements.splice(
        //   this.index - 1,
        //   1,
        //   state.layout.elements[this.index]
        // )[0]
        this.$emit('moveDown')
      }
      // this.$emit('moveDown')
    }, //置于顶层
    moveTopHandler() {
      this.$emit('moveTop')
    }, //置于底层
    moveBottomHandler() {
      this.$emit('moveBottom')
    }, //水平分布
    alignCenterHandler() {
      state.layout.elements[this.index].left =
        (state.layout.width - state.layout.elements[this.index].width) / 2
    }, //垂直居中
    alignMiddleHandler() {
      state.layout.elements[this.index].top =
        (state.layout.height - state.layout.elements[this.index].height) / 2
    },
    deleteHandler() {
      state.layout.elements.splice(this.index, 1)
      this.$emit('opDelete')
      //
    },
    copyHandler() {
      let element = Object.assign({}, state.layout.elements[this.index])
      element.top += 20 * this.count
      element.left += 20 * this.count
      this.count++
      state.layout.elements.push(element)
    }
  }
}
</script>
