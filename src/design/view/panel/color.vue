<template>
  <div class="vx-color">
    <div @click.stop class="vx-color-select" v-if="isShow">
      <Sketch v-model="color" class="vx-color-panel" />
    </div>
  </div>
</template>
<script>
import { Sketch } from 'vue-color'

export default {
  name: 'vx-color',
  props: {
    value: Boolean
  },
  data() {
    return {
      color: {
        hex8: '#ffffffff'
      },
      isShow: this.value
    }
  },

  components: {
    Sketch
  },
  mounted() {
    window.addEventListener('click', this.hideSelectHandler)
  },
  methods: {
    hideSelectHandler() {
      this.isShow = false
    }
  },
  watch: {
    isShow(value) {
      this.$nextTick(() => {
        this.$emit('input', value)
      })
    },
    value(val) {
      this.isShow = val
    },
    'color.hex8': function(val) {
      this.$emit('select', val)
    }
  }
}
</script>
<style lang="stylus" scoped>
.vx-color {
  position: relative;
}

.vx-color-select {
  position: absolute;
  top: 40px;
}

.vx-color-panel {
  z-index: 10;
}
</style>