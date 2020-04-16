<template>
  <div class="vx-login-form">
    <div class="vx-login-forget">
      <div class="vx-login-form-top">更改密码</div>
      <div class="vx-login-forget-phone">
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
          class="vx-login-form-getVeriy"
          @click.stop="getVeriyCodehandler"
        >{{text}}</div>
      </div>
      <div class="vx-login-form-newpassword">
        <el-input
          @keyup.enter.native="changePasswordHandler"
          type="password"
          placeholder="请输入6-30位新密码"
          v-model="passWord"
        ></el-input>
      </div>
      <div class="vx-login-forget-change">
        <div @click="changePasswordHandler" class="vx-login-phone-login">更改密码</div>
      </div>
    </div>
    <div class="vx-login-bottom forget-text">
      <div class="vx-login-bottom-text"></div>
      <div class="vx-login-bottom-phone">
        想起密码？
        <a @click="loginHandler">去登录</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'vx-forget',
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
    },
    changePasswordHandler() {}
  }
}
</script>