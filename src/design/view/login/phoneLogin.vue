<template>
  <div class="vx-login-phone-password">
    <div class="vx-login-form-top">账户密码登录</div>
    <div class="vx-login-form-phone">
      <el-input
        autocomplete="off"
        placeholder="请输入手机号"
        v-model="username"
        class="input-with-select"
      >
        <el-select v-model="number" slot="prepend" placeholder="请选择">
          <el-option label="+86" value="中国 +86"></el-option>
          <el-option label="+852" value="中国香港 +852"></el-option>
          <el-option label="+853" value="中国澳门 +853"></el-option>
        </el-select>
      </el-input>
    </div>
    <div v-if="messageLogin" class="vx-login-form-pass">
      <el-input
        autocomplete="off"
        @keyup.enter.native="loginHandler"
        type="password"
        placeholder="请输入密码"
        v-model="passWord"
      >
        <template slot="prepend">密码</template>
      </el-input>
    </div>
    <div v-if="!messageLogin" class="vx-login-form-msg">
      <el-input
        autocomplete="off"
        @keyup.enter.native="loginHandler"
        type="text"
        placeholder="请输入短信中的验证码"
      ></el-input>
      <div
        class="vx-login-form-getVeriy"
        :class="{'image-disable': isDisable}"
        @click.stop="getVeriyCodehandler"
      >{{text}}</div>
    </div>
    <div class="vx-login-phone-content">
      <div @click="messageLogin = !messageLogin" class="vx-login-phone-message">
        <span v-if="messageLogin">短信密码登录</span>
        <span v-if="!messageLogin">账号密码登录</span>
      </div>
      <div @click="forgetPasswordHandler">忘记密码</div>
    </div>
    <div @click="loginHandler" class="vx-login-phone-login">登录</div>
  </div>
</template>
<script>
// import { API } from 'src/design/utils'
// import { mitation } from 'src/design/store'
// import { mutations } from 'src/store'
import { authLoginByAccount } from 'src/api/api'
import MyStorage from 'src/utils/cache'

export default {
  name: 'vx-phoneLogin',
  data() {
    return {
      username: '',
      number: '+86',
      passWord: '',
      messageLogin: true,
      text: '获取验证码',
      isDisable: false
    }
  },
  computed: {},
  methods: {
    forgetPasswordHandler() {
      this.$emit('forgetPassword')
    },
    loginHandler() {
      let param = {
        username: this.username,
        password: this.passWord
      }
      //分类目录当前分类数据接口
      authLoginByAccount(param).then(res => {
        if (res.errno === 0) {
          MyStorage.setItem('Token', res.data.token)
          MyStorage.setItem('userName', res.data.userInfo.nickName)
          this.$store.commit('updateLoginState', true)
          // this.$store.commit('changeLogin', '1')
        } else {
          this.$message({
            message: res.errmsg,
            type: 'error'
          })
        }
      })
    },
    getVeriyCodehandler() {
      this.isDisable = true
      let num = 60

      this.text = num + 's后获取'
      let clock = setInterval(() => {
        num--
        this.text = num + 's后获取'

        if (num < 0) {
          this.isDisable = false
          this.text = '获取验证码'
          clearInterval(clock)
        }
      }, 1 * 1000)
    }
  }
}
</script>