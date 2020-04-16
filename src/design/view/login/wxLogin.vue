<template>
  <div class="vx-login-form">
    <div class="vx-login-form-top">
      <img
        src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTYwMTU1MTg1NTE1IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIzMDciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTM5NC42NjY2NjcgMTA2LjY2NjY2N2MxNzEuNzc2IDAgMzE0LjYyNCAxMDIuNjEzMzMzIDM0NS42IDIzOC4yNTA2NjZBNDI1Ljc3MDY2NyA0MjUuNzcwNjY3IDAgMCAwIDY4OCAzNDEuMzMzMzMzYy0xOTQuMTMzMzMzIDAtMzUyIDEzMS41ODQtMzUyIDI5My4zMzMzMzQgMCAxOC44MTYgMi4zNDY2NjcgMzcuMjA1MzMzIDYuNDQyNjY3IDU1LjA4MjY2NmEzOTkuNjE2IDM5OS42MTYgMCAwIDEtODUuMzMzMzM0LTIxLjI0OGwtMTI2LjQyMTMzMyA1NC4xODY2NjcgNDYuMzc4NjY3LTkyLjg0MjY2N0M5NS4zNiA1NzYuMjEzMzMzIDQyLjY2NjY2NyA0OTMuMzk3MzMzIDQyLjY2NjY2NyA0MDAgNDIuNjY2NjY3IDIzOC4wMzczMzMgMjAwLjIzNDY2NyAxMDYuNjY2NjY3IDM5NC42NjY2NjcgMTA2LjY2NjY2N3pNMjc3LjMzMzMzMyAzMjYuNjU2YTQ0LjAzMiA0NC4wMzIgMCAxIDAgMC04OC4wMjEzMzMgNDQuMDMyIDQ0LjAzMiAwIDAgMCAwIDg4LjAyMTMzM3ogbTIzNC42NjY2NjcgMGE0NC4wMzIgNDQuMDMyIDAgMSAwIDAtODguMDIxMzMzIDQ0LjAzMiA0NC4wMzIgMCAwIDAgMCA4OC4wMjEzMzN6IG00NjkuMzMzMzMzIDMwOC4wMTA2NjdjMCA3NS4wNTA2NjctNDQuOCAxNDEuMDk4NjY3LTExMy4zNjUzMzMgMTg0LjAyMTMzM2w1NC42OTg2NjcgMTA5LjMxMi0xNTguMTIyNjY3LTY3Ljc1NDY2N2EzNTguNCAzNTguNCAwIDAgMS03Ni41NDQgOS4wODhjLTE2MS45NjI2NjcgMC0yOTMuMzMzMzMzLTEwNS4wODgtMjkzLjMzMzMzMy0yMzQuNjY2NjY2czEzMS4zNzA2NjctMjM0LjY2NjY2NyAyOTMuMzMzMzMzLTIzNC42NjY2NjdTOTgxLjMzMzMzMyA1MDUuMDg4IDk4MS4zMzMzMzMgNjM0LjY2NjY2N3ogbS0zODEuMzU0NjY2LTE0LjY3NzMzNGE0NC4wMzIgNDQuMDMyIDAgMSAwIDAtODguMDIxMzMzIDQ0LjAzMiA0NC4wMzIgMCAwIDAgMCA4OC4wMjEzMzN6IG0xNzYuMDQyNjY2IDBhNDQuMDMyIDQ0LjAzMiAwIDEgMC0wLjA0MjY2Ni04OC4wMjEzMzMgNDQuMDMyIDQ0LjAzMiAwIDAgMCAwIDg4LjAyMTMzM3oiIHAtaWQ9IjIzMDgiIGZpbGw9IiM1OUNDMEQiPjwvcGF0aD48L3N2Zz4="
        alt="wechat"
        class="vx-login-form-wechat"
      />
      微信扫码登录/注册
    </div>
    <div class="vx-login-form-tips">登录后模板免费下载</div>
    <div class="vx-login-form-code">
      <el-image :src="url">
        <div slot="error" class="image-slot">
          <i class="el-icon-loading"></i>生成二维码中...
        </div>
      </el-image>
    </div>
    <div class="vx-login-form-code-tips">关注"海报设计设计官方服务号"进行注册</div>
  </div>
</template>
<script>
export default {
  name: 'vx-WxLogin',
  data() {
    return {
      url: ''
    }
  },
  created() {
    setTimeout(() => {
      this.url =
        'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQGM8DwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyOG1GaU1xelZjbTAxOE45bTF1MVoAAgSxTg1eAwSAOgkA'
    }, 3 * 1000)
  }
}
</script>