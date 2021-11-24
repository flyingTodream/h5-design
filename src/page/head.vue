<template>
  <div class="home-head">
    <div class="logo">
      <div class="logo-img"></div>
      <div class="logo-text">爱友圈</div>
    </div>
    <div class="vx-nav">
      <li
        @click="$router.push('/')"
        :class="$route.path == '/' ? 'active' : ''"
      >
        <div class="border"></div>
        首页
      </li>
      <li
        :class="$route.path == '/mall/modelCenter' ? 'active' : ''"
        @click="$router.push('/mall/modelCenter')"
      >
        <div class="border"></div>
        模板中心
      </li>
      <li
        :class="$route.path == '/miniProgram' ? 'active' : ''"
        @click="$router.push('/miniProgram')"
      >
        <div class="border"></div>
        移动端
      </li>
    </div>
    <div
      v-if="!isLogin"
      class="login"
      @click="$store.commit('updateShowLogin', true)"
    >
      登录
    </div>
    <!-- <div  v-if="$route.path == '/' "   class="login" @click="goLogin">{{userInfo}}</div> -->

    <div class="afterlogin" v-if="isLogin">
      <el-row v-if="isLogin" class="block-col-2">
        <el-col :span="8">
          <el-dropdown style="width:250px;padding:16px" trigger="click">
            <span class="el-dropdown-link">
              <el-avatar :size="35" :src="avatarUrl"></el-avatar>
              <div style="padding-left: 5px;">{{ userName }}</div>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="vx-mall-header-dropdown" slot="dropdown">
              <el-dropdown-item
                v-if="$route.path != '/'"
                @click.native="$router.push('/')"
              >
                <vx-icon name="home"></vx-icon>首页
              </el-dropdown-item>
              <el-dropdown-item @click.native="$router.push('/user/myworks')">
                <vx-icon name="opus"></vx-icon>我的作品
              </el-dropdown-item>

              <el-dropdown-item @click.native="$router.push('/user/myCollect')">
                <vx-icon name="collection"></vx-icon>我的收藏
              </el-dropdown-item>
              <!-- <el-dropdown-item @click.native="$router.push('/user/myBuy')">
                <vx-icon name="order"></vx-icon>订单中心
              </el-dropdown-item> -->
              <el-dropdown-item @click.native="exitUser">
                <vx-icon name="logout"></vx-icon>退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import MyStorage from "src/utils/cache";
import { authLoginByAccount } from "src/api/api";
export default {
  name: "vx-head",
  computed: {
    isLogin() {
      return this.$store.getters.getLoginState();
    },
    userName() {
      let user = MyStorage.getItem("userName");
      if (user == false) {
        return "user123";
      } else {
        return MyStorage.getItem("userName");
      }
    },
    avatarUrl() {
      return MyStorage.getItem("avatarUrl");
    }
  },
  data() {
    return {
      showFixed: false,
      userInfo: "登录"
    };
  },
  mounted() {},
  methods: {
    // 直接登录
    goLogin() {
      let param = {
        username: "",
        password: ""
      };
      authLoginByAccount(param).then(res => {
        window.localStorage.setItem("user-info", JSON.stringify(res.data));

        let storageUser = window.localStorage.getItem(
          "user-info",
          JSON.stringify(res.data)
        );

        this.userInfo = JSON.parse(storageUser).userInfo.nickName;
      });
    },
    // 退出登录
    exitUser() {
      this.$store.commit("updateShowLogin", false);
      this.$store.commit("updateLoginState", false);
      MyStorage.clear();
    }
  }
};
</script>
<style scoped>
.el-dropdown-link {
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-col-12 {
  width: 150px !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
