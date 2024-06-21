import { createStore } from 'vuex';

export default createStore({
  state: {
    isLoggedIn: false,
    userId: null,
    userRole: null
  },
  mutations: {
    setLoggedIn(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
    setUserRole(state, userRole){
      state.userRole = userRole;
    }
  },
  actions: {
    setLoggedIn({ commit }, isLoggedIn) {
      commit('setLoggedIn', isLoggedIn);
    },
    setUserId({ commit }, userId) {
      commit('setUserId', userId);
    },
    setUserRole({ commit }, userRole) {
      commit('setUserRole', userRole);
    }
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    getUserId: state => state.userId,
    getUserRole: state => state.userRole
  }
});
