import Vue from 'vue';
import Vuex from 'vuex';
import * as mutations from './mutations';
import * as actions from './actions';
import contentaudit from "./modules/contentaudit"

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    login: false
  },
  mutations: mutations.default,
  actions,
  modules:{
    contentaudit
  },
  strict: process.env.NODE_ENV !== 'production'
});

export default store;
