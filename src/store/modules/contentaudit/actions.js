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
export const updateDataForAudit = ({ commit, state, dispatch },param) => {
  var load = new apiConfig.urlApi.contentaudit.updateDataForAudit();
  load.param = param;
  return new Promise((resolve, reject) => {
    return load.exec(function( success ){
      var obj = success.data;
      resolve(obj);
    },function( error ){
      console.log( error );
    })
  });
};
