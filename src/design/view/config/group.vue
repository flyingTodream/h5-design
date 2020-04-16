<template>
  <div class="vx-config-group">
    <div v-if="isSplitable" @click="setSplitHandler" class="vx-config-group-button">拆分组</div>
    <div v-if="isGroupable" @click="setGroupHandler" class="vx-config-group-button">成组</div>
    <!-- <div v-if="isSplitable && index == -1" class="vx-config-group-panel">
      <div class="vx-config-group-panel-icon">
        <div>
          <vx-icon title="上对齐" name="align-top"></vx-icon>
          <vx-icon title="水平居中对齐" name="align-center"></vx-icon>
          <vx-icon title="下对齐" name="align-bottom"></vx-icon>
        </div>
        <div>
          <vx-icon title="左对齐" name="align-left"></vx-icon>
          <vx-icon title="垂直居中对齐" name="align-middle"></vx-icon>
          <vx-icon title="右对齐" name="align-right"></vx-icon>
        </div>
      </div>
      <div class="vx-config-group-panel-distribution">
        <div class="vx-config-group-panel-distribution-left">水平分布</div>
        <div>垂直分布</div>
      </div>
    </div>-->
  </div>
</template>
<script>
import { mitation, getter } from 'src/design/store'
export default {
  name: 'vx-group',
  props: {
    index: {
      type: Number
    }
  },
  computed: {
    isGroupable() {
      return getter.isGroupable()
    },
    isSplitable() {
      return getter.isSplitable()
    }
  },
  methods: {
    setSplitHandler() {
      mitation.setSplit()
    },
    setGroupHandler() {
      mitation.setGroup()
    }
  }
}
</script>