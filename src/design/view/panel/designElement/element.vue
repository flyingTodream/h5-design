<template>
  <vx-template class="design-resource-element">
    <template v-slot:label>
      <h2>图形</h2>
    </template>
    <div class="design-resource-scene">
      <div class="design-resource-element-list">
        <ul>
          <li @click="selectHandler(item.id)" v-for="(item, index) in templateList" :key="index">
            <el-image fit="contain" class="design-resource-element-item" :src="item.typefacePath">
              <div slot="placeholder" class="image-slot"></div>
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </li>
          <div id="element-bottom" class="load-bottom"></div>
        </ul>
      </div>
      <VxLoading v-if="loading" />
      <p class="nomore-text" v-if="noMore">已全部加载完</p>
    </div>
  </vx-template>
</template>
<script>
import VxTemplate from '../template'
import { mitation, getter } from 'src/design/store'
// import VxSceneData from './sceneData'
import { API, log } from 'src/design/utils'
// import VxLoadmore from 'src/design/components/loadmore'
export default {
  name: 'vx-element-scene',
  components: {
    VxTemplate
  },
  data() {
    return {
      templateList: [],
      loading: true,
      pageNum: 1,
      // totalPages: 10,
      noMore: false
    }
  },
  computed: {},
  async mounted() {
    await this.getDataHandler()
    this.scrollData()
  },
  methods: {
    scrollData() {
      var elementIo = new IntersectionObserver(entries => {
        let item = entries[0] // 拿第一个就行，反正只有一个
        if (item.isIntersecting) {
          if (!this.noMore) {
            this.getDataHandler()
          }
        }
      })
      elementIo.observe(document.getElementById('element-bottom'))
    },
    getDataHandler() {
      this.loading = true
      let params = {
        page: this.pageNum, // 当前页
        limit: 21, // 页大小
        type: 'img', // 类别id
        l: 0,
        t: 0
      }
      this.$axios
        .get(API.EFFECTS_API, { params: params })
        .then(data => {
          this.totalPages = data.data.pages
          if (this.templateList.length >= data.data.total) {
            this.noMore = true
          }

          this.loading = false
          this.templateList = this.templateList.concat(data.data.list)
          this.pageNum++
        })
        .catch(err => {
          log.danger(err)
        })
    },
    selectHandler(id) {
      let params = {
        id: id
      }
      this.setTextPositionHandler()
      this.$axios
        .get(API.EFFECT_DETAIL_API, { params })
        .then(data => {
          console.log(data)
          const detail = JSON.parse(data.data.info.detail)
          data.left = this.l
          data.top = this.t
          mitation.addImage(detail.model)
          this.$emit('select')
        })
        .catch(err => {
          log.danger(err)
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