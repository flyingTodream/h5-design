import Vue from 'vue'
import Vuex from 'vuex'
import MyStorage from 'src/utils/cache'
Vue.use(Vuex)
const state = {
  isLogin: MyStorage.getItem('Token') || true,
  isCollapse: false,
  showLogin: false
}

const store = new Vuex.Store({

  state,
  getters: {
    getLoginState: (state) => () => {
      return state.isLogin
    },
    getShowLogin: (state) => () => {
      return state.showLogin
    }, getisCollapse: (state) => () => {
      return state.showLogin
    }
  },
  mutations: {
    updateLoginState(state, val) {
      state.isLogin = val
    },
    updateShowLogin(state, val) {
      state.showLogin = val
    }, updateisCollapse(state, val) {
      state.isCollapse = val
    }
  }
})
export default store;
