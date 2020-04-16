<template>
  <div class="vx-h5design-panel">
    <div class="vx-h5-panel">
      <ul>
        <li
          v-for="(item,index) in panelList"
          :class="{'active':activePanel === item.index}"
          @click.stop="clickHandler(item.index)"
          :key="index"
        >
          <i class="h5-panel-item">
            <vx-icon :name="item.icon"></vx-icon>
            <span>{{item.name}}</span>
          </i>
        </li>
      </ul>
    </div>
    <VxTemplate @close="colseHandler" v-show="activePanel !== -1" :showPanel="activePanel" />
  </div>
</template>
<script>
import VxTemplate from './panelTemplate'
export default {
  name: 'vx-h5-panel',
  components: {
    VxTemplate
  },
  data() {
    return {
      activePanel: -1,
      panelList: [
        {
          index: 1,
          icon: 'h5-image',
          name: '照片'
        },
        {
          index: 2,
          icon: 'h5-font',
          name: '文字'
        },
        {
          index: 3,
          icon: 'h5-component',
          name: '组件'
        }
      ]
    }
  },
  mounted() {
    window.addEventListener('click', () => {
      this.activePanel = -1
    })
  },
  methods: {
    clickHandler(index) {
      if (index == this.activePanel) {
        this.activePanel = -1
      } else {
        this.activePanel = index
      }
    },
    colseHandler() {
      this.activePanel = -1
    }
  }
}
</script>