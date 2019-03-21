export function getTime(date,isGetMillSeconds){
  if(!date) {
    return '';
  }
  var date = new Date(date);
  var Y = date.getFullYear();
  var M = date.getMonth() + 1;
  M = M < 10 ? '0' + M : M;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var H = date.getHours();
  H = H < 10 ? '0' + H : H;
  var m = date.getMinutes();
  m = m < 10 ? '0' + m : m;
  var s = date.getSeconds();
  s = s < 10 ? '0' + s : s;
  var ms = date.getMilliseconds();
  ms = ms < 10 ? '00'+ms : (ms < 100 ? '0'+ms : ms);
  return Y + '-' + M + '-' + d + ' ' + H + ':' + m + ':' + s+(!!isGetMillSeconds ? '.'+ms :'');
}
