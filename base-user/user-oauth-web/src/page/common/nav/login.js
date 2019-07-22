require('./login.css');
var _mm             = require('util/mm.js');
var _user           = require('service/user-service.js');
var templateIndex   = require('./login.string');

// 表单里的错误提示
var formError = {
    show : function(errMsg){
        $('.error-item').show().find('.err-msg').text(errMsg);
    },
    hide : function(){
        $('.error-item').hide().find('.err-msg').text('');
    }
};
// page逻辑部分
var modal = {
    show : function(){
        // 缓存modal框
        this.$modalWrap = $('.login-wrap');
        // 加载信息
        this.loadInfo();
        // 绑定事件
        this.bindEvent();
    },
    // 关闭弹窗
    hide : function(){
        this.$modalWrap.empty();
    },
    loadInfo : function(){
        var modalHtml = _mm.renderHtml(templateIndex);
        this.$modalWrap.html(modalHtml);
    },
    bindEvent : function(){
        var _this = this;
        // 保证点击modal内容区的时候不关闭弹窗
        this.$modalWrap.find('.user-con').click(function(e){
            e.stopPropagation();
        });
        // 提交或者点击蒙版区域,关闭弹窗
        this.$modalWrap.find('.close').click(function(){
            _this.hide();
        });
        // 登录按钮的点击
        this.$modalWrap.find('#submit').click(function(){
            _this.submit();
        });
        // 如果按下回车,也进行提交
        this.$modalWrap.find('.user-content').keyup(function(e){
           // keyCode == 13 表示回车键
           if (e.keyCode === 13) {
                _this.submit();
           }
        });
    },
    // 提交表单
    submit : function(){
        var formData = {
            username : $.trim($('#username').val()),
            password : $.trim($('#password').val())
        },
        // 表单验证结果
        validateResult = this.formValidate(formData);
        // 验证成功
        if (validateResult.status) {
            _user.login(formData,function(res){
                window.location.href = _mm.getUrlParam('redirect') || './index.html';
            }, function(errMsg){
                formError.show(errMsg);
            });
        }
        // 验证失败
        else{
            // 错误提示
            formError.show(validateResult.msg);
        }
    },
    // 表单的验证
    formValidate : function(formData){
        var result = {
            status : false,
            msg    : ''
        };
        if (!_mm.validate(formData.username,'require')) {
            result.msg = '用户名不能为空';
            return result;
        }
        if (!_mm.validate(formData.password,'require')) {
            result.msg = '密码不能为空';
            return result;
        }
        // 通过验证,返回正确结果
        result.status = true;
        result.msg    = '通过验证';
        return result;
    }
};

module.exports = modal;