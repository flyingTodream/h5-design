<template>
  <div class="vx-login-form">
    <div class="vx-login-forget">
      <div class="vx-login-form-top">注册账号</div>
      <div class="vx-login-register-phone">
        <el-input placeholder="请输入手机号" v-model="phone" class="input-with-select">
          <el-select v-model="number" slot="prepend" placeholder="请选择">
            <el-option label="+86" value="中国 +86"></el-option>
            <el-option label="+852" value="中国香港 +852"></el-option>
            <el-option label="+853" value="中国澳门 +853"></el-option>
          </el-select>
        </el-input>
      </div>
      <div class="vx-login-form-msg">
        <el-input placeholder="请输入短信中的验证码"></el-input>
        <div
          :class="{'image-disable': isDisable}"
          @click.stop="getVeriyCodehandler"
          class="vx-login-form-getVeriy"
        >{{text}}</div>
      </div>
      <div class="vx-login-register-password">
        <el-input
          @keyup.enter.native="registerHandler"
          type="password"
          placeholder="请输入6-30位密码"
          v-model="passWord"
        ></el-input>
      </div>
      <div class="vx-login-forget-change">
        <div @click="registerHandler" class="vx-login-phone-login">注册账号</div>
      </div>
    </div>
    <div class="vx-login-bottom forget-text">
      <div class="vx-login-bottom-text">
        注册即同意
        <a>用户协议</a>和
        <a>隐私政策</a>
      </div>
      <div class="vx-login-bottom-phone">
        已有账号？
        <a @click="loginHandler">去登录</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'vx-register',
  data() {
    return {
      phone: '',
      number: '+86',
      passWord: '',
      text: '获取验证码',
      isDisable: false
    }
  },
  methods: {
    loginHandler() {
      this.$emit('login')
    },
    getVeriyCodehandler() {
      this.isDisable = true
      let num = 10

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
    },
    registerHandler() {}
  }
}
</script>