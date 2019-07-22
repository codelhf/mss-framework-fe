require('./index.css');
var _mm           = require('util/mm.js');
var _user         = require('service/user-service.js');
var _login        = require('./login.js');

// 导航
var nav = {
    init : function(option){
        this.onload();
        this.bindEvent();
        return this;
    },
    onload : function(){
        this.loadUserInfo();
    },
    bindEvent : function(){
        var _this = this;
        // 登录点击事件
        $('.js-login').click(function(){
            _login.show();
        });
        // 退出点击事件
        $('.js-logout').click(function(){
            _user.logout(function(res){
                window.location.reload();
            }, function(errMsg){
                _mm.errorTips(errMsg);
            });
        });
    },
    // 加载用户信息
    loadUserInfo : function(){
        _user.checkLogin(function(res){
            $('.user.not-login').hide().siblings('.user.login').show()
                .find('.username').text(res.username);
        }, function(errMsg){
            // do nothing
        });
    }
};

module.exports = nav.init();