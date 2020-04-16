<template>
  <div class="vx-h5-panel-image">
    <div class="h5-panel-image-title">组件</div>
    <div class="h5-panel-component-item">
      <div class="component-item-title">互动</div>
      <div class="component-item-list">
        <ul>
          <li @click.stop="addComponentHandler('vx-map')">
            <vx-icon name="h5-map"></vx-icon>
            <span>地图</span>
          </li>
          <li @click.stop="addComponentHandler('vx-call')">
            <vx-icon name="h5-call"></vx-icon>
            <span>一键拨号</span>
          </li>
          <li @click.stop="addComponentHandler('vx-link')">
            <vx-icon name="h5-link"></vx-icon>
            <span>跳转链接</span>
          </li>
          <li @click.stop="addComponentHandler('vx-form')">
            <vx-icon name="h5-form"></vx-icon>
            <span>表单</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="h5-panel-component-item">
      <div class="component-item-title">互动</div>
      <div class="component-item-list">
        <ul>
          <li>
            <vx-icon name="h5-map"></vx-icon>
            <span>地图</span>
          </li>
          <li>
            <vx-icon name="h5-map"></vx-icon>
            <span>地图</span>
          </li>
          <li>
            <vx-icon name="h5-map"></vx-icon>
            <span>地图</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import Element from '../modules/element'
export default {
  name: 'vx-component',
  methods: {
    ...mapActions('editor', ['elementManager']),
    addComponentHandler(name) {
      const element = new Element({ name })
      this.elementManager({
        type: 'add',
        value: element
      })
      this.$emit('close')
    }
  }
}
</script>