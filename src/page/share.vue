<template>
  <!--分享模板-->
  <div>
    <div class="vx-default-share">
      <div class="vx-logoHome-headerLeft-share">
        <img class="vx-logoHome-img" src="../assets/image/logo.png" />
      </div>
    </div>
    <div class="sharedImgWrap">
      <div class="sharedImgContent">
        <el-image class="sharedImgContent-image" :fit="fit" :src="imgUrl" alt>
          <div slot="placeholder">
            <i class="el-icon-loading"></i>加载中
          </div>
          <div slot="error">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
    </div>
    <div v-if="!isMobile()" class="designDiv">
      <a class="btn useDesign" @click="gotoDesign">复制使用此设计</a>
      <a class="btn myDesign" @click="bieginDesign('/design/new')">我也要设计</a>
    </div>
  </div>
</template>
<script>
import { getProduct } from 'src/api/api'
import { log } from 'src/design/utils'
import API from 'src/design/utils/API'
export default {
  name: 'vx-shared',
  data() {
    return {
      fit: 'contain',
      imgUrl: '',
      parId: '',
      detial: ''
    }
  },
  methods: {
    goodsDetail() {
      this.parId = this.$route.params.id
      getProduct(this.parId).then(res => {
        this.imgUrl = res.data.picUrl
        this.detail = res.data.detail
      })
    },
    isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
      return flag
    },
    bieginDesign(page) {
      const { href } = this.$router.resolve({
        path: page,
      })
      window.open(href, '_blank')
    },
    gotoDesign() {
      //先发送一个保存接口，来判断登录
      let params = {
        Id: '',
        detail: this.detail,
        picUrl: this.imgUrl || ''
      }
      this.$axios
        .post(API.SAVE_API, params)
        .then(res => {
          this.projectId = res.data.id
          // mitation.setId(res.data.id);
          const { href } = this.$router.resolve({
            path: '/design/' + this.projectId,
            query: {
              designModel: 'user'
            }
          })
          window.open(href, '_blank')
        })
        .catch(err => {
          log.warning(err)
        })
    }
  },

  created() {
    this.goodsDetail()
  }
}
</script>

 
