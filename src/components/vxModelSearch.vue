<template>
  <div class="hotSearch">
    <div class="text">精彩设计，随时随地</div>
    <div class="vx-search vx-search-page__search">
      <span>
        <div class="vx-search__view">
          <input
            type="search"
            placeholder="搜索海量模板"
            maxlength="50"
            class="vx-search__input"
            style="width: 40rem; padding: 0px 20px;"
            @keyup.enter="searchInpChange"
            v-model.trim="searchInpVal"
          />
          <i @click="searchInpChange" class="el-icon-search"></i>
        </div>
      </span>
      <!-- <button class="vx-search__btn">
        <span class="gd-button__content" @click="searchInpChange">搜索</span>
      </button>-->
    </div>
    <div class="vx-search-page__tip">
      <div>
        <span class="vx-search-page__label">热门搜索：</span>
        <!-- 热门搜索 关键词 -->
        <span
          class="vx-search-page__label vx-search-page__hot-key"
          v-for="(item, index) in hotSearchList"
          :key="index"
          @click="hotSearchFun(index)"
          ref="hotSearchValue"
        >{{item}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getHotWord } from '../api/api'

export default {
  name: 'vx-vxModelSearch',
  data() {
    return {
      searchInpVal: '',
      // 热门搜索 关键词
      hotSearchList: [],
    }
  },
  methods: {
    // 热门搜索
    hotSearchFun(index) {
      //这个是获取当前hotSearchValue值，用index来区分当前元素是v-for 产生的数组中的第几个数
      let hotSearchVal = this.$refs.hotSearchValue[index].innerText
      this.$emit('keyWord', hotSearchVal)
      // 点击 热词时  将热词传到输入框
      this.searchInpVal = hotSearchVal
    },
    //搜索框 搜索
    searchInpChange() {
      if (this.searchInpVal.length != 0) {
        this.$emit('keyWord', this.searchInpVal)
      }
    },
  },
  created() {
    // 请求热门词组
    getHotWord().then((res) => {
      this.hotSearchList = res.data.list
    })
  },
}
</script>