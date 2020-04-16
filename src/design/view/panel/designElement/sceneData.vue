<template>
  <div class="design-resource-scene-content">
    <ul>
      <li @click="selectHandler(item.id)" v-for="(item,index) in previewList" :key="index">
        <img :src="item.preview.url" />
      </li>
    </ul>
  </div>
</template>
<script>
import { getter, mitation } from 'src/design/store'
import { API } from 'src/design/utils'
export default {
  name: 'vx-scene-data',
  data() {
    return {
      previewList: [],
      l: 0,
      t: 0
    }
  },
  props: {
    id: Number
  },
  created() {
    this.getDataHandler()
  },
  computed: {
    len() {
      let arr = getter.layout().elements || []
      return arr.length
    }
  },
  methods: {
    getDataHandler() {
      let param = {
        page_num: 1,
        page_size: 5,
        category_id: this.id,
        platforms: 2018,
        channels: 57
      }
      this.$axios.get(API.MATERIALS_LIST_API, param).then(res => {
        this.previewList.length = 0
        this.previewList = [...res.data.slice(0, 3)]
      })
    },
    selectHandler(id) {
      this.setTextPositionHandler()
      this.$axios.get(`${API.TEMPLATE_API}/114382`, { id: id }).then(data => {
        data.data.left = this.l
        data.data.top = this.t
        mitation.addImage(data.data)
        this.addHandler()
      })
    },
    addHandler() {
      this.$emit('add', {
        id: this.len - 1,
        type: 'widget'
      })
    },
    setTextPositionHandler() {
      if (getter.canvasH() - 80 < this.t) {
        this.l += 40
        this.t = 0
      }
      this.t += 40
      this.l += 40
      if (getter.canvasW() - 80 < this.l) {
        this.t = 0
        this.l = 0
      }
    }
  }
}
</script>