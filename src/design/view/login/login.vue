<template>
  <div class="vx-login">
    <el-dialog
      :visible.sync="showLogin"
      :modal-append-to-body="false"
      @closed="closedHandler"
      center
      :close-on-click-modal="false"
    >
      <div v-if="type == 'login'" class="vx-login-form">
        <VxWxLogin v-if="weChatLogin" />
        <VxPhoneLogin @forgetPassword="forgetPasswordHandler" v-if="!weChatLogin" />
        <div class="vx-login-form-others">
          <div v-if="weChatLogin" class="vx-login-phone">
            <div @click="weChatLogin = !weChatLogin" class="vx-login-phone-icon">
              <img
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTYwMTU1MjA5Njc1IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI0NzciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTc3NC4xNDQgMTAyLjRIMjQ5Ljg1NmMtMzkuMzIxNiAwLTY1LjUzNiAyNi4yMTQ0LTY1LjUzNiA2NS41MzZ2NzIwLjg5NmMwIDM5LjMyMTYgMjYuMjE0NCA2NS41MzYgNjUuNTM2IDY1LjUzNmg1MjQuMjg4YzM5LjMyMTYgMCA2NS41MzYtMjYuMjE0NCA2NS41MzYtNjUuNTM2VjE2Ny45MzZjMC0zOS4zMjE2LTI2LjIxNDQtNjUuNTM2LTY1LjUzNi02NS41MzZ6IG0tMTk2LjYwOCA3ODYuNDMyaC0xMzEuMDcydi02NS41MzZoMTMxLjA3MnY2NS41MzZ6IG0xOTYuNjA4LTEzMS4wNzJIMjQ5Ljg1NnYtNjUuNTM2aDUyNC4yODh2NjUuNTM2eiIgcC1pZD0iMjQ3OCIgZmlsbD0iI0Y4OUY1MCI+PC9wYXRoPjwvc3ZnPg=="
                alt="phone"
              />
            </div>
            <div class="vx-login-phone-text">手机号登录</div>
          </div>

          <div v-if="!weChatLogin" class="vx-login-phone">
            <div @click="weChatLogin = !weChatLogin" class="vx-login-phone-icon">
              <img
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTYwMTU1MTg1NTE1IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIzMDciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTM5NC42NjY2NjcgMTA2LjY2NjY2N2MxNzEuNzc2IDAgMzE0LjYyNCAxMDIuNjEzMzMzIDM0NS42IDIzOC4yNTA2NjZBNDI1Ljc3MDY2NyA0MjUuNzcwNjY3IDAgMCAwIDY4OCAzNDEuMzMzMzMzYy0xOTQuMTMzMzMzIDAtMzUyIDEzMS41ODQtMzUyIDI5My4zMzMzMzQgMCAxOC44MTYgMi4zNDY2NjcgMzcuMjA1MzMzIDYuNDQyNjY3IDU1LjA4MjY2NmEzOTkuNjE2IDM5OS42MTYgMCAwIDEtODUuMzMzMzM0LTIxLjI0OGwtMTI2LjQyMTMzMyA1NC4xODY2NjcgNDYuMzc4NjY3LTkyLjg0MjY2N0M5NS4zNiA1NzYuMjEzMzMzIDQyLjY2NjY2NyA0OTMuMzk3MzMzIDQyLjY2NjY2NyA0MDAgNDIuNjY2NjY3IDIzOC4wMzczMzMgMjAwLjIzNDY2NyAxMDYuNjY2NjY3IDM5NC42NjY2NjcgMTA2LjY2NjY2N3pNMjc3LjMzMzMzMyAzMjYuNjU2YTQ0LjAzMiA0NC4wMzIgMCAxIDAgMC04OC4wMjEzMzMgNDQuMDMyIDQ0LjAzMiAwIDAgMCAwIDg4LjAyMTMzM3ogbTIzNC42NjY2NjcgMGE0NC4wMzIgNDQuMDMyIDAgMSAwIDAtODguMDIxMzMzIDQ0LjAzMiA0NC4wMzIgMCAwIDAgMCA4OC4wMjEzMzN6IG00NjkuMzMzMzMzIDMwOC4wMTA2NjdjMCA3NS4wNTA2NjctNDQuOCAxNDEuMDk4NjY3LTExMy4zNjUzMzMgMTg0LjAyMTMzM2w1NC42OTg2NjcgMTA5LjMxMi0xNTguMTIyNjY3LTY3Ljc1NDY2N2EzNTguNCAzNTguNCAwIDAgMS03Ni41NDQgOS4wODhjLTE2MS45NjI2NjcgMC0yOTMuMzMzMzMzLTEwNS4wODgtMjkzLjMzMzMzMy0yMzQuNjY2NjY2czEzMS4zNzA2NjctMjM0LjY2NjY2NyAyOTMuMzMzMzMzLTIzNC42NjY2NjdTOTgxLjMzMzMzMyA1MDUuMDg4IDk4MS4zMzMzMzMgNjM0LjY2NjY2N3ogbS0zODEuMzU0NjY2LTE0LjY3NzMzNGE0NC4wMzIgNDQuMDMyIDAgMSAwIDAtODguMDIxMzMzIDQ0LjAzMiA0NC4wMzIgMCAwIDAgMCA4OC4wMjEzMzN6IG0xNzYuMDQyNjY2IDBhNDQuMDMyIDQ0LjAzMiAwIDEgMC0wLjA0MjY2Ni04OC4wMjEzMzMgNDQuMDMyIDQ0LjAzMiAwIDAgMCAwIDg4LjAyMTMzM3oiIHAtaWQ9IjIzMDgiIGZpbGw9IiM1OUNDMEQiPjwvcGF0aD48L3N2Zz4="
                alt="wx"
              />
            </div>
            <div class="vx-login-phone-text">微信登录</div>
          </div>
        </div>
        <div class="vx-login-bottom">
          <div class="vx-login-bottom-text">
            登录即同意
            <a>用户协议</a>和
            <a>隐私政策</a>
          </div>
          <div @click="registerHandler" class="vx-login-bottom-phone">
            手机号注册
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
      <VxForget @login="loginHandler" v-if="type == 'findPassword'" />
      <VxRegister @login="loginHandler" v-if="type == 'register'" />
    </el-dialog>
    <!-- </transition> -->
  </div>
</template>
<script>
import VxWxLogin from './wxLogin'
import VxPhoneLogin from './phoneLogin'
import VxForget from './forgetPassword'
import VxRegister from './register'
export default {
  name: 'vx-login',
  components: {
    VxWxLogin,
    VxPhoneLogin,
    VxForget,
    VxRegister
  },
  data() {
    return {
      weChatLogin: true,
      type: 'login',
      showLogin: true,
      isShowmask: true
    }
  },
  props: {
    // showLogin: Boolean
  },
  methods: {
    forgetPasswordHandler() {
      this.type = 'findPassword'
    },
    loginHandler() {
      this.type = 'login'
    },
    registerHandler() {
      this.type = 'register'
    },
    closedHandler() {
      this.$emit('hideLogin')
    }
  }
}
</script>