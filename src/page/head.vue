<template>
  <div>
    <header id="vx-header" class="vx-default-header">
      <div class="vx-default-header__content">
        <div @click="$route.path != '/' && $router.push('/')" class="vx-logoHome-headerLeft">
          <img class="vx-logoHome-img" src="../assets/image/logo.png" />
        </div>
        <!-- 登录/注册 -->
        <div class="vx-logoHome-headerRight">
          <div class="vx-header-user">
            <span class="signBtn" @click="$store.commit('updateShowLogin', true)">
              <span class="signBtn-span" v-if="!isLogin">登录 / 注册</span>
              <el-row v-if="isLogin" class="block-col-2">
                <el-col :span="8">
                  <el-dropdown style="width:150px;padding:16px" trigger="click">
                    <span class="el-dropdown-link">
                      {{userName}}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu class="vx-mall-header-dropdown" slot="dropdown">
                      <el-dropdown-item v-if="$route.path != '/'" @click.native="$router.push('/')">
                        <vx-icon name="home"></vx-icon>首页
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="$router.push('/user/myworks')">
                        <vx-icon name="opus"></vx-icon>我的作品
                      </el-dropdown-item>

                      <el-dropdown-item @click.native="$router.push('/user/myCollect')">
                        <vx-icon name="collection"></vx-icon>我的收藏
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="$router.push('/user/myBuy')">
                        <vx-icon name="order"></vx-icon>订单中心
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="exitUser">
                        <vx-icon name="logout"></vx-icon>退出登录
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </span>
          </div>
        </div>
      </div>
    </header>

    <header v-if="showFixed" :class="{'vx-header-fixed':showFixed}" class="vx-default-header">
      <div class="vx-default-header__content">
        <div @click="$route.path != '/' && $router.push('/')" class="vx-logoHome-headerLeft">
          <img class="vx-logoHome-img" src="../assets/image/logo.png" />
        </div>
        <!-- 登录/注册 -->

        <div class="vx-logoHome-headerRight">
          <div class="vx-header-user">
            <span class="signBtn" @click="$store.commit('updateShowLogin', true)">
              <span class="signBtn-span" v-if="!isLogin">登录 / 注册</span>
              <el-row v-if="isLogin" class="block-col-2">
                <el-col :span="8">
                  <el-dropdown style="width:150px;padding:16px" trigger="click">
                    <span class="el-dropdown-link">
                      {{userName}}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu class="vx-mall-header-dropdown" slot="dropdown">
                      <el-dropdown-item v-if="$route.path != '/'" @click.native="$router.push('/')">
                        <vx-icon name="home"></vx-icon>首页
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="$router.push('/user/myworks')">
                        <vx-icon name="opus"></vx-icon>我的作品
                      </el-dropdown-item>

                      <el-dropdown-item @click.native="$router.push('/user/myCollect')">
                        <vx-icon name="collection"></vx-icon>我的收藏
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="$router.push('/user/myBuy')">
                        <vx-icon name="order"></vx-icon>订单中心
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="exitUser">
                        <vx-icon name="logout"></vx-icon>退出登录
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </span>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>
<script>
import MyStorage from 'src/utils/cache'
export default {
  name: 'vx-head',
  computed: {
    isLogin() {
      return this.$store.getters.getLoginState()
    },
    userName() {
      return MyStorage.getItem('userName')
    }
  },
  data() {
    return {
      showFixed: false
    }
  },
  mounted() {
    var io = new IntersectionObserver(entries => {
      let item = entries[0] // 拿第一个就行，反正只有一个
      if (item.isIntersecting) {
        this.showFixed = false
      } else {
        this.showFixed = true
      }
    })
    io.observe(document.querySelector('#vx-header'))
  },
  methods: {
    // 退出登录
    exitUser() {
      this.$store.commit('updateShowLogin', false)
      this.$store.commit('updateLoginState', false)
      MyStorage.clear()
    }
  }
}
</script>