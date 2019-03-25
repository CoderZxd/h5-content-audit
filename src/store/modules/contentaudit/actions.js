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
