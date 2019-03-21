import apiConfig from '../../api/http';

export const getDataForAudit = ({ commit, state, dispatch }) => {
  var load = new apiConfig.urlApi.contentaudit.getDataForAudit();
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
export const addProductLine = ({ commit, state, dispatch },str) => {
  var param = "";
  param += 'productLineName='+str.productLineName+'&eProductLineName='+str.eProductLineName+'&desc='+str.desc;
  var load = new apiConfig.urlApi.contentaudit.addProductLine();
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
export const deleteProductLine = ({ commit, state, dispatch },str) => {
  var param = "";
  param += 'productLineId='+str;
  var load = new apiConfig.urlApi.contentaudit.deleteProductLine();
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
export const updateProductLine = ({ commit, state, dispatch },str) => {
  var param = "";
  param += 'productLineName='+str.productLineName+'&eProductLineName='+str.eProductLineName+'&desc='+str.desc+'&productLineId='+str.productLineId;
  var load = new apiConfig.urlApi.contentaudit.updateProductLine();
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
