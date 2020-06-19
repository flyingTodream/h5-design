<template>
  <div class="vx-user-header">
    <i
      @click="closeHandler"
      :class="flag ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
      class="vx-user-header-icon"
    ></i>
    <el-row class="g-btn__content userMenu">
      <el-row class="block-col-2">
        <el-col :span="12">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <el-avatar :size="35" :src="avatarUrl"></el-avatar>
              <div style="padding-left: 5px;">{{userName}}</div>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="vx-user-dropdown" slot="dropdown">
              <el-dropdown-item @click.native="jumpPage('/')">
                <vx-icon name="home"></vx-icon>首页
              </el-dropdown-item>
              <el-dropdown-item @click.native="exitUser">
                <vx-icon name="logout"></vx-icon>退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>
<script>
import MyStorage from 'src/utils/cache'
export default {
  data() {
    return {
      flag: false
    }
  },
  computed: {
    isLogin() {
      return this.$store.getters.getLoginState()
    },
    showLogin() {
      return this.$store.getters.getShowLogin()
    },
    userName() {
      return MyStorage.getItem('userName')
    },
    avatarUrl() {
      return MyStorage.getItem('avatarUrl')
    }
  },
  methods: {
    // 跳转页面
    jumpPage(Page) {
      this.$router.push({
        path: Page
      })
    },
    exitUser() {
      this.$store.commit('updateShowLogin', false)
      this.$store.commit('updateLoginState', false)
      MyStorage.clear()
      this.$router.push({
        path: '/'
      })
    },
    closeHandler() {
      this.flag = !this.flag
      this.$store.commit('updateisCollapse', this.flag)
    }
  }
}
</script>
<style scoped>
.el-dropdown-link {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>