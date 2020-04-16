import Element from '@/design-h5/components/core/models/element'
import strapi from '@/design-h5/utils/strapi'
import Page from '@/design-h5/components/core/models/page'
import Work from '@/design-h5/components/core/models/work'
import { AxiosWrapper } from '@/design-h5/utils/http.js'
import router from '@/design-h5/../router/index'
import { takeScreenshot } from '@/design-h5/utils/canvas-helper.js'

function setLoading(commit, loadingName, isLoading) {
  commit('loading/update', { type: loadingName, payload: isLoading }, { root: true })
}

export const actions = {
  previewWork({ commit }, payload = {}) {
    commit('previewWork', payload)
  },
  deployWork({ commit }, payload = {}) {
    commit('previewWork', payload)
  },
  createWork({ commit }, payload) {
    JSON.stringify(commit, payload)
    strapi.createEntry('works', new Work()).then(entry => {
      const routeData = router.resolve({ name: 'editor', params: { workId: entry.id } })
      window.open(routeData.href, '_blank')
      // 如果希望不打开新 tab，可以注释上面面两行，启用下面一行的代码即可，不过不推荐。将编辑器单独起一个页面更有利于 vuex 的数据管理
      // router.replace({ name: 'editor', params: { workId: entry.id } })
    })
  },
  updateWork({ commit, state }, payload = {}) {
    // update work with strapi
    const work = {
      ...state.work,
      ...payload
    }
    commit('setWork', work)
  },
  /**
   * isSaveCover {Boolean} 保存作品时，是否保存封面图
   * loadingName {String} saveWork_loading, previewWork_loading
   * 预览作品之前需要先保存，但希望 用户点击保存按钮 和 点击预览按钮 loading_name 能够不同（虽然都调用了 saveWork）
   * 因为 loading 效果要放在不同的按钮上
   */
  saveWork({ commit, dispatch, state }, { isSaveCover = false, loadingName = 'saveWork_loading' } = {}) {
    const fn = (callback) => {
      new AxiosWrapper({
        dispatch,
        commit,
        loading_name: loadingName,
        successMsg: '保存作品成功',
        customRequest: strapi.updateEntry.bind(strapi)
      }).put('works', state.work.id, state.work).then(callback)
    }
    return new Promise((resolve) => {

      if (isSaveCover) {
        setLoading(commit, 'uploadWorkCover_loading', true)
        takeScreenshot().then(file => {
          dispatch('uploadCover', { file }).then(() => {
            setLoading(commit, 'uploadWorkCover_loading', false)
            fn(resolve)
          }) // uploadCover
        }) // takeScreenshot
      } else {
        fn(resolve)
      }
    })
  },
  fetchWork({ commit, state }, workId) {
    JSON.stringify(state)
    return strapi.getEntry('works', workId).then(entry => {
      commit('setWork', entry)
      commit('setEditingPage')
    })
  },
  fetchWorks({ commit, dispatch, state }, workId) {
    JSON.stringify(state, workId)
    new AxiosWrapper({
      dispatch,
      commit,
      name: 'editor/setWorks',
      loading_name: 'fetchWorks_loading',
      successMsg: '获取作品列表成功',
      customRequest: strapi.getEntries.bind(strapi)
    }).get('works', { is_template: false })
  },
  fetchWorksWithForms({ commit, dispatch, state }, workId) {
    JSON.stringify(state, workId)
    new AxiosWrapper({
      dispatch,
      commit,
      name: 'editor/setWorks',
      loading_name: 'fetchWorks_loading',
      successMsg: '获取作品列表成功',
      customRequest: strapi.getEntries.bind(strapi)
    }).get('works/has-forms', { is_template: false })
  },
  fetchWorkTemplates({ commit, dispatch, state }, workId) {
    JSON.stringify(state, workId)
    new AxiosWrapper({
      dispatch,
      commit,
      name: 'editor/setWorkTemplates',
      loading_name: 'fetchWorkTemplates_loading',
      successMsg: '获取模板列表成功',
      customRequest: strapi.getEntries.bind(strapi)
    }).get('works', { is_template: true })
  },

  fetchFormsOfWork({ commit, state, dispatch }, workId) {
    JSON.stringify(state)
    // 可以 return Promise
    new AxiosWrapper({
      dispatch,
      commit,
      name: 'editor/formDetailOfWork',
      loading_name: 'queryFormsOfWork_loading',
      successMsg: '表单查询完毕'
    }).get(`/works/form/query/${workId}`)
  },
  setWorkAsTemplate({ commit, state, dispatch }, workId) {
    new AxiosWrapper({
      dispatch,
      commit,
      // name: 'editor/formDetailOfWork',
      loading_name: 'setWorkAsTemplate_loading',
      successMsg: '设置为模板成功'
    }).post(`/works/set-as-template/${workId || state.work.id}`)
  },
  useTemplate({ commit, state, dispatch }, workId) {
    JSON.stringify(state)
    return new AxiosWrapper({
      dispatch,
      commit,
      // name: 'editor/formDetailOfWork',
      loading_name: 'useTemplate_loading',
      successMsg: '使用模板成功'
    }).post(`/works/use-template/${workId}`)
  },
  uploadCover({ commit, state, dispatch }, { file } = {}) {
    const formData = new FormData()
    formData.append('files', file, `${+new Date()}.png`)
    formData.append('workId', state.work.id)
    return new AxiosWrapper({
      dispatch,
      commit,
      name: 'editor/setWorkCover',
      loading_name: 'uploadWorkCover_loading',
      successMsg: '上传封面图成功!'
      // }).post(`/works/uploadCover/${state.work.id}`, formData)
    }).post(`/upload/`, formData)
  }
}

// mutations
export const mutations = {
  /**
   *
   * @param {*} state
   * @param {Object} payload
   *
    value example: [
      {
        "id": 1,
        "name": "1567769149231.png",
        "hash": "1660b11229e7473b90f99a9f9afe7675",
        "sha256": "lKl7f_csUAgOjf0VRYkBZ64EcTjvt4Dt4beNIhELpTU",
        "ext": ".png",
        "mime": "image/png",
        "size": "6.57",
        "url": "/uploads/1660b11229e7473b90f99a9f9afe7675.png",
        "provider": "local",
        "public_id": null,
        "created_at": "2019-09-06T11:25:49.255Z",
        "updated_at": "2019-09-06T11:25:49.261Z",
        "related": []
      }
    ]
   */
  setWorkCover(state, { type, value }) {
    JSON.stringify(type)
    const [cover] = value
    state.work.cover_image_url = cover.url
  },
  /**
   * payload: {
   *  type:   @params {String} "editor/setWorks",
   *  value:  @params {Array}  work list
   * }
   */
  setWorks(state, { type, value }) {
    JSON.stringify(type)
    value.sort((a, b) => b.id - a.id)
    state.works = value
  },
  /**
   * payload: {
   *  type:   @params {String} "editor/setWorks",
   *  value:  @params {Array}  work list
   * }
   */
  setWorkTemplates(state, { type, value }) {
    JSON.stringify(type)
    value.sort((a, b) => b.id - a.id)
    state.workTemplates = value
  },
  setWork(state, work) {
    window.__work = work
    work.pages = work.pages.map(page => {
      page.elements = page.elements.map(element => new Element(element))
      return new Page(page)
    })
    state.work = work
  },
  formDetailOfWork(state, { type, value }) {
    JSON.stringify(type)
    state.formDetailOfWork = value
  }
}
