<template>
  <vx-template class="design-resource-element">
    <template v-slot:label>
      <h2>图形</h2>
    </template>
    <div class="design-resource-scene">
      <div v-for="(item,index) in templateList" :key="index">
        <div class="design-resource-scene-name">
          <span>{{item.name}}</span>
          <span @click="showContentHandler(item)" class="design-resource-scene-name-all">
            全部
            <i class="el-icon-arrow-right"></i>
          </span>
        </div>
        <VxSceneData @add="addHandler" :id="item.id" />
      </div>
    </div>
  </vx-template>
</template>
<script>
import VxTemplate from '../template'
import VxSceneData from './sceneData'
import { API, log } from 'src/design/utils'
export default {
  name: 'vx-element-scene',
  components: {
    VxTemplate,
    VxSceneData
  },
  data() {
    return {
      templateList: []
    }
  },
  mounted() {
    this.getDataHandler()
  },
  methods: {
    getDataHandler() {
      this.$axios
        .get(API.CATEGORIES_API)
        .then(data => {
          this.templateList.length = 0
          this.templateList = [...data.data]
        })
        .catch(err => {
          log.danger(err)
        })
    },

    showContentHandler(item) {
      this.$emit('showContent', item)
    },
    addHandler(data) {
      this.$emit('add', data)
    }
  }
}
</script>
<style scoped>
.design-resource__content {
  overflow: auto;
}
</style>