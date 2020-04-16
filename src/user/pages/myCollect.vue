<template>
  <div class="vx-myCollect" ref="scrollTopDiv">
    <VxLoading v-if="loading" />
    <transition-group
      name="list-complete"
      enter-active-class="animated bounceInRight"
      v-on:before-enter="beforeEnter"
      tag="p"
    >
      <VxUserMyCollect
        v-for="(item,index) in UserPicModel"
        :key="item.valueId"
        :item="item"
        :index="index"
        @delete="deleteHandler"
        class="list-complete-item"
      />
    </transition-group>
    <div v-show="userCenterListTotal === 0" class="vx-collect-nodata">
      <div class="clickColl">
        您还未收藏过任何模板，
        <a @click="$router.push('/mall/modelCenter')">立马去商城逛逛</a>
      </div>
    </div>
    <!-- 分页 -->
    <div v-if="userCenterListTotal > pageSize" class="paginationFenYe">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="userCenterListTotal"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
const VxUserMyCollect = () => import('./components/userCollect')
import { collectList } from 'src/api/api'
import { log } from 'src/design/utils'
export default {
  name: 'vx-vxMyCollect',
  data() {
    return {
      loading: true,
      UserPicModel: [],
      currentPage: 1, // 当前页码
      pageSize: 12, // 每页大小
      userCenterListTotal: 0 // 数据总数量
    }
  },
  components: { VxUserMyCollect },
  mounted() {
    this.getDate()
  },
  methods: {
    beforeEnter(el) {
      let delayNum = parseInt(el.getAttribute('index')) * 100 + 'ms'
      el.style.animationDelay = delayNum
    },
    getDate() {
      let param = {
        type: 0,
        page: this.currentPage,
        limit: this.pageSize
      }
      collectList(param)
        .then(res => {
          this.userCenterListTotal = res.data.total
          this.UserPicModel.length = 0
          this.UserPicModel = [...res.data.list]

          this.loading = false
        })
        .catch(err => {
          this.loading = false
          log.danger(err)
        })
    },
    deleteHandler(index) {
      this.UserPicModel.splice(index, 1)
      if (this.UserPicModel.length <= 0) {
        this.getDate()
      }
    },
    // 长度改变----改变每页显示的条数的时候  自动触发
    handleSizeChange(val) {
      this.pageSize = val
      this.getDate()
    },
    // 当前改变----当前页码改变之后，触发这个函数
    handleCurrentChange(val) {
      this.UserPicModel = []
      this.loading = true
      this.currentPage = val
      this.getDate()
    }
  }
}
</script>

