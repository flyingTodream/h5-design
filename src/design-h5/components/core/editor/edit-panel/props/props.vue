<template>
  <div class="vx-h5edit-props">
    <div v-if="editingElement === 'noselect'">请先选择一个元素</div>
    <VxPropsText v-if="editingElement.name === 'vx-text'" />
    <VxPropsPicture v-if="editingElement.name === 'vx-picture'" />
    <VxPropsButton v-if="editingElement.name === 'vx-button'" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
const VxPropsText = () => import('./text')
const VxPropsPicture = () => import('./picture')
const VxPropsButton = () => import('./button')
export default {
  components: {
    VxPropsText,
    VxPropsPicture,
    VxPropsButton
  },
  computed: {
    ...mapState('editor', {
      stateEditingElement: state => state.editingElement
    }),
    editingElement() {
      if (!this.stateEditingElement) {
        return 'noselect'
      } else {
        return this.stateEditingElement
      }
    }
  }
}
</script>