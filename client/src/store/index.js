import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sUserData: [],
    sSales_product: [],
    sMasterID: 1,
    sReportID: 1,
    sProductID: 1,
    sIntHome: 0,
    sBlnGraph: false
  },
  mutations: {
    cUserData(state, Data) {
      state.sUserData = Data
    },
    cSales_product(state, Data) {
      state.sSales_product = Data
    },
    cMasterID(state, Data) {
      state.sMasterID = Data
    },
    cReportID(state, Data) {
      state.sReportID = Data
    },
    cProductID(state, Data) {
      state.sProductID = Data
    },
    cBlnGraph(state, Data) {
      state.sBlnGraph = Data
    },
    cIntHome(state, Data) {
      state.sIntHome = Data
    },
  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState()]
})
