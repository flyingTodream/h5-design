<template>
  <div class="design-resource design-resource-element">
    <VxElementScene @add="addHandler" @showContent="showContentHandler" v-if="!showContent" />
    <VxElementContent
      @add="addHandler"
      :category="category"
      @showScene="showSceneHandler"
      v-if="showContent"
    />
  </div>
</template>
<script>
import VxElementScene from './elementScene'
import VxElementContent from './elementContent'
export default {
  name: 'vx-design-element',
  components: {
    VxElementScene,
    VxElementContent
  },
  data() {
    return {
      showContent: false,
      category: {}
    }
  },
  methods: {
    showContentHandler(item) {
      this.category = item
      this.showContent = true
    },
    showSceneHandler() {
      this.showContent = false
    },
    addHandler(data) {
      this.$emit('add', data)
    }
  }
}
</script>