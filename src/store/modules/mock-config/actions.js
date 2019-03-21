import apiConfig from '../../api/http';
import * as globalTypes from '../../mutation-types';

export const querySystemConfig = ({ commit, state, dispatch },str) => {
  var load = new apiConfig.urlApi.systemConfig.query();
  load.type="get";
  return new Promise((resolve, reject) => {
    return load.exec(function( success ){
      var obj = success;
      let tempLevelType = obj.data.levelType.split(",");
      let levelType = [];
      for (let i=0; i<tempLevelType.length; i++) {
        levelType.push(tempLevelType[i]);
      }
      obj.data.levelType = tempLevelType;
      resolve(obj);
    },function( error ){
      resolve(error);
      console.log( error );
    })
  });
};

export const getAllMockConfig = ({ commit, state, dispatch }) => {
  var load = new apiConfig.urlApi.mockConfig.getAll();
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
export const deleteMockConfig = ({ commit, state, dispatch },str) => {
  var param = "";
  param += 'mockId='+str;
  var load = new apiConfig.urlApi.mockConfig.deleteMockConfig();
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
export const addMockConfig = ({commit, state, dispatch}, str) => {
  var param = {};
  param.applicationid = str.applicationid;
  param.namespace = str.namespace;
  param.userlabel = str.userlabel;
  param.requestpath = str.requestpath;
  param.requesttype = str.requesttype;
  param.strategyename = str.strategyename;
  param.mockname = str.mockname;
  param.desc = str.desc;
  param.routecode = str.routecode;
  param.status = str.status;
  if(str.groupid == ''){
    str.groupid = null;
  }
  param.groupid = str.groupid;
  param.strategyInfo = JSON.stringify(str.strategyInfo);
  var load = new apiConfig.urlApi.mockConfig.addMockConfig();
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
export const cloneMockConfig = ({commit, state, dispatch}, str) => {
  var param = {};
  param.mockid = str.mockid;
  param.applicationid = str.applicationid;
  param.namespace = str.namespace;
  param.userlabel = str.userlabel;
  param.mockName = str.mockName;
  param.desc = str.desc;
  param.routecode = str.routecode;
  param.status = str.status;
  if(str.groupid == ''){
    str.groupid = null;
  }
  param.groupid = str.groupid;
  var load = new apiConfig.urlApi.mockConfig.cloneMockConfig();
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
export const testMockConfig = ({commit, state, dispatch}, str) => {
  var param = {};
  param = str;
  var load = new apiConfig.urlApi.mockConfig.testMockConfig();
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
export const updateMockConfig = ({commit, state, dispatch}, str) => {
  var param = {};
  param.mockid = str.mockid;
  param.applicationid = str.applicationid;
  param.namespace = str.namespace;
  param.userlabel = str.userlabel;
  param.requestpath = str.requestpath;
  param.requesttype = str.requesttype;
  param.strategyename = str.strategyename;
  param.mockname = str.mockname;
  param.desc = str.desc;
  param.routecode = str.routecode;
  param.strategyinfoid = str.strategyinfoid;
  param.status = str.status;
  if(str.groupid == ''){
    str.groupid = null;
  }
  param.groupid = str.groupid;
  param.strategyInfo = JSON.stringify(str.strategyInfo);
  var load = new apiConfig.urlApi.mockConfig.updateMockConfig();
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
export const changeStatus = ({commit, state, dispatch}, str) => {
  var param = {};
  param = str;
  var load = new apiConfig.urlApi.mockConfig.changeStatus();
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
export const getMockConfigDetail = ({commit, state, dispatch}, str) => {
  var param = {};
  param.strategyename = str.strategyename;
  param.strategyinfoid = str.strategyinfoid;
  var load = new apiConfig.urlApi.mockConfig.getMockConfigDetail();
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
export const getAllMockConfigBySearch = ({commit, state, dispatch}, str) => {
  var param = {};
  param.searchType = str.searchType;
  param.searchValue = str.searchValue;
  var load = new apiConfig.urlApi.mockConfig.getAllMockConfigBySearch();
  load.param = param;
  return new Promise((resolve, reject) => {
    return load.exec(function (success) {
      var obj = success.data;
      resolve(obj);
    }, function (error) {

      console.log(error);
    })
  });
};
