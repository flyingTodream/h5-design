<template>
  <div class="vx-color-picker vx-color-transparent">
    <span
      class="vx-color-context"
      :class="{'vx-color-transparent':color.hex8==='#00000000'}"
      :style="{'background':color.hex8==='#00000000' ? '' : color.hex8 }"
      @click.stop="show = !show"
    ></span>
    <!-- 'background:'+color.hex8 -->
    <span @click.stop v-if="show" class="vx-color-select">
      <Photoshop class="vx-color-select__panel" v-model="color"></Photoshop>
    </span>
  </div>
</template>
<script>
import { Sketch } from 'vue-color'
export default {
  name: 'vx-color-picker',
  components: {
    Photoshop: Sketch
  },
  props: {
    value: String
  },
  mounted() {
    window.addEventListener('click', () => {
      this.show = false
    })
  },
  data() {
    return {
      show: false,
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