import Vue from 'vue';
import Vuex from 'vuex';
import * as mutations from './mutations';
import * as actions from './actions';
import mockConfig from './modules/mock-config'
import strategyConfig from './modules/strategy-config'
import applicationConfig from "./modules/application-config"
import contentaudit from "./modules/contentaudit"
import mockConfigGroup from './modules/mock-config-group'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    login: false
  },
  mutations: mutations.default,
  actions,
  modules:{
    mockConfig,
    strategyConfig,
    applicationConfig,
    contentaudit,
    mockConfigGroup
  },
  strict: process.env.NODE_ENV !== 'production'
});

export default store;
