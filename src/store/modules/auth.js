const state = {
  user: null,
  isAuthenticated: true,
  access_token: ''
}
const actions = {
  setToken({ commit }, token) {
    commit('SET_TOKEN', token)
  },
  setUser({ commit }, user) {
    commit('SET_USER', user)
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
    state.user = null
  },
  SET_USER: (state, user) => {
    console.log(user)
    state.user = user
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
