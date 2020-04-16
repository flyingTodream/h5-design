<template>
  <a-button class="shortcut-button" :class="{'disable':disable}" @click="onClickHandler">
    <i class="shortcut-icon fa" :class="icon" aria-hidden="true" />
    <span>{{item.title}}</span>
  </a-button>
</template>
<script>
export default {
  props: {
    item: {
      required: true,
      type: Object
    },
    clickFn: {
      required: false,
      type: Function
    }
  },
  computed: {
    icon() {
      return `fa-${this.item.icon}`
    },
    disable() {
      return this.item.disabled
    }
  },
  methods: {
    onClickHandler() {
      this.clickFn(this.item)
    }
  }
}
</script>