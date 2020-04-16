<template>
  <div class="vx-bannerDiv">
    <div>
      <div class="vx-tags vx-search-page__tags">
        <div class="vx-tags__group">
          <!-- 一级分类 -->
          <div
            class="allAllFirst vx-tags__item"
            :class="activeClassFirst == null ? 'activeFirst':''"
            @click="allFirst"
          >全部</div>
          <div class="vx-search-tags">
            <div class="vx-search-first-item">
              <div
                v-for="(item,index) in categoryListFirst"
                :key="index"
                class="vx-tags__item"
                :class="activeClassFirst == item.id ? 'activeFirst':''"
                @click="activeClassFirst != item.id && getItemFirst(item.id)"
              >{{categoryListFirst[index].name}}</div>
            </div>
            <div class="vx-tags__group">
              <!-- 二级分类 -->
              <div
                v-for="(item,index) in categoryList"
                :key="index"
                class="vx-tags__item"
                :class="activeClass == item.id ? 'active':''"
                @click="activeClass != item.id && getItem(item.id)"
              >{{categoryList[index].name}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getLevel1Category, getLevel2Category } from '../api/api'
export default {
  name: 'vx-ModelBanner',
  props: {
    activesSearch: Boolean,
    categoryListProps: Array
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      activeClass: 0, // 0为默认选择第一个，-1为不选择
      activeClassFirst: null,
      //一级分类
      categoryListFirst: [],
      // 二级分类
      categoryList: [],
      level2ListId: [],
      level2ListFirstId: 0
    }
  },
  methods: {
    // 点击全部事件
    allFirst() {
      this.activeClassFirst = null
      this.activeClass = null
      let param = {
        type: 1
      }
      this.$emit('selectCatalog', param)
      // 二级分类 还原默认
      let parms = {
        id: this.level2ListFirstId
      }
      getLevel2Category(parms).then(res => {
        this.categoryList = res.data.subCategoryList
      })
    },
    //点击 一级分类
    getItemFirst(id) {
      // 把当前点击一级分类的id，赋值给activeClassFirst 变色
      this.activeClassFirst = id
      for (let i = 0; i < this.categoryListFirst.length; i++) {
        if (this.activeClassFirst == this.categoryListFirst[i].id) {
          getLevel2Category({ id: this.categoryListFirst[i].id }).then(
            respon => {
              let getLevel2Id = respon.data.subCategoryList[0].id
              let para = {
                id: getLevel2Id,
                type: 1
              }
              this.$emit('selectCatalog', para)
            }
          )
        }
      }
      // 二级分类 根据点击的一级分类  传过来的id 去判断
      getLevel2Category({ id: id }).then(res => {
        this.categoryList = res.data.subCategoryList
      })
    },
    // 点击二级 分类
    getItem(id) {
      // 把当前点击元素的index，赋值给activeClass
      this.activeClass = id
      if (this.level2ListId.includes(id)) {
        this.activeClassFirst = this.level2ListFirstId
      }
      let para = {
        id: id,
        type: 1
      }
      this.$emit('selectCatalog', para)
    }
  },
  watch: {
    categoryListProps: function() {
      this.categoryList = this.categoryListProps
    }
  },
  computed: {
    allSearch() {
      if (this.activesSearch == true) {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    // 一级分类  默认显示
    getLevel1Category().then(res => {
      this.level2ListFirstId = res.data.categoryList[0].id
      this.categoryListFirst.length = 0
      this.categoryListFirst = res.data.categoryList
      // 二级分类  默认显示
      getLevel2Category({ id: this.level2ListFirstId }).then(respon => {
        this.categoryList = respon.data.subCategoryList
        this.level2ListId = []
        for (let i = 0; i < this.categoryList.length; i++) {
          this.level2ListId.push(this.categoryList[i].id)
        }
      })
    })
  }
}
</script>