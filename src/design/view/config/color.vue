<template>
  <div v-if="show" class="vx-color-picker vx-color-transparent">
    <span @click.stop class="vx-color-select">
      <Photoshop class="vx-color-select__panel" v-model="color"></Photoshop>
    </span>
  </div>
</template>
<script>
import { Sketch } from 'vue-color'
export default {
  name: 'vx-color',
  components: {
    Photoshop: Sketch
  },
  props: {
    show: {
      type: Boolean
    }
  },
  mounted() {
    window.addEventListener('click', () => {
      this.isShow = false
    })
  },
  data() {
    return {
      isShow: this.show,
      color: {
        hex8: this.value
      }
    }
  },
  watch: {
    color(value) {
      this.$emit('input', value.hex8)
    },
    value(value) {
      this.color.hex8 = value
    }
  }
}
</script>