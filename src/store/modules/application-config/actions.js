import apiConfig from '../../api/http';
export const getApplication = ({commit, state, dispatch}) => {
  var load = new apiConfig.urlApi.applicationConfig.getAllApplication();
  load.type = "get";
  return new Promise((resolve, reject) => {
    return load.exec(function (success) {
      var obj = success.data;
      resolve(obj);
    }, function (error) {
      console.log(error);
    })
  });
};
export const getNamespacesByApplicationId = ({commit, state, dispatch},str) => {
  var load = new apiConfig.urlApi.applicationConfig.getNamespacesByApplicationId();
  load.param = str;
  return new Promise((resolve, reject) => {
    return load.exec(function (success) {
      var obj = success.data;
      resolve(obj);
    }, function (error) {
      console.log(error);
    })
  });
};
export const getRoutecodesByNamespace = ({commit, state, dispatch},str) => {
  var load = new apiConfig.urlApi.applicationConfig.getRoutecodesByNamespace();
  load.param = str;
  return new Promise((resolve, reject) => {
      return load.exec(function (success) {
        var obj = success.data;
        resolve(obj);
      }, function (error) {
        console.log(error);
      })
    });
};
export const getAllNamespace = ({commit, state, dispatch},str) => {
  var load = new apiConfig.urlApi.applicationConfig.getAllNamespace();
  load.param = str;
  return new Promise((resolve, reject) => {
      return load.exec(function (success) {
        var obj = success.data;
        resolve(obj);
      }, function (error) {
        console.log(error);
      })
    });
};
export const getAllApplicationBySearch = ({commit, state, dispatch},str) => {
  var load = new apiConfig.urlApi.applicationConfig.getAllApplicationBySearch();
  load.param = str;
  return new Promise((resolve, reject) => {
    return load.exec(function (success) {
      var obj = success.data;
      resolve(obj);
    }, function (error) {
      console.log(error);
    })
  });
};
export const addApplication = ({commit, state, dispatch}, str) => {
  var param = {};
  param.applicationName = str.applicationName;
  param.eapplicationName = str.eapplicationName;
  param.applicationDesc = str.desc;
  param.productLineId = str.productlineinfo.productLineId;
  param.MonitorSwitch = str.MonitorSwitch;
  param.moduleStr = JSON.stringify(str.moduleStr);
  param.applicationPersonArray = JSON.stringify(str.applicationPersonArray);
  param.applicationmonitorArray = JSON.stringify(str.applicationmonitorArray);
  param.isAudit = str.isAudit;
  param.envConfig = str.envConfig;
  var load = new apiConfig.urlApi.applicationConfig.addApplication();
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
export const deleteApplication = ({commit, state, dispatch}, str) => {
  var param = "";
  param += 'applicationId=' + str;
  var load = new apiConfig.urlApi.applicationConfig.deleteApplication();
  load.url = load.url + '?' + param;
  return new Promise((resolve, reject) => {
    return load.exec(function (success) {
      var obj = success;
      resolve(obj);
    }, function (error) {

      console.log(error);
    })
  });
};
export const queryApplicationsByProdLine = ({commit, state, dispatch}, str) => {
  var param = "";
  param += 'eproductLineName=' + str;
  var load = new apiConfig.urlApi.applicationConfig.queryApplicationsByProdLine();
  load.url = load.url + '?' + param;
  return new Promise((resolve, reject) => {
    return load.exec(function (success) {
      var obj = success;
      resolve(obj);
    }, function (error) {

      console.log(error);
    })
  });
};
export const updateApplication = ({commit, state, dispatch}, str) => {
  var param = {};
  param.applicationName = str.applicationName;
  param.eapplicationName = str.eapplicationName;
  param.applicationDesc = str.desc;
  param.productLineId = str.productlineinfo.productLineId;
  param.MonitorSwitch = str.MonitorSwitch;
  param.moduleStr = JSON.stringify(str.moduleStr);
  param.applicationPersonArray = JSON.stringify(str.applicationPersonArray);
  param.applicationmonitorArray = JSON.stringify(str.applicationmonitorArray);
  param.applicationId = str.applicationId;
  param.isAudit = str.isAudit;
  param.envConfig = str.envConfig;
  var load = new apiConfig.urlApi.applicationConfig.updateApplication();
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
