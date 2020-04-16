<template>
  <vx-design-layout></vx-design-layout>
</template>

<script>
import { state } from 'src/design/store'
const VxDesignLayout = () => import('src/design/view/layout')
export default {
  name: 'app',
  components: {
    VxDesignLayout
  },
  computed: {
    store() {
      return state
    }
  }
}
</script>