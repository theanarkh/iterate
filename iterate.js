    var utils = {};
    utils.isObject = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }

    utils.isArray  = function(arr) {
        return Object.prototype.toString.call(arr) === '[object Array]';
    }

    utils.flatten =function(arg,overwrite) {
        if (utils.isArray(arg)) {
            return utils.flattenArray(arg);
        }
        else if(utils.isObject(arg)){
            return utils.flattenObject(arg,overwrite);
        } else {
            return [arg];
        }
    }

    utils.flattenArray = function(arr) {
        var result = [];
        var len = arr.length;
        var index = 0;
        var position = 0;
        for (;index<len;index++) {
            var value = arr[index];
            if (utils.isArray(value)) {
                var tmp = utils.flattenArray(value);
                var _len = tmp.length;
                var _index = 0;
                while (_index<_len) {
                    result[position++] = tmp[_index++];
                }
            }
            else{
                result[position++] = value;//utils.isObject(value) ? JSON.stringify(value) : value;
            }
        }
        return result;
    }

    utils.flattenObject = function(obj, overwrite) { //键值越前越深就可能会被后面的覆盖
        if (!utils.isObject(obj)) {
            return;
        }
        var keys = Object.keys(obj);
        var len = keys.length;
        var result = {};
        for (var index = 0; index < len; index++) {
            var value = obj[keys[index]];
            if (utils.isObject(value)) {
                var ret = utils.flatten(value, overwrite);
                var _keys = Object.keys(ret);
                var _len = _keys.length;
                for (var _index = 0; _index < _len; _index++) {
                    var _key = _keys[_index];
                    (result[_key] && !overwrite) || (result[_key] = ret[_key]);
                }
            } else {
                (result[keys[index]] && !overwrite) || (result[keys[index]] = value);
            }
        }
        return result;
    }
    /*
        arg: array|object
        fun: callback
        context: this
        deepExtend: true|false (extend the )
    */
    utils.iterate = function(arg,fun,context,deepExtend) {
    	if (utils.isArray(arg)) {
    		var result = utils.flatten(arg);
    		for (var index = 0; index< result.length;index++) {
    			if (deepExtend && utils.isObject(result[index])) {
    				if (utils.iterate(result[index],fun,context,deepExtend) === false) {
    					return false;
    				}
    			}
    			else if (fun.call(context,result[index],index,result) === false) {
    				return false;
    			}
    		}
    	} else if (utils.isObject(arg)) {
    		for (var key in arg) {
    			if (hasOwnProperty.call(arg,key)) {
    				if (utils.isObject(arg[key])) {
    					if (utils.iterate(arg[key],fun,context) === false) {
    						return false;
    					}
    				} else if (deepExtend && utils.isArray(arg[key])){
                        if (utils.iterate(arg[key],fun,context,deepExtend) === false) {
                            return false;
                        }
                    } 
                    else {
    					if (fun.call(context,arg[key],key,arg) === false) {
		    				return false;
		    			}
    				}
    			}
    		}
    	}
    }

utils.iterate({hello:'world'},function(value,index,obj) {
    console.log(value,index)
},null)

utils.iterate([1,2,3],function(value,index,obj) {
    console.log(value,index) 
},null)

utils.iterate({hello:[1,2,3]},function(value,index,obj) {
    console.log(value,index) 
},null,false)

utils.iterate({hello:[1,2,3]},function(value,index,obj) {
    console.log(value,index) 
},null,true)

utils.iterate([1,2,[3],{a:4,b:5}],function(value,index,obj) {
    console.log(value,index) 
},null,false)

utils.iterate([1,2,[3],{a:4,b:5}],function(value,index,obj) {
    console.log(value,index) 
},null,true)

utils.iterate({hello:[{a:1},2,3]},function(value,index,obj) {
    console.log(value,index) 
},null,true)

utils.iterate([1,2,3],function(value,index,obj) {
    console.log(value,index) 
    if (value === 1) return false;
},null,true)
