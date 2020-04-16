<template>
  <div :class="{'image-disable': locked}" class="vx-config-svg">
    <div class="vx-config-svg-color">
      <div>颜色</div>
      <div class="vx-config-svg-color-list">
        <ul>
          <li
            v-for="(item ,index ) in colors"
            :key="index"
            :style="`background:${item}`"
            @click.stop="changeColorHandler(index)"
          ></li>
        </ul>
      </div>
    </div>
    <VxColor v-model="showColor" @select="setColorHandler" />
    <div class="vx-config-svg-button">
      <div @click="rotateYHandler">水平翻转</div>
      <div @click="rotateXHandler">垂直翻转</div>
    </div>
    <div class="font-text-range">
      <div class="font-range-input">
        <div class="font-range-lable">不透明</div>
        <div class="font-range">
          <el-slider :show-tooltip="false" :min="0" :max="10" v-model="range"></el-slider>
        </div>
        <div class="font-range-value">{{range}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { state } from 'src/design/store'
import VxColor from '../panel/color'
export default {
  name: 'vx-svgicon',
  components: {
    VxColor
  },
  props: {
    index: {
      type: Number
    },
    elementIndex: {
      type: Number
    },
    isGroup: {
      type: Boolean
    }
  },
  data() {
    return {
      showColor: false,
      colorIndex: 0
    }
  },
  computed: {
    locked() {
      return state.layout.elements[this.index].lock
    },
    colors() {
      if (this.isGroup) {
        return state.layout.elements[this.index].elements[this.elementIndex]
          .colors
      } else {
        return state.layout.elements[this.index].colors
      }
    },
    range: {
      get() {
        if (this.isGroup) {
          return (
            state.layout.elements[this.index].elements[this.elementIndex]
              .opacity * 10
          )
        } else {
          return state.layout.elements[this.index].opacity * 10
        }
      },
      set(newValue) {
        if (this.isGroup) {
          return (state.layout.elements[this.index].elements[
            this.elementIndex
          ].opacity = newValue / 10)
        } else {
          state.layout.elements[this.index].opacity = newValue / 10
        }
      }
    }
  },
  methods: {
    changeColorHandler(index) {
      this.colorIndex = index
      this.showColor = !this.showColor
    },
    setColorHandler(value) {
      if (this.isGroup) {
        let colors =
          state.layout.elements[this.index].elements[this.elementIndex].colors
        colors[this.colorIndex] = value
        state.layout.elements[this.index].elements[this.elementIndex].colors = [
          ...colors
        ]
      } else {
        let colors = state.layout.elements[this.index].colors
        colors[this.colorIndex] = value
        state.layout.elements[this.index].colors = [...colors]
      }
    },
    rotateYHandler() {
      if (this.isGroup) {
        state.layout.elements[this.index].elements[
          this.elementIndex
        ].transform.a = -state.layout.elements[this.index].elements[
          this.elementIndex
        ].transform.a
        state.layout.elements[this.index].elements[
          this.elementIndex
        ].transform.b = -state.layout.elements[this.index].elements[
          this.elementIndex
        ].transform.b
      } else {
        state.layout.elements[this.index].transform.a = -state.layout.elements[
          this.index
        ].transform.a
        state.layout.elements[this.index].transform.b = -state.layout.elements[
          this.index
        ].transform.b
      }
    },
    rotateXHandler() {
      if (this.isGroup) {
        state.layout.elements[this.index].elements[
          this.elementIndex
        ].transform.c = -state.layout.elements[this.index].elements[
          this.elementIndex
        ].transform.c
        state.layout.elements[this.index].elements[
          this.elementIndex
        ].transform.d = -state.layout.elements[this.index].elements[
          this.elementIndex
        ].transform.d
      } else {
        state.layout.elements[this.index].transform.c = -state.layout.elements[
          this.index
        ].transform.c
        state.layout.elements[this.index].transform.d = -state.layout.elements[
          this.index
        ].transform.d
      }
    }
  }
}
</script>