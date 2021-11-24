<template>
  <div class="vx-home">
    <VxHead />
    <div class="home-content">
      <div class="home-image"></div>
      <div class="vx-title">
        快速作图，
        <br />随时随地分享
      </div>
      <div class="vx-interduce">极简在线编辑器，丰富模板，多终端协作极简在线编辑器，丰富模板，多终端协作！</div>
      <div class="vx-begin" @click="bieginDesign('/design/new')">开始制作</div>

      <div class="copyright">© 2020 iyouquan.cn 版权所有</div>
    </div>
  </div>
</template>
<script>
import VxHead from './head'
export default {
  name: 'home',
  components: {
    VxHead,
  },
  methods: {
    bieginDesign(page) {
      const { href } = this.$router.resolve({
        path: page,
      })
      window.open(href, '_blank')
    },
  },
}
</script>