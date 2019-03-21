import apiConfig from '../../api/http';
import * as globalTypes from '../../mutation-types';

export const getAllMockConfigGroup = ({ commit, state, dispatch }) => {
  var load = new apiConfig.urlApi.mockConfigGroup.getAll();
  load.type="get";
  return new Promise((resolve, reject) => {
    return load.exec(function( success ){
      console.log(success)
      var obj = success.data;
      resolve(obj);
    },function( error ){
      console.log( error );
    })
  });
};
export const deleteMockConfigGroup = ({ commit, state, dispatch },str) => {
  var param = "";
  param += 'id='+str;
  var load = new apiConfig.urlApi.mockConfigGroup.delete();
  load.url = load.url + '?'+param;
  return new Promise((resolve, reject) => {
    return load.exec(function( success ){
      var obj = success;
      resolve(obj);
    },function( error ){
      console.log( error );
    })
  });
};
export const addMockConfigGroup = ({commit, state, dispatch}, str) => {
  var param = str;
  var load = new apiConfig.urlApi.mockConfigGroup.add();
  load.param = param;
  return new Promise((resolve, reject) => {
    return load.exec(function (success) {
      var obj = success;
      resolve(obj);
    }, function (error) {

      console.log(error);
    })
  });
};
export const updateMockConfigGroup = ({commit, state, dispatch}, str) => {
  var param = str;
  var load = new apiConfig.urlApi.mockConfigGroup.update();
  load.param = param;
  return new Promise((resolve, reject) => {
    return load.exec(function (success) {
      var obj = success;
      resolve(obj);
    }, function (error) {

      console.log(error);
    })
  });
};
