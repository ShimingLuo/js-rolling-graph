
_listener = {};

function Base(selector) {
    this.elements = [];
    this.selectElement = function (selector) {
        var e = document.querySelectorAll(selector);
        for(var i=0; i<e.length; i++){
            this.elements.push(e[i]);
            this[i] = e[i];
            this['children'] = e[i].children;
        }
        this.length = e.length;
        return this;
    };
    this.initHTMLElement = function (obj) {
        this.elements.push(obj);
        this[0] = obj;
        this['children'] = obj.children;
        this.length = 1;
        return this;
    };
    if(!!selector){
        if(this.isDom(selector)){
            this.initHTMLElement(selector);
        }else {
            this.selectElement(selector);
        }
    }
}
Base.prototype.isDom = function (obj) {
    if(typeof HTMLElement === 'object'){
        return obj instanceof HTMLElement;
    }else {
        return obj && typeof obj === 'object' && obj.nodeType === 1;
    }
};
Base.prototype.click = function (fun) {
    for(var i=0; i<this.elements.length; i++){
        var element = this.elements[i];
        element.onclick = fun;
    }
};
Base.prototype.top = function (left) {
    var element = this.elements[0];
    if(arguments.length == 0){
        return element.style.top ? parseInt(element.style.top) : 0;
    }
    element.style.top = left + 'px';
    return this;
};
Base.prototype.hasClass = function (className) {
    var element = this.elements[0];
    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(element.className);
};
Base.prototype.removeClass = function (className) {
    for(var i=0; i<this.elements.length; i++){
        var element = this.elements[i];
        element.className = element.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), '');
    }
    return this;
};
Base.prototype.addClass = function (className) {
    for(var i=0; i<this.elements.length; i++){
        var element = this.elements[i];
        if(!new RegExp('(\\s|^)' + className + '(\\s|$)').test(element.className)){
            element.className += ' ' + className;
        }
    }
    return this;
};
Base.prototype.attr = function (attr, value) {
    var element = this.elements[0];
    if(arguments.length == 1){
        return element.getAttribute(attr);
    }
    element.setAttribute(attr, value);
    return this;
};
Base.prototype.data = function (attr, value) {
    var that = this;
    attr = 'data-' + attr;
    if(arguments.length == 1){
        return (function () {
            try {
                return eval(that.attr(attr));
            }catch (e){
                return that.attr(attr);
            }
        })();
    }
    that.attr(attr, value);
    return this;
};
Base.prototype.on = function (type, fun) {
    var ev = document.createEvent('HTMLEvents');
    ev.initEvent(type, false, false);
    for(var i=0; i<this.elements.length; i++){
        var element = this.elements[i];
        element.addEventListener(type, function (e) {
            if(typeof fun === 'function'){
                // this === element
                fun.call(this);// 将 fun 指向 element
                fun(e, e.data);
            }
        }, false);
    }
    _listener[type] = ev;
    return this;
};
Base.prototype.trigger = function (type, data) {
    var element = this.elements[0];
    _listener[type]['data'] = data;
    element.dispatchEvent(_listener[type]);
};
var $ = function (selector) {
    return new Base(selector);
};

window.onload = function () {
    var offsetSept = 350 + 3;
    $('#banner-img-list').on('indexChange', function (e, index) {
        if(!e){
            return;
        }
        $('#banner-img-list').data('current-index', index);
        $('#banner-img-list').top(-offsetSept * index);
        $('#banner-img-buttons span').removeClass('on');
        $('#banner-img-buttons span:nth-child(' + (index+1) + ')').addClass('on');
    });
    $('.arrow').click(function (e) {
        e.preventDefault();
        var index = $('#banner-img-list').data('current-index');
        var total = -1 + $('#banner-img-list').children.length;
        if($(this).hasClass('prev')){
            if(index == 0){
                index = total;
            }else {
                index -= 1;
            }
        }else if($(this).hasClass('next')){
            if(index == total){
                index = 0;
            }else {
                index += 1;
            }
        }
        $('#banner-img-list').trigger('indexChange', index);
    });
    $('#banner-img-buttons span').click(function (e) {
        e.preventDefault();
        var index = $(this).data('index');
        $('#banner-img-list').trigger('indexChange', index);
    });
};


