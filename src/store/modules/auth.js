const state = {
  users: [],
  isAuthenticated: true,
  access_token: ''
}
const actions = {
  setToken({ commit }, token) {
    commit('SET_TOKEN', token)
  },
  logout({ commit }) {
    commit('LOGOUT')
  }
}
const mutations = {
  SET_TOKEN: (state, token) => {
    state.access_token = token
    state.isAuthenticated = true
  },
  LOGOUT: (state) => {
    state.access_token = ''
    state.isAuthenticated = false
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
