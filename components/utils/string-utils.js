String.prototype.trunc = String.prototype.trunc ||
  function(n){
    var str = this.length>n ? this.substr(0,n-1)+'...' : this;
    return str.replace(/^\"|\"$/, '');
  };

String.prototype.contains = String.prototype.contains ||
  function(it) {
  	return this.toLowerCase().indexOf(it.toLowerCase()) !== -1;
  };

Function.prototype.getMethods = Function.prototype.getMethods ||
  function(obj) {
    var res = [];
    for(var m in obj) {
      if(typeof obj[m] == "function") {
        res.push(m)
      }
    }
    return res;
  };