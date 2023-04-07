Array.prototype.forEach = Array.prototype.forEach || function (callback) {
  var isArray = Object.prototype.toString.call(this) == '[object Array]';
  if(isArray){
      for(var key in this){
          if(key != 'forEach'){
              callback.call(this[key],key,this[key],this);
          }
      }
  }else{
      throw TypeError;
  }
};