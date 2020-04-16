<template>
  <div class="editor-element editor-element-group" :style="elementStyles">
    <template v-for="(item, i) in data.elements">
      <vx-group-text
        :class="{
                    'editor-element-selected': itemSelected === `${index}-${i}`
                }"
        v-model="item.content"
        :index="i"
        :parent="index"
        :zoom="zoom"
        :editor="editor===`${index}-${i}`"
        @event="selectWidgetHandler"
        v-if="item.type==='text'"
        :data.sync="item"
        :key="item.id"
      />
      <vx-group-three-text
        :class="{'editor-element-selected':selectedItem.includes(index)}"
        v-model="item.content"
        :index="i"
        :zoom="zoom"
        :editor="editor===`${index}-${i}`"
        @event="selectWidgetHandler"
        v-if="item.type==='threeText'"
        :data.sync="item"
        :key="item.id"
      />
      <vx-group-image
        :class="{
                'editor-element-selected': itemSelected === `${index}-${i}`
            }"
        :zoom="zoom"
        :index="i"
        :parent="index"
        @event="selectWidgetHandler"
        :cutable="cutable&&selected.index === i"
        v-if="['image', 'mask'].includes(item.type)"
        :data.sync="item"
        :key="item.id"
      />
      <vx-group-svg
        :class="{
                'editor-element-selected': itemSelected === `${index}-${i}`
            }"
        :zoom="zoom"
        ref="groupsvg"
        v-show="type !== 'print'"
        :index="i"
        :parent="index"
        @event="selectWidgetHandler"
        :cutable="cutable&&selected.index === i"
        v-if="['svg'].includes(item.type)"
        :data.sync="item"
        :key="item.id"
      />
    </template>
    <i class="border-before"></i>
  </div>
</template>
<script>
import { getter } from 'src/design/store'
import VxGroupText from './text'
import VxGroupThreeText from './threeText'
import VxGroupImage from './image'
import VxGroupSvg from './svg'
export default {
  name: 'vx-editor-group',
  props: {
    data: {},
    zoom: {
      type: Number,
      default: 0
    },
    index: Number,
    editor: String,
    selected: {},
    cutable: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  computed: {
    elementStyles() {
      let transform = this.data.transform || { a: 0, b: 0, c: 0, tx: 0, ty: 0 }
      return {
        opacity: this.data.opacity,
        transform: `matrix(${transform.a},${transform.b},${transform.c},${transform.d},${transform.tx},${transform.ty})`,
        width: (this.data.width * this.zoom || 0) + 'px',
        height: (this.data.height * this.zoom || 0) + 'px',
        top: (this.data.top * this.zoom || 0) + 'px',
        left: (this.data.left * this.zoom || 0) + 'px'
      }
    },
    itemSelected() {
      let current = getter.current()
      if (current.id === -1) return
      return `${current.id}-${current.index}`
    }
  },
  components: {
    VxGroupText,
    VxGroupThreeText,
    VxGroupImage,
    VxGroupSvg
  },
  methods: {
    selectWidgetHandler(data) {
      this.$emit('event', data)
    }
  }
}
</script>