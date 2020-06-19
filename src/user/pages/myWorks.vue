<template>
  <!-- 最外层大盒子 -->
  <div class="vx-myWorks-warp">
    <!-- 创建新作品 -->

    <transition-group
      enter-active-class="animated bounceInRight"
      v-on:before-enter="beforeEnter"
      name="list-complete"
      tag="p"
    >
      <div
        class="vx-myWorks-warp-makePro"
        :style="{'width':isCollapse ? '250px':'280px'}"
        key="new"
        @click="goEdit('/design')"
      >
        <div class="vx-myWorks-warp-makePro-add">
          <div class="add-border">
            <i class="el-icon-plus"></i>
          </div>
        </div>
        <div class="vx-myWorks-warp-makePro-text">创建新作品</div>
      </div>
      <VxUserPicModel
        class="list-complete-item"
        v-for="(item,index) in UserPicModel"
        :key="item.id"
        :item="item"
        :index="index"
        @delete="deleteHandler"
      ></VxUserPicModel>
    </transition-group>

    <!-- <div v-if="userCenterListTotal === 0" class="dataTotalLin">←您还未创建作品,左键点击创建新作品</div> -->
    <VxLoading class="vxLoading" v-if="loading" />
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
const VxUserPicModel = () => import('./components/userPicModel')
import { userCenterList } from 'src/api/api'
import { log } from 'src/design/utils'
import state from 'src/store'
export default {
  name: 'vx-vxMyWorks',
  data() {
    return {
      UserPicModel: [],
      currentPage: 1, // 当前页码
      pageSize: 11, // 每页大小
      userCenterListTotal: 0, // 数据总数量
      loading: true
    }
  },
  components: { VxUserPicModel },
  created() {
    this.getDate()
  },
  computed: {
    isCollapse() {
      return state.state.isCollapse
    }
  },
  methods: {
    beforeEnter(el) {
      let delayNum = parseInt(el.getAttribute('index')) * 100 + 'ms'
      el.style.animationDelay = delayNum
    },
    goEdit(page) {
      const { href } = this.$router.resolve({
        path: page + '/new'
      })
      window.open(href, '_blank')
    },
    getDate() {
      this.loading = true
      let param = {
        type: 0,
        page: this.currentPage,
        limit: this.pageSize
      }
      userCenterList(param)
        .then(res => {
          this.userCenterListTotal = res.data.total
          // goodsId
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
      // this.loading = true
      // this.getDate()
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
