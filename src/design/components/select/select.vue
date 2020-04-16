<template>
  <div class="vx-select">
    <div class="vx-select-input" :class="{active: active}" @click.stop="showSelectListHandler">
      <div v-show="!isInput" @dblclick="showInputHandler">
        <template v-if="$slots.label">
          <slot name="label" />
        </template>
        <span v-else>{{selected}}</span>
      </div>
      <input ref="input" @blur="hideInputHandler" v-show="isInput" type="text" v-model="selected" />
    </div>
    <div v-show="isShowSelectList" class="vx-select-content">
      <ul class="vx-select-list">
        <slot />
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'vx-select',
  props: {
    value: [Number, String],
    minValue: Number,
    maxValue: Number
  },
  data() {
    return {
      selected: this.value,
      isShowSelectList: false,
      isInput: false,
      type: null,
      active: false
    }
  },
  mounted() {
    window.removeEventListener('click', this.hideSelectListHandler)
    window.addEventListener('click', this.hideSelectListHandler)
  },
  methods: {
    showSelectListHandler() {
      this.isShowSelectList = true
      this.active = true
    },
    hideSelectListHandler() {
      this.isShowSelectList = false
      this.isInput = false
      this.active = false
    },
    selectHandler(data) {
      this.selected = data
      this.hideSelectListHandler()
    },
    showInputHandler() {
      this.isInput = true
      this.active = true
      this.$nextTick(() => {
        this.$refs.input.focus()
        this.$emit('edit')
      })
    },
    hideInputHandler() {
      this.isInput = false
      this.active = false
      let value = this.selected
      if (value === '') return
      if (value < this.minValue) {
        this.$emit('input', this.minValue)
        this.selected = this.minValue
      } else if (value > this.maxValue) {
        this.$emit('input', this.maxValue)
        this.selected = this.maxValue
      } else {
        this.$emit('input', value)
        this.selected = value
      }
    }
  },
  watch: {
    selected(val) {
      // 存在问题
      if (typeof val === this.type) {
        this.$emit('input', val)
      } else {
        if (val === '') {
          this.$emit('input', '')
          return
        }

        if (this.type === 'number') {
          if (/^\d+/.test(val)) {
            let value = parseInt(val)
            this.$emit('input', value)
            this.selected = value
          } else {
            this.$emit('input', '')
            this.selected = ''
          }
          return
        }
        this.$emit('input', val)
      }
    },
    value(val) {
      this.selected = val
    }
  }
}
</script>