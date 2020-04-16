<template>
  <div id="app">
    <router-view></router-view>

    <VxLogin @hideLogin="hideLoginFormHandler" v-if="showLogin && !isLogin" />
  </div>
</template>

<script>
const VxLogin = () => import('src/design/view/login')
export default {
  name: 'app',
  components: {
    VxLogin
  },
  computed: {
    isLogin() {
      return this.$store.getters.getLoginState()
    },
    showLogin() {
      return this.$store.getters.getShowLogin()
    }
  },
  methods: {
    hideLoginFormHandler() {
      this.$store.commit('updateShowLogin', false)
    }
  }
}
</script>
