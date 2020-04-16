<template>
  <div class="vx-h5-panel-image">
    <div class="h5-panel-image-title">照片</div>
    <ul class="panel-image-list">
      <li
        class="panel-image-item"
        @click.stop="selectHandler(item.preview.url)"
        v-for="(item,index) in imageList"
        :key="index"
      >
        <img :src="item.preview.url" />
      </li>
    </ul>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import Element from '../modules/element'
export default {
  data() {
    return {
      imageList: require('./image.json')
    }
  },
  methods: {
    ...mapActions('editor', ['elementManager']),
    selectHandler(url) {
      const name = 'vx-picture'
      const Image = new Element({ name, url })
      console.log(Image)
      this.elementManager({
        type: 'add',
        value: Image
      })
      this.$emit('close')
    }
  }
}
</script>