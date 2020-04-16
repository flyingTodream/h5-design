<template>
  <div class="panel">
    <vx-design-template @select="SelectHandler" v-show="show === 0" />
    <vx-design-text @add="addHandler" @select="SelectHandler" v-show="show === 1" />
    <vx-design-element @add="addHandler" @select="SelectHandler" v-show="show === 2" />
    <vx-design-background @select="SelectHandler" v-show="show === 3" />
    <vx-upload v-show="show === 4" />
    <VxKeybord @close="closeHandler" v-show="show === 5" />
  </div>
</template>
<script>
const VxDesignTemplate = () => import('./designTemplate')
const VxDesignText = () => import('./designText')
const VxDesignElement = () => import('./designElement')
const VxDesignBackground = () => import('./designBackground')
const VxUpload = () => import('./upload')
const VxKeybord = () => import('./keybord')
export default {
  name: 'vx-panel',
  props: {
    show: Number
  },
  components: {
    VxDesignTemplate,
    VxDesignText,
    VxDesignElement,
    VxDesignBackground,
    VxUpload,
    VxKeybord
  },
  methods: {
    SelectHandler() {
      this.$parent.selectHandler()
    },
    addHandler(data) {
      this.$parent.addHandler(data)
    },
    closeHandler() {
      this.$emit('close')
    }
  }
}
</script>