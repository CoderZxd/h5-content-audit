import * as types from './mutation-types';
import apiConfig from './api/http';

export const login = ({ commit, state, dispatch }, user) => {
  var load = new apiConfig.urlApi.user.login();
  load.param = user
  return new Promise((resolve, reject) => {
    return load.exec(function( success ){
      var obj = success.data;
      commit(types.LOGIN, true);
      console.log(obj);
      resolve(obj);
    },function( error ){
      commit(types.LOGIN, true);
      resolve(error);
      console.log( error );
    })
  })
}




