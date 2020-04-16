<template>
  <vxDesignH5 />
</template>

<script>
const vxDesignH5 = () => import('./views/Editor')
export default {
  name: 'app',
  components: {
    vxDesignH5
  },
  computed: {
    store() {
      return state
    }
  }
}
</script>

<style lang="scss">
* {
  &:focus {
    outline: none;
  }
}
</style>
