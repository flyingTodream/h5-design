<template>
  <div class="vx-h5-panel-image">
    <div class="h5-panel-image-title">文字</div>
    <div class="h5-panel-image-button">
      <el-button @click.stop="addFontHandler">
        <vx-icon name="h5-plus"></vx-icon>
        <span class="panel-image-button-text">添加文字</span>
      </el-button>
    </div>
    <ul>
      <!-- <li
        @click.stop="selectHandler(item.preview.url)"
        v-for="(item,index) in imageList"
        :key="index"
      >
        <img :src="item.preview.url" />
      </li>-->
    </ul>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import Element from '../modules/element'
export default {
  name: 'vx-font',
  methods: {
    ...mapActions('editor', ['elementManager']),
    addFontHandler() {
      const name = 'vx-text'
      const font = new Element({ name })
      this.elementManager({
        type: 'add',
        value: font
      })
      this.$emit('close')
    }
  }
}
</script>