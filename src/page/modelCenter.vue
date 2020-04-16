<template>
  <div class="scrollWrapDiv">
    <modelSearch @keyWord="searchHandler" ref="modelSea"></modelSearch>
    <VxModelBanner
      ref="banner"
      :activesSearch="actives"
      :categoryListProps="categoryListProps"
      @selectCatalog="getDataList"
    ></VxModelBanner>
    <el-backtop target=".scrollWrapDiv" :bottom="100">
      <div class="backTop">UP</div>
    </el-backtop>
    <div class="infinite-list-wrapper">
      <vxWaterfall
        :imgsArr="currentSubCategory"
        ref="waterfall"
        srcKey="picUrl"
        :over="noMore"
        :isloading="loading"
        @scrollReachBottom="scrollgetDataList"
      ></vxWaterfall>
    </div>
    <el-backtop target=".app" :bottom="100" :right="30"></el-backtop>
  </div>
</template>
<script>
const modelSearch = () => import('../components/vxModelSearch')
const VxModelBanner = () => import('../components/vxModelBanner')
import { goodsList, getLevel2Category } from '../api/api'
import vxWaterfall from '../components/vxWaterfall'
export default {
  name: 'vx-vxModelShow',
  components: {
    VxModelBanner,
    modelSearch,
    vxWaterfall
  },
  data() {
    return {
      currentSubCategory: [],
      count: 10,
      loading: false,
      keyWord: '',
      isSelected: false,
      page: 1,
      noMore: false,
      actives: true,
      categoryListProps: [],
      categoryId: 0
    }
  },
  methods: {
    scrollData() {
      var io = new IntersectionObserver(entries => {
        let item = entries[0] // 拿第一个就行，反正只有一个
        if (item.isIntersecting) {
          if (!this.noMore && !this.loading) {
            this.scrollgetDataList()
          }
        }
      })
      io.observe(document.querySelector('#buttom'))
    },
    // 滑动加载数据
    scrollgetDataList() {
      this.loading = true
      let param = {
        keyword: this.keyWord,
        page: this.page,
        limit: 35,
        categoryId: this.categoryId
      }
      //分类目录 当前分类数据接口
      goodsList(param).then(res => {
        this.currentSubCategory = this.currentSubCategory.concat(res.data.list)
        if (this.currentSubCategory.length >= res.data.total) {
          this.noMore = true
        }
        this.loading = false
        this.page++
      })
    },
    //点击分类时请求数据
    getDataList(para) {
      // 点击分类的时候 将搜索框内的文字 清空
      if (this.$refs.banner.activeClass != 0) {
        this.$refs.modelSea.searchInpVal = ''
      }
      this.noMore = false
      this.keyWord = null
      if (para.type) {
        this.page = 1
        this.categoryId = para.id
      }
      let bannerHeight = this.$refs.banner.$el.clientHeight
      let seachHeight = this.$refs.modelSea.$el.clientHeight
      this.clientHeight = `${document.documentElement.clientHeight}`
      let bottomBanner = this.clientHeight - bannerHeight - seachHeight - 20
      if (this.currentSubCategory.length == 0) {
        this.scrollgetDataList()
      } else if (bottomBanner > this.$refs.waterfall.bottomTop) {
        this.scrollgetDataList()
      } else {
        this.currentSubCategory = [...[]]
      }
      this.$refs.waterfall.bottomTop = 0
    },
    //搜索框搜索  热词搜索
    searchHandler(val) {
      this.keyWord = val
      this.categoryId = 0
      this.page = 1
      this.noMore = false
      this.$refs.banner.activeClass = null
      this.$refs.banner.activeClassFirst = null
      // 二级分类 还原默认
      getLevel2Category({ id: this.$refs.banner.level2ListFirstId }).then(
        res => {
          this.categoryListProps = res.data.subCategoryList
        }
      )
      let bannerHeight = this.$refs.banner.$el.clientHeight
      let seachHeight = this.$refs.modelSea.$el.clientHeight
      this.clientHeight = `${document.documentElement.clientHeight}`
      let bottomBanner = this.clientHeight - bannerHeight - seachHeight - 20
      if (this.currentSubCategory.length == 0) {
        this.scrollgetDataList()
      } else if (bottomBanner > this.$refs.waterfall.bottomTop) {
        this.scrollgetDataList()
      } else {
        this.currentSubCategory = [...[]]
      }
      this.$refs.waterfall.bottomTop = 0
    },
    // 模板跳转到编辑器
    goEditHandler(id) {
      const { href } = this.$router.resolve({
        path: '/design',
        query: {
          id: id
        }
      })
      window.open(href, '_blank')
    }
  },
  mounted() {
    this.scrollData()
  }
}
</script>