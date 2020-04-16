import Vue from 'vue'
import Vuex from 'vuex'
import MyStorage from 'src/utils/cache'
import undoRedoPlugin from './plugins/undo-redo/index'
import editor from './modules/editor'
import user from './modules/user'
import visible from './modules/visible'
import loading from './modules/loading'
Vue.use(Vuex)
const state = {
  isLogin: MyStorage.getItem('Token') || false,
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
  },
  modules: {
    editor,
    user,
    visible,
    loading
  },
  plugins: [undoRedoPlugin]
})
export default store;
