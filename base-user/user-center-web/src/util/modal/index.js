require('./index.css');
var Hogan         = require('hogan.js');
var templateIndex = require('./index.string');
// modal弹窗
var Modal = {
    init : function() {
        // 缓存modal框
        this.$modalWrap = $('.modal-wrap');
        // 绑定事件
        this.bindEvent();
    },
    // 绑定弹窗点击事件
    bindEvent : function(){
        var _this = this;
        // 保证点击modal内容区的时候不关闭弹窗
        $(document).on('click', '.modal-con', function(e){
            e.stopPropagation();
        });
        // 点击叉号关闭弹窗
        $(document).on('click','.modal-close', function(){
            _this.hide();
        });
    },
    // 关闭弹窗
    hide : function(){
        this.$modalWrap.empty();
    },
    // 显示弹窗
    show : function(templateHtml, params){
        var _this = this,
            data  = {
                type          : params.type          || 'confirm',
                className     : params.className,
                maskCloseable : params.maskCloseable || false,
                modalTile     : params.title,
                modalMessage  : params.message,
                onOk          : params.onOk          || function () {},
                onCancel      : params.onCancel      || function () {},
                okText        : params.okText        || 'Ok',
                cancelText    : params.cancelText    || 'Cancel',
            };
        // 不是用户自定义HTML
        if (!templateHtml) {
            // 渲染HTML
            var modalHtml = Hogan.compile(templateIndex).render(data);
            this.$modalWrap.html(modalHtml);
        } else {
            // 渲染HTML
            var modalHtml = Hogan.compile(templateHtml).render(params);
            this.$modalWrap.html(modalHtml);
        }
        // 确认框显示取消按钮
        if (params.type === 'confirm') {
            this.$modalWrap.find('.modal-cancel').css('display', 'inline-block');
        }
        // 确认按钮点击事件
        this.$modalWrap.find('.modal-confirm').click(function(){
            _this.hide();
            if (typeof params.onOk === 'function') {
                params.onOk();
            }
        });
        // 取消按钮点击事件
        this.$modalWrap.find('.modal-cancel').click(function(){
            _this.hide();
            if (typeof params.onCancel === 'function') {
                params.onCancel();
            }
        });
        // 透明背景的点击事件, 默认不可关闭
        this.$modalWrap.find('.modal-mask').click(function () {
            if (params.maskCloseable) {
                _this.hide();
            }
        });
    },
    // 弹窗提示
    alert : function(title, message, type, onOk, onCancel, okText, cancelText, className, maskCloseable){
        var params = {
            type          : type  || 'alert',
            title         : title || '温馨提示~',
            message       : message,
            onOk          : onOk,
            onCancel      : onCancel,
            okText        : okText     || '确定',
            cancelText    : cancelText || '取消',
            className     : className,
            maskCloseable : maskCloseable
        };
        this.show(null, params);
    },
    // 确认提示
    confirm : function(message, onOk, onCancel, title){
        this.alert(message, title || '确认提示？', 'confirm', onOk, onCancel);
    },
    // 成功提示
    success : function(message, title){
        this.alert(message, title || '成功提示！', 'success');
    },
    // 错误提示
    error : function(message, title){
        this.alert(message, title || '错误提示！！！', 'error');
    }
};

module.exports = Modal.init();