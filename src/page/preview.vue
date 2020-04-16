<template>
  <!-- 详情页 整个大盒子 -->
  <div class="max-mall-preview" :key="vxShowPreview.id">
    <div class="mall-preview">
      <!-- 详情页 整个大盒子 背景为灰色 -->
      <div class="mall-preview-top">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-show="this.whereFrom" :to="{ path: '/mall/modelCenter' }">模板中心</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.whereFrom ? vxShowPreview.name:whereFromName}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 详情页 内容 -->
      <div class="mall-preview-container">
        <!-- 详情页 左边大盒子 详情 预览图片 -->
        <div class="vx-mall-preview-image-bg">
          <div
            class="mall-preview-container-left"
            :style="{width:'300px',height:height+'px',backgroundColor:color}"
            ref="prewDiv"
          >
            <img class="mall-preview-container-left-img" :src="vxShowPreview.picUrl" alt />
          </div>
        </div>
        <!-- 详情页 右边大盒子 详情 预览名称和介绍内容 -->
        <div class="mall-preview-container-right">
          <!-- 详情 预览名称  在线编辑 收藏 -->
          <div class="mall-preview-container-right-top">
            <!-- 名称 -->
            <div class="mall-preview-container-right-top-top">
              <div>{{vxShowPreview.name}}</div>
              <!-- <div>{{vxShowPreview.counterPrice}}元</div> -->
            </div>
            <div class="mall-preview-container-right-top-buttom">
              <div
                @click="goEditHandler"
                class="mall-preview-container-right-top-buttom-btn edit"
              >在线编辑</div>
              <!-- <div
                class="mall-preview-container-right-top-buttom-btn like"
                @click="vxByGoods(item)"
              >购买</div>-->
              <div
                :class="this.userHasCollect==1?'image-disable':''"
                class="mall-preview-container-right-top-buttom-btn like"
                @click="vxCollect(0,vxShowPreview.goodsId)"
              >{{this.userHasCollect == '0'?'收藏':'已收藏'}}</div>
            </div>
          </div>
          <!-- 详情 预览内容 分类-->
          <!-- <div class="mall-preview-container-right-buttom">{{vxShowPreview.detail}}</div> -->
        </div>
      </div>
    </div>
    <VxButtom />
  </div>
</template>

<script>
import { goodsDetail, CollectAdd } from 'src/api/api'
const VxButtom = () => import('./buttom')
export default {
  name: 'vx-preview',
  data() {
    return {
      vxShowPreview: {},
      userHasCollect: 0,
      // true 表示从首页进入  false 表示从模板中心进入
      whereFrom: true,
      whereFromName: '精选海报模板',
      imgsArr: [],
      height: 0,
      color: ''
    }
  },
  components: {
    VxButtom
  },
  methods: {
    //获取URL的参数
    getQueryVariable(variable, url) {
      let num = url.lastIndexOf('?')
      var query = url.substring(num + 1, url.length)
      var vars = query.split('&')
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        if (pair[0] == variable) {
          return pair[1]
        }
      }
      return false
    },
    getParams(url) {
      const _width = 300
      let w = this.getQueryVariable('width', url)
      let h = this.getQueryVariable('height', url)
      this.height = (_width * h) / w
      this.color = this.getQueryVariable('color', url)
    },
    goEditHandler() {
      const { href } = this.$router.resolve({
        path: '/design/' + this.vxShowPreview.goodsId
      })
      window.open(href, '_blank')
    },
    // 收藏  点击事件
    vxCollect(type, valueId) {
      let param = {
        type: type,
        valueId: valueId
      }
      CollectAdd(param).then(res => {
        if (res.errno == 0) {
          let getId = this.$route.params.id
          let parId = {
            id: getId
          }
          goodsDetail(parId).then(res => {
            // userHasCollect  判断是否已收藏
            this.userHasCollect = res.data.userHasCollect
            this.vxShowPreview = res.data.info
           
          })
        }
      })
    },

    async goodsDetail() {
      let parId = {
        id: this.$route.params.id
      }
      await goodsDetail(parId).then(res => {
        this.vxShowPreview = res.data.info

        // userHasCollect  判断是否已收藏'
        this.userHasCollect = res.data.userHasCollect
      })
    }
  },
  async created() {
    this.whereFrom = this.$route.query.whereFrom
    // 根据 id查询商品详情
    await this.goodsDetail()
    this.getParams(this.vxShowPreview.picUrl)
  }
}
</script>