import * as types from './mutation-types'
import Vue from 'vue'

export default {
  [types.LOGIN] (state,login) {
    Vue.set(state, 'login', login);
  },
  [types.CONFIG] (state,config) {
    Vue.set(state, 'config', config);
  }
}

