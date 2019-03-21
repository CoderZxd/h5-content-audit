import apiConfig from '../../api/http';

export const getAllStategy = ({ commit, state, dispatch }) => {
  var load = new apiConfig.urlApi.strategyConfig.getAllStategy();
  load.type="get";
  return new Promise((resolve, reject) => {
    return load.exec(function( success ){
      var obj = success.data;
      resolve(obj);
    },function( error ){

      console.log( error );
    })
  });
};

export const updateStrategy = ({commit, state, dispatch}, str) => {
  var param = "";
  param += 'strategyId='+str.strategyId+'&strategyName='+str.strategyName+'&strategyename='+str.strategyename+'&desc='+str.desc;
  var load = new apiConfig.urlApi.strategyConfig.updateStrategy();
  load.url = load.url + '?'+param;
  return new Promise((resolve, reject) => {
    return load.exec(function (success) {
      var obj = success;
      resolve(obj);
    }, function (error) {
      console.log(error);
    })
  });
};

export const addStrategy = ({commit, state, dispatch}, str) => {
  var param = "";
  param += 'strategyName='+str.strategyName+'&strategyename='+str.strategyename+'&desc='+str.desc;
  var load = new apiConfig.urlApi.strategyConfig.addStrategy();
  load.url = load.url + '?'+param;
  return new Promise((resolve, reject) => {
    return load.exec(function (success) {
      var obj = success;
      resolve(obj);
    }, function (error) {
      console.log(error);
    })
  });
};

export const deleteStrategy = ({ commit, state, dispatch },str) => {
  var param = "";
  param += 'strategyId='+str;
  var load = new apiConfig.urlApi.strategyConfig.deleteStrategy();
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
