<template>
  <div class="design-result" @click.stop :class="{'is-show': isShow, 'is-hide': !isShow}">
    <ul class="res-list">
      <li @click="togglePanelHandler(0)" :class="{active: panelShow === 0}">
        <vx-once-tooltip />
        <i :class="{'active-panel-icon': panelShow === 0}">
          <vx-icon name="template" />
          <span>模板</span>
        </i>
      </li>
      <li @click="togglePanelHandler(1)" :class="{active: panelShow === 1}">
        <i :class="{'active-panel-icon': panelShow === 1}">
          <vx-icon name="text" />
          <span>文字</span>
        </i>
      </li>
      <li @click="togglePanelHandler(2)" :class="{active: panelShow === 2}">
        <i :class="{'active-panel-icon': panelShow === 2}">
          <vx-icon name="element" />
          <span>图形</span>
        </i>
      </li>
      <li @click="togglePanelHandler(3)" :class="{active: panelShow === 3}">
        <i :class="{'active-panel-icon': panelShow === 3}">
          <vx-icon name="background" />
          <span>背景</span>
        </i>
      </li>
      <li @click="togglePanelHandler(4)" :class="{active: panelShow === 4}">
        <i :class="{'active-panel-icon': panelShow === 4}">
          <vx-icon name="upload" />
          <span>上传</span>
        </i>
      </li>
    </ul>
    <ul class="tool-help">
      <li @click="togglePanelHandler(5)" :class="{active: panelShow === 5}">
        <i :class="{'active-panel-icon': panelShow === 5}">
          <vx-icon name="keyboard" />
          <span>快捷键</span>
        </i>
      </li>
      <!-- <li @click="togglePanelHandler(6)" :class="{active: panelShow === 6}">
                    <i>
                        <vx-icon name="help"/>
                        <span>帮助</span>
                    </i>
      </li>-->
    </ul>
    <div class="res-panel">
      <vx-panel @close="panelShow = -1" :show="panelShow" />
    </div>
  </div>
</template>
<script>
const VxPanel = () => import('src/design/view/panel/panel')
const VxOnceTooltip = () => import('./tooltip')
export default {
  name: 'design-aside',
  components: {
    VxPanel,
    VxOnceTooltip
  },
  data() {
    return {
      panelShow: -1,
      selectWidget: null
    }
  },
  computed: {
    isShow() {
      return this.panelShow !== -1
    }
  },
  methods: {
    // 切换面板
    togglePanelHandler(panel) {
      if (panel === this.panelShow) {
        this.panelShow = -1
      } else {
        this.panelShow = panel
      }
    },
    selectHandler() {
      this.panelShow = -1
    },
    addHandler(data) {
      this.$emit('add', data)
    }
  },
  mounted() {
    window.addEventListener('click', this.selectHandler)
  }
}
</script>