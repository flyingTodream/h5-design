<template>
  <vx-template class="design-resource-text">
    <template v-slot:label>
      <h2 style="cursor: pointer;" @click="showSceneHandler">
        <i class="el-icon-arrow-left"></i>
        {{category.name}}
      </h2>
      <!-- {{category.children}} -->
    </template>
    <template>
      <div v-if="category.children.length > 0" class="design-resource-element-categories">
        <ul>
          <li :class="{'active':sel==null}" @click="selectCategoryHandler(null)">全部</li>
          <li
            v-for="(item,index) in showCategory"
            :key="index"
            :class="{'active':sel==index}"
            @click="selectCategoryHandler(index)"
          >{{item.name}}</li>
          <li v-if="showCategory.length < category.children.length" @click="showMoreHandler">更多</li>
          <li
            @click="hideMoreHandler"
            v-if="category.children.length > 6 && showCategory.length == category.children.length"
          >收起</li>
        </ul>
      </div>
      <vx-loadmore
        :loading="loading"
        :offset="0"
        :nomore="noMore"
        :initScroll="true"
        @infinite-scroll="getDataHandler()"
      >
        <div class="design-resource-element-list">
          <ul>
            <li @click="selectHandler(item.id)" v-for="(item, index) in templateList" :key="index">
              <img class="design-resource-element__list__item__preview" :src="item.preview.url" />
            </li>
          </ul>
        </div>
      </vx-loadmore>
    </template>
  </vx-template>
</template>
<script>
import { mitation, getter } from 'src/design/store'
import VxTemplate from '../template'
import VxLoadmore from 'src/design/components/loadmore'
import { API } from 'src/design/utils'

export default {
  name: 'vx-element-content',

  components: {
    VxTemplate,
    VxLoadmore
  },
  props: {
    category: Object
  },
  data() {
    return {
      templateList: [],
      loading: false,
      sel: null,
      completed: false,
      // noMore: false,
      pageNum: 0,
      totalPages: 10,
      l: 0,
      t: 0,
      showCategory: this.category.children.slice(0, 6)
    }
  },
  computed: {
    len() {
      let arr = getter.layout().elements || []
      return arr.length
    },
    noMore() {
      //当起始页数大于总页数时停止加载
      return this.pageNum >= this.totalPages
    }
  },
  mounted() {
    this.getDataHandler()
  },
  methods: {
    selectCategoryHandler(index) {
      this.sel = index
    },
    showSceneHandler() {
      this.$emit('showScene')
    },
    getDataHandler() {
      let param = {
        page_num: this.pageNum, // 当前页
        page_size: 10, // 页大小
        scene_id: 1315,
        category_id: this.category.id,
        platforms: 4096,
        channels: 33
      }
      this.$axios.get(API.MATERIALS_LIST_API, param).then(data => {
        this.loading = false
        this.templateList = this.templateList.concat(data.data)
      })
    },
    selectHandler(id) {
      this.setTextPositionHandler()
      this.$axios.get(`${API.TEMPLATE_API}/114382`, { id }).then(data => {
        data.data.left = this.l
        data.data.top = this.t
        mitation.addImage(data.data)
        this.addHandler()
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
    },
    showMoreHandler() {
      this.showCategory = [...this.category.children]
    },
    hideMoreHandler() {
      this.showCategory = [...this.category.children.slice(0, 6)]
    },
    addHandler() {
      this.$nextTick(() => {
        this.$emit('add', {
          id: this.len - 1,
          type: 'widget'
        })
      })
    }
  }
}
</script>