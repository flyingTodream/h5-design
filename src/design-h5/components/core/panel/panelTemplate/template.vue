<template>
  <div @click.stop class="vx-h5-template">
    <VxImage @close="colseHandler" v-show="showPanel === 1" />
    <VxFont @close="colseHandler" v-show="showPanel === 2" />
    <VxComponent @close="colseHandler" v-show="showPanel === 3" />
  </div>
</template>
<script>
import VxImage from './image'
import VxFont from './font'
import VxComponent from './component'
export default {
  name: 'vx-h5-template',
  components: {
    VxImage,
    VxFont,
    VxComponent
  },
  props: {
    showPanel: {
      type: Number,
      defult: -1
    },
    name: {
      type: String,
      defult: ''
    }
  },
  methods: {
    colseHandler() {
      this.$emit('close')
    }
  }
}
</script>