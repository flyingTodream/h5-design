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
const modelSearch = () => import("../components/vxModelSearch");
const VxModelBanner = () => import("../components/vxModelBanner");
import { goodsList } from "../api/api";
import vxWaterfall from "../components/vxWaterfall";
export default {
  name: "vx-vxModelShow",
  components: {
    VxModelBanner,
    modelSearch,
    vxWaterfall,
  },
  data() {
    return {
      currentSubCategory: [],
      count: 10,
      loading: false,
      keyWord: "",
      isSelected: false,
      page: 1,
      noMore: false,
      actives: true,
      categoryListProps: [],
      categoryId: 0,
    };
  },
  methods: {
    // 新增： 点击全部加载数据
    getAllListData() {
      let param = {
        keyword: this.keyWord,
        page: this.page,
        limit: 35,
        categoryId: this.categoryId,
      };
      goodsList(param).then((res) => {
        this.currentSubCategory = this.currentSubCategory.concat(res.data.list);
        if (this.currentSubCategory.length >= res.data.total) {
          this.noMore = true;
        }
        this.loading = false;
        this.page++;
      });
    },

    scrollData() {
      var io = new IntersectionObserver((entries) => {
        let item = entries[0]; // 拿第一个就行，反正只有一个
        if (item.isIntersecting) {
          if (!this.noMore && !this.loading) {
            this.scrollgetDataList();
          }
        }
      });
      io.observe(document.querySelector("#buttom"));
    },
    // 新增： 数据列表请求
    getCardList() {
      let param = {
        keyword: this.keyWord,
        page: this.page,
        limit: 35,
        categoryId: this.categoryId,
      };
      goodsList(param).then((res) => {
        this.currentSubCategory = res.data.list;
        if (this.currentSubCategory.length == 0) {
          this.noMore = true
        } else {
          this.noMore = false
        }
        this.loading = false;
        this.page++;
      });
    },


    // 滑动加载数据
    scrollgetDataList() {
      this.loading = true;
      let param = {
        keyword: this.keyWord,
        page: this.page,
        limit: 35,
        categoryId: this.categoryId,
      };
      //分类目录 当前分类数据接口
      goodsList(param).then((res) => {

        this.currentSubCategory = this.currentSubCategory.concat(res.data.list)
        console.log(res.data)
        console.log(this.currentSubCategory)
        if (this.currentSubCategory.length >= res.data.total) {
          this.noMore = true
        }
        this.loading = false;
        this.page++;
      });
    },
    //修改：点击分类时请求数据
    getDataList(para) {
      // 点击分类的时候 将搜索框内的文字 清空
      if (this.$refs.banner.activeClass != 0) {
        this.$refs.modelSea.searchInpVal = "";
      }
      this.noMore = true;
      this.keyWord = null;
      if (para.type) {
        this.page = 1;
        this.categoryId = para.id;
      }
      let bannerHeight = this.$refs.banner.$el.clientHeight;
      let seachHeight = this.$refs.modelSea.$el.clientHeight;
      this.clientHeight = `${document.documentElement.clientHeight}`;
      let bottomBanner = this.clientHeight - bannerHeight - seachHeight - 20;

      this.scrollgetDataList();
      this.noMore = false;
      if (bottomBanner > this.$refs.waterfall.bottomTop) {
        this.scrollgetDataList();
        this.noMore = true;
      }
      if(this.currentSubCategory.length == 0) {
        this.getCardList()
        this.noMore = false
      } else if (bottomBanner > this.$refs.waterfall.bottomTop) {
        this.scrollgetDataList()
        this.noMore = true
      } else {
        this.currentSubCategory = [...[]]
      }


      this.$refs.waterfall.bottomTop = 0;
    },
    //搜索框搜索  热词搜索
    searchHandler(val) {
      this.keyWord = val;
      this.categoryId = 0;
      this.page = 1;
      this.noMore = false;
      this.$refs.banner.activeClass = null;
      this.$refs.banner.activeClassFirst = null;
      let params = {
        keyword: this.keyWord,
        page: this.page,
        limit: 35,
        categoryId: this.categoryId,
      }
      goodsList(params).then((res) => {
        console.log(res.data)
        this.currentSubCategory = res.data.list
      });
      
      this.$refs.waterfall.bottomTop = 0;
    },
    // 模板跳转到编辑器
    goEditHandler(id) {
      const { href } = this.$router.resolve({
        path: "/design",
        query: {
          id: id,
        },
      });
      window.open(href, "_blank");
    },
  },
  mounted() {
    this.scrollData();
  },
};
</script>