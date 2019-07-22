//HTML模板引擎
var Hogan = require('hogan.js');
// modal框
var Modal = require('./modal/index.js');
//自己写的js加下划线
var _mm = {
    // 网络请求
    request : function(param){
        var _this = this;
        $.ajax({
            url         : param.url     || '',
            type        : param.method  || 'get',
            data        : param.data    || '',
            dataType    : param.type    || 'json',
            cache       : param.cache,
            processData : param.processData,
            contentType : param.contentType,
            success     : function(res){
                // 请求成功
                if(0 === res.status){
                    typeof param.success === 'function' && param.success(res.data, res.msg);
                }
                // 没有登录状态，需要强制登录
                else if(10 === res.status){
                    _this.doLogin();
                }
                // 请求不到数据
                else if(1 === res.status){
                    typeof param.error === 'function' && param.error(res.msg || res.data);
                }
                // 其他错误
                else {
                    _this.errorTips(res.msg || res.data);
                }
            },
            error       : function(err){
                typeof param.error === 'function' && param.error(err.statusText);
            }
        });
    },
    // 返回首页
    goHome : function(){
        window.location.href = './index.html';
    },
    // 统一登录处理
    doLogin : function(){
        window.location.href = './user-login.html?redirect=' + encodeURIComponent(window.location.href);
    },
    //获取服务器根路径
    serverHost : function () {
        // var pathName = window.location.pathname.substring(1),
        //     webName  = pathName === '' ? '' : pathName.substring(0, pathName.indexOf('/'));
        // if (webName === "") {
        //     return window.location.protocol + '//' + window.location.host;
        // } else {
        //     return window.location.protocol + '//' + window.location.host + '/' + webName;
        // }
        return '';
    },
    // 获取服务器地址
    getServerUrl : function(path){
        var _this = this;
        return _this.serverHost() + path;
    },
    // 获取url参数
    getUrlParam : function(name){
        var reg     = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var result  = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },
    // 渲染html模板
    renderHtml : function(htmlTemplate, data){
        var template = Hogan.compile(htmlTemplate);
        return template.render(data);
    },
    // 成功提示
    successTips : function(msg){
        Modal.success(msg || '操作成功！');
    },
    // 错误提示
    errorTips : function(errMsg){
        Modal.error(errMsg || '哪里不对了~');
    },
    // 操作提示
    confirmTips : function(msg, confirm){
        Modal.confirm(msg || '确认执行该操作吗？', confirm);
    },
    // 字段的验证，支持非空、手机、邮箱的判断
    validate : function(value, type){
        var value = $.trim(value);
        // 空值验证
        if('empty' === type){
            return !!value;
        }
        // 长度验证
        if ('length' === type) {
            return /^[\s\S]{6,18}$/.test(value);
        }
        // 数字验证
        if ('number' === type) {
            return /^[0-9]+$/.test(value);
        }
        // 手机号验证
        if('phone' === type){
            return /^1\d{10}$/.test(value);
        }
        // 邮箱格式验证
        if('email' === type){
            return /^(\w)+(\.-\w+)*@[a-zA-Z0-9-]+((\.[a-zA-Z0-9]{2,6}){1,3})$/.test(value);
        }
    },
    // H5本地存储
    setStorage: function(name, data){
        var value = {};
        // 设置存储时间
        value.setTime = new Date().getTime();
        // 存放数据
        value.data = data;
        // 存放到本地存储
        window.localStorage.setItem(name, JSON.stringify(value));
    },
    // 取出本地出内容
    getStorage: function(name){
        var _this = this, value = window.localStorage.getItem(name);
        // 没有值
        if (!value) {
            return '';
        }
        value = JSON.parse(value);
        // 不是我们存储的数据
        if (!value || !value.setTime) {
            return '';
        }
        // 是否过期
        var expire = ((new Date().getTime()) - value.setTime) > 30*60*1000;
        if (expire) {
            _this.removeStorage(name);
            return '';
        }
        // 更新时间
        _this.setStorage(name, value.data);
        return value.data;
    },
    // 删除本地存储
    removeStorage: function(name){
        window.localStorage.removeItem(name);
    }
};

module.exports = _mm;