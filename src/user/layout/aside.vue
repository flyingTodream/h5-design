<template>
  <div>
    <div v-if="!isCollapse" class="vx-user-aside-logo">
      <div class="mallName" @click="$router.push('/')">
        <img class="vx-logoHome-img" src="../../assets/image/logo.png" />
      </div>
      <div class="vx-logo-name">个人中心</div>
    </div>
    <div v-if="isCollapse" @click="$router.push('/')" class="vx-user-aside-title">爱友圈</div>
    <el-menu default-active class="el-menu-vertical-demo" :collapse="isCollapse" router>
      <template v-for="item in menu">
        <el-menu-item
          :default-active="$route.path"
          router
          style="display:flex"
          class="vx-user-aside-item-collapse"
          v-if="!item.children||item.children.length <= 0"
          :class="{'is-active':isActive(item.path)}"
          :key="item.path"
          :index="item.path"
        >
          <vx-icon :name="item.icon"></vx-icon>
          <span class="userTitle" slot="title">{{item.meta.title}}</span>
        </el-menu-item>
        <el-submenu v-else :key="item.path" :index="item.path">
          <template slot="title">
            <span slot="title">{{item.meta.title}}</span>
          </template>
          <el-menu-item
            v-for="(child) in item.children"
            :key="child.path"
            :index="child.path"
            :class="{'is-active':isActive(item.path)}"
          >{{child.meta.title}}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
<script>
import state from 'src/store'
export default {
  name: 'vx-aside',
  mounted() {
    this.isActive()
  },
  methods: {
    handleSelect(key) {
      if (key === 'default-active') {
        this.$router.push('/default-active')
      } else if (key === '/user/myBuy') {
        this.$router.push('/user/myBuy')
      } else if (key === '/user/myCollect') {
        this.$router.push('/user/myCollect')
      }
    },
    isActive(path) {
      return this.$route.fullPath == '/user/' + path
    },
    isActiv(iconicon) {
      return this.$route.icon == iconicon
    }
  },
  computed: {
    menu() {
      return this.$router.options.routes[3].children
    },
    isCollapse() {
      return state.state.isCollapse
    }
  }
}
</script>