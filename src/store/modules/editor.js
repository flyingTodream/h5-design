// initial state
import Work from '@/design-h5/components/core/models/work'
import { actions as pageActions, mutations as pageMutations } from './page'
import { actions as elementActions, mutations as elementMutations } from './element'
import { actions as workActions, mutations as workMutations } from './work'

const state = {
  works: [],
  work: new Work(),
  editingPage: { elements: [] },
  editingElement: null,
  formDetailOfWork: {
    uuidMap2Name: {},
    formRecords: []
  },
  workTemplates: []
}
//默认选中第一个页面
if (!state.editingPage.uuid) {
  state.editingPage = state.work.pages[0]
}

// getters
const getters = {}

// actions
const actions = {
  ...elementActions,
  ...pageActions,
  ...workActions
}

// mutations
const mutations = {
  ...elementMutations,
  ...pageMutations,
  ...workMutations
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
