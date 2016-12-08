import $ from 'jquery';

function query(uri, data, cb, _cacheTime){
    if(!uri) return false;
    if(!$.isPlainObject(data) && $.isFunction(data)){
        _cacheTime = cb;
        cb = data;
        data = {};
    }
    var cacheTime = _cacheTime;
    if(_cacheTime && !$.isFunction(_cacheTime)){
        cacheTime = function(){
            return _cacheTime;
        }
    }
    if(cacheTime){
        var res = cache.getItem(uri);
        if(res){
            return $.isFunction(cb) && cb(res);
        }
    }
    // 携带url基础query参数
    data = $.extend({}, data, url.get('?'));
    $.ajax({
        url: uri,
        data: data,
        success: function(res){
            if(cacheTime){
                cache.setItem(uri, res, cacheTime(res));
            }
            $.isFunction(cb) && cb(res);
        },
        error: function(res){
            // TODO 之后可以做统一上报
            $.isFunction(cb) && cb(false);
        }
    });


}

export default query;
