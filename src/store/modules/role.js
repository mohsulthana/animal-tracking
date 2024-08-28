const state = {
  roles: []
}
const actions = {
  setRole({ commit }, roles) {
    commit('SET_ROLE', roles)
  }
}
const mutations = {
  SET_ROLE: (state, role) => {
    state.role = role
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
