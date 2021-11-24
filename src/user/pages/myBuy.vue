<template>
  <div class="vx-myCollect">
    <VxLoading v-if="loading" />
    <div v-if="userCenterListTotal === 0" class="vx-collect-nodata">
      还没有开通购买功能，
      <a @click="$router.push('/mall/modelCenter')">先去免费中心看看吧</a>
    </div>
    <transition-group
      v-on:before-enter="beforeEnter"
      enter-active-class="animated bounceInRight"
      name="list-complete"
      tag="p"
    >
      <VxUserBuy
        v-for="(item,index) in orderList"
        :key="index"
        :index="index"
        class="list-complete-item"
        :buyInfo="item"
      />
    </transition-group>
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
import { orderList } from 'src/api/api'
import { log } from 'src/design/utils'
const VxUserBuy = () => import('./components/userBuy')
export default {
  name: 'vx-vxMyBuy',
  data() {
    return {
      dataTotalLin: '',
      loading: true,
      orderList: [],
      currentPage: 1, // 当前页码
      pageSize: 5, // 每页大小
      userCenterListTotal: 0, // 数据总数量
      activeName: 0
    }
  },
  components: {
    VxUserBuy
  },
  created() {
    this.getDate()
  },
  methods: {
    beforeEnter(el) {
      let delayNum = parseInt(el.getAttribute('index')) * 100 + 'ms'
      el.style.animationDelay = delayNum
    },
    getDate() {
      this.orderList = []
      this.loading = true
      let parm = {
        type: 0,
        page: this.currentPage,
        limit: this.pageSize
      }
      orderList(parm)
        .then(res => {
          this.userCenterListTotal = res.data.total
          this.orderList = [...res.data.list]
          this.loading = false
        })
        .catch(err => {
          this.loading = false
          log.danger(err)
        })
    },
    // 长度改变----改变每页显示的条数的时候  自动触发
    handleSizeChange(val) {
      this.pageSize = val
      this.getDate()
    },
    // 当前改变----当前页码改变之后，触发这个函数
    handleCurrentChange(val) {
      this.currentPage = val
      this.getDate()
    }
  }
}
</script>
