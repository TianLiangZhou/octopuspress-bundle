var CKFinder = function () {
    function __internalInit(e) {
        return (e = e || {})['demoMessage'] = 'This is a demo version of CKFinder 3', e['hello'] = 'Hello fellow cracker! We are really sad that you are trying to crack our application - we put lots of effort to create it. ' + 'Would you like to get a free CKFinder license? Feel free to submit your translation! https://ckeditor.com/docs/ckfinder/ckfinder3/#!/guide/dev_translations', e['isDemo'] = !0, e;
    }
    var connectors = {
            php: 'core/connector/php/connector.php',
            net: '/ckfinder/connector',
            java: '/ckfinder/connector'
        }, connector = 'php';
    function internalCKFinderInit(e, t, n) {
        var i = t.getElementsByTagName('head')[0], r = t.createElement('script');
        r[r.innerText ? 'innerText' : 'innerHTML'] = n + '.CKFinder._setup( window, document );CKFinder.start(' + JSON.stringify(e) + ');', i.appendChild(r);
    }
    function configOrDefault(e, t) {
        return e || t;
    }
    function createUrlParams(e) {
        var t = [];
        for (var n in e)
            t.push(encodeURIComponent(n) + '=' + encodeURIComponent(e[n]));
        return '?' + t.join('&');
    }
    function extendObject(e, t) {
        for (var n in t)
            t.hasOwnProperty(n) && (e[n] = t[n]);
        return e;
    }
    function getCookie(e) {
        e = e.toLowerCase();
        for (var t = window.document.cookie.split(';'), n = 0; n < t.length; n++) {
            var i = t[n].split('='), r = decodeURIComponent(i[0].trim().toLowerCase()), o = 1 < i.length ? i[1] : '';
            if (r === e)
                return decodeURIComponent(o);
        }
        return null;
    }
    function setCookie(e, t) {
        window.document.cookie = encodeURIComponent(e) + '=' + encodeURIComponent(t) + ';path=/';
    }
    function updateIOSConfig(e, t) {
        e._iosWidgetHeight = parseInt(getComputedStyle(t).height), e._iosWidgetWidth = parseInt(getComputedStyle(t).width);
    }
    function checkOnInit(t, e) {
        var n = e.navigator.userAgent;
        if ((0 < n.indexOf('MSIE ') || 0 < n.indexOf('Trident/') || 0 < n.indexOf('Edge/')) && e.addEventListener('ckfinderReady', function (n) {
                setTimeout(function () {
                    var e = n.detail.ckfinder, t = getCookie('ckCsrfToken');
                    t || (t = e.request('csrf:getToken'), setCookie('ckCsrfToken', t)), e.request('internal:csrf:setParentWindowToken', { token: t });
                }, 1000);
            }), t && !t._omitCheckOnInit && 'function' == typeof t.onInit) {
            var i = t.onInit;
            delete t.onInit, e.addEventListener('ckfinderReady', function (e) {
                t._initCalled || (t._initCalled = !0, i(e.detail.ckfinder));
            });
        }
    }
    var basePath = function () {
            if (parent && parent.CKFinder && parent.CKFinder.basePath)
                return parent.CKFinder.basePath;
            var e, t, n, i = document.getElementsByTagName('script');
            for (e = 0; e < i.length && (!(n = void 0 !== (t = i[e]).getAttribute.length ? t.src : t.getAttribute('src')) || -1 === n.split('/').slice(-1)[0].indexOf('ckfinder.js')); e++);
            return n.split('/').slice(0, -1).join('/') + '/';
        }(), Modal = {
            open: function (e) {
                if (e = e || {}, !Modal.div) {
                    Modal.heightAdded = 48, Modal.widthAdded = 2;
                    var r, o, t = Math.min(configOrDefault(e.width, 1000), window.innerWidth - Modal.widthAdded), n = Math.min(configOrDefault(e.height, 700), window.innerHeight - Modal.heightAdded), s = !1, a = !1, i = 0, l = 0, u = e.width, c = e.height;
                    e.width = e.height = '100%';
                    var d = Modal.div = document.createElement('div');
                    d.id = 'ckf-modal', d.style.position = 'fixed', d.style.top = (document.documentElement.clientHeight - Modal.heightAdded) / 2 - n / 2 + 'px', d.style.left = (document.documentElement.clientWidth - Modal.widthAdded) / 2 - t / 2 + 'px', d.style.background = '#fff', d.style.border = '1px solid #aaa', d.style.boxShadow = '3px 3px 5px rgba(0,0,0,0.2)', d.style.zIndex = 8999, d.innerHTML = '<div id="ckf-modal-header" style="cursor: move; height:35px !important; background: #fafafa">' + '<a style="float: right; padding: 7px 10px 0 !important; margin: 0 !important; font-family: Arial, sans-serif !important; font-weight:bold; font-size: 20px !important; line-height: 20px !important; text-decoration: none !important; color: #888 !important;" id="ckf-modal-close" href="#">\xD7</a>' + '</div>' + '<div id="ckf-modal-body" style="position: relative;width: ' + t + 'px; height: ' + n + 'px"></div>' + '<div id="ckf-modal-footer" style="height: 10px !important; background: #f3f3f3">' + '<span id="ckf-modal-resize-handle-sw" style="cursor: sw-resize; width: 7px; height: 7px; display: block; float: left; border-left: 3px solid #ddd; border-bottom: 3px solid #ddd;"></span>' + '<span id="ckf-modal-resize-handle-se" style="cursor: se-resize; width: 7px; height: 7px; display: block; float: right; border-right: 3px solid #ddd; border-bottom: 3px solid #ddd;"></span>' + '</div>', document.body.appendChild(d), CKFinder.widget('ckf-modal-body', e), Modal.footer = document.getElementById('ckf-modal-footer'), window.addEventListener('orientationchange', function () {
                        Modal.maximized || setTimeout(function () {
                            t = Math.min(configOrDefault(u, 1000), document.documentElement.clientWidth - Modal.widthAdded), n = Math.min(configOrDefault(c, 700), document.documentElement.clientHeight - Modal.heightAdded);
                            var e = document.getElementById('ckf-modal-body');
                            e.style.width = t + 'px', e.style.height = n + 'px', d.style.top = (document.documentElement.clientHeight - Modal.heightAdded) / 2 - n / 2 + 'px', d.style.left = (document.documentElement.clientWidth - Modal.widthAdded) / 2 - t / 2 + 'px';
                        }, 100);
                    }), b(document.getElementById('ckf-modal-close'), [
                        'click',
                        'touchend'
                    ], function (e) {
                        e.stopPropagation(), e.preventDefault(), Modal.close();
                    });
                    var f = Modal.header = document.getElementById('ckf-modal-header'), h = d.offsetLeft, g = d.offsetTop;
                    b(f, [
                        'mousedown',
                        'touchstart'
                    ], function (e) {
                        e.preventDefault(), !0;
                        var t = E(e);
                        i = t.x, l = t.y, h = i - d.offsetLeft, g = l - d.offsetTop, w.appendChild(C), b(document, [
                            'mousemove',
                            'touchmove'
                        ], F);
                    }), b(f, [
                        'mouseup',
                        'touchend'
                    ], function () {
                        !1, C.parentNode === w && w.removeChild(C), x(document, [
                            'mousemove',
                            'touchmove'
                        ], F);
                    });
                    var p, v, m = document.getElementById('ckf-modal-resize-handle-se'), y = document.getElementById('ckf-modal-resize-handle-sw'), w = Modal.body = document.getElementById('ckf-modal-body'), C = document.createElement('div');
                    C.style.position = 'absolute', C.style.top = C.style.right = C.style.bottom = C.style.left = 0, C.style.zIndex = 100000, b(m, [
                        'mousedown',
                        'touchstart'
                    ], function (e) {
                        s = !0, T(e);
                    }), b(y, [
                        'mousedown',
                        'touchstart'
                    ], function (e) {
                        h = d.offsetLeft, a = !0, T(e);
                    });
                }
                function b(t, e, n) {
                    e.forEach(function (e) {
                        t.addEventListener(e, n);
                    });
                }
                function x(t, e, n) {
                    e.forEach(function (e) {
                        t.removeEventListener(e, n);
                    });
                }
                function E(e) {
                    return 0 === e.type.indexOf('touch') ? {
                        x: e.touches[0].pageX,
                        y: e.touches[0].pageY
                    } : {
                        x: document.all ? window.event.clientX : e.pageX,
                        y: document.all ? window.event.clientX : e.pageY
                    };
                }
                function F(e) {
                    var t = E(e);
                    i = t.x;
                    var n = (l = t.y) - g;
                    d.style.left = i - h + 'px', d.style.top = (n < 0 ? 0 : n) + 'px';
                }
                function _(e) {
                    var t, n, i = E(e);
                    s ? (t = r - (p - i.x), n = o - (v - i.y), 200 < t && (w.style.width = t + 'px'), 200 < n && (w.style.height = n + 'px')) : a && (t = r + (p - i.x), n = o - (v - i.y), 200 < t && (w.style.width = t + 'px', d.style.left = h - (p - i.x) + 'px'), 200 < n && (w.style.height = n + 'px'));
                }
                function M() {
                    C.parentNode === w && w.removeChild(C), a = s = !1, x(document, [
                        'mousemove',
                        'touchmove'
                    ], _), x(document, [
                        'mouseup',
                        'touchend'
                    ], M);
                }
                function T(e) {
                    e.preventDefault();
                    var t = E(e);
                    p = t.x, v = t.y, r = w.clientWidth, o = w.clientHeight, w.appendChild(C), b(document, [
                        'mousemove',
                        'touchmove'
                    ], _), b(document, [
                        'mouseup',
                        'touchend'
                    ], M);
                }
            },
            close: function () {
                Modal.div && (document.body.removeChild(Modal.div), Modal.div = null, Modal.maximized && (document.documentElement.style.overflow = Modal.preDocumentOverflow, document.documentElement.style.width = Modal.preDocumentWidth, document.documentElement.style.height = Modal.preDocumentHeight));
            },
            maximize: function (e) {
                e ? (Modal.preDocumentOverflow = document.documentElement.style.overflow, Modal.preDocumentWidth = document.documentElement.style.width, Modal.preDocumentHeight = document.documentElement.style.height, document.documentElement.style.overflow = 'hidden', document.documentElement.style.width = 0, document.documentElement.style.height = 0, Modal.preLeft = Modal.div.style.left, Modal.preTop = Modal.div.style.top, Modal.preWidth = Modal.body.style.width, Modal.preHeight = Modal.body.style.height, Modal.preBorder = Modal.div.style.border, Modal.div.style.left = Modal.div.style.top = Modal.div.style.right = Modal.div.style.bottom = 0, Modal.body.style.width = '100%', Modal.body.style.height = '100%', Modal.div.style.border = '', Modal.header.style.display = 'none', Modal.footer.style.display = 'none', Modal.maximized = !0) : (document.documentElement.style.overflow = Modal.preDocumentOverflow, document.documentElement.style.width = Modal.preDocumentWidth, document.documentElement.style.height = Modal.preDocumentHeight, Modal.div.style.right = Modal.div.style.bottom = '', Modal.div.style.left = Modal.preLeft, Modal.div.style.top = Modal.preTop, Modal.div.style.border = Modal.preBorder, Modal.body.style.width = Modal.preWidth, Modal.body.style.height = Modal.preHeight, Modal.header.style.display = 'block', Modal.footer.style.display = 'block', Modal.maximized = !1);
            }
        };
    function S(e) {
        for (var t = '', n = e.charCodeAt(0), i = 1; i < e.length; ++i)
            t += String.fromCharCode(e.charCodeAt(i) ^ i + n & 127);
        return t;
    }
    var _r = /(window|S("A0&5j4"))/, ckfPopupWindow;
    function isIE9() {
        var e, t = -1;
        return navigator.appName == 'Microsoft Internet Explorer' && (e = navigator.userAgent, null !== new RegExp('MSIE ([0-9]{1,}[.0-9]{0,})').exec(e) && (t = parseFloat(RegExp.$1))), 9 === t;
    }
    return {
        basePath: basePath,
        connector: connector,
        _connectors: connectors,
        modal: function (e) {
            return e === 'close' ? Modal.close() : e === 'visible' ? !!Modal.div : e === 'maximize' ? Modal.maximize(!0) : e === 'minimize' ? Modal.maximize(!1) : void Modal.open(e);
        },
        config: function (e) {
            CKFinder._config = e;
        },
        widget: function (e, t) {
            if (t = t || {}, !e)
                throw 'No "id" option defined in CKFinder.widget() call.';
            function n(e) {
                return e + (/^[0-9]+$/.test(e) ? 'px' : '');
            }
            var i = 'border:none;';
            i += 'width:' + n(configOrDefault(t.width, '100%')) + ';', i += 'height:' + n(configOrDefault(t.height, '400')) + ';';
            var r = document.createElement('iframe');
            r.src = '', r.setAttribute('style', i), r.setAttribute('seamless', 'seamless'), r.setAttribute('scrolling', 'auto'), r.setAttribute('tabindex', configOrDefault(t.tabindex, 0)), r.attachEvent ? r.attachEvent('onload', function () {
                internalCKFinderInit(t, r.contentDocument, 'parent');
            }) : r.onload = function () {
                /iPad|iPhone|iPod/.test(navigator.platform) && (updateIOSConfig(t, r), r.contentWindow.addEventListener('ckfinderReady', function (e) {
                    e.detail.ckfinder.on('ui:resize', function (e) {
                        updateIOSConfig(e.finder.config, r);
                    }, null, null, 1);
                })), internalCKFinderInit(t, r.contentDocument, 'parent');
            };
            var o = document.getElementById(e);
            if (!o)
                throw 'CKFinder.widget(): could not find element with id "' + e + '".';
            o.innerHTML = '', o.appendChild(r), checkOnInit(t, r.contentWindow);
        },
        popup: function (e) {
            e = e || {}, window.CKFinder._popupOptions = e;
            var t, n = isIE9() ? window.CKFinder.basePath + 'ckfinder.html' : 'about:blank', i = 'location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes';
            i += ',width=' + configOrDefault(e.width, 1000), i += ',height=' + configOrDefault(e.height, 700), i += ',top=50', i += ',left=100', void 0 === ckfPopupWindow || ckfPopupWindow.closed || ckfPopupWindow.close();
            try {
                var r = 'CKFPopup' + Date.now();
                ckfPopupWindow = window.open(n, r, i);
            } catch (e) {
                return;
            }
            function o() {
                ckfPopupWindow && ((t = ckfPopupWindow.document).open(containerComponent), t.write('<!DOCTYPE html>' + '<html>' + '<head>' + '<meta charset="utf-8">' + '<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">' + '<title>CKFinder 3 - File Browser</title>' + '</head>' + '<body>' + '<script src="' + window.CKFinder.basePath + 'ckfinder.min.js" charset="utf-8"></script>' + '<script>' + 'window.isCKFinderPopup=true;' + 'window.onload=function() {' + '    CkfinderMin.start( window.opener.CKFinder._popupOptions );' + '}' + '</script>' + '</body>' + '</html>'), t.close(), ckfPopupWindow.focus());
            }
            return /iPad|iPhone|iPod/.test(navigator.platform) ? setTimeout(o, 100) : o(), ckfPopupWindow;
        },
        start: function (e) {
            if (!e) {
                var t = window.opener, n = {};
                e = {};
                var i = window.location.search.substring(1);
                if (i)
                    for (var r = i.split('&'), o = 0; o < r.length; ++o) {
                        var s = r[o].split('=');
                        n[s[0]] = s[1] || null;
                    }
                if (n.popup && (window.isCKFinderPopup = !0), t && n.configId && t.CKFinder && t.CKFinder._popupOptions) {
                    var a = decodeURIComponent(n.configId);
                    (e = t.CKFinder._popupOptions[a] || {})._omitCheckOnInit = !0;
                }
            }
            CKFinder._setup(window, document), checkOnInit(e, window), CKFinder.start(e);
        },
        setupCKEditor: function (e, t, n) {
            if (e) {
                e.config.filebrowserBrowseUrl = window.CKFinder.basePath + 'ckfinder.html', n = extendObject({
                    command: 'QuickUpload',
                    type: 'Files'
                }, n), t = extendObject(window.CKFinder._config || {}, t);
                var i = window.CKFinder._connectors[window.CKFinder.connector];
                '/' !== i.charAt(0) && (i = window.CKFinder.basePath + i), i = o(i), Object.keys(t).length && (window.CKFinder._popupOptions || (window.CKFinder._popupOptions = {}), t._omitCheckOnInit = !0, window.CKFinder._popupOptions[e.name] = t, e.config.filebrowserBrowseUrl += '?popup=1&configId=' + encodeURIComponent(e.name), t.connectorPath && (i = o(t.connectorPath))), e.config.filebrowserUploadUrl = i + createUrlParams(n);
            } else {
                for (var r in CKEDITOR.instances)
                    CKFinder.setupCKEditor(CKEDITOR.instances[r]);
                CKEDITOR.on('instanceCreated', function (e) {
                    CKFinder.setupCKEditor(e.editor);
                });
            }
            function o(e) {
                if (/^(http(s)?:)?\/\/.+/i.test(e))
                    return e;
                0 !== e.indexOf('/') && (e = '/' + e);
                var t = window.parent ? window.parent.location : window.location;
                return t.protocol + '//' + t.host + e;
            }
        },
        _setup: function (window, document) {
            var CKFinder, yh, zh, Ah, Bh, QEa, event;
            window.CKFinder = window.CKFinder || {}, window.CKFinder.connector = connector, window.CKFinder._connectors = connectors, window.CKFinder.basePath = function () {
                if (window.parent && window.parent.CKFinder && window.parent.CKFinder.basePath)
                    return window.parent.CKFinder.basePath;
                for (var e, t, n = document.getElementsByTagName('script'), i = 0; i < n.length && (!(t = void 0 !== (e = n[i]).getAttribute.length ? e.src : e.getAttribute('src')) || -1 === t.split('/').slice(-1)[0].indexOf('ckfinder.js')); i++);
                return t.split('/').slice(0, -1).join('/') + '/';
            }(), function () {
                var requirejs, require, define;
                CKFinder && CKFinder.requirejs || (CKFinder ? require = CKFinder : CKFinder = {}, function (global) {
                    var req, s, head, baseElement, dataMain, src, interactiveScript, currentlyAddingScript, mainScript, subPath, version = '2.1.22', commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm, cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g, jsSuffixRegExp = /\.js$/, currDirRegExp = /^\.\//, op = Object.prototype, ostring = op.toString, hasOwn = op.hasOwnProperty, ap = Array.prototype, isBrowser = !(void 0 === window || 'undefined' == typeof navigator || !window.document), isWebWorker = !isBrowser && 'undefined' != typeof importScripts, readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ? /^complete$/ : /^(complete|loaded)$/, defContextName = '_', isOpera = 'undefined' != typeof opera && opera.toString() === '[object Opera]', contexts = {}, cfg = {}, globalDefQueue = [], useInteractive = !1;
                    function isFunction(e) {
                        return '[object Function]' === ostring.call(e);
                    }
                    function isArray(e) {
                        return '[object Array]' === ostring.call(e);
                    }
                    function each(e, t) {
                        var n;
                        if (e)
                            for (n = 0; n < e.length && (!e[n] || !t(e[n], n, e)); n += 1);
                    }
                    function eachReverse(e, t) {
                        var n;
                        if (e)
                            for (n = e.length - 1; -1 < n && (!e[n] || !t(e[n], n, e)); n -= 1);
                    }
                    function hasProp(e, t) {
                        return hasOwn.call(e, t);
                    }
                    function getOwn(e, t) {
                        return hasProp(e, t) && e[t];
                    }
                    function eachProp(e, t) {
                        var n;
                        for (n in e)
                            if (hasProp(e, n) && t(e[n], n))
                                break;
                    }
                    function mixin(n, e, i, r) {
                        return e && eachProp(e, function (e, t) {
                            !i && hasProp(n, t) || (!r || 'object' != typeof e || !e || isArray(e) || isFunction(e) || e instanceof RegExp ? n[t] = e : (n[t] || (n[t] = {}), mixin(n[t], e, i, r)));
                        }), n;
                    }
                    function bind(e, t) {
                        return function () {
                            return t.apply(e, arguments);
                        };
                    }
                    function scripts() {
                        return document.getElementsByTagName('script');
                    }
                    function defaultOnError(e) {
                        throw e;
                    }
                    function getGlobal(e) {
                        if (!e)
                            return e;
                        var t = global;
                        return each(e.split('.'), function (e) {
                            t = t[e];
                        }), t;
                    }
                    function makeError(e, t, n, i) {
                        var r = new Error(t + '\nhttp://requirejs.org/docs/errors.html#' + e);
                        return r.requireType = e, r.requireModules = i, n && (r.originalError = n), r;
                    }
                    if (void 0 === define) {
                        if (void 0 !== requirejs) {
                            if (isFunction(requirejs))
                                return;
                            cfg = requirejs, requirejs = void 0;
                        }
                        void 0 === require || isFunction(require) || (cfg = require, require = void 0), req = requirejs = function (e, t, n, i) {
                            var r, o, s = defContextName;
                            return isArray(e) || 'string' == typeof e || (o = e, isArray(t) ? (e = t, t = n, n = i) : e = []), o && o.context && (s = o.context), (r = getOwn(contexts, s)) || (r = contexts[s] = req.s.newContext(s)), o && r.configure(o), r.require(e, t, n);
                        }, req.config = function (e) {
                            return req(e);
                        }, req.nextTick = 'undefined' != typeof setTimeout ? function (e) {
                            setTimeout(e, 4);
                        } : function (e) {
                            e();
                        }, require || (require = req), req.version = version, req.jsExtRegExp = /^\/|:|\?|\.js$/, req.isBrowser = isBrowser, s = req.s = {
                            contexts: contexts,
                            newContext: newContext
                        }, req({}), each([
                            'toUrl',
                            'undef',
                            'defined',
                            'specified'
                        ], function (t) {
                            req[t] = function () {
                                var e = contexts[defContextName];
                                return e.require[t].apply(e, arguments);
                            };
                        }), isBrowser && (head = s.head = document.getElementsByTagName('head')[0], baseElement = document.getElementsByTagName('base')[0], baseElement && (head = s.head = baseElement.parentNode)), req.onError = defaultOnError, req.createNode = function (e, t, n) {
                            var i = e.xhtml ? document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') : document.createElement('script');
                            return i.type = e.scriptType || 'text/javascript', i.charset = 'utf-8', i.async = !0, i;
                        }, req.load = function (t, n, i) {
                            var e, r = t && t.config || {};
                            if (isBrowser)
                                return e = req.createNode(r, n, i), r.onNodeCreated && r.onNodeCreated(e, r, n, i), e.setAttribute('data-requirecontext', t.contextName), e.setAttribute('data-requiremodule', n), !e.attachEvent || e.attachEvent.toString && e.attachEvent.toString().indexOf('[native code') < 0 || isOpera ? (e.addEventListener('load', t.onScriptLoad, !1), e.addEventListener('error', t.onScriptError, !1)) : (useInteractive = !0, e.attachEvent('onreadystatechange', t.onScriptLoad)), e.src = i, currentlyAddingScript = e, baseElement ? head.insertBefore(e, baseElement) : head.appendChild(e), currentlyAddingScript = null, e;
                            if (isWebWorker)
                                try {
                                    importScripts(i), t.completeLoad(n);
                                } catch (e) {
                                    t.onError(makeError('importscripts', 'importScripts failed for ' + n + ' at ' + i, e, [n]));
                                }
                        }, isBrowser && !cfg.skipDataMain && eachReverse(scripts(), function (e) {
                            if (head || (head = e.parentNode), dataMain = e.getAttribute('data-main'))
                                return mainScript = dataMain, cfg.baseUrl || (mainScript = (src = mainScript.split('/')).pop(), subPath = src.length ? src.join('/') + '/' : './', cfg.baseUrl = subPath), mainScript = mainScript.replace(jsSuffixRegExp, ''), req.jsExtRegExp.test(mainScript) && (mainScript = dataMain), cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript], !0;
                        }), define = function (e, n, t) {
                            var i, r;
                            'string' != typeof e && (t = n, n = e, e = null), isArray(n) || (t = n, n = null), !n && isFunction(t) && (n = [], t.length && (t.toString().replace(commentRegExp, '').replace(cjsRequireRegExp, function (e, t) {
                                n.push(t);
                            }), n = (1 === t.length ? ['require'] : [
                                'require',
                                'exports',
                                'module'
                            ]).concat(n))), useInteractive && (i = currentlyAddingScript || getInteractiveScript()) && (e || (e = i.getAttribute('data-requiremodule')), r = contexts[i.getAttribute('data-requirecontext')]), r ? (r.defQueue.push([
                                e,
                                n,
                                t
                            ]), r.defQueueMap[e] = !0) : globalDefQueue.push([
                                e,
                                n,
                                t
                            ]);
                        }, define.amd = { jQuery: !0 }, req.exec = function (text) {
                            return eval(text);
                        }, req(cfg);
                    }
                    function newContext(l) {
                        var n, e, h, u, c, p = {
                                waitSeconds: 7,
                                baseUrl: './',
                                paths: {},
                                bundles: {},
                                pkgs: {},
                                shim: {},
                                config: {}
                            }, d = {}, f = {}, i = {}, g = [], v = {}, r = {}, m = {}, y = 1, w = 1;
                        function C(e, t, n) {
                            var i, r, o, s, a, l, u, c, d, f, S = t && t.split('/'), h = p.map, g = h && h['*'];
                            if (e && (l = (e = e.split('/')).length - 1, p.nodeIdCompat && jsSuffixRegExp.test(e[l]) && (e[l] = e[l].replace(jsSuffixRegExp, '')), '.' === e[0].charAt(0) && S && (e = S.slice(0, S.length - 1).concat(e)), function (e) {
                                    var t, n;
                                    for (t = 0; t < e.length; t++)
                                        if ('.' === (n = e[t]))
                                            e.splice(t, 1), t -= 1;
                                        else if ('..' === n) {
                                            if (0 === t || 1 === t && '..' === e[2] || '..' === e[t - 1])
                                                continue;
                                            0 < t && (e.splice(t - 1, 2), t -= 2);
                                        }
                                }(e), e = e.join('/')), n && h && (S || g)) {
                                e:
                                    for (o = (r = e.split('/')).length; 0 < o; o -= 1) {
                                        if (a = r.slice(0, o).join('/'), S)
                                            for (s = S.length; 0 < s; s -= 1)
                                                if ((i = getOwn(h, S.slice(0, s).join('/'))) && (i = getOwn(i, a))) {
                                                    u = i, c = o;
                                                    break e;
                                                }
                                        !d && g && getOwn(g, a) && (d = getOwn(g, a), f = o);
                                    }
                                !u && d && (u = d, c = f), u && (r.splice(0, c, u), e = r.join('/'));
                            }
                            return getOwn(p.pkgs, e) || e;
                        }
                        function b(t) {
                            isBrowser && each(scripts(), function (e) {
                                if (e.getAttribute('data-requiremodule') === t && e.getAttribute('data-requirecontext') === h.contextName)
                                    return e.parentNode.removeChild(e), !0;
                            });
                        }
                        function x(e) {
                            var t = getOwn(p.paths, e);
                            if (t && isArray(t) && 1 < t.length)
                                return t.shift(), h.require.undef(e), h.makeRequire(null, { skipMap: !0 })([e]), !0;
                        }
                        function E(e) {
                            var t, n = e ? e.indexOf('!') : -1;
                            return -1 < n && (t = e.substring(0, n), e = e.substring(n + 1, e.length)), [
                                t,
                                e
                            ];
                        }
                        function F(e, t, n, i) {
                            var r, o, s, a, l = null, u = t ? t.name : null, c = e, d = !0, f = '';
                            return e || (d = !1, e = '_@r' + (y += 1)), l = (a = E(e))[0], e = a[1], l && (l = C(l, u, i), o = getOwn(v, l)), e && (l ? f = o && o.normalize ? o.normalize(e, function (e) {
                                return C(e, u, i);
                            }) : -1 === e.indexOf('!') ? C(e, u, i) : e : (l = (a = E(f = C(e, u, i)))[0], f = a[1], n = !0, r = h.nameToUrl(f))), {
                                prefix: l,
                                name: f,
                                parentMap: t,
                                unnormalized: !!(s = !l || o || n ? '' : '_unnormalized' + (w += 1)),
                                url: r,
                                originalName: c,
                                isDefine: d,
                                id: (l ? l + '!' + f : f) + s
                            };
                        }
                        function _(e) {
                            var t = e.id, n = getOwn(d, t);
                            return n || (n = d[t] = new h.Module(e)), n;
                        }
                        function M(e, t, n) {
                            var i = e.id, r = getOwn(d, i);
                            !hasProp(v, i) || r && !r.defineEmitComplete ? (r = _(e)).error && t === 'error' ? n(r.error) : r.on(t, n) : 'defined' === t && n(v[i]);
                        }
                        function T(n, e) {
                            var t = n.requireModules, i = !1;
                            e ? e(n) : (each(t, function (e) {
                                var t = getOwn(d, e);
                                t && (t.error = n, t.events.error && (i = !0, t.emit('error', n)));
                            }), i || req.onError(n));
                        }
                        function I() {
                            globalDefQueue.length && (each(globalDefQueue, function (e) {
                                var t = e[0];
                                'string' == typeof t && (h.defQueueMap[t] = !0), g.push(e);
                            }), globalDefQueue = []);
                        }
                        function O(e) {
                            delete d[e], delete f[e];
                        }
                        function P() {
                            var e, i, t = 1000 * p.waitSeconds, r = t && h.startTime + t < new Date().getTime(), o = [], s = [], a = !1, l = !0;
                            if (!n) {
                                if (n = !0, eachProp(f, function (e) {
                                        var t = e.map, n = t.id;
                                        if (e.enabled && (t.isDefine || s.push(e), !e.error))
                                            if (!e.inited && r)
                                                x(n) ? a = i = !0 : (o.push(n), b(n));
                                            else if (!e.inited && e.fetched && t.isDefine && (a = !0, !t.prefix))
                                                return l = !1;
                                    }), r && o.length)
                                    return (e = makeError('timeout', 'Load timeout for modules: ' + o, null, o)).contextName = h.contextName, T(e);
                                l && each(s, function (e) {
                                    !function r(o, s, a) {
                                        var e = o.map.id;
                                        o.error ? o.emit('error', o.error) : (s[e] = !0, each(o.depMaps, function (e, t) {
                                            var n = e.id, i = getOwn(d, n);
                                            !i || o.depMatched[t] || a[n] || (getOwn(s, n) ? (o.defineDep(t, v[n]), o.check()) : r(i, s, a));
                                        }), a[e] = !0);
                                    }(e, {}, {});
                                }), r && !i || !a || !isBrowser && !isWebWorker || c || (c = setTimeout(function () {
                                    c = 0, P();
                                }, 50)), n = !1;
                            }
                        }
                        function s(e) {
                            hasProp(v, e[0]) || _(F(e[0], null, !0)).init(e[1], e[2]);
                        }
                        function o(e, t, n, i) {
                            e.detachEvent && !isOpera ? i && e.detachEvent(i, t) : e.removeEventListener(n, t, !1);
                        }
                        function a(e) {
                            var t = e.currentTarget || e.srcElement;
                            return o(t, h.onScriptLoad, 'load', 'onreadystatechange'), o(t, h.onScriptError, 'error'), {
                                node: t,
                                id: t && t.getAttribute('data-requiremodule')
                            };
                        }
                        function R() {
                            var e;
                            for (I(); g.length;) {
                                if (null === (e = g.shift())[0])
                                    return T(makeError('mismatch', 'Mismatched anonymous define() module: ' + e[e.length - 1]));
                                s(e);
                            }
                            h.defQueueMap = {};
                        }
                        return u = {
                            require: function (e) {
                                return e.require ? e.require : e.require = h.makeRequire(e.map);
                            },
                            exports: function (e) {
                                if (e.usingExports = !0, e.map.isDefine)
                                    return e.exports ? v[e.map.id] = e.exports : e.exports = v[e.map.id] = {};
                            },
                            module: function (e) {
                                return e.module ? e.module : e.module = {
                                    id: e.map.id,
                                    uri: e.map.url,
                                    config: function () {
                                        return getOwn(p.config, e.map.id) || {};
                                    },
                                    exports: e.exports || (e.exports = {})
                                };
                            }
                        }, (e = function (e) {
                            this.events = getOwn(i, e.id) || {}, this.map = e, this.shim = getOwn(p.shim, e.id), this.depExports = [], this.depMaps = [], this.depMatched = [], this.pluginMaps = {}, this.depCount = 0;
                        }).prototype = {
                            init: function (e, t, n, i) {
                                i = i || {}, this.inited || (this.factory = t, n ? this.on('error', n) : this.events.error && (n = bind(this, function (e) {
                                    this.emit('error', e);
                                })), this.depMaps = e && e.slice(0), this.errback = n, this.inited = !0, this.ignore = i.ignore, i.enabled || this.enabled ? this.enable() : this.check());
                            },
                            defineDep: function (e, t) {
                                this.depMatched[e] || (this.depMatched[e] = !0, this.depCount -= 1, this.depExports[e] = t);
                            },
                            fetch: function () {
                                if (!this.fetched) {
                                    this.fetched = !0, h.startTime = new Date().getTime();
                                    var e = this.map;
                                    if (!this.shim)
                                        return e.prefix ? this.callPlugin() : this.load();
                                    h.makeRequire(this.map, { enableBuildCallback: !0 })(this.shim.deps || [], bind(this, function () {
                                        return e.prefix ? this.callPlugin() : this.load();
                                    }));
                                }
                            },
                            load: function () {
                                var e = this.map.url;
                                r[e] || (r[e] = !0, h.load(this.map.id, e));
                            },
                            check: function () {
                                if (this.enabled && !this.enabling) {
                                    var t, e, n = this.map.id, i = this.depExports, r = this.exports, o = this.factory;
                                    if (this.inited) {
                                        if (this.error)
                                            this.emit('error', this.error);
                                        else if (!this.defining) {
                                            if (this.defining = !0, this.depCount < 1 && !this.defined) {
                                                if (isFunction(o)) {
                                                    try {
                                                        r = h.execCb(n, o, i, r);
                                                    } catch (e) {
                                                        t = e;
                                                    }
                                                    if (this.map.isDefine && void 0 === r && ((e = this.module) ? r = e.exports : this.usingExports && (r = this.exports)), t) {
                                                        if (this.events.error && this.map.isDefine || req.onError !== defaultOnError)
                                                            return t.requireMap = this.map, t.requireModules = this.map.isDefine ? [this.map.id] : null, t.requireType = this.map.isDefine ? 'define' : 'require', T(this.error = t);
                                                        'undefined' != typeof console && console.error ? console.error(t) : req.onError(t);
                                                    }
                                                } else
                                                    r = o;
                                                if (this.exports = r, this.map.isDefine && !this.ignore && (v[n] = r, req.onResourceLoad)) {
                                                    var s = [];
                                                    each(this.depMaps, function (e) {
                                                        s.push(e.normalizedMap || e);
                                                    }), req.onResourceLoad(h, this.map, s);
                                                }
                                                O(n), this.defined = !0;
                                            }
                                            this.defining = !1, this.defined && !this.defineEmitted && (this.defineEmitted = !0, this.emit('defined', this.exports), this.defineEmitComplete = !0);
                                        }
                                    } else
                                        hasProp(h.defQueueMap, n) || this.fetch();
                                }
                            },
                            callPlugin: function () {
                                var l = this.map, u = l.id, e = F(l.prefix);
                                this.depMaps.push(e), M(e, 'defined', bind(this, function (e) {
                                    var o, t, n, i = getOwn(m, this.map.id), r = this.map.name, s = this.map.parentMap ? this.map.parentMap.name : null, a = h.makeRequire(l.parentMap, { enableBuildCallback: !0 });
                                    return this.map.unnormalized ? (e.normalize && (r = e.normalize(r, function (e) {
                                        return C(e, s, !0);
                                    }) || ''), M(t = F(l.prefix + '!' + r, this.map.parentMap), 'defined', bind(this, function (e) {
                                        this.map.normalizedMap = t, this.init([], function () {
                                            return e;
                                        }, null, {
                                            enabled: !0,
                                            ignore: !0
                                        });
                                    })), void ((n = getOwn(d, t.id)) && (this.depMaps.push(t), this.events.error && n.on('error', bind(this, function (e) {
                                        this.emit('error', e);
                                    })), n.enable()))) : i ? (this.map.url = h.nameToUrl(i), void this.load()) : ((o = bind(this, function (e) {
                                        this.init([], function () {
                                            return e;
                                        }, null, { enabled: !0 });
                                    })).error = bind(this, function (e) {
                                        this.inited = !0, (this.error = e).requireModules = [u], eachProp(d, function (e) {
                                            0 === e.map.id.indexOf(u + '_unnormalized') && O(e.map.id);
                                        }), T(e);
                                    }), o.fromText = bind(this, function (e, t) {
                                        var n = l.name, i = F(n), r = useInteractive;
                                        t && (e = t), r && (useInteractive = !1), _(i), hasProp(p.config, u) && (p.config[n] = p.config[u]);
                                        try {
                                            req.exec(e);
                                        } catch (e) {
                                            return T(makeError('fromtexteval', 'fromText eval for ' + u + ' failed: ' + e, e, [u]));
                                        }
                                        r && (useInteractive = !0), this.depMaps.push(i), h.completeLoad(n), a([n], o);
                                    }), void e.load(l.name, a, o, p));
                                })), h.enable(e, this), this.pluginMaps[e.id] = e;
                            },
                            enable: function () {
                                (f[this.map.id] = this).enabled = !0, this.enabling = !0, each(this.depMaps, bind(this, function (e, t) {
                                    var n, i, r;
                                    if ('string' == typeof e) {
                                        if (e = F(e, this.map.isDefine ? this.map : this.map.parentMap, !1, !this.skipMap), this.depMaps[t] = e, r = getOwn(u, e.id))
                                            return void (this.depExports[t] = r(this));
                                        this.depCount += 1, M(e, 'defined', bind(this, function (e) {
                                            this.undefed || (this.defineDep(t, e), this.check());
                                        })), this.errback ? M(e, 'error', bind(this, this.errback)) : this.events.error && M(e, 'error', bind(this, function (e) {
                                            this.emit('error', e);
                                        }));
                                    }
                                    n = e.id, i = d[n], hasProp(u, n) || !i || i.enabled || h.enable(e, this);
                                })), eachProp(this.pluginMaps, bind(this, function (e) {
                                    var t = getOwn(d, e.id);
                                    t && !t.enabled && h.enable(e, this);
                                })), this.enabling = !1, this.check();
                            },
                            on: function (e, t) {
                                var n = this.events[e];
                                n || (n = this.events[e] = []), n.push(t);
                            },
                            emit: function (e, t) {
                                each(this.events[e], function (e) {
                                    e(t);
                                }), e === 'error' && delete this.events[e];
                            }
                        }, (h = {
                            config: p,
                            contextName: l,
                            registry: d,
                            defined: v,
                            urlFetched: r,
                            defQueue: g,
                            defQueueMap: {},
                            Module: e,
                            makeModuleMap: F,
                            nextTick: req.nextTick,
                            onError: T,
                            configure: function (e) {
                                e.baseUrl && '/' !== e.baseUrl.charAt(e.baseUrl.length - 1) && (e.baseUrl += '/');
                                var n = p.shim, i = {
                                        paths: !0,
                                        bundles: !0,
                                        config: !0,
                                        map: !0
                                    };
                                eachProp(e, function (e, t) {
                                    i[t] ? (p[t] || (p[t] = {}), mixin(p[t], e, !0, !0)) : p[t] = e;
                                }), e.bundles && eachProp(e.bundles, function (e, t) {
                                    each(e, function (e) {
                                        e !== t && (m[e] = t);
                                    });
                                }), e.shim && (eachProp(e.shim, function (e, t) {
                                    isArray(e) && (e = { deps: e }), !e.exports && !e.init || e.exportsFn || (e.exportsFn = h.makeShimExports(e)), n[t] = e;
                                }), p.shim = n), e.packages && each(e.packages, function (e) {
                                    var t;
                                    t = (e = 'string' == typeof e ? { name: e } : e).name, e.location && (p.paths[t] = e.location), p.pkgs[t] = e.name + '/' + (e.main || 'main').replace(currDirRegExp, '').replace(jsSuffixRegExp, '');
                                }), eachProp(d, function (e, t) {
                                    e.inited || e.map.unnormalized || (e.map = F(t, null, !0));
                                }), (e.deps || e.callback) && h.require(e.deps || [], e.callback);
                            },
                            makeShimExports: function (t) {
                                return function () {
                                    var e;
                                    return t.init && (e = t.init.apply(global, arguments)), e || t.exports && getGlobal(t.exports);
                                };
                            },
                            makeRequire: function (o, s) {
                                function a(e, t, n) {
                                    var i, r;
                                    return s.enableBuildCallback && t && isFunction(t) && (t.__requireJsBuild = !0), 'string' == typeof e ? isFunction(t) ? T(makeError('requireargs', 'Invalid require call'), n) : o && hasProp(u, e) ? u[e](d[o.id]) : req.get ? req.get(h, e, o, a) : (i = F(e, o, !1, !0).id, hasProp(v, i) ? v[i] : T(makeError('notloaded', 'Module name "' + i + '" has not been loaded yet for context: ' + l + (o ? '' : '. Use require([])')))) : (R(), h.nextTick(function () {
                                        R(), (r = _(F(null, o))).skipMap = s.skipMap, r.init(e, t, n, { enabled: !0 }), P();
                                    }), a);
                                }
                                return s = s || {}, mixin(a, {
                                    isBrowser: isBrowser,
                                    toUrl: function (e) {
                                        var t, n = e.lastIndexOf('.'), i = e.split('/')[0];
                                        return -1 !== n && (!('.' === i || '..' === i) || 1 < n) && (t = e.substring(n, e.length), e = e.substring(0, n)), h.nameToUrl(C(e, o && o.id, !0), t, !0);
                                    },
                                    defined: function (e) {
                                        return hasProp(v, F(e, o, !1, !0).id);
                                    },
                                    specified: function (e) {
                                        return e = F(e, o, !1, !0).id, hasProp(v, e) || hasProp(d, e);
                                    }
                                }), o || (a.undef = function (n) {
                                    I();
                                    var e = F(n, o, !0), t = getOwn(d, n);
                                    t.undefed = !0, b(n), delete v[n], delete r[e.url], delete i[n], eachReverse(g, function (e, t) {
                                        e[0] === n && g.splice(t, 1);
                                    }), delete h.defQueueMap[n], t && (t.events.defined && (i[n] = t.events), O(n));
                                }), a;
                            },
                            enable: function (e) {
                                getOwn(d, e.id) && _(e).enable();
                            },
                            completeLoad: function (e) {
                                var t, n, i, r = getOwn(p.shim, e) || {}, o = r.exports;
                                for (I(); g.length;) {
                                    if (null === (n = g.shift())[0]) {
                                        if (n[0] = e, t)
                                            break;
                                        t = !0;
                                    } else
                                        n[0] === e && (t = !0);
                                    s(n);
                                }
                                if (h.defQueueMap = {}, i = getOwn(d, e), !t && !hasProp(v, e) && i && !i.inited) {
                                    if (!(!p.enforceDefine || o && getGlobal(o)))
                                        return x(e) ? void 0 : T(makeError('nodefine', 'No define call for ' + e, null, [e]));
                                    s([
                                        e,
                                        r.deps || [],
                                        r.exportsFn
                                    ]);
                                }
                                P();
                            },
                            nameToUrl: function (e, t, n) {
                                var i, r, o, s, a, l, u = getOwn(p.pkgs, e);
                                if (u && (e = u), l = getOwn(m, e))
                                    return h.nameToUrl(l, t, n);
                                if (req.jsExtRegExp.test(e))
                                    s = e + (t || '');
                                else {
                                    for (i = p.paths, o = (r = e.split('/')).length; 0 < o; o -= 1)
                                        if (a = getOwn(i, r.slice(0, o).join('/'))) {
                                            isArray(a) && (a = a[0]), r.splice(0, o, a);
                                            break;
                                        }
                                    s = r.join('/'), s = ('/' === (s += t || (/^data\:|\?/.test(s) || n ? '' : '.js')).charAt(0) || s.match(/^[\w\+\.\-]+:/) ? '' : p.baseUrl) + s;
                                }
                                return p.urlArgs ? s + (-1 === s.indexOf('?') ? '?' : '&') + p.urlArgs : s;
                            },
                            load: function (e, t) {
                                req.load(h, e, t);
                            },
                            execCb: function (e, t, n, i) {
                                return t.apply(i, n);
                            },
                            onScriptLoad: function (e) {
                                if (e.type === 'load' || readyRegExp.test((e.currentTarget || e.srcElement).readyState)) {
                                    interactiveScript = null;
                                    var t = a(e);
                                    h.completeLoad(t.id);
                                }
                            },
                            onScriptError: function (e) {
                                var n = a(e);
                                if (!x(n.id)) {
                                    var i = [];
                                    return eachProp(d, function (e, t) {
                                        0 !== t.indexOf('_@r') && each(e.depMaps, function (e) {
                                            return e.id === n.id && i.push(t), !0;
                                        });
                                    }), T(makeError('scripterror', 'Script error for "' + n.id + (i.length ? '", needed by: ' + i.join(', ') : '"'), e, [n.id]));
                                }
                            }
                        }).require = h.makeRequire(), h;
                    }
                    function getInteractiveScript() {
                        return interactiveScript && interactiveScript.readyState === 'interactive' || eachReverse(scripts(), function (e) {
                            if (e.readyState === 'interactive')
                                return interactiveScript = e;
                        }), interactiveScript;
                    }
                }(this), CKFinder.requirejs = requirejs, CKFinder.require = require, CKFinder.define = define);
            }(), CKFinder.define('requireLib', function () {
            }), yh = this, zh = function () {
                var e = '1.13.1', t = 'object' == typeof self && self.self === self && self || 'object' == typeof global && global.global === global && global || Function('return this')() || {}, i = Array.prototype, s = Object.prototype, h = 'undefined' != typeof Symbol ? Symbol.prototype : null, r = i.push, l = i.slice, g = s.toString, n = s.hasOwnProperty, o = 'undefined' != typeof ArrayBuffer, a = 'undefined' != typeof DataView, u = Array.isArray, c = Object.keys, d = Object.create, f = o && ArrayBuffer.isView, p = isNaN, v = isFinite, m = !{ toString: null }.propertyIsEnumerable('toString'), y = [
                        'valueOf',
                        'isPrototypeOf',
                        'toString',
                        'propertyIsEnumerable',
                        'hasOwnProperty',
                        'toLocaleString'
                    ], w = Math.pow(2, 53) - 1;
                function C(r, o) {
                    return o = null == o ? r.length - 1 : +o, function () {
                        for (var e = Math.max(arguments.length - o, 0), t = Array(e), n = 0; n < e; n++)
                            t[n] = arguments[n + o];
                        switch (o) {
                        case 0:
                            return r.call(this, t);
                        case 1:
                            return r.call(this, arguments[0], t);
                        case 2:
                            return r.call(this, arguments[0], arguments[1], t);
                        }
                        var i = Array(o + 1);
                        for (n = 0; n < o; n++)
                            i[n] = arguments[n];
                        return i[o] = t, r.apply(this, i);
                    };
                }
                function b(e) {
                    var t = typeof e;
                    return 'function' == t || 'object' == t && !!e;
                }
                function x(e) {
                    return void 0 === e;
                }
                function E(e) {
                    return !0 === e || !1 === e || g.call(e) === '[object Boolean]';
                }
                function F(e) {
                    var t = '[object ' + e + ']';
                    return function (e) {
                        return g.call(e) === t;
                    };
                }
                var _ = F('String'), M = F('Number'), T = F('Date'), I = F('RegExp'), O = F('Error'), P = F('Symbol'), R = F('ArrayBuffer'), B = F('Function'), D = t.document && t.document.childNodes;
                'function' != typeof /./ && 'object' != typeof Int8Array && 'function' != typeof D && (B = function (e) {
                    return 'function' == typeof e || !1;
                });
                var A = B, V = F('Object'), K = a && V(new DataView(new ArrayBuffer(8))), N = 'undefined' != typeof Map && V(new Map()), H = F('DataView');
                var q = K ? function (e) {
                        return null != e && A(e.getInt8) && R(e.buffer);
                    } : H, L = u || F('Array');
                function U(e, t) {
                    return null != e && n.call(e, t);
                }
                var W = F('Arguments');
                !function () {
                    W(arguments) || (W = function (e) {
                        return U(e, 'callee');
                    });
                }();
                var $ = W;
                function z(e) {
                    return M(e) && p(e);
                }
                function J(e) {
                    return function () {
                        return e;
                    };
                }
                function k(n) {
                    return function (e) {
                        var t = n(e);
                        return 'number' == typeof t && 0 <= t && t <= w;
                    };
                }
                function Z(t) {
                    return function (e) {
                        return null == e ? void 0 : e[t];
                    };
                }
                var Q = Z('byteLength'), Y = k(Q), X = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
                var G = o ? function (e) {
                        return f ? f(e) && !q(e) : Y(e) && X.test(g.call(e));
                    } : J(!1), j = Z('length');
                function ee(e, t) {
                    t = function (t) {
                        for (var n = {}, e = t.length, i = 0; i < e; ++i)
                            n[t[i]] = !0;
                        return {
                            contains: function (e) {
                                return n[e];
                            },
                            push: function (e) {
                                return n[e] = !0, t.push(e);
                            }
                        };
                    }(t);
                    var n = y.length, i = e.constructor, r = A(i) && i.prototype || s, o = 'constructor';
                    for (U(e, o) && !t.contains(o) && t.push(o); n--;)
                        (o = y[n]) in e && e[o] !== r[o] && !t.contains(o) && t.push(o);
                }
                function te(e) {
                    if (!b(e))
                        return [];
                    if (c)
                        return c(e);
                    var t = [];
                    for (var n in e)
                        U(e, n) && t.push(n);
                    return m && ee(e, t), t;
                }
                function ne(e, t) {
                    var n = te(t), i = n.length;
                    if (null == e)
                        return !i;
                    for (var r = Object(e), o = 0; o < i; o++) {
                        var s = n[o];
                        if (t[s] !== r[s] || !(s in r))
                            return !1;
                    }
                    return !0;
                }
                function ie(e) {
                    return e instanceof ie ? e : this instanceof ie ? void (this._wrapped = e) : new ie(e);
                }
                function re(e) {
                    return new Uint8Array(e.buffer || e, e.byteOffset || 0, Q(e));
                }
                ie.VERSION = e, ie.prototype.valueOf = ie.prototype.toJSON = ie.prototype.value = function () {
                    return this._wrapped;
                }, ie.prototype.toString = function () {
                    return String(this._wrapped);
                };
                var oe = '[object DataView]';
                function se(e, t, n, i) {
                    if (e === t)
                        return 0 !== e || 1 / e == 1 / t;
                    if (null == e || null == t)
                        return !1;
                    if (e != e)
                        return t != t;
                    var r = typeof e;
                    return ('function' == r || 'object' == r || 'object' == typeof t) && function e(t, n, i, r) {
                        t instanceof ie && (t = t._wrapped);
                        n instanceof ie && (n = n._wrapped);
                        var o = g.call(t);
                        if (o !== g.call(n))
                            return !1;
                        if (K && o == '[object Object]' && q(t)) {
                            if (!q(n))
                                return !1;
                            o = oe;
                        }
                        switch (o) {
                        case '[object RegExp]':
                        case '[object String]':
                            return '' + t == '' + n;
                        case '[object Number]':
                            return +t != +t ? +n != +n : 0 == +t ? 1 / +t == 1 / n : +t == +n;
                        case '[object Date]':
                        case '[object Boolean]':
                            return +t == +n;
                        case '[object Symbol]':
                            return h.valueOf.call(t) === h.valueOf.call(n);
                        case '[object ArrayBuffer]':
                        case oe:
                            return e(re(t), re(n), i, r);
                        }
                        var s = '[object Array]' === o;
                        if (!s && G(t)) {
                            var a = Q(t);
                            if (a !== Q(n))
                                return !1;
                            if (t.buffer === n.buffer && t.byteOffset === n.byteOffset)
                                return !0;
                            s = !0;
                        }
                        if (!s) {
                            if ('object' != typeof t || 'object' != typeof n)
                                return !1;
                            var l = t.constructor, u = n.constructor;
                            if (l !== u && !(A(l) && l instanceof l && A(u) && u instanceof u) && 'constructor' in t && 'constructor' in n)
                                return !1;
                        }
                        i = i || [];
                        r = r || [];
                        var c = i.length;
                        for (; c--;)
                            if (i[c] === t)
                                return r[c] === n;
                        i.push(t);
                        r.push(n);
                        if (s) {
                            if ((c = t.length) !== n.length)
                                return !1;
                            for (; c--;)
                                if (!se(t[c], n[c], i, r))
                                    return !1;
                        } else {
                            var d, f = te(t);
                            if (c = f.length, te(n).length !== c)
                                return !1;
                            for (; c--;)
                                if (d = f[c], !U(n, d) || !se(t[d], n[d], i, r))
                                    return !1;
                        }
                        i.pop();
                        r.pop();
                        return !0;
                    }(e, t, n, i);
                }
                function ae(e) {
                    if (!b(e))
                        return [];
                    var t = [];
                    for (var n in e)
                        t.push(n);
                    return m && ee(e, t), t;
                }
                function le(i) {
                    var r = j(i);
                    return function (e) {
                        if (null == e)
                            return !1;
                        var t = ae(e);
                        if (j(t))
                            return !1;
                        for (var n = 0; n < r; n++)
                            if (!A(e[i[n]]))
                                return !1;
                        return i !== he || !A(e[ue]);
                    };
                }
                var ue = 'forEach', ce = 'has', de = [
                        'clear',
                        'delete'
                    ], fe = [
                        'get',
                        ce,
                        'set'
                    ], Se = de.concat(ue, fe), he = de.concat(fe), ge = ['add'].concat(de, ue, ce), pe = N ? le(Se) : F('Map'), ve = N ? le(he) : F('WeakMap'), me = N ? le(ge) : F('Set'), ye = F('WeakSet');
                function we(e) {
                    for (var t = te(e), n = t.length, i = Array(n), r = 0; r < n; r++)
                        i[r] = e[t[r]];
                    return i;
                }
                function Ce(e) {
                    for (var t = {}, n = te(e), i = 0, r = n.length; i < r; i++)
                        t[e[n[i]]] = n[i];
                    return t;
                }
                function be(e) {
                    var t = [];
                    for (var n in e)
                        A(e[n]) && t.push(n);
                    return t.sort();
                }
                function xe(l, u) {
                    return function (e) {
                        var t = arguments.length;
                        if (u && (e = Object(e)), t < 2 || null == e)
                            return e;
                        for (var n = 1; n < t; n++)
                            for (var i = arguments[n], r = l(i), o = r.length, s = 0; s < o; s++) {
                                var a = r[s];
                                u && void 0 !== e[a] || (e[a] = i[a]);
                            }
                        return e;
                    };
                }
                var Ee = xe(ae), Fe = xe(te), _e = xe(ae, !0);
                function Me(e) {
                    if (!b(e))
                        return {};
                    if (d)
                        return d(e);
                    var t = function () {
                    };
                    t.prototype = e;
                    var n = new t();
                    return t.prototype = null, n;
                }
                function Te(e) {
                    return b(e) ? L(e) ? e.slice() : Ee({}, e) : e;
                }
                function Ie(e) {
                    return L(e) ? e : [e];
                }
                function Oe(e) {
                    return ie.toPath(e);
                }
                function Pe(e, t) {
                    for (var n = t.length, i = 0; i < n; i++) {
                        if (null == e)
                            return;
                        e = e[t[i]];
                    }
                    return n ? e : void 0;
                }
                function Re(e, t, n) {
                    var i = Pe(e, Oe(t));
                    return x(i) ? n : i;
                }
                function Be(e) {
                    return e;
                }
                function De(t) {
                    return t = Fe({}, t), function (e) {
                        return ne(e, t);
                    };
                }
                function Ae(t) {
                    return t = Oe(t), function (e) {
                        return Pe(e, t);
                    };
                }
                function Ve(r, o, e) {
                    if (void 0 === o)
                        return r;
                    switch (null == e ? 3 : e) {
                    case 1:
                        return function (e) {
                            return r.call(o, e);
                        };
                    case 3:
                        return function (e, t, n) {
                            return r.call(o, e, t, n);
                        };
                    case 4:
                        return function (e, t, n, i) {
                            return r.call(o, e, t, n, i);
                        };
                    }
                    return function () {
                        return r.apply(o, arguments);
                    };
                }
                function Ke(e, t, n) {
                    return null == e ? Be : A(e) ? Ve(e, t, n) : b(e) && !L(e) ? De(e) : Ae(e);
                }
                function Ne(e, t) {
                    return Ke(e, t, 1 / 0);
                }
                function He(e, t, n) {
                    return ie.iteratee !== Ne ? ie.iteratee(e, t) : Ke(e, t, n);
                }
                function qe() {
                }
                function Le(e, t) {
                    return null == t && (t = e, e = 0), e + Math.floor(Math.random() * (t - e + 1));
                }
                ie.toPath = Ie, ie.iteratee = Ne;
                var Ue = Date.now || function () {
                    return new Date().getTime();
                };
                function We(t) {
                    var n = function (e) {
                            return t[e];
                        }, e = '(?:' + te(t).join('|') + ')', i = RegExp(e), r = RegExp(e, 'g');
                    return function (e) {
                        return e = null == e ? '' : '' + e, i.test(e) ? e.replace(r, n) : e;
                    };
                }
                var $e = {
                        '&': '&amp;',
                        '<': '&lt;',
                        '>': '&gt;',
                        '"': '&quot;',
                        '\'': '&#x27;',
                        '`': '&#x60;'
                    }, ze = We($e), Je = We(Ce($e)), ke = ie.templateSettings = {
                        evaluate: /<%([\s\S]+?)%>/g,
                        interpolate: /<%=([\s\S]+?)%>/g,
                        escape: /<%-([\s\S]+?)%>/g
                    }, Ze = /(.)^/, Qe = {
                        '\'': '\'',
                        '\\': '\\',
                        '\r': 'r',
                        '\n': 'n',
                        '\u2028': 'u2028',
                        '\u2029': 'u2029'
                    }, Ye = /\\|'|\r|\n|\u2028|\u2029/g;
                function Xe(e) {
                    return '\\' + Qe[e];
                }
                var Ge = /^\s*(\w|\$)+\s*$/;
                var je = 0;
                function et(e, t, n, i, r) {
                    if (!(i instanceof t))
                        return e.apply(n, r);
                    var o = Me(e.prototype), s = e.apply(o, r);
                    return b(s) ? s : o;
                }
                var tt = C(function (r, o) {
                    var s = tt.placeholder, a = function () {
                            for (var e = 0, t = o.length, n = Array(t), i = 0; i < t; i++)
                                n[i] = o[i] === s ? arguments[e++] : o[i];
                            for (; e < arguments.length;)
                                n.push(arguments[e++]);
                            return et(r, a, this, this, n);
                        };
                    return a;
                });
                tt.placeholder = ie;
                var nt = C(function (t, n, i) {
                        if (!A(t))
                            throw new TypeError('Bind must be called on a function');
                        var r = C(function (e) {
                            return et(t, r, n, this, i.concat(e));
                        });
                        return r;
                    }), it = k(j);
                function rt(e, t, n, i) {
                    if (i = i || [], t || 0 === t) {
                        if (t <= 0)
                            return i.concat(e);
                    } else
                        t = 1 / 0;
                    for (var r = i.length, o = 0, s = j(e); o < s; o++) {
                        var a = e[o];
                        if (it(a) && (L(a) || $(a)))
                            if (1 < t)
                                rt(a, t - 1, n, i), r = i.length;
                            else
                                for (var l = 0, u = a.length; l < u;)
                                    i[r++] = a[l++];
                        else
                            n || (i[r++] = a);
                    }
                    return i;
                }
                var ot = C(function (e, t) {
                    var n = (t = rt(t, !1, !1)).length;
                    if (n < 1)
                        throw new Error('bindAll must be passed function names');
                    for (; n--;) {
                        var i = t[n];
                        e[i] = nt(e[i], e);
                    }
                    return e;
                });
                var st = C(function (e, t, n) {
                        return setTimeout(function () {
                            return e.apply(null, n);
                        }, t);
                    }), at = tt(st, ie, 1);
                function lt(e) {
                    return function () {
                        return !e.apply(this, arguments);
                    };
                }
                function ut(e, t) {
                    var n;
                    return function () {
                        return 0 < --e && (n = t.apply(this, arguments)), e <= 1 && (t = null), n;
                    };
                }
                var ct = tt(ut, 2);
                function dt(e, t, n) {
                    t = He(t, n);
                    for (var i, r = te(e), o = 0, s = r.length; o < s; o++)
                        if (t(e[i = r[o]], i, e))
                            return i;
                }
                function ft(o) {
                    return function (e, t, n) {
                        t = He(t, n);
                        for (var i = j(e), r = 0 < o ? 0 : i - 1; 0 <= r && r < i; r += o)
                            if (t(e[r], r, e))
                                return r;
                        return -1;
                    };
                }
                var St = ft(1), ht = ft(-1);
                function gt(e, t, n, i) {
                    for (var r = (n = He(n, i, 1))(t), o = 0, s = j(e); o < s;) {
                        var a = Math.floor((o + s) / 2);
                        n(e[a]) < r ? o = a + 1 : s = a;
                    }
                    return o;
                }
                function pt(o, s, a) {
                    return function (e, t, n) {
                        var i = 0, r = j(e);
                        if ('number' == typeof n)
                            0 < o ? i = 0 <= n ? n : Math.max(n + r, i) : r = 0 <= n ? Math.min(n + 1, r) : n + r + 1;
                        else if (a && n && r)
                            return e[n = a(e, t)] === t ? n : -1;
                        if (t != t)
                            return 0 <= (n = s(l.call(e, i, r), z)) ? n + i : -1;
                        for (n = 0 < o ? i : r - 1; 0 <= n && n < r; n += o)
                            if (e[n] === t)
                                return n;
                        return -1;
                    };
                }
                var vt = pt(1, St, gt), mt = pt(-1, ht);
                function yt(e, t, n) {
                    var i = (it(e) ? St : dt)(e, t, n);
                    if (void 0 !== i && -1 !== i)
                        return e[i];
                }
                function wt(e, t, n) {
                    var i, r;
                    if (t = Ve(t, n), it(e))
                        for (i = 0, r = e.length; i < r; i++)
                            t(e[i], i, e);
                    else {
                        var o = te(e);
                        for (i = 0, r = o.length; i < r; i++)
                            t(e[o[i]], o[i], e);
                    }
                    return e;
                }
                function Ct(e, t, n) {
                    t = He(t, n);
                    for (var i = !it(e) && te(e), r = (i || e).length, o = Array(r), s = 0; s < r; s++) {
                        var a = i ? i[s] : s;
                        o[s] = t(e[a], a, e);
                    }
                    return o;
                }
                function bt(l) {
                    return function (e, t, n, i) {
                        var r = 3 <= arguments.length;
                        return function (e, t, n, i) {
                            var r = !it(e) && te(e), o = (r || e).length, s = 0 < l ? 0 : o - 1;
                            for (i || (n = e[r ? r[s] : s], s += l); 0 <= s && s < o; s += l) {
                                var a = r ? r[s] : s;
                                n = t(n, e[a], a, e);
                            }
                            return n;
                        }(e, Ve(t, i, 4), n, r);
                    };
                }
                var xt = bt(1), Et = bt(-1);
                function Ft(e, i, t) {
                    var r = [];
                    return i = He(i, t), wt(e, function (e, t, n) {
                        i(e, t, n) && r.push(e);
                    }), r;
                }
                function _t(e, t, n) {
                    t = He(t, n);
                    for (var i = !it(e) && te(e), r = (i || e).length, o = 0; o < r; o++) {
                        var s = i ? i[o] : o;
                        if (!t(e[s], s, e))
                            return !1;
                    }
                    return !0;
                }
                function Mt(e, t, n) {
                    t = He(t, n);
                    for (var i = !it(e) && te(e), r = (i || e).length, o = 0; o < r; o++) {
                        var s = i ? i[o] : o;
                        if (t(e[s], s, e))
                            return !0;
                    }
                    return !1;
                }
                function Tt(e, t, n, i) {
                    return it(e) || (e = we(e)), ('number' != typeof n || i) && (n = 0), 0 <= vt(e, t, n);
                }
                var It = C(function (e, n, i) {
                    var r, o;
                    return A(n) ? o = n : (n = Oe(n), r = n.slice(0, -1), n = n[n.length - 1]), Ct(e, function (e) {
                        var t = o;
                        if (!t) {
                            if (r && r.length && (e = Pe(e, r)), null == e)
                                return;
                            t = e[n];
                        }
                        return null == t ? t : t.apply(e, i);
                    });
                });
                function Ot(e, t) {
                    return Ct(e, Ae(t));
                }
                function Pt(e, i, t) {
                    var n, r, o = -1 / 0, s = -1 / 0;
                    if (null == i || 'number' == typeof i && 'object' != typeof e[0] && null != e)
                        for (var a = 0, l = (e = it(e) ? e : we(e)).length; a < l; a++)
                            null != (n = e[a]) && o < n && (o = n);
                    else
                        i = He(i, t), wt(e, function (e, t, n) {
                            r = i(e, t, n), (s < r || r === -1 / 0 && o === -1 / 0) && (o = e, s = r);
                        });
                    return o;
                }
                function Rt(e, t, n) {
                    if (null == t || n)
                        return it(e) || (e = we(e)), e[Le(e.length - 1)];
                    var i = it(e) ? Te(e) : we(e), r = j(i);
                    t = Math.max(Math.min(t, r), 0);
                    for (var o = r - 1, s = 0; s < t; s++) {
                        var a = Le(s, o), l = i[s];
                        i[s] = i[a], i[a] = l;
                    }
                    return i.slice(0, t);
                }
                function Bt(s, t) {
                    return function (i, r, e) {
                        var o = t ? [
                            [],
                            []
                        ] : {};
                        return r = He(r, e), wt(i, function (e, t) {
                            var n = r(e, t, i);
                            s(o, e, n);
                        }), o;
                    };
                }
                var Dt = Bt(function (e, t, n) {
                        U(e, n) ? e[n].push(t) : e[n] = [t];
                    }), At = Bt(function (e, t, n) {
                        e[n] = t;
                    }), Vt = Bt(function (e, t, n) {
                        U(e, n) ? e[n]++ : e[n] = 1;
                    }), Kt = Bt(function (e, t, n) {
                        e[n ? 0 : 1].push(t);
                    }, !0), Nt = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
                function Ht(e, t, n) {
                    return t in n;
                }
                var qt = C(function (e, t) {
                        var n = {}, i = t[0];
                        if (null == e)
                            return n;
                        A(i) ? (1 < t.length && (i = Ve(i, t[1])), t = ae(e)) : (i = Ht, t = rt(t, !1, !1), e = Object(e));
                        for (var r = 0, o = t.length; r < o; r++) {
                            var s = t[r], a = e[s];
                            i(a, s, e) && (n[s] = a);
                        }
                        return n;
                    }), Lt = C(function (e, n) {
                        var t, i = n[0];
                        return A(i) ? (i = lt(i), 1 < n.length && (t = n[1])) : (n = Ct(rt(n, !1, !1), String), i = function (e, t) {
                            return !Tt(n, t);
                        }), qt(e, i, t);
                    });
                function Ut(e, t, n) {
                    return l.call(e, 0, Math.max(0, e.length - (null == t || n ? 1 : t)));
                }
                function Wt(e, t, n) {
                    return null == e || e.length < 1 ? null == t || n ? void 0 : [] : null == t || n ? e[0] : Ut(e, e.length - t);
                }
                function $t(e, t, n) {
                    return l.call(e, null == t || n ? 1 : t);
                }
                var zt = C(function (e, t) {
                        return t = rt(t, !0, !0), Ft(e, function (e) {
                            return !Tt(t, e);
                        });
                    }), Jt = C(function (e, t) {
                        return zt(e, t);
                    });
                function kt(e, t, n, i) {
                    E(t) || (i = n, n = t, t = !1), null != n && (n = He(n, i));
                    for (var r = [], o = [], s = 0, a = j(e); s < a; s++) {
                        var l = e[s], u = n ? n(l, s, e) : l;
                        t && !n ? (s && o === u || r.push(l), o = u) : n ? Tt(o, u) || (o.push(u), r.push(l)) : Tt(r, l) || r.push(l);
                    }
                    return r;
                }
                var Zt = C(function (e) {
                    return kt(rt(e, !0, !0));
                });
                function Qt(e) {
                    for (var t = e && Pt(e, j).length || 0, n = Array(t), i = 0; i < t; i++)
                        n[i] = Ot(e, i);
                    return n;
                }
                var Yt = C(Qt);
                function Xt(e, t) {
                    return e._chain ? ie(t).chain() : t;
                }
                function Gt(n) {
                    return wt(be(n), function (e) {
                        var t = ie[e] = n[e];
                        ie.prototype[e] = function () {
                            var e = [this._wrapped];
                            return r.apply(e, arguments), Xt(this, t.apply(ie, e));
                        };
                    }), ie;
                }
                wt([
                    'pop',
                    'push',
                    'reverse',
                    'shift',
                    'sort',
                    'splice',
                    'unshift'
                ], function (t) {
                    var n = i[t];
                    ie.prototype[t] = function () {
                        var e = this._wrapped;
                        return null != e && (n.apply(e, arguments), t !== 'shift' && t !== 'splice' || 0 !== e.length || delete e[0]), Xt(this, e);
                    };
                }), wt([
                    'concat',
                    'join',
                    'slice'
                ], function (e) {
                    var t = i[e];
                    ie.prototype[e] = function () {
                        var e = this._wrapped;
                        return null != e && (e = t.apply(e, arguments)), Xt(this, e);
                    };
                });
                var jt = Gt({
                    __proto__: null,
                    VERSION: e,
                    restArguments: C,
                    isObject: b,
                    isNull: function (e) {
                        return null === e;
                    },
                    isUndefined: x,
                    isBoolean: E,
                    isElement: function (e) {
                        return !(!e || 1 !== e.nodeType);
                    },
                    isString: _,
                    isNumber: M,
                    isDate: T,
                    isRegExp: I,
                    isError: O,
                    isSymbol: P,
                    isArrayBuffer: R,
                    isDataView: q,
                    isArray: L,
                    isFunction: A,
                    isArguments: $,
                    isFinite: function (e) {
                        return !P(e) && v(e) && !isNaN(parseFloat(e));
                    },
                    isNaN: z,
                    isTypedArray: G,
                    isEmpty: function (e) {
                        if (null == e)
                            return !0;
                        var t = j(e);
                        return 'number' == typeof t && (L(e) || _(e) || $(e)) ? 0 === t : 0 === j(te(e));
                    },
                    isMatch: ne,
                    isEqual: function (e, t) {
                        return se(e, t);
                    },
                    isMap: pe,
                    isWeakMap: ve,
                    isSet: me,
                    isWeakSet: ye,
                    keys: te,
                    allKeys: ae,
                    values: we,
                    pairs: function (e) {
                        for (var t = te(e), n = t.length, i = Array(n), r = 0; r < n; r++)
                            i[r] = [
                                t[r],
                                e[t[r]]
                            ];
                        return i;
                    },
                    invert: Ce,
                    functions: be,
                    methods: be,
                    extend: Ee,
                    extendOwn: Fe,
                    assign: Fe,
                    defaults: _e,
                    create: function (e, t) {
                        var n = Me(e);
                        return t && Fe(n, t), n;
                    },
                    clone: Te,
                    tap: function (e, t) {
                        return t(e), e;
                    },
                    get: Re,
                    has: function (e, t) {
                        for (var n = (t = Oe(t)).length, i = 0; i < n; i++) {
                            var r = t[i];
                            if (!U(e, r))
                                return !1;
                            e = e[r];
                        }
                        return !!n;
                    },
                    mapObject: function (e, t, n) {
                        t = He(t, n);
                        for (var i = te(e), r = i.length, o = {}, s = 0; s < r; s++) {
                            var a = i[s];
                            o[a] = t(e[a], a, e);
                        }
                        return o;
                    },
                    identity: Be,
                    constant: J,
                    noop: qe,
                    toPath: Ie,
                    property: Ae,
                    propertyOf: function (t) {
                        return null == t ? qe : function (e) {
                            return Re(t, e);
                        };
                    },
                    matcher: De,
                    matches: De,
                    times: function (e, t, n) {
                        var i = Array(Math.max(0, e));
                        t = Ve(t, n, 1);
                        for (var r = 0; r < e; r++)
                            i[r] = t(r);
                        return i;
                    },
                    random: Le,
                    now: Ue,
                    escape: ze,
                    unescape: Je,
                    templateSettings: ke,
                    template: function (o, e, t) {
                        !e && t && (e = t), e = _e({}, e, ie.templateSettings);
                        var n = RegExp([
                                (e.escape || Ze).source,
                                (e.interpolate || Ze).source,
                                (e.evaluate || Ze).source
                            ].join('|') + '|$', 'g'), s = 0, a = '__p+=\'';
                        o.replace(n, function (e, t, n, i, r) {
                            return a += o.slice(s, r).replace(Ye, Xe), s = r + e.length, t ? a += '\'+\n((__t=(' + t + '))==null?\'\':_.escape(__t))+\n\'' : n ? a += '\'+\n((__t=(' + n + '))==null?\'\':__t)+\n\'' : i && (a += '\';\n' + i + '\n__p+=\''), e;
                        }), a += '\';\n';
                        var i, r = e.variable;
                        if (r) {
                            if (!Ge.test(r))
                                throw new Error('variable is not a bare identifier: ' + r);
                        } else
                            a = 'with(obj||{}){\n' + a + '}\n', r = 'obj';
                        a = 'var __t,__p=\'\',__j=Array.prototype.join,' + 'print=function(){__p+=__j.call(arguments,\'\');};\n' + a + 'return __p;\n';
                        try {
                            i = new Function(r, '_', a);
                        } catch (e) {
                            throw e.source = a, e;
                        }
                        var l = function (e) {
                            return i.call(this, e, ie);
                        };
                        return l.source = 'function(' + r + '){\n' + a + '}', l;
                    },
                    result: function (e, t, n) {
                        var i = (t = Oe(t)).length;
                        if (!i)
                            return A(n) ? n.call(e) : n;
                        for (var r = 0; r < i; r++) {
                            var o = null == e ? void 0 : e[t[r]];
                            void 0 === o && (o = n, r = i), e = A(o) ? o.call(e) : o;
                        }
                        return e;
                    },
                    uniqueId: function (e) {
                        var t = ++je + '';
                        return e ? e + t : t;
                    },
                    chain: function (e) {
                        var t = ie(e);
                        return t._chain = !0, t;
                    },
                    iteratee: Ne,
                    partial: tt,
                    bind: nt,
                    bindAll: ot,
                    memoize: function (i, r) {
                        var o = function (e) {
                            var t = o.cache, n = '' + (r ? r.apply(this, arguments) : e);
                            return U(t, n) || (t[n] = i.apply(this, arguments)), t[n];
                        };
                        return o.cache = {}, o;
                    },
                    delay: st,
                    defer: at,
                    throttle: function (n, i, r) {
                        var o, s, a, l, u = 0;
                        r || (r = {});
                        var c = function () {
                                u = !1 === r.leading ? 0 : Ue(), o = null, l = n.apply(s, a), o || (s = a = null);
                            }, e = function () {
                                var e = Ue();
                                u || !1 !== r.leading || (u = e);
                                var t = i - (e - u);
                                return s = this, a = arguments, t <= 0 || i < t ? (o && (clearTimeout(o), o = null), u = e, l = n.apply(s, a), o || (s = a = null)) : o || !1 === r.trailing || (o = setTimeout(c, t)), l;
                            };
                        return e.cancel = function () {
                            clearTimeout(o), u = 0, o = s = a = null;
                        }, e;
                    },
                    debounce: function (t, n, i) {
                        var r, o, s, a, l, u = function () {
                                var e = Ue() - o;
                                e < n ? r = setTimeout(u, n - e) : (r = null, i || (a = t.apply(l, s)), r || (s = l = null));
                            }, e = C(function (e) {
                                return l = this, s = e, o = Ue(), r || (r = setTimeout(u, n), i && (a = t.apply(l, s))), a;
                            });
                        return e.cancel = function () {
                            clearTimeout(r), r = s = l = null;
                        }, e;
                    },
                    wrap: function (e, t) {
                        return tt(t, e);
                    },
                    negate: lt,
                    compose: function () {
                        var n = arguments, i = n.length - 1;
                        return function () {
                            for (var e = i, t = n[i].apply(this, arguments); e--;)
                                t = n[e].call(this, t);
                            return t;
                        };
                    },
                    after: function (e, t) {
                        return function () {
                            if (--e < 1)
                                return t.apply(this, arguments);
                        };
                    },
                    before: ut,
                    once: ct,
                    findKey: dt,
                    findIndex: St,
                    findLastIndex: ht,
                    sortedIndex: gt,
                    indexOf: vt,
                    lastIndexOf: mt,
                    find: yt,
                    detect: yt,
                    findWhere: function (e, t) {
                        return yt(e, De(t));
                    },
                    each: wt,
                    forEach: wt,
                    map: Ct,
                    collect: Ct,
                    reduce: xt,
                    foldl: xt,
                    inject: xt,
                    reduceRight: Et,
                    foldr: Et,
                    filter: Ft,
                    select: Ft,
                    reject: function (e, t, n) {
                        return Ft(e, lt(He(t)), n);
                    },
                    every: _t,
                    all: _t,
                    some: Mt,
                    any: Mt,
                    contains: Tt,
                    includes: Tt,
                    include: Tt,
                    invoke: It,
                    pluck: Ot,
                    where: function (e, t) {
                        return Ft(e, De(t));
                    },
                    max: Pt,
                    min: function (e, i, t) {
                        var n, r, o = 1 / 0, s = 1 / 0;
                        if (null == i || 'number' == typeof i && 'object' != typeof e[0] && null != e)
                            for (var a = 0, l = (e = it(e) ? e : we(e)).length; a < l; a++)
                                null != (n = e[a]) && n < o && (o = n);
                        else
                            i = He(i, t), wt(e, function (e, t, n) {
                                ((r = i(e, t, n)) < s || r === 1 / 0 && o === 1 / 0) && (o = e, s = r);
                            });
                        return o;
                    },
                    shuffle: function (e) {
                        return Rt(e, 1 / 0);
                    },
                    sample: Rt,
                    sortBy: function (e, i, t) {
                        var r = 0;
                        return i = He(i, t), Ot(Ct(e, function (e, t, n) {
                            return {
                                value: e,
                                index: r++,
                                criteria: i(e, t, n)
                            };
                        }).sort(function (e, t) {
                            var n = e.criteria, i = t.criteria;
                            if (n !== i) {
                                if (i < n || void 0 === n)
                                    return 1;
                                if (n < i || void 0 === i)
                                    return -1;
                            }
                            return e.index - t.index;
                        }), 'value');
                    },
                    groupBy: Dt,
                    indexBy: At,
                    countBy: Vt,
                    partition: Kt,
                    toArray: function (e) {
                        return e ? L(e) ? l.call(e) : _(e) ? e.match(Nt) : it(e) ? Ct(e, Be) : we(e) : [];
                    },
                    size: function (e) {
                        return null == e ? 0 : it(e) ? e.length : te(e).length;
                    },
                    pick: qt,
                    omit: Lt,
                    first: Wt,
                    head: Wt,
                    take: Wt,
                    initial: Ut,
                    last: function (e, t, n) {
                        return null == e || e.length < 1 ? null == t || n ? void 0 : [] : null == t || n ? e[e.length - 1] : $t(e, Math.max(0, e.length - t));
                    },
                    rest: $t,
                    tail: $t,
                    drop: $t,
                    compact: function (e) {
                        return Ft(e, Boolean);
                    },
                    flatten: function (e, t) {
                        return rt(e, t, !1);
                    },
                    without: Jt,
                    uniq: kt,
                    unique: kt,
                    union: Zt,
                    intersection: function (e) {
                        for (var t = [], n = arguments.length, i = 0, r = j(e); i < r; i++) {
                            var o = e[i];
                            if (!Tt(t, o)) {
                                var s;
                                for (s = 1; s < n && Tt(arguments[s], o); s++);
                                s === n && t.push(o);
                            }
                        }
                        return t;
                    },
                    difference: zt,
                    unzip: Qt,
                    transpose: Qt,
                    zip: Yt,
                    object: function (e, t) {
                        for (var n = {}, i = 0, r = j(e); i < r; i++)
                            t ? n[e[i]] = t[i] : n[e[i][0]] = e[i][1];
                        return n;
                    },
                    range: function (e, t, n) {
                        null == t && (t = e || 0, e = 0), n || (n = t < e ? -1 : 1);
                        for (var i = Math.max(Math.ceil((t - e) / n), 0), r = Array(i), o = 0; o < i; o++, e += n)
                            r[o] = e;
                        return r;
                    },
                    chunk: function (e, t) {
                        if (null == t || t < 1)
                            return [];
                        for (var n = [], i = 0, r = e.length; i < r;)
                            n.push(l.call(e, i, i += t));
                        return n;
                    },
                    mixin: Gt,
                    default: ie
                });
                return jt._ = jt;
            }, 'object' == typeof exports && 'undefined' != typeof module ? module.exports = zh() : 'function' == typeof CKFinder.define && CKFinder.define.amd ? CKFinder.define('underscore', zh) : (yh = 'undefined' != typeof globalThis ? globalThis : yh || self, Ah = yh._, (Bh = yh._ = zh()).noConflict = function () {
                return yh._ = Ah, Bh;
            }), function () {
                function Ev(e) {
                    return e.replace(/\\('|\\)/g, '$1').replace(/[\r\t\n]/g, ' ');
                }
                var Gv, Fv = {
                        version: '1.0.3',
                        templateSettings: {
                            evaluate: /\{\{([\s\S]+?(\}?)+)\}\}/g,
                            interpolate: /\{\{=([\s\S]+?)\}\}/g,
                            encode: /\{\{!([\s\S]+?)\}\}/g,
                            use: /\{\{#([\s\S]+?)\}\}/g,
                            useParams: /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
                            define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
                            defineParams: /^\s*([\w$]+):([\s\S]+)/,
                            conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
                            iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
                            varname: 'it',
                            strip: !0,
                            append: !0,
                            selfcontained: !1,
                            doNotSkipEncoded: !1
                        },
                        template: void 0,
                        compile: void 0
                    };
                Fv.encodeHTMLSource = function (e) {
                    var t = {
                            '&': '&#38;',
                            '<': '&#60;',
                            '>': '&#62;',
                            '"': '&#34;',
                            '\'': '&#39;',
                            '/': '&#47;'
                        }, n = e ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
                    return function (e) {
                        return e ? e.toString().replace(n, function (e) {
                            return t[e] || e;
                        }) : '';
                    };
                }, Gv = function () {
                    return this || eval('this');
                }(), 'undefined' != typeof module && module.exports ? module.exports = Fv : 'function' == typeof CKFinder.define && CKFinder.define.amd ? CKFinder.define('doT', [], function () {
                    return Fv;
                }) : Gv.doT = Fv;
                var Hv = {
                        start: '\'+(',
                        end: ')+\'',
                        startencode: '\'+encodeHTML('
                    }, Iv = {
                        start: '\';out+=(',
                        end: ');out+=\'',
                        startencode: '\';out+=encodeHTML('
                    }, Jv = /$^/;
                Fv.template = function (t, e, n) {
                    var i, r, o = (e = e || Fv.templateSettings).append ? Hv : Iv, s = 0;
                    t = e.use || e.define ? function i(r, e, o) {
                        return ('string' == typeof e ? e : e.toString()).replace(r.define || Jv, function (e, i, t, n) {
                            return 0 === i.indexOf('def.') && (i = i.substring(4)), i in o || (':' === t ? (r.defineParams && n.replace(r.defineParams, function (e, t, n) {
                                o[i] = {
                                    arg: t,
                                    text: n
                                };
                            }), i in o || (o[i] = n)) : new Function('def', 'def[\'' + i + '\']=' + n)(o)), '';
                        }).replace(r.use || Jv, function (e, t) {
                            r.useParams && (t = t.replace(r.useParams, function (e, t, n, i) {
                                if (o[n] && o[n].arg && i)
                                    return e = (n + ':' + i).replace(/'|\\/g, '_'), o.__exp = o.__exp || {}, o.__exp[e] = o[n].text.replace(new RegExp('(^|[^\\w$])' + o[n].arg + '([^\\w$])', 'g'), '$1' + i + '$2'), t + 'def.__exp[\'' + e + '\']';
                            }));
                            var n = new Function('def', 'return ' + t)(o);
                            return n ? i(r, n, o) : n;
                        });
                    }(e, t, n || {}) : t, t = ('var out=\'' + (e.strip ? t.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g, ' ').replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g, '') : t).replace(/'|\\/g, '\\$&').replace(e.interpolate || Jv, function (e, t) {
                        return o.start + Ev(t) + o.end;
                    }).replace(e.encode || Jv, function (e, t) {
                        return i = !0, o.startencode + Ev(t) + o.end;
                    }).replace(e.conditional || Jv, function (e, t, n) {
                        return t ? n ? '\';}else if(' + Ev(n) + '){out+=\'' : '\';}else{out+=\'' : n ? '\';if(' + Ev(n) + '){out+=\'' : '\';}out+=\'';
                    }).replace(e.iterate || Jv, function (e, t, n, i) {
                        return t ? (s += 1, r = i || 'i' + s, t = Ev(t), '\';var arr' + s + '=' + t + ';if(arr' + s + '){var ' + n + ',' + r + '=-1,l' + s + '=arr' + s + '.length-1;while(' + r + '<l' + s + '){' + n + '=arr' + s + '[' + r + '+=1];out+=\'') : '\';} } out+=\'';
                    }).replace(e.evaluate || Jv, function (e, t) {
                        return '\';' + Ev(t) + 'out+=\'';
                    }) + '\';return out;').replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r').replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, ''), i && (e.selfcontained || !Gv || Gv._encodeHTML || (Gv._encodeHTML = Fv.encodeHTMLSource(e.doNotSkipEncoded)), t = 'var encodeHTML = typeof _encodeHTML !== \'undefined\' ? _encodeHTML : (' + Fv.encodeHTMLSource.toString() + '(' + (e.doNotSkipEncoded || '') + '));' + t);
                    try {
                        return new Function(e.varname, t);
                    } catch (e) {
                        throw 'undefined' != typeof console && console.log('Could not create a template function: ' + t), e;
                    }
                }, Fv.compile = function (e, t) {
                    return Fv.template(e, null, t);
                };
            }(), CKFinder.define('underscore_polyfill', ['underscore'], function (f) {
                'use strict';
                var t, u = {
                        function: !0,
                        object: !0
                    }, n = (t = 'length', function (e) {
                        return null == e ? void 0 : e[t];
                    }), i = '[object Object]', r = Object.prototype.toString;
                function o(e, t) {
                    return function (l) {
                        return function (e, t, n) {
                            for (var i = toObject(e), r = n(e), o = r.length, s = l ? o : -1; l ? s-- : ++s < o;) {
                                var a = r[s];
                                if (!1 === t(i[a], a, i))
                                    break;
                            }
                            return e;
                        };
                    }(e);
                }
                function s(e) {
                    return 'number' == typeof e && -1 < e && e % 1 == 0 && e <= MAX_SAFE_INTEGER;
                }
                function h(e) {
                    return null != e && s(n(e));
                }
                function g(e) {
                    return !!e && 'object' == typeof e;
                }
                function e(e, t) {
                    for (var n = -1, i = e.length; ++n < i && !1 !== t(e[n], n, e););
                    return e;
                }
                function p(e) {
                    var t, n;
                    return !(!g(e) || r.call(e) != i || f.isArguments(e) || !(hasOwnProperty.call(e, 'constructor') || 'function' != typeof (t = e.constructor) || t instanceof t)) && (o(e), void 0 === n || hasOwnProperty.call(e, n));
                }
                function v(o, s, a, l, u) {
                    if (!f.isObject(o))
                        return o;
                    var c = h(s) && (isArray(s) || isTypedArray(s)), d = c ? void 0 : f.keys(s);
                    return e(d || s, function (e, t) {
                        if (d && (e = s[t = e]), g(e))
                            l || (l = []), u || (u = []), m(o, s, t, v, a, l, u);
                        else {
                            var n = o[t], i = a ? a(n, e, t, o, s) : void 0, r = void 0 === i;
                            r && (i = e), void 0 === i && (!c || t in o) || !r && (i == i ? i === n : n != n) || (o[t] = i);
                        }
                    }), o;
                }
                function m(e, t, n, i, r, o, s) {
                    for (var a = o.length, l = t[n]; a--;)
                        if (o[a] == l)
                            return void (e[n] = s[a]);
                    var u = e[n], c = r ? r(u, l, n, e, t) : void 0, d = void 0 === c;
                    d && (h(c = l) && (isArray(l) || isTypedArray(l)) ? c = isArray(u) ? u : h(u) ? arrayCopy(u) : [] : p(l) || f.isArguments(l) ? c = f.isArguments(u) ? toPlainObject(u) : p(u) ? u : {} : d = !1), o.push(l), s.push(c), d ? e[n] = i(c, l, r, o, s) : (c == c ? c !== u : u == u) && (e[n] = c);
                }
                var a = {
                    forOwn: function (e, t, n) {
                        var i, r = e, o = r;
                        if (!r)
                            return o;
                        if (!u[typeof r])
                            return o;
                        t = t && void 0 === n ? t : baseCreateCallback(t, n, 3);
                        for (var s = -1, a = u[typeof r] && f.keys(r), l = a ? a.length : 0; ++s < l;)
                            if (!1 === t(r[i = a[s]], i, e))
                                return o;
                        return o;
                    },
                    merge: function (o, s, a, l, u) {
                        if (!f.isObject(o))
                            return o;
                        var c = h(s) && (f.isArray(s) || f.isTypedArray(s)), d = c ? void 0 : f.keys(s);
                        return e(d || s, function (e, t) {
                            if (d && (e = s[t = e]), g(e))
                                l || (l = []), u || (u = []), m(o, s, t, v, a, l, u);
                            else {
                                var n = o[t], i = a ? f.customizer(n, e, t, o, s) : void 0, r = void 0 === i;
                                r && (i = e), void 0 === i && (!c || t in o) || !r && (i == i ? i === n : n != n) || (o[t] = i);
                            }
                        }), o;
                    },
                    isArrayLike: h,
                    baseMerge: v
                };
                return (f = f.mixin(a))._ = f;
            }), function (i, r) {
                if ('function' == typeof CKFinder.define && CKFinder.define.amd)
                    CKFinder.define('backbone', [
                        'underscore',
                        'jquery',
                        'exports'
                    ], function (e, t, n) {
                        i.Backbone = r(i, n, e, t);
                    });
                else if ('undefined' != typeof exports) {
                    var e = require('underscore');
                    r(i, exports, e);
                } else
                    i.Backbone = r(i, {}, i._, i.jQuery || i.Zepto || i.ender || i.$);
            }(this, function (e, a, x, t) {
                var n = e.Backbone, i = [], r = i.slice;
                a.VERSION = '1.1.2', a.$ = t, a.noConflict = function () {
                    return e.Backbone = n, this;
                }, a.emulateHTTP = !1, a.emulateJSON = !1;
                var o = a.Events = {
                        on: function (e, t, n) {
                            return d(this, 'on', e, [
                                t,
                                n
                            ]) && t && (this._events || (this._events = {}), (this._events[e] || (this._events[e] = [])).push({
                                callback: t,
                                context: n,
                                ctx: n || this
                            })), this;
                        },
                        once: function (e, t, n) {
                            if (!d(this, 'once', e, [
                                    t,
                                    n
                                ]) || !t)
                                return this;
                            var i = this, r = x.once(function () {
                                    i.off(e, r), t.apply(this, arguments);
                                });
                            return r._callback = t, this.on(e, r, n);
                        },
                        off: function (e, t, n) {
                            var i, r, o, s, a, l, u, c;
                            if (!this._events || !d(this, 'off', e, [
                                    t,
                                    n
                                ]))
                                return this;
                            if (!e && !t && !n)
                                return this._events = void 0, this;
                            for (a = 0, l = (s = e ? [e] : x.keys(this._events)).length; a < l; a++)
                                if (e = s[a], o = this._events[e]) {
                                    if (this._events[e] = i = [], t || n)
                                        for (u = 0, c = o.length; u < c; u++)
                                            r = o[u], (t && t !== r.callback && t !== r.callback._callback || n && n !== r.context) && i.push(r);
                                    i.length || delete this._events[e];
                                }
                            return this;
                        },
                        trigger: function (e) {
                            if (!this._events)
                                return this;
                            var t = r.call(arguments, 1);
                            if (!d(this, 'trigger', e, t))
                                return this;
                            var n = this._events[e], i = this._events.all;
                            return n && s(n, t), i && s(i, arguments), this;
                        },
                        stopListening: function (e, t, n) {
                            var i = this._listeningTo;
                            if (!i)
                                return this;
                            var r = !t && !n;
                            for (var o in (n || 'object' != typeof t || (n = this), e && ((i = {})[e._listenId] = e), i))
                                (e = i[o]).off(t, n, this), (r || x.isEmpty(e._events)) && delete this._listeningTo[o];
                            return this;
                        }
                    }, l = /\s+/, d = function (e, t, n, i) {
                        if (!n)
                            return !0;
                        if ('object' == typeof n) {
                            for (var r in n)
                                e[t].apply(e, [
                                    r,
                                    n[r]
                                ].concat(i));
                            return !1;
                        }
                        if (l.test(n)) {
                            for (var o = n.split(l), s = 0, a = o.length; s < a; s++)
                                e[t].apply(e, [o[s]].concat(i));
                            return !1;
                        }
                        return !0;
                    }, s = function (e, t) {
                        var n, i = -1, r = e.length, o = t[0], s = t[1], a = t[2];
                        switch (t.length) {
                        case 0:
                            for (; ++i < r;)
                                (n = e[i]).callback.call(n.ctx);
                            return;
                        case 1:
                            for (; ++i < r;)
                                (n = e[i]).callback.call(n.ctx, o);
                            return;
                        case 2:
                            for (; ++i < r;)
                                (n = e[i]).callback.call(n.ctx, o, s);
                            return;
                        case 3:
                            for (; ++i < r;)
                                (n = e[i]).callback.call(n.ctx, o, s, a);
                            return;
                        default:
                            for (; ++i < r;)
                                (n = e[i]).callback.apply(n.ctx, t);
                            return;
                        }
                    }, u = {
                        listenTo: 'on',
                        listenToOnce: 'once'
                    };
                x.each(u, function (r, e) {
                    o[e] = function (e, t, n) {
                        var i = this._listeningTo || (this._listeningTo = {});
                        return n || 'object' != typeof t || (n = this), (i[e._listenId || (e._listenId = x.uniqueId('l'))] = e)[r](t, n, this), this;
                    };
                }), o.bind = o.on, o.unbind = o.off, x.extend(a, o);
                var E = a.Model = function (e, t) {
                    var n = e || {};
                    t || (t = {}), this.cid = x.uniqueId('c'), this.attributes = {}, t.collection && (this.collection = t.collection), t.parse && (n = this.parse(n, t) || {}), n = x.defaults({}, n, x.result(this, 'defaults')), this.set(n, t), this.changed = {}, this.initialize.apply(this, arguments);
                };
                x.extend(E.prototype, o, {
                    changed: null,
                    validationError: null,
                    idAttribute: 'id',
                    initialize: function () {
                    },
                    toJSON: function (e) {
                        return x.clone(this.attributes);
                    },
                    sync: function () {
                        return a.sync.apply(this, arguments);
                    },
                    get: function (e) {
                        return this.attributes[e];
                    },
                    escape: function (e) {
                        return x.escape(this.get(e));
                    },
                    has: function (e) {
                        return null != this.get(e);
                    },
                    set: function (e, t, n) {
                        var i, r, o, s, a, l, u, c;
                        if (null == e)
                            return this;
                        if ('object' == typeof e ? (r = e, n = t) : (r = {})[e] = t, n || (n = {}), !this._validate(r, n))
                            return !1;
                        for (i in (o = n.unset, a = n.silent, s = [], l = this._changing, this._changing = !0, l || (this._previousAttributes = x.clone(this.attributes), this.changed = {}), c = this.attributes, u = this._previousAttributes, this.idAttribute in r && (this.id = r[this.idAttribute]), r))
                            t = r[i], x.isEqual(c[i], t) || s.push(i), x.isEqual(u[i], t) ? delete this.changed[i] : this.changed[i] = t, o ? delete c[i] : c[i] = t;
                        if (!a) {
                            s.length && (this._pending = n);
                            for (var d = 0, f = s.length; d < f; d++)
                                this.trigger('change:' + s[d], this, c[s[d]], n);
                        }
                        if (l)
                            return this;
                        if (!a)
                            for (; this._pending;)
                                n = this._pending, this._pending = !1, this.trigger('change', this, n);
                        return this._pending = !1, this._changing = !1, this;
                    },
                    unset: function (e, t) {
                        return this.set(e, void 0, x.extend({}, t, { unset: !0 }));
                    },
                    clear: function (e) {
                        var t = {};
                        for (var n in this.attributes)
                            t[n] = void 0;
                        return this.set(t, x.extend({}, e, { unset: !0 }));
                    },
                    hasChanged: function (e) {
                        return null == e ? !x.isEmpty(this.changed) : x.has(this.changed, e);
                    },
                    changedAttributes: function (e) {
                        if (!e)
                            return !!this.hasChanged() && x.clone(this.changed);
                        var t, n = !1, i = this._changing ? this._previousAttributes : this.attributes;
                        for (var r in e)
                            x.isEqual(i[r], t = e[r]) || ((n || (n = {}))[r] = t);
                        return n;
                    },
                    previous: function (e) {
                        return null != e && this._previousAttributes ? this._previousAttributes[e] : null;
                    },
                    previousAttributes: function () {
                        return x.clone(this._previousAttributes);
                    },
                    fetch: function (t) {
                        void 0 === (t = t ? x.clone(t) : {}).parse && (t.parse = !0);
                        var n = this, i = t.success;
                        return t.success = function (e) {
                            if (!n.set(n.parse(e, t), t))
                                return !1;
                            i && i(n, e, t), n.trigger('sync', n, e, t);
                        }, K(this, t), this.sync('read', this, t);
                    },
                    save: function (e, t, n) {
                        var i, r, o, s = this.attributes;
                        if (null == e || 'object' == typeof e ? (i = e, n = t) : (i = {})[e] = t, n = x.extend({ validate: !0 }, n), i && !n.wait) {
                            if (!this.set(i, n))
                                return !1;
                        } else if (!this._validate(i, n))
                            return !1;
                        i && n.wait && (this.attributes = x.extend({}, s, i)), void 0 === n.parse && (n.parse = !0);
                        var a = this, l = n.success;
                        return n.success = function (e) {
                            a.attributes = s;
                            var t = a.parse(e, n);
                            if (n.wait && (t = x.extend(i || {}, t)), x.isObject(t) && !a.set(t, n))
                                return !1;
                            l && l(a, e, n), a.trigger('sync', a, e, n);
                        }, K(this, n), (r = this.isNew() ? 'create' : n.patch ? 'patch' : 'update') === 'patch' && (n.attrs = i), o = this.sync(r, this, n), i && n.wait && (this.attributes = s), o;
                    },
                    destroy: function (t) {
                        t = t ? x.clone(t) : {};
                        var n = this, i = t.success, r = function () {
                                n.trigger('destroy', n, n.collection, t);
                            };
                        if (t.success = function (e) {
                                (t.wait || n.isNew()) && r(), i && i(n, e, t), n.isNew() || n.trigger('sync', n, e, t);
                            }, this.isNew())
                            return t.success(), !1;
                        K(this, t);
                        var e = this.sync('delete', this, t);
                        return t.wait || r(), e;
                    },
                    url: function () {
                        var e = x.result(this, 'urlRoot') || x.result(this.collection, 'url') || V();
                        return this.isNew() ? e : e.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id);
                    },
                    parse: function (e, t) {
                        return e;
                    },
                    clone: function () {
                        return new this.constructor(this.attributes);
                    },
                    isNew: function () {
                        return !this.has(this.idAttribute);
                    },
                    isValid: function (e) {
                        return this._validate({}, x.extend(e || {}, { validate: !0 }));
                    },
                    _validate: function (e, t) {
                        if (!t.validate || !this.validate)
                            return !0;
                        e = x.extend({}, this.attributes, e);
                        var n = this.validationError = this.validate(e, t) || null;
                        return !n || (this.trigger('invalid', this, n, x.extend(t, { validationError: n })), !1);
                    }
                });
                var c = [
                    'keys',
                    'values',
                    'pairs',
                    'invert',
                    'pick',
                    'omit'
                ];
                x.each(c, function (t) {
                    E.prototype[t] = function () {
                        var e = r.call(arguments);
                        return e.unshift(this.attributes), x[t].apply(x, e);
                    };
                });
                var f = a.Collection = function (e, t) {
                        t || (t = {}), t.model && (this.model = t.model), void 0 !== t.comparator && (this.comparator = t.comparator), this._reset(), this.initialize.apply(this, arguments), e && this.reset(e, x.extend({ silent: !0 }, t));
                    }, F = {
                        add: !0,
                        remove: !0,
                        merge: !0
                    }, h = {
                        add: !0,
                        remove: !1
                    };
                x.extend(f.prototype, o, {
                    model: E,
                    initialize: function () {
                    },
                    toJSON: function (t) {
                        return this.map(function (e) {
                            return e.toJSON(t);
                        });
                    },
                    sync: function () {
                        return a.sync.apply(this, arguments);
                    },
                    add: function (e, t) {
                        return this.set(e, x.extend({ merge: !1 }, t, h));
                    },
                    remove: function (e, t) {
                        var n, i, r, o, s = !x.isArray(e);
                        for (t || (t = {}), n = 0, i = (e = s ? [e] : x.clone(e)).length; n < i; n++)
                            (o = e[n] = this.get(e[n])) && (delete this._byId[o.id], delete this._byId[o.cid], r = this.indexOf(o), this.models.splice(r, 1), this.length--, t.silent || (t.index = r, o.trigger('remove', o, this, t)), this._removeReference(o, t));
                        return s ? e[0] : e;
                    },
                    set: function (e, t) {
                        (t = x.defaults({}, t, F)).parse && (e = this.parse(e, t));
                        var n, i, r, o, s, a, l, u = !x.isArray(e);
                        e = u ? e ? [e] : [] : x.clone(e);
                        var c = t.at, d = this.model, f = this.comparator && null == c && !1 !== t.sort, h = x.isString(this.comparator) ? this.comparator : null, g = [], p = [], v = {}, m = t.add, y = t.merge, w = t.remove, C = !(f || !m || !w) && [];
                        for (n = 0, i = e.length; n < i; n++) {
                            if (r = (s = e[n] || {}) instanceof E ? o = s : s[d.prototype.idAttribute || 'id'], a = this.get(r))
                                w && (v[a.cid] = !0), y && (s = s === o ? o.attributes : s, t.parse && (s = a.parse(s, t)), a.set(s, t), f && !l && a.hasChanged(h) && (l = !0)), e[n] = a;
                            else if (m) {
                                if (!(o = e[n] = this._prepareModel(s, t)))
                                    continue;
                                g.push(o), this._addReference(o, t);
                            }
                            o = a || o, !C || !o.isNew() && v[o.id] || C.push(o), v[o.id] = !0;
                        }
                        if (w) {
                            for (n = 0, i = this.length; n < i; ++n)
                                v[(o = this.models[n]).cid] || p.push(o);
                            p.length && this.remove(p, t);
                        }
                        if (g.length || C && C.length)
                            if (f && (l = !0), this.length += g.length, null != c)
                                for (n = 0, i = g.length; n < i; n++)
                                    this.models.splice(c + n, 0, g[n]);
                            else {
                                C && (this.models.length = 0);
                                var b = C || g;
                                for (n = 0, i = b.length; n < i; n++)
                                    this.models.push(b[n]);
                            }
                        if (l && this.sort({ silent: !0 }), !t.silent) {
                            for (n = 0, i = g.length; n < i; n++)
                                (o = g[n]).trigger('add', o, this, t);
                            (l || C && C.length) && this.trigger('sort', this, t);
                        }
                        return u ? e[0] : e;
                    },
                    reset: function (e, t) {
                        t || (t = {});
                        for (var n = 0, i = this.models.length; n < i; n++)
                            this._removeReference(this.models[n], t);
                        return t.previousModels = this.models, this._reset(), e = this.add(e, x.extend({ silent: !0 }, t)), t.silent || this.trigger('reset', this, t), e;
                    },
                    push: function (e, t) {
                        return this.add(e, x.extend({ at: this.length }, t));
                    },
                    pop: function (e) {
                        var t = this.at(this.length - 1);
                        return this.remove(t, e), t;
                    },
                    unshift: function (e, t) {
                        return this.add(e, x.extend({ at: 0 }, t));
                    },
                    shift: function (e) {
                        var t = this.at(0);
                        return this.remove(t, e), t;
                    },
                    slice: function () {
                        return r.apply(this.models, arguments);
                    },
                    get: function (e) {
                        if (null != e)
                            return this._byId[e] || this._byId[e.id] || this._byId[e.cid];
                    },
                    at: function (e) {
                        return this.models[e];
                    },
                    where: function (n, e) {
                        return x.isEmpty(n) ? e ? void 0 : [] : this[e ? 'find' : 'filter'](function (e) {
                            for (var t in n)
                                if (n[t] !== e.get(t))
                                    return !1;
                            return !0;
                        });
                    },
                    findWhere: function (e) {
                        return this.where(e, !0);
                    },
                    sort: function (e) {
                        if (!this.comparator)
                            throw new Error('Cannot sort a set without a comparator');
                        return e || (e = {}), x.isString(this.comparator) || 1 === this.comparator.length ? this.models = this.sortBy(this.comparator, this) : this.models.sort(x.bind(this.comparator, this)), e.silent || this.trigger('sort', this, e), this;
                    },
                    pluck: function (e) {
                        return x.invoke(this.models, 'get', e);
                    },
                    fetch: function (n) {
                        void 0 === (n = n ? x.clone(n) : {}).parse && (n.parse = !0);
                        var i = n.success, r = this;
                        return n.success = function (e) {
                            var t = n.reset ? 'reset' : 'set';
                            r[t](e, n), i && i(r, e, n), r.trigger('sync', r, e, n);
                        }, K(this, n), this.sync('read', this, n);
                    },
                    create: function (e, n) {
                        if (n = n ? x.clone(n) : {}, !(e = this._prepareModel(e, n)))
                            return !1;
                        n.wait || this.add(e, n);
                        var i = this, r = n.success;
                        return n.success = function (e, t) {
                            n.wait && i.add(e, n), r && r(e, t, n);
                        }, e.save(null, n), e;
                    },
                    parse: function (e, t) {
                        return e;
                    },
                    clone: function () {
                        return new this.constructor(this.models);
                    },
                    _reset: function () {
                        this.length = 0, this.models = [], this._byId = {};
                    },
                    _prepareModel: function (e, t) {
                        if (e instanceof E)
                            return e;
                        var n = new ((t = t ? (x.clone(t)) : {}).collection = this).model(e, t);
                        return n.validationError ? (this.trigger('invalid', this, n.validationError, t), !1) : n;
                    },
                    _addReference: function (e, t) {
                        null != (this._byId[e.cid] = e).id && (this._byId[e.id] = e), e.collection || (e.collection = this), e.on('all', this._onModelEvent, this);
                    },
                    _removeReference: function (e, t) {
                        this === e.collection && delete e.collection, e.off('all', this._onModelEvent, this);
                    },
                    _onModelEvent: function (e, t, n, i) {
                        (e !== 'add' && e !== 'remove' || n === this) && (e === 'destroy' && this.remove(t, i), t && e === 'change:' + t.idAttribute && (delete this._byId[t.previous(t.idAttribute)], null != t.id && (this._byId[t.id] = t)), this.trigger.apply(this, arguments));
                    }
                });
                var g = [
                    'forEach',
                    'each',
                    'map',
                    'collect',
                    'reduce',
                    'foldl',
                    'inject',
                    'reduceRight',
                    'foldr',
                    'find',
                    'detect',
                    'filter',
                    'select',
                    'reject',
                    'every',
                    'all',
                    'some',
                    'any',
                    'include',
                    'contains',
                    'invoke',
                    'max',
                    'min',
                    'toArray',
                    'size',
                    'first',
                    'head',
                    'take',
                    'initial',
                    'rest',
                    'tail',
                    'drop',
                    'last',
                    'without',
                    'difference',
                    'indexOf',
                    'shuffle',
                    'lastIndexOf',
                    'isEmpty',
                    'chain',
                    'sample'
                ];
                x.each(g, function (t) {
                    f.prototype[t] = function () {
                        var e = r.call(arguments);
                        return e.unshift(this.models), x[t].apply(x, e);
                    };
                });
                var p = [
                    'groupBy',
                    'countBy',
                    'sortBy',
                    'indexBy'
                ];
                x.each(p, function (i) {
                    f.prototype[i] = function (t, e) {
                        var n = x.isFunction(t) ? t : function (e) {
                            return e.get(t);
                        };
                        return x[i](this.models, n, e);
                    };
                });
                var v = a.View = function (e) {
                        this.cid = x.uniqueId('view'), e || (e = {}), x.extend(this, x.pick(e, y)), this._ensureElement(), this.initialize.apply(this, arguments), this.delegateEvents();
                    }, m = /^(\S+)\s*(.*)$/, y = [
                        'model',
                        'collection',
                        'el',
                        'id',
                        'attributes',
                        'className',
                        'tagName',
                        'events'
                    ];
                x.extend(v.prototype, o, {
                    tagName: 'div',
                    $: function (e) {
                        return this.$el.find(e);
                    },
                    initialize: function () {
                    },
                    render: function () {
                        return this;
                    },
                    remove: function () {
                        return this.$el.remove(), this.stopListening(), this;
                    },
                    setElement: function (e, t) {
                        return this.$el && this.undelegateEvents(), this.$el = e instanceof a.$ ? e : a.$(e), this.el = this.$el[0], !1 !== t && this.delegateEvents(), this;
                    },
                    delegateEvents: function (e) {
                        if (!e && !(e = x.result(this, 'events')))
                            return this;
                        for (var t in (this.undelegateEvents(), e)) {
                            var n = e[t];
                            if (x.isFunction(n) || (n = this[e[t]]), n) {
                                var i = t.match(m), r = i[1], o = i[2];
                                n = x.bind(n, this), r += '.delegateEvents' + this.cid, '' === o ? this.$el.on(r, n) : this.$el.on(r, o, n);
                            }
                        }
                        return this;
                    },
                    undelegateEvents: function () {
                        return this.$el.off('.delegateEvents' + this.cid), this;
                    },
                    _ensureElement: function () {
                        if (this.el)
                            this.setElement(x.result(this, 'el'), !1);
                        else {
                            var e = x.extend({}, x.result(this, 'attributes'));
                            this.id && (e.id = x.result(this, 'id')), this.className && (e['class'] = x.result(this, 'className'));
                            var t = a.$('<' + x.result(this, 'tagName') + '>').attr(e);
                            this.setElement(t, !1);
                        }
                    }
                }), a.sync = function (e, t, n) {
                    var i = C[e];
                    x.defaults(n || (n = {}), {
                        emulateHTTP: a.emulateHTTP,
                        emulateJSON: a.emulateJSON
                    });
                    var r = {
                        type: i,
                        dataType: 'json'
                    };
                    if (n.url || (r.url = x.result(t, 'url') || V()), null != n.data || !t || e !== 'create' && e !== 'update' && e !== 'patch' || (r.contentType = 'application/json', r.data = JSON.stringify(n.attrs || t.toJSON(n))), n.emulateJSON && (r.contentType = 'application/x-www-form-urlencoded', r.data = r.data ? { model: r.data } : {}), n.emulateHTTP && (i === 'PUT' || i === 'DELETE' || i === 'PATCH')) {
                        r.type = 'POST', n.emulateJSON && (r.data._method = i);
                        var o = n.beforeSend;
                        n.beforeSend = function (e) {
                            if (e.setRequestHeader('X-HTTP-Method-Override', i), o)
                                return o.apply(this, arguments);
                        };
                    }
                    r.type === 'GET' || n.emulateJSON || (r.processData = !1), r.type === 'PATCH' && w && (r.xhr = function () {
                        return new ActiveXObject('Microsoft.XMLHTTP');
                    });
                    var s = n.xhr = a.ajax(x.extend(r, n));
                    return t.trigger('request', t, s, n), s;
                };
                var w = !(void 0 === window || !window.ActiveXObject || window.XMLHttpRequest && new XMLHttpRequest().dispatchEvent), C = {
                        create: 'POST',
                        update: 'PUT',
                        patch: 'PATCH',
                        delete: 'DELETE',
                        read: 'GET'
                    };
                a.ajax = function () {
                    return a.$.ajax.apply(a.$, arguments);
                };
                var b = a.Router = function (e) {
                        e || (e = {}), e.routes && (this.routes = e.routes), this._bindRoutes(), this.initialize.apply(this, arguments);
                    }, _ = /\((.*?)\)/g, M = /(\(\?)?:\w+/g, T = /\*\w+/g, I = /[\-{}\[\]+?.,\\\^$|#\s]/g;
                x.extend(b.prototype, o, {
                    initialize: function () {
                    },
                    route: function (n, i, r) {
                        x.isRegExp(n) || (n = this._routeToRegExp(n)), x.isFunction(i) && (r = i, i = ''), r || (r = this[i]);
                        var o = this;
                        return a.history.route(n, function (e) {
                            var t = o._extractParameters(n, e);
                            o.execute(r, t), o.trigger.apply(o, ['route:' + i].concat(t)), o.trigger('route', i, t), a.history.trigger('route', o, i, t);
                        }), this;
                    },
                    execute: function (e, t) {
                        e && e.apply(this, t);
                    },
                    navigate: function (e, t) {
                        return a.history.navigate(e, t), this;
                    },
                    _bindRoutes: function () {
                        if (this.routes) {
                            this.routes = x.result(this, 'routes');
                            for (var e, t = x.keys(this.routes); null != (e = t.pop());)
                                this.route(e, this.routes[e]);
                        }
                    },
                    _routeToRegExp: function (e) {
                        return e = e.replace(I, '\\$&').replace(_, '(?:$1)?').replace(M, function (e, t) {
                            return t ? e : '([^/?]+)';
                        }).replace(T, '([^?]*?)'), new RegExp('^' + e + '(?:\\?([\\s\\S]*))?$');
                    },
                    _extractParameters: function (e, t) {
                        var n = e.exec(t).slice(1);
                        return x.map(n, function (e, t) {
                            return t === n.length - 1 ? e || null : e ? decodeURIComponent(e) : null;
                        });
                    }
                });
                var O = a.History = function () {
                        this.handlers = [], x.bindAll(this, 'checkUrl'), void 0 !== window && (this.location = window.location, this.history = window.history);
                    }, P = /^[#\/]|\s+$/g, R = /^\/+|\/+$/g, B = /msie [\w.]+/, D = /\/$/, A = /#.*$/;
                O.started = !1, x.extend(O.prototype, o, {
                    interval: 50,
                    atRoot: function () {
                        return this.location.pathname.replace(/[^\/]$/, '$&/') === this.root;
                    },
                    getHash: function (e) {
                        var t = (e || this).location.href.match(/#(.*)$/);
                        return t ? t[1] : '';
                    },
                    getFragment: function (e, t) {
                        if (null == e)
                            if (this._hasPushState || !this._wantsHashChange || t) {
                                e = decodeURI(this.location.pathname + this.location.search);
                                var n = this.root.replace(D, '');
                                e.indexOf(n) || (e = e.slice(n.length));
                            } else
                                e = this.getHash();
                        return e.replace(P, '');
                    },
                    start: function (e) {
                        if (O.started)
                            throw new Error('Backbone.history has already been started');
                        O.started = !0, this.options = x.extend({ root: '/' }, this.options, e), this.root = this.options.root, this._wantsHashChange = !1 !== this.options.hashChange, this._wantsPushState = !!this.options.pushState, this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
                        var t = this.getFragment(), n = document.documentMode, i = B.exec(navigator.userAgent.toLowerCase()) && (!n || n <= 7);
                        if (this.root = ('/' + this.root + '/').replace(R, '/'), i && this._wantsHashChange) {
                            var r = a.$('<iframe src="javascript:0" tabindex="-1">');
                            this.iframe = r.hide().appendTo('body')[0].contentWindow, this.navigate(t);
                        }
                        this._hasPushState ? a.$(window).on('popstate', this.checkUrl) : this._wantsHashChange && 'onhashchange' in window && !i ? a.$(window).on('hashchange', this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), this.fragment = t;
                        var o = this.location;
                        if (this._wantsHashChange && this._wantsPushState) {
                            if (!this._hasPushState && !this.atRoot())
                                return this.fragment = this.getFragment(null, !0), this.location.replace(this.root + '#' + this.fragment), !0;
                            this._hasPushState && this.atRoot() && o.hash && (this.fragment = this.getHash().replace(P, ''), this.history.replaceState({}, document.title, this.root + this.fragment));
                        }
                        if (!this.options.silent)
                            return this.loadUrl();
                    },
                    stop: function () {
                        a.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl), this._checkUrlInterval && clearInterval(this._checkUrlInterval), O.started = !1;
                    },
                    route: function (e, t) {
                        this.handlers.unshift({
                            route: e,
                            callback: t
                        });
                    },
                    checkUrl: function (e) {
                        var t = this.getFragment();
                        if (t === this.fragment && this.iframe && (t = this.getFragment(this.getHash(this.iframe))), t === this.fragment)
                            return !1;
                        this.iframe && this.navigate(t), this.loadUrl();
                    },
                    loadUrl: function (t) {
                        return t = this.fragment = this.getFragment(t), x.any(this.handlers, function (e) {
                            if (e.route.test(t))
                                return e.callback(t), !0;
                        });
                    },
                    navigate: function (e, t) {
                        if (!O.started)
                            return !1;
                        t && !0 !== t || (t = { trigger: !!t });
                        var n = this.root + (e = this.getFragment(e || ''));
                        if (e = e.replace(A, ''), this.fragment !== e) {
                            if ('' === (this.fragment = e) && '/' !== n && (n = n.slice(0, -1)), this._hasPushState)
                                this.history[t.replace ? 'replaceState' : 'pushState']({}, document.title, n);
                            else {
                                if (!this._wantsHashChange)
                                    return this.location.assign(n);
                                this._updateHash(this.location, e, t.replace), this.iframe && e !== this.getFragment(this.getHash(this.iframe)) && (t.replace || this.iframe.document.open(containerComponent).close(), this._updateHash(this.iframe.location, e, t.replace));
                            }
                            return t.trigger ? this.loadUrl(e) : void 0;
                        }
                    },
                    _updateHash: function (e, t, n) {
                        if (n) {
                            var i = e.href.replace(/(javascript:|#).*$/, '');
                            e.replace(i + '#' + t);
                        } else
                            e.hash = '#' + t;
                    }
                }), a.history = new O();
                E.extend = f.extend = b.extend = v.extend = O.extend = function (e, t) {
                    var n, i = this;
                    n = e && x.has(e, 'constructor') ? e.constructor : function () {
                        return i.apply(this, arguments);
                    }, x.extend(n, i, t);
                    var r = function () {
                        this.constructor = n;
                    };
                    return r.prototype = i.prototype, n.prototype = new r(), e && x.extend(n.prototype, e), n.__super__ = i.prototype, n;
                };
                var V = function () {
                        throw new Error('A "url" property or function must be specified');
                    }, K = function (t, n) {
                        var i = n.error;
                        n.error = function (e) {
                            i && i(t, e, n), t.trigger('error', t, e, n);
                        };
                    };
                return a;
            }), CKFinder.define('CKFinder/Config', [], function () {
                'use strict';
                return {
                    id: '',
                    configPath: 'config.js',
                    language: '',
                    languages: {
                        az: 1,
                        bg: 1,
                        bs: 1,
                        ca: 1,
                        cs: 1,
                        cy: 1,
                        da: 1,
                        de: 1,
                        'de-ch': 1,
                        el: 1,
                        en: 1,
                        eo: 1,
                        es: 1,
                        'es-mx': 1,
                        et: 1,
                        eu: 1,
                        fa: 1,
                        fi: 1,
                        fr: 1,
                        gu: 1,
                        he: 1,
                        hi: 1,
                        hr: 1,
                        hu: 1,
                        it: 1,
                        ja: 1,
                        ko: 1,
                        ku: 1,
                        lt: 1,
                        lv: 1,
                        nb: 1,
                        nl: 1,
                        nn: 1,
                        no: 1,
                        pl: 1,
                        'pt-br': 1,
                        ro: 1,
                        ru: 1,
                        sk: 1,
                        sl: 1,
                        sr: 1,
                        sv: 1,
                        tr: 1,
                        uk: 1,
                        'uz-cyrl': 1,
                        'uz-latn': 1,
                        vi: 1,
                        'zh-cn': 1,
                        'zh-tw': 1
                    },
                    defaultLanguage: 'en',
                    removeModules: '',
                    plugins: '',
                    tabIndex: 0,
                    resourceType: null,
                    type: null,
                    startupPath: '',
                    startupFolderExpanded: !0,
                    readOnly: !1,
                    readOnlyExclude: '',
                    connectorPath: '',
                    connectorLanguage: 'php',
                    pass: '',
                    connectorInfo: '',
                    dialogMinWidth: '18em',
                    dialogMinHeight: '4em',
                    dialogFocusItem: !0,
                    dialogOverlaySwatch: !1,
                    loaderOverlaySwatch: !1,
                    width: '100%',
                    height: 400,
                    fileIcons: {
                        default: 'unknown.png',
                        folder: 'directory.png',
                        '7z': '7z.png',
                        accdb: 'access.png',
                        avi: 'video.png',
                        bmp: 'image.png',
                        css: 'css.png',
                        csv: 'csv.png',
                        doc: 'msword.png',
                        docx: 'msword.png',
                        flac: 'audio.png',
                        gif: 'image.png',
                        gz: 'tar.png',
                        htm: 'html.png',
                        html: 'html.png',
                        jpeg: 'image.png',
                        jpg: 'image.png',
                        js: 'javascript.png',
                        log: 'log.png',
                        mp3: 'audio.png',
                        mp4: 'video.png',
                        odg: 'draw.png',
                        odp: 'impress.png',
                        ods: 'calc.png',
                        odt: 'writer.png',
                        ogg: 'audio.png',
                        opus: 'audio.png',
                        pdf: 'pdf.png',
                        php: 'php.png',
                        png: 'image.png',
                        ppt: 'powerpoint.png',
                        pptx: 'powerpoint.png',
                        rar: 'rar.png',
                        README: 'readme.png',
                        rtf: 'rtf.png',
                        sql: 'sql.png',
                        tar: 'tar.png',
                        tiff: 'image.png',
                        txt: 'plain.png',
                        wav: 'audio.png',
                        weba: 'audio.png',
                        webm: 'video.png',
                        xls: 'excel.png',
                        xlsx: 'excel.png',
                        zip: 'zip.png'
                    },
                    fileIconsPath: 'skins/core/file-icons/',
                    fileIconsSizes: '256,128,64,48,32,22,16',
                    defaultDisplayFileName: !0,
                    defaultDisplayDate: !0,
                    defaultDisplayFileSize: !0,
                    defaultViewType: 'thumbnails',
                    defaultSortBy: 'name',
                    defaultSortByOrder: 'asc',
                    listViewIconSize: 22,
                    compactViewIconSize: 22,
                    thumbnailDelay: 50,
                    thumbnailDefaultSize: 150,
                    thumbnailMinSize: null,
                    thumbnailMaxSize: null,
                    thumbnailSizeStep: 2,
                    thumbnailClasses: {
                        120: 'small',
                        180: 'medium'
                    },
                    chooseFiles: !1,
                    chooseFilesOnDblClick: !0,
                    chooseFilesClosePopup: !0,
                    resizeImages: !0,
                    rememberLastFolder: !0,
                    skin: 'neko',
                    swatch: 'a',
                    displayFoldersPanel: !0,
                    jquery: 'libs/jquery.js',
                    jqueryMobile: 'libs/jquery.mobile.js',
                    jqueryMobileStructureCSS: 'libs/jquery.mobile.structure.css',
                    jqueryMobileIconsCSS: '',
                    iconsCSS: '',
                    themeCSS: '',
                    coreCSS: 'skins/core/ckfinder.css',
                    primaryPanelWidth: '',
                    secondaryPanelWidth: '',
                    cors: !1,
                    corsSelect: !1,
                    editImageMode: '',
                    editImageAdjustments: [
                        'brightness',
                        'contrast',
                        'exposure',
                        'saturation',
                        'sepia',
                        'sharpen'
                    ],
                    editImagePresets: [
                        'clarity',
                        'herMajesty',
                        'nostalgia',
                        'pinhole',
                        'sunrise',
                        'vintage'
                    ],
                    autoCloseHTML5Upload: 5,
                    uiModeThreshold: 48
                };
            }), CKFinder.define('CKFinder/Event', [], function () {
                'use strict';
                function e() {
                }
                function d(e) {
                    var t = e.getPrivate && e.getPrivate() || e._ev || (e._ev = {});
                    return t.events || (t.events = {});
                }
                function f(e) {
                    this.name = e, this.listeners = [];
                }
                var c, S, h, g;
                return f.prototype = {
                    getListenerIndex: function (e) {
                        for (var t = 0, n = this.listeners; t < n.length; t++)
                            if (n[t].fn === e)
                                return t;
                        return -1;
                    }
                }, e.prototype = {
                    on: function (o, s, a, l, e) {
                        function t(e, t, n, i) {
                            var r = {
                                name: o,
                                sender: this,
                                finder: e,
                                data: t,
                                listenerData: l,
                                stop: n,
                                cancel: i,
                                removeListener: u
                            };
                            return !1 !== s.call(a, r) && r.data;
                        }
                        function u() {
                            c.removeListener(o, s);
                        }
                        var n, i, r = function (e) {
                                var t = d(this);
                                return t[e] || (t[e] = new f(e));
                            }.call(this, o), c = this;
                        if (r.getListenerIndex(s) < 0) {
                            for (n = r.listeners, a || (a = this), isNaN(e) && (e = 10), t.fn = s, t.priority = e, i = n.length - 1; 0 <= i; i--)
                                if (n[i].priority <= e)
                                    return n.splice(i + 1, 0, t), { removeListener: u };
                            n.unshift(t);
                        }
                        return { removeListener: u };
                    },
                    once: function () {
                        var t = arguments[1];
                        return arguments[1] = function (e) {
                            return e.removeListener(), t.apply(this, arguments);
                        }, this.on.apply(this, arguments);
                    },
                    fire: (c = 0, S = function () {
                        c = 1;
                    }, h = 0, g = function () {
                        h = 1;
                    }, function (e, t, n) {
                        var i, r, o, s, a = d(this)[e], l = c, u = h;
                        if (h = c = 0, a && (o = a.listeners).length)
                            for (o = o.slice(0), i = 0; i < o.length; i++) {
                                if (a.errorProof)
                                    try {
                                        s = o[i].call(this, n, t, S, g);
                                    } catch (e) {
                                    }
                                else
                                    s = o[i].call(this, n, t, S, g);
                                if (!1 === s ? h = 1 : void 0 !== s && (t = s), c || h)
                                    break;
                            }
                        return r = !h && (void 0 === t || t), c = l, h = u, r;
                    }),
                    fireOnce: function (e, t, n) {
                        var i = this.fire(e, t, n);
                        return delete d(this)[e], i;
                    },
                    removeListener: function (e, t) {
                        var n, i = d(this)[e];
                        i && 0 <= (n = i.getListenerIndex(t)) && i.listeners.splice(n, 1);
                    },
                    removeAllListeners: function () {
                        var e, t = d(this);
                        for (e in t)
                            delete t[e];
                    },
                    hasListeners: function (e) {
                        var t = d(this)[e];
                        return t && 0 < t.listeners.length;
                    }
                }, e;
            }), CKFinder.define('CKFinder/Util/Util', ['underscore'], function (u) {
                'use strict';
                return {
                    url: function (e) {
                        return /^(http(s)?:)?\/\/.+/i.test(e) ? e : CKFinder.require.toUrl(e);
                    },
                    asyncArrayTraverse: function (i, r, e) {
                        var o, s = 0;
                        e || (e = null), r = r.bind(e), (o = function () {
                            for (var e, t = 0, n = new Date().getTime();;) {
                                if (s >= i.length)
                                    return;
                                if (!(e = i.item ? i.item(s) : i[s]) || !1 === r(e, s, i))
                                    return;
                                if (s += 1, 10 <= (t += 1) && 50 < new Date().getTime() - n)
                                    return setTimeout(o, 50);
                            }
                        }).call();
                    },
                    isPopup: function () {
                        return window !== window.parent && !!window.opener || window.isCKFinderPopup;
                    },
                    isModal: function () {
                        return window.parent.CKFinder && window.parent.CKFinder.modal && window.parent.CKFinder.modal('visible');
                    },
                    isWidget: function () {
                        return window !== window.parent && !window.opener;
                    },
                    toGet: function (n) {
                        var i = '';
                        return u.forOwn(n, function (e, t) {
                            i += '&' + encodeURIComponent(t) + '=' + encodeURIComponent(n[t]);
                        }), i.substring(1);
                    },
                    cssEntities: function (e) {
                        return e.replace(/\(/g, '&#92;&#40;').replace(/\)/g, '&#92;&#41;');
                    },
                    jsCssEntities: function (e) {
                        return e.replace(/\(/g, '%28').replace(/\)/g, '%29');
                    },
                    getUrlParams: function () {
                        var i = {};
                        return window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (e, t, n) {
                            i[t] = n;
                        }), i;
                    },
                    parentFolder: function (e) {
                        return e.split('/').slice(0, -1).join('/');
                    },
                    isShortcut: function (e, t) {
                        var n = t.split('+'), i = !!e.ctrlKey || !!e.metaKey, r = !!e.altKey, o = !!e.shiftKey, s = i == !!u.includes(n, 'ctrl'), a = r == !!u.includes(n, 'alt'), l = o == !!u.includes(n, 'shift');
                        return s && a && l;
                    },
                    randomString: function (e, t) {
                        t || (t = 'abcdefghijklmnopqrstuvwxyz0123456789');
                        for (var n = '', i = 0; i < e; i++)
                            n += t.charAt(Math.floor(Math.random() * t.length));
                        return n;
                    },
                    escapeHtml: function (e) {
                        var t = {
                            '&': '&amp;',
                            '<': '&lt;',
                            '>': '&gt;',
                            '"': '&quot;',
                            '\'': '&#039;'
                        };
                        return e.replace(/[&<>"']/g, function (e) {
                            return t[e];
                        });
                    }
                };
            }), CKFinder.define('CKFinder/Util/Lang', [
                'underscore',
                'jquery',
                'ckf_global'
            ], function (s, t, a) {
                'use strict';
                var l = {
                    loadPluginLang: function (e, t, n, i) {
                        var r, o = n.lang.split(',');
                        if (0 <= s.indexOf(o, e))
                            r = e;
                        else {
                            if (!(0 <= s.indexOf(o, t)))
                                return void i({});
                            r = t;
                        }
                        a.require(['text!' + a.require.toUrl(n.path) + 'lang/' + r + '.json'], function (e) {
                            var t;
                            try {
                                t = JSON.parse(e);
                            } catch (e) {
                                t = {};
                            }
                            i(t);
                        }, function () {
                            i({});
                        });
                    },
                    init: function (e) {
                        var o = new t.Deferred();
                        return function (t, e, n, i) {
                            t || (t = l.getSupportedLanguage(navigator.userLanguage || navigator.language, n));
                            n[e] || (e = 'en');
                            var r, o = 'lang/' + e + '.json';
                            n[t] && (r = 'lang/' + t + '.json');
                            r || (r = o);
                            a.require(['text!' + a.require.toUrl(r) + '?ckfver=596166831'], function (e) {
                                i(t, JSON.parse(e));
                            }, function () {
                                i(t);
                            });
                        }(e.language, e.defaultLanguage, e.languages, function (e, t) {
                            if (t) {
                                var n, i, r = t;
                                r.formatDate = (n = '[\'' + r.units.dateAmPm.join('\',\'') + '\']', i = (i = '\'' + (i = r.units.dateFormat.replace(/dd|mm|yyyy|hh|HH|MM|aa|d|m|yy|h|H|M|a/g, function (e) {
                                    var t = {
                                        d: 'day.replace(/^0/,\'\')',
                                        dd: 'day',
                                        m: 'month.replace(/^0/,\'\')',
                                        mm: 'month',
                                        yy: 'year.substr(2)',
                                        yyyy: 'year',
                                        H: 'hour.replace(/^0/,\'\')',
                                        HH: 'hour',
                                        h: 'parseInt( hour ) === 0 && parseInt( minute ) === 0 ?' + ' \'12\' ' + ':' + ' ( ( hour <= 12 ? hour : ( ( hour - 12 ) + 100 ).toString().substr( 1 ) ).replace(/^0/,\'\') )',
                                        hh: 'parseInt( hour ) === 0 && parseInt( minute ) === 0 ?' + ' \'12\' ' + ':' + ' ( ( hour <= 12 ? hour : ( ( hour - 12 ) + 100 ).toString().substr( 1 ) ) )',
                                        M: 'minute.replace(/^0/,\'\')',
                                        MM: 'minute',
                                        a: n + '[ hour < 12 ? 0 : 1 ].charAt(0)',
                                        aa: n + '[ hour < 12 ? 0 : 1 ]'
                                    };
                                    return '\',' + t[e] + ',\'';
                                })) + '\'').replace(/('',)|,''$/g, ''), new Function('year', 'month', 'day', 'hour', 'minute', 'return [' + i + '].join("");')), r.formatDateString = function (e) {
                                    return e = e || '', s.isNumber(e) && (e = e.toString()), e.length < 12 ? '' : r.formatDate(e.substr(0, 4), e.substr(4, 2), e.substr(6, 2), e.substr(8, 2), e.substr(10, 2));
                                }, r.formatFileSize = function (e) {
                                    var t = 1024, n = t * t, i = n * t;
                                    return i <= e ? r.units.gb.replace('{size}', (e / i).toFixed(1)) : n <= e ? r.units.mb.replace('{size}', (e / n).toFixed(1)) : t <= e ? r.units.kb.replace('{size}', (e / t).toFixed(1)) : '{size} B'.replace('{size}', e);
                                }, r.formatTransfer = function (e) {
                                    return r.units.sizePerSecond.replace('{size}', r.formatFileSize(parseInt(e)));
                                }, r.formatFilesCount = function (e) {
                                    return r.files[1 === e ? 'countOne' : 'countMany'].replace('{count}', e);
                                }, o.resolve(r);
                            } else
                                o.reject();
                        }), o.promise();
                    },
                    getSupportedLanguage: function (e, t) {
                        if (!e)
                            return !1;
                        var n = e.toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/), i = n[1], r = n[2];
                        return t[i + '-' + r] ? i = i + '-' + r : t[i] || (i = !1), i;
                    }
                };
                return l;
            }), CKFinder.define('CKFinder/Util/KeyCode', {
                up: 38,
                down: 40,
                left: 37,
                right: 39,
                backspace: 8,
                tab: 9,
                enter: 13,
                space: 32,
                escape: 27,
                end: 35,
                home: 36,
                delete: 46,
                menu: 93,
                slash: 191,
                a: 65,
                r: 82,
                u: 85,
                f2: 113,
                f5: 116,
                f7: 118,
                f8: 119,
                f9: 120,
                f10: 121
            }), CKFinder.define('CKFinder/UI/UIHacks', [
                'underscore',
                'jquery',
                'CKFinder/Util/KeyCode',
                'ckf-jquery-mobile'
            ], function (a, l, u) {
                'use strict';
                return {
                    init: function (n) {
                        !function () {
                            var e = ['transition'];
                            a.forEach(e, function (e) {
                                (function (e) {
                                    var t = (document.body || document.documentElement).style;
                                    if ('string' == typeof t[e])
                                        return !0;
                                    var n = [
                                        'Moz',
                                        'webkit',
                                        'Webkit',
                                        'Khtml',
                                        'O',
                                        'ms'
                                    ];
                                    e = e.charAt(0).toUpperCase() + e.substr(1);
                                    for (var i = 0; i < n.length; i++)
                                        if ('string' == typeof t[n[i] + e])
                                            return !0;
                                    return !1;
                                }(e) && l('body').addClass('ckf-feature-css-' + e));
                            });
                        }(), function (t) {
                            var e = void 0 === document.documentMode, n = window.chrome;
                            e && !n ? l(window).on('focusin', function (e) {
                                e.target === window && setTimeout(function () {
                                    t.fire('ui:focus', null, t);
                                }, 300);
                            }).on('focusout', function (e) {
                                e.target === window && t.fire('ui:blur', null, t);
                            }) : window.addEventListener ? (window.addEventListener('focus', function () {
                                setTimeout(function () {
                                    t.fire('ui:focus', null, t);
                                }, 300);
                            }, !1), window.addEventListener('blur', function () {
                                t.fire('ui:blur', null, t);
                            }, !1)) : (window.attachEvent('focus', function () {
                                setTimeout(function () {
                                    t.fire('ui:focus', null, t);
                                }, 300);
                            }), window.attachEvent('blur', function () {
                                t.fire('ui:blur', null, t);
                            }));
                        }(n);
                        var e, t, i, r = l('body');
                        r.attr({
                            'data-theme': n.config.swatch,
                            role: 'application'
                        }), -1 < navigator.userAgent.toLowerCase().indexOf('trident/') && r.addClass('ckf-ie'), l('html').attr({
                            dir: n.lang.dir,
                            lang: n.lang.langCode
                        }), n.lang.dir !== 'ltr' && r.addClass('ckf-rtl'), n.setHandler('ui:getMode', (i = window.matchMedia ? function () {
                            return void 0 === t && (t = '(max-width: ' + n.config.uiModeThreshold + 'em)'), window.matchMedia(t).matches;
                        } : function () {
                            return void 0 === e && (e = parseFloat(l('body').css('font-size')) * n.config.uiModeThreshold), window.innerWidth <= e;
                        }, function () {
                            return i.call(this) ? 'mobile' : 'desktop';
                        }));
                        var o = n.request('ui:getMode');
                        if (c(r, null, o), l(window).on('throttledresize', function () {
                                var e = n.request('ui:getMode'), t = o !== e;
                                t && (c(r, o, e), o = e), n.fire('ui:resize', {
                                    modeChanged: t,
                                    mode: o
                                }, n);
                            }), navigator.maxTouchPoints) {
                            var s = l.event.special.swipe.start;
                            l.event.special.swipe.start = function (e) {
                                var t = s(e);
                                return t.ckfOrigin = e.originalEvent.type, t;
                            }, l(window).on('swipeleft', function (e) {
                                0 !== e.swipestart.ckfOrigin.indexOf('mouse') && n.fire('ui:swipeleft', { evt: e }, n);
                            }), l(window).on('swiperight', function (e) {
                                0 !== e.swipestart.ckfOrigin.indexOf('mouse') && n.fire('ui:swiperight', { evt: e }, n);
                            });
                        }
                        n.setHandler('closePopup', function () {
                            n.util.isPopup() ? window.close() : window.top && window.top.CKFinder && window.top.CKFinder.modal && window.top.CKFinder.modal('close');
                        }), l(document).on('selectstart', '[draggable]', function (e) {
                            e.preventDefault(), e.dragDrop && e.dragDrop();
                        }), n.once('app:ready', function (e) {
                            e.finder.request('key:listen', { key: u.space }), e.finder.on('keydown:' + u.space, function (e) {
                                e.data.evt.preventDefault();
                            });
                        });
                    }
                };
                function c(e, t, n) {
                    t && e.removeClass('ckf-ui-mode-' + t), e.addClass('ckf-ui-mode-' + n);
                }
            }), CKFinder.define('CKFinder/Plugins/Plugin', [
                'underscore',
                'jquery',
                'backbone'
            ], function (e, t, n) {
                'use strict';
                function i() {
                }
                return i.extend = n.Model.extend, e.extend(i.prototype, {
                    addCss: function (e) {
                        t('<style>').text(e).appendTo('head');
                    },
                    init: function () {
                    }
                }), i;
            }), CKFinder.define('CKFinder/Plugins/Plugins', [
                'underscore',
                'jquery',
                'backbone',
                'CKFinder/Plugins/Plugin',
                'CKFinder/Util/Lang'
            ], function (r, e, t, o, s) {
                'use strict';
                return t.Collection.extend({
                    load: function (i) {
                        var n = [], e = i.config.plugins;
                        function t() {
                            var e = r.countBy(n, 'loaded');
                            e.undefined || (i.fire('plugin:allReady', null, i), e.false && r.forEach(r.where(n, { loaded: !1 }), function (e) {
                                i.fire('plugin:loadError', {
                                    configKey: e.config,
                                    url: e.url
                                });
                            }));
                        }
                        e.length < 1 ? i.fire('plugin:allReady', null, i) : (r.isString(e) && (e = e.split(',')), r.forEach(e, function (e) {
                            var t = e;
                            -1 === e.search('/') && (t = CKFinder.require.toUrl('plugins/' + e + '/' + e + '.js')), n.push({
                                config: e,
                                url: t,
                                loaded: void 0
                            });
                        }), i.on('plugin:ready', function () {
                            t();
                        }), r.forEach(n, function (n) {
                            CKFinder.require([n.url], function (e) {
                                var t = o.extend(e);
                                !function (t, e, n) {
                                    if (e.path = t.util.parentFolder(n.url) + '/', !e.lang)
                                        return i();
                                    function i() {
                                        e.init(t), t._plugins.add(e), n.loaded = !0, t.fire('plugin:ready', { plugin: e }, t);
                                    }
                                    s.loadPluginLang(t.lang.langCode, t.config.defaultLanguage, e, function (e) {
                                        e.name && e.values && (t.lang[e.name] = e.values), i();
                                    });
                                }(i, new t(), n);
                            }, function () {
                                n.loaded = !1, t();
                            });
                        }));
                    }
                });
            }), CKFinder.define('CKFinder/Modules/CsrfTokenManager/CsrfTokenManager', [], function () {
                'use strict';
                var t = 'ckCsrfToken', n = 40, i = null;
                function r() {
                    if (i)
                        return i;
                    var e = function (e) {
                        e = e.toLowerCase();
                        for (var t = window.document.cookie.split(';'), n = 0; n < t.length; n++) {
                            var i = t[n].split('='), r = decodeURIComponent(i[0].trim().toLowerCase()), o = 1 < i.length ? i[1] : '';
                            if (r === e)
                                return decodeURIComponent(o);
                        }
                        return '';
                    }(t);
                    return e.length != n && (e = function (e) {
                        var t = 'abcdefghijklmnopqrstuvwxyz0123456789', n = [], i = '';
                        if (window.crypto && window.crypto.getRandomValues)
                            n = new Uint8Array(e), window.crypto.getRandomValues(n);
                        else
                            for (var r = 0; r < e; r++)
                                n.push(Math.floor(256 * Math.random()));
                        for (var o = 0; o < n.length; o++) {
                            var s = t.charAt(n[o] % t.length);
                            i += 0.5 < Math.random() ? s.toUpperCase() : s;
                        }
                        return i;
                    }(n), function (e, t) {
                        window.document.cookie = encodeURIComponent(e) + '=' + encodeURIComponent(t) + ';path=/';
                    }(t, e)), e;
                }
                return function (e) {
                    e.setHandler('csrf:getToken', r), e.setHandler('internal:csrf:setParentWindowToken', function (e) {
                        i = e.token;
                    });
                };
            }), CKFinder.define('CKFinder/Modules/Connector/Transport', [
                'jquery',
                'underscore'
            ], function (i, r) {
                'use strict';
                var o = function () {
                };
                function e(e, t) {
                    this.url = e, this.config = t, this.onDone = o, this.onFail = o, this.request = null;
                }
                return e.prototype.done = function (e) {
                    this.onDone = e;
                }, e.prototype.fail = function (e) {
                    this.onFail = e;
                }, e.prototype.send = function () {
                    window.XMLHttpRequest ? function (e) {
                        var t, n;
                        t = new XMLHttpRequest(), n = null, t.open(e.config.type, e.url, !0), t.onreadystatechange = function () {
                            4 === this.readyState && e.onDone(this.responseText);
                        }, t.onerror = function () {
                            e.onFail();
                        }, r.isFunction(e.config.uploadProgress) && t.upload && (t.upload.onprogress = e.config.uploadProgress);
                        r.isFunction(e.config.uploadEnd) && t.upload && (t.upload.onload = e.config.uploadEnd);
                        e.config.type === 'post' && (n = i.param(r.extend(e.config.post)), t.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'));
                        t.send(n), e.request = t;
                    }(this) : function (e) {
                        var t, n;
                        t = new XDomainRequest(), n = null, e.config.type === 'post' && (n = i.param(e.config.post));
                        t.open(containerComponent), t.onload = function () {
                            e.onDone(this.responseText);
                        }, t.onprogress = o, t.ontimeout = o, t.onerror = function () {
                            e.onFail();
                        }, e.request = t, setTimeout(function () {
                            t.send(n);
                        }, 0);
                    }(this);
                }, e.prototype.abort = function () {
                    this.request && this.request.abort();
                }, e;
            }), CKFinder.define('CKFinder/Modules/Connector/Connector', [
                'underscore',
                'jquery',
                'ckf_global',
                'CKFinder/Modules/Connector/Transport'
            ], function (c, r, i, d) {
                'use strict';
                function f(e, t, n) {
                    var i = this.finder, r = i.config, o = {
                            command: e,
                            lang: i.lang.langCode,
                            langCode: i.lang.langCode
                        }, s = r.connectorInfo;
                    if (n && (o.type = n.get('resourceType'), o.currentFolder = n.getPath(), o.hash = n.getHash()), r.pass.length) {
                        var a = r.pass.split(',');
                        c.forEach(a, function (e) {
                            o[e] = i.config[e];
                        });
                    }
                    r.id && (o.id = r.id);
                    var l = this.baseUrl + '?' + i.util.toGet(c.extend(o, t));
                    return 0 < s.length && (l += '&' + s), l;
                }
                function o(o) {
                    var s = this.finder, a = o.name, l = r.Deferred(), u = {
                            name: a,
                            response: { error: { number: 109 } }
                        };
                    if (c.has(o, 'context') && (u.context = o.context), s.fire('command:before', o, s) && s.fire('command:before:' + a, o, s)) {
                        var e = c.extend({
                                type: 'get',
                                post: {}
                            }, o), t = {};
                        t.type = e.type, e.type === 'post' && (e.post.ckCsrfToken = s.request('csrf:getToken'), t.post = e.sendPostAsJson ? { jsonData: JSON.stringify(e.post) } : e.post), e.uploadProgress && (t.uploadProgress = e.uploadProgress), e.uploadEnd && (t.uploadEnd = e.uploadEnd);
                        var n = f.call(this, a, o.params, o.folder), i = new d(n, t);
                        return i.done(function (t) {
                            var e, n, i = !1;
                            try {
                                n = JSON.parse(t), e = {
                                    name: a,
                                    response: n,
                                    rawResponse: t
                                }, i = !0;
                            } catch (e) {
                                var r = u;
                                return r.response.error.message = t, h(a, r, s), void l.reject(r);
                            }
                            i && l.resolve(n), c.has(o, 'context') && (e.context = o.context), !n || n.error ? s.fire('command:error:' + a, e, s) && (o.context && o.context.silentConnectorErrors || s.fire('command:error', e, s)) : s.fire('command:ok:' + a, e, s), s.fire('command:after', e, s), s.fire('command:after:' + a, e, s);
                        }), i.fail(function () {
                            h(a, u, s), l.reject(u);
                        }), i.send(), o.returnTransport ? i : l.promise();
                    }
                }
                function h(e, t, n) {
                    n.fire('command:error:' + e, t, n) && n.fire('command:error', t, n), n.fire('command:after', t, n), n.fire('command:after:' + e, t, n);
                }
                return function (e) {
                    var t = e.config;
                    function n(e) {
                        if (/^(http(s)?:)?\/\/.+/i.test(e))
                            return e;
                        0 !== e.indexOf('/') && (e = '/' + e);
                        var t = window.parent ? window.parent.location : window.location;
                        return t.protocol + '//' + t.host + e;
                    }
                    this.finder = e, (this.config = t).connectorPath ? this.baseUrl = n(t.connectorPath) : (this.baseUrl = i._connectors[i.connector], '/' !== this.baseUrl.charAt(0) && (this.baseUrl = i.require.toUrl('./' + this.baseUrl)), this.baseUrl = n(this.baseUrl)), e.setHandlers({
                        'command:send': {
                            callback: o,
                            context: this
                        },
                        'command:url': {
                            callback: function (e) {
                                return f.call(this, e.command, e.params, e.folder);
                            },
                            context: this
                        }
                    });
                };
            }), function (n, i) {
                if ('function' == typeof CKFinder.define && CKFinder.define.amd)
                    CKFinder.define('marionette', [
                        'backbone',
                        'underscore'
                    ], function (e, t) {
                        return n.Marionette = n.Mn = i(n, e, t);
                    });
                else if ('undefined' != typeof exports) {
                    var e = require('backbone'), t = require('underscore');
                    module.exports = i(n, e, t);
                } else
                    n.Marionette = n.Mn = i(n, n.Backbone, n._);
            }(this, function (e, s, f) {
                'use strict';
                var t, n, i, r, o, a, l, u, c, d, h, g, p, v, m, y, w, C;
                n = f, i = (t = s).ChildViewContainer, t.ChildViewContainer = function (e, i) {
                    var n = function (e) {
                        this._views = {}, this._indexByModel = {}, this._indexByCustom = {}, this._updateLength(), i.each(e, this.add, this);
                    };
                    i.extend(n.prototype, {
                        add: function (e, t) {
                            var n = e.cid;
                            return (this._views[n] = e).model && (this._indexByModel[e.model.cid] = n), t && (this._indexByCustom[t] = n), this._updateLength(), this;
                        },
                        findByModel: function (e) {
                            return this.findByModelCid(e.cid);
                        },
                        findByModelCid: function (e) {
                            var t = this._indexByModel[e];
                            return this.findByCid(t);
                        },
                        findByCustom: function (e) {
                            var t = this._indexByCustom[e];
                            return this.findByCid(t);
                        },
                        findByIndex: function (e) {
                            return i.values(this._views)[e];
                        },
                        findByCid: function (e) {
                            return this._views[e];
                        },
                        remove: function (e) {
                            var n = e.cid;
                            return e.model && delete this._indexByModel[e.model.cid], i.any(this._indexByCustom, function (e, t) {
                                if (e === n)
                                    return delete this._indexByCustom[t], !0;
                            }, this), delete this._views[n], this._updateLength(), this;
                        },
                        call: function (e) {
                            this.apply(e, i.tail(arguments));
                        },
                        apply: function (t, n) {
                            i.each(this._views, function (e) {
                                i.isFunction(e[t]) && e[t].apply(e, n || []);
                            });
                        },
                        _updateLength: function () {
                            this.length = i.size(this._views);
                        }
                    });
                    var t = [
                        'forEach',
                        'each',
                        'map',
                        'find',
                        'detect',
                        'filter',
                        'select',
                        'reject',
                        'every',
                        'all',
                        'some',
                        'any',
                        'include',
                        'contains',
                        'invoke',
                        'toArray',
                        'first',
                        'initial',
                        'rest',
                        'last',
                        'without',
                        'isEmpty',
                        'pluck',
                        'reduce'
                    ];
                    return i.each(t, function (t) {
                        n.prototype[t] = function () {
                            var e = [i.values(this._views)].concat(i.toArray(arguments));
                            return i[t].apply(i, e);
                        };
                    }), n;
                }(0, n), t.ChildViewContainer.VERSION = '0.1.11', t.ChildViewContainer.noConflict = function () {
                    return t.ChildViewContainer = i, this;
                }, t.ChildViewContainer, o = f, w = (r = s).Wreqr, C = r.Wreqr = {}, r.Wreqr.VERSION = '1.3.6', r.Wreqr.noConflict = function () {
                    return r.Wreqr = w, this;
                }, C.Handlers = (l = o, (u = function (e) {
                    this.options = e, this._wreqrHandlers = {}, l.isFunction(this.initialize) && this.initialize(e);
                }).extend = (a = r).Model.extend, l.extend(u.prototype, a.Events, {
                    setHandlers: function (e) {
                        l.each(e, function (e, t) {
                            var n = null;
                            l.isObject(e) && !l.isFunction(e) && (n = e.context, e = e.callback), this.setHandler(t, e, n);
                        }, this);
                    },
                    setHandler: function (e, t, n) {
                        var i = {
                            callback: t,
                            context: n
                        };
                        this._wreqrHandlers[e] = i, this.trigger('handler:add', e, t, n);
                    },
                    hasHandler: function (e) {
                        return !!this._wreqrHandlers[e];
                    },
                    getHandler: function (e) {
                        var t = this._wreqrHandlers[e];
                        if (t)
                            return function () {
                                return t.callback.apply(t.context, arguments);
                            };
                    },
                    removeHandler: function (e) {
                        delete this._wreqrHandlers[e];
                    },
                    removeAllHandlers: function () {
                        this._wreqrHandlers = {};
                    }
                }), u), C.CommandStorage = (c = function (e) {
                    this.options = e, this._commands = {}, o.isFunction(this.initialize) && this.initialize(e);
                }, o.extend(c.prototype, r.Events, {
                    getCommands: function (e) {
                        var t = this._commands[e];
                        return t || (t = {
                            command: e,
                            instances: []
                        }, this._commands[e] = t), t;
                    },
                    addCommand: function (e, t) {
                        this.getCommands(e).instances.push(t);
                    },
                    clearCommands: function (e) {
                        this.getCommands(e).instances = [];
                    }
                }), c), C.Commands = (h = o, (d = C).Handlers.extend({
                    storageType: d.CommandStorage,
                    constructor: function (e) {
                        this.options = e || {}, this._initializeStorage(this.options), this.on('handler:add', this._executeCommands, this), d.Handlers.prototype.constructor.apply(this, arguments);
                    },
                    execute: function (e) {
                        e = arguments[0];
                        var t = h.rest(arguments);
                        this.hasHandler(e) ? this.getHandler(e).apply(this, t) : this.storage.addCommand(e, t);
                    },
                    _executeCommands: function (e, t, n) {
                        var i = this.storage.getCommands(e);
                        h.each(i.instances, function (e) {
                            t.apply(n, e);
                        }), this.storage.clearCommands(e);
                    },
                    _initializeStorage: function (e) {
                        var t, n = e.storageType || this.storageType;
                        t = h.isFunction(n) ? new n() : n, this.storage = t;
                    }
                })), C.RequestResponse = (g = o, C.Handlers.extend({
                    request: function (e) {
                        if (this.hasHandler(e))
                            return this.getHandler(e).apply(this, g.rest(arguments));
                    }
                })), C.EventAggregator = (v = o, (m = function () {
                }).extend = (p = r).Model.extend, v.extend(m.prototype, p.Events), m), C.Channel = (y = function (e) {
                    this.vent = new r.Wreqr.EventAggregator(), this.reqres = new r.Wreqr.RequestResponse(), this.commands = new r.Wreqr.Commands(), this.channelName = e;
                }, o.extend(y.prototype, {
                    reset: function () {
                        return this.vent.off(), this.vent.stopListening(), this.reqres.removeAllHandlers(), this.commands.removeAllHandlers(), this;
                    },
                    connectEvents: function (e, t) {
                        return this._connect('vent', e, t), this;
                    },
                    connectCommands: function (e, t) {
                        return this._connect('commands', e, t), this;
                    },
                    connectRequests: function (e, t) {
                        return this._connect('reqres', e, t), this;
                    },
                    _connect: function (n, e, i) {
                        if (e) {
                            i = i || this;
                            var r = n === 'vent' ? 'on' : 'setHandler';
                            o.each(e, function (e, t) {
                                this[n][r](t, o.bind(e, i));
                            }, this);
                        }
                    }
                }), y), C.radio = function (n, o) {
                    var e = function () {
                        this._channels = {}, this.vent = {}, this.commands = {}, this.reqres = {}, this._proxyMethods();
                    };
                    o.extend(e.prototype, {
                        channel: function (e) {
                            if (!e)
                                throw new Error('Channel must receive a name');
                            return this._getChannel(e);
                        },
                        _getChannel: function (e) {
                            var t = this._channels[e];
                            return t || (t = new n.Channel(e), this._channels[e] = t), t;
                        },
                        _proxyMethods: function () {
                            o.each([
                                'vent',
                                'commands',
                                'reqres'
                            ], function (t) {
                                o.each(i[t], function (e) {
                                    this[t][e] = r(this, t, e);
                                }, this);
                            }, this);
                        }
                    });
                    var i = {
                            vent: [
                                'on',
                                'off',
                                'trigger',
                                'once',
                                'stopListening',
                                'listenTo',
                                'listenToOnce'
                            ],
                            commands: [
                                'execute',
                                'setHandler',
                                'setHandlers',
                                'removeHandler',
                                'removeAllHandlers'
                            ],
                            reqres: [
                                'request',
                                'setHandler',
                                'setHandlers',
                                'removeHandler',
                                'removeAllHandlers'
                            ]
                        }, r = function (n, i, r) {
                            return function (e) {
                                var t = n._getChannel(e)[i];
                                return t[r].apply(t, o.rest(arguments));
                            };
                        };
                    return new e();
                }(C, o), r.Wreqr;
                var b = e.Marionette, x = e.Mn, E = s.Marionette = {};
                E.VERSION = '2.4.7', E.noConflict = function () {
                    return e.Marionette = b, e.Mn = x, this;
                }, (s.Marionette = E).Deferred = s.$.Deferred, E.extend = s.Model.extend, E.isNodeAttached = function (e) {
                    return s.$.contains(document.documentElement, e);
                }, E.mergeOptions = function (e, t) {
                    e && f.extend(this, f.pick(e, t));
                }, E.getOption = function (e, t) {
                    if (e && t)
                        return e.options && void 0 !== e.options[t] ? e.options[t] : e[t];
                }, E.proxyGetOption = function (e) {
                    return E.getOption(this, e);
                }, E._getValue = function (e, t, n) {
                    return f.isFunction(e) && (e = n ? e.apply(t, n) : e.call(t)), e;
                }, E.normalizeMethods = function (e) {
                    return f.reduce(e, function (e, t, n) {
                        return f.isFunction(t) || (t = this[t]), t && (e[n] = t), e;
                    }, {}, this);
                }, E.normalizeUIString = function (e, t) {
                    return e.replace(/@ui\.[a-zA-Z-_$0-9]*/g, function (e) {
                        return t[e.slice(4)];
                    });
                }, E.normalizeUIKeys = function (e, i) {
                    return f.reduce(e, function (e, t, n) {
                        return e[E.normalizeUIString(n, i)] = t, e;
                    }, {});
                }, E.normalizeUIValues = function (t, i, r) {
                    return f.each(t, function (n, e) {
                        f.isString(n) ? t[e] = E.normalizeUIString(n, i) : f.isObject(n) && f.isArray(r) && (f.extend(n, E.normalizeUIValues(f.pick(n, r), i)), f.each(r, function (e) {
                            var t = n[e];
                            f.isString(t) && (n[e] = E.normalizeUIString(t, i));
                        }));
                    }), t;
                }, E.actAsCollection = function (e, n) {
                    var t = [
                        'forEach',
                        'each',
                        'map',
                        'find',
                        'detect',
                        'filter',
                        'select',
                        'reject',
                        'every',
                        'all',
                        'some',
                        'any',
                        'include',
                        'contains',
                        'invoke',
                        'toArray',
                        'first',
                        'initial',
                        'rest',
                        'last',
                        'without',
                        'isEmpty',
                        'pluck'
                    ];
                    f.each(t, function (t) {
                        e[t] = function () {
                            var e = [f.values(f.result(this, n))].concat(f.toArray(arguments));
                            return f[t].apply(f, e);
                        };
                    });
                };
                var F = E.deprecate = function (e, t) {
                    f.isObject(e) && (e = e.prev + ' is going to be removed in the future. ' + 'Please use ' + e.next + ' instead.' + (e.url ? ' See: ' + e.url : '')), void 0 !== t && t || F._cache[e] || (F._warn('Deprecation warning: ' + e), F._cache[e] = !0);
                };
                F._console = 'undefined' != typeof console ? console : {}, F._warn = function () {
                    return (F._console.warn || F._console.log || function () {
                    }).apply(F._console, arguments);
                }, F._cache = {}, E._triggerMethod = function () {
                    var s = /(^|:)(\w)/gi;
                    function a(e, t, n) {
                        return n.toUpperCase();
                    }
                    return function (e, t, n) {
                        var i = arguments.length < 3;
                        i && (t = (n = t)[0]);
                        var r, o = e['on' + t.replace(s, a)];
                        return f.isFunction(o) && (r = o.apply(e, i ? f.rest(n) : n)), f.isFunction(e.trigger) && (1 < i + n.length ? e.trigger.apply(e, i ? n : [t].concat(f.drop(n, 0))) : e.trigger(t)), r;
                    };
                }(), E.triggerMethod = function (e) {
                    return E._triggerMethod(this, arguments);
                }, E.triggerMethodOn = function (e) {
                    return (f.isFunction(e.triggerMethod) ? e.triggerMethod : E.triggerMethod).apply(e, f.rest(arguments));
                }, E.MonitorDOMRefresh = function (e) {
                    function t() {
                        e._isShown && e._isRendered && E.isNodeAttached(e.el) && E.triggerMethodOn(e, 'dom:refresh', e);
                    }
                    e._isDomRefreshMonitored || (e._isDomRefreshMonitored = !0, e.on({
                        show: function () {
                            e._isShown = !0, t();
                        },
                        render: function () {
                            e._isRendered = !0, t();
                        }
                    }));
                }, function (s) {
                    function i(n, i, r, e) {
                        var t = e.split(/\s+/);
                        f.each(t, function (e) {
                            var t = n[e];
                            if (!t)
                                throw new s.Error('Method "' + e + '" was configured as an event handler, but does not exist.');
                            n.listenTo(i, r, t);
                        });
                    }
                    function r(e, t, n, i) {
                        e.listenTo(t, n, i);
                    }
                    function o(n, i, r, e) {
                        var t = e.split(/\s+/);
                        f.each(t, function (e) {
                            var t = n[e];
                            n.stopListening(i, r, t);
                        });
                    }
                    function a(e, t, n, i) {
                        e.stopListening(t, n, i);
                    }
                    function l(n, i, e, r, o) {
                        if (i && e) {
                            if (!f.isObject(e))
                                throw new s.Error({
                                    message: 'Bindings must be an object or function.',
                                    url: 'marionette.functions.html#marionettebindentityevents'
                                });
                            e = s._getValue(e, n), f.each(e, function (e, t) {
                                f.isFunction(e) ? r(n, i, t, e) : o(n, i, t, e);
                            });
                        }
                    }
                    s.bindEntityEvents = function (e, t, n) {
                        l(e, t, n, r, i);
                    }, s.unbindEntityEvents = function (e, t, n) {
                        l(e, t, n, a, o);
                    }, s.proxyBindEntityEvents = function (e, t) {
                        return s.bindEntityEvents(this, e, t);
                    }, s.proxyUnbindEntityEvents = function (e, t) {
                        return s.unbindEntityEvents(this, e, t);
                    };
                }(E);
                var _ = [
                    'description',
                    'fileName',
                    'lineNumber',
                    'name',
                    'message',
                    'number'
                ];
                return E.Error = E.extend.call(Error, {
                    urlRoot: 'http://marionettejs.com/docs/v' + E.VERSION + '/',
                    constructor: function (e, t) {
                        f.isObject(e) ? e = (t = e).message : t || (t = {});
                        var n = Error.call(this, e);
                        f.extend(this, f.pick(n, _), f.pick(t, _)), this.captureStackTrace(), t.url && (this.url = this.urlRoot + t.url);
                    },
                    captureStackTrace: function () {
                        Error.captureStackTrace && Error.captureStackTrace(this, E.Error);
                    },
                    toString: function () {
                        return this.name + ': ' + this.message + (this.url ? ' See: ' + this.url : '');
                    }
                }), E.Error.extend = E.extend, E.Callbacks = function () {
                    this._deferred = E.Deferred(), this._callbacks = [];
                }, f.extend(E.Callbacks.prototype, {
                    add: function (t, n) {
                        var e = f.result(this._deferred, 'promise');
                        this._callbacks.push({
                            cb: t,
                            ctx: n
                        }), e.then(function (e) {
                            n && (e.context = n), t.call(e.context, e.options);
                        });
                    },
                    run: function (e, t) {
                        this._deferred.resolve({
                            options: e,
                            context: t
                        });
                    },
                    reset: function () {
                        var e = this._callbacks;
                        this._deferred = E.Deferred(), this._callbacks = [], f.each(e, function (e) {
                            this.add(e.cb, e.ctx);
                        }, this);
                    }
                }), E.Controller = function (e) {
                    this.options = e || {}, f.isFunction(this.initialize) && this.initialize(this.options);
                }, E.Controller.extend = E.extend, f.extend(E.Controller.prototype, s.Events, {
                    destroy: function () {
                        return E._triggerMethod(this, 'before:destroy', arguments), E._triggerMethod(this, 'destroy', arguments), this.stopListening(), this.off(), this;
                    },
                    triggerMethod: E.triggerMethod,
                    mergeOptions: E.mergeOptions,
                    getOption: E.proxyGetOption
                }), E.Object = function (e) {
                    this.options = f.extend({}, f.result(this, 'options'), e), this.initialize.apply(this, arguments);
                }, E.Object.extend = E.extend, f.extend(E.Object.prototype, s.Events, {
                    initialize: function () {
                    },
                    destroy: function (e) {
                        return e = e || {}, this.triggerMethod('before:destroy', e), this.triggerMethod('destroy', e), this.stopListening(), this;
                    },
                    triggerMethod: E.triggerMethod,
                    mergeOptions: E.mergeOptions,
                    getOption: E.proxyGetOption,
                    bindEntityEvents: E.proxyBindEntityEvents,
                    unbindEntityEvents: E.proxyUnbindEntityEvents
                }), E.Region = E.Object.extend({
                    constructor: function (e) {
                        if (this.options = e || {}, this.el = this.getOption('el'), this.el = this.el instanceof s.$ ? this.el[0] : this.el, !this.el)
                            throw new E.Error({
                                name: 'NoElError',
                                message: 'An "el" must be specified for a region.'
                            });
                        this.$el = this.getEl(this.el), E.Object.call(this, e);
                    },
                    show: function (e, t) {
                        if (this._ensureElement()) {
                            this._ensureViewIsIntact(e), E.MonitorDOMRefresh(e);
                            var n = t || {}, i = e !== this.currentView, r = !!n.preventDestroy, o = !!n.forceShow, s = !!this.currentView, a = i && !r, l = i || o;
                            if (s && this.triggerMethod('before:swapOut', this.currentView, this, t), this.currentView && i && delete this.currentView._parent, a ? this.empty() : s && l && this.currentView.off('destroy', this.empty, this), l) {
                                e.once('destroy', this.empty, this), (e._parent = this)._renderView(e), s && this.triggerMethod('before:swap', e, this, t), this.triggerMethod('before:show', e, this, t), E.triggerMethodOn(e, 'before:show', e, this, t), s && this.triggerMethod('swapOut', this.currentView, this, t);
                                var u = E.isNodeAttached(this.el), c = [], d = f.extend({
                                        triggerBeforeAttach: this.triggerBeforeAttach,
                                        triggerAttach: this.triggerAttach
                                    }, n);
                                return u && d.triggerBeforeAttach && (c = this._displayedViews(e), this._triggerAttach(c, 'before:')), this.attachHtml(e), this.currentView = e, u && d.triggerAttach && (c = this._displayedViews(e), this._triggerAttach(c)), s && this.triggerMethod('swap', e, this, t), this.triggerMethod('show', e, this, t), E.triggerMethodOn(e, 'show', e, this, t), this;
                            }
                            return this;
                        }
                    },
                    triggerBeforeAttach: !0,
                    triggerAttach: !0,
                    _triggerAttach: function (e, t) {
                        var n = (t || '') + 'attach';
                        f.each(e, function (e) {
                            E.triggerMethodOn(e, n, e, this);
                        }, this);
                    },
                    _displayedViews: function (e) {
                        return f.union([e], f.result(e, '_getNestedViews') || []);
                    },
                    _renderView: function (e) {
                        e.supportsRenderLifecycle || E.triggerMethodOn(e, 'before:render', e), e.render(), e.supportsRenderLifecycle || E.triggerMethodOn(e, 'render', e);
                    },
                    _ensureElement: function () {
                        if (f.isObject(this.el) || (this.$el = this.getEl(this.el), this.el = this.$el[0]), this.$el && 0 !== this.$el.length)
                            return !0;
                        if (this.getOption('allowMissingEl'))
                            return !1;
                        throw new E.Error('An "el" ' + this.$el.selector + ' must exist in DOM');
                    },
                    _ensureViewIsIntact: function (e) {
                        if (!e)
                            throw new E.Error({
                                name: 'ViewNotValid',
                                message: 'The view passed is undefined and therefore invalid. You must pass a view instance to show.'
                            });
                        if (e.isDestroyed)
                            throw new E.Error({
                                name: 'ViewDestroyedError',
                                message: 'View (cid: "' + e.cid + '") has already been destroyed and cannot be used.'
                            });
                    },
                    getEl: function (e) {
                        return s.$(e, E._getValue(this.options.parentEl, this));
                    },
                    attachHtml: function (e) {
                        this.$el.contents().detach(), this.el.appendChild(e.el);
                    },
                    empty: function (e) {
                        var t = this.currentView, n = !!(e || {}).preventDestroy;
                        return t && (t.off('destroy', this.empty, this), this.triggerMethod('before:empty', t), n || this._destroyView(), this.triggerMethod('empty', t), delete this.currentView, n && this.$el.contents().detach()), this;
                    },
                    _destroyView: function () {
                        var e = this.currentView;
                        e.isDestroyed || (e.supportsDestroyLifecycle || E.triggerMethodOn(e, 'before:destroy', e), e.destroy ? e.destroy() : (e.remove(), e.isDestroyed = !0), e.supportsDestroyLifecycle || E.triggerMethodOn(e, 'destroy', e));
                    },
                    attachView: function (e) {
                        return this.currentView && delete this.currentView._parent, (e._parent = this).currentView = e, this;
                    },
                    hasView: function () {
                        return !!this.currentView;
                    },
                    reset: function () {
                        return this.empty(), this.$el && (this.el = this.$el.selector), delete this.$el, this;
                    }
                }, {
                    buildRegion: function (e, t) {
                        if (f.isString(e))
                            return this._buildRegionFromSelector(e, t);
                        if (e.selector || e.el || e.regionClass)
                            return this._buildRegionFromObject(e, t);
                        if (f.isFunction(e))
                            return this._buildRegionFromRegionClass(e);
                        throw new E.Error({
                            message: 'Improper region configuration type.',
                            url: 'marionette.region.html#region-configuration-types'
                        });
                    },
                    _buildRegionFromSelector: function (e, t) {
                        return new t({ el: e });
                    },
                    _buildRegionFromObject: function (e, t) {
                        var n = e.regionClass || t, i = f.omit(e, 'selector', 'regionClass');
                        return e.selector && !i.el && (i.el = e.selector), new n(i);
                    },
                    _buildRegionFromRegionClass: function (e) {
                        return new e();
                    }
                }), E.RegionManager = E.Controller.extend({
                    constructor: function (e) {
                        this._regions = {}, this.length = 0, E.Controller.call(this, e), this.addRegions(this.getOption('regions'));
                    },
                    addRegions: function (e, i) {
                        return e = E._getValue(e, this, arguments), f.reduce(e, function (e, t, n) {
                            return f.isString(t) && (t = { selector: t }), t.selector && (t = f.defaults({}, t, i)), e[n] = this.addRegion(n, t), e;
                        }, {}, this);
                    },
                    addRegion: function (e, t) {
                        var n;
                        return n = t instanceof E.Region ? t : E.Region.buildRegion(t, E.Region), this.triggerMethod('before:add:region', e, n), (n._parent = this)._store(e, n), this.triggerMethod('add:region', e, n), n;
                    },
                    get: function (e) {
                        return this._regions[e];
                    },
                    getRegions: function () {
                        return f.clone(this._regions);
                    },
                    removeRegion: function (e) {
                        var t = this._regions[e];
                        return this._remove(e, t), t;
                    },
                    removeRegions: function () {
                        var e = this.getRegions();
                        return f.each(this._regions, function (e, t) {
                            this._remove(t, e);
                        }, this), e;
                    },
                    emptyRegions: function () {
                        var e = this.getRegions();
                        return f.invoke(e, 'empty'), e;
                    },
                    destroy: function () {
                        return this.removeRegions(), E.Controller.prototype.destroy.apply(this, arguments);
                    },
                    _store: function (e, t) {
                        this._regions[e] || this.length++, this._regions[e] = t;
                    },
                    _remove: function (e, t) {
                        this.triggerMethod('before:remove:region', e, t), t.empty(), t.stopListening(), delete t._parent, delete this._regions[e], this.length--, this.triggerMethod('remove:region', e, t);
                    }
                }), E.actAsCollection(E.RegionManager.prototype, '_regions'), E.TemplateCache = function (e) {
                    this.templateId = e;
                }, f.extend(E.TemplateCache, {
                    templateCaches: {},
                    get: function (e, t) {
                        var n = this.templateCaches[e];
                        return n || (n = new E.TemplateCache(e), this.templateCaches[e] = n), n.load(t);
                    },
                    clear: function () {
                        var e, t = f.toArray(arguments), n = t.length;
                        if (0 < n)
                            for (e = 0; e < n; e++)
                                delete this.templateCaches[t[e]];
                        else
                            this.templateCaches = {};
                    }
                }), f.extend(E.TemplateCache.prototype, {
                    load: function (e) {
                        if (this.compiledTemplate)
                            return this.compiledTemplate;
                        var t = this.loadTemplate(this.templateId, e);
                        return this.compiledTemplate = this.compileTemplate(t, e), this.compiledTemplate;
                    },
                    loadTemplate: function (e, t) {
                        var n = s.$(e);
                        if (!n.length)
                            throw new E.Error({
                                name: 'NoTemplateError',
                                message: 'Could not find template: "' + e + '"'
                            });
                        return n.html();
                    },
                    compileTemplate: function (e, t) {
                        return f.template(e, t);
                    }
                }), E.Renderer = {
                    render: function (e, t) {
                        if (!e)
                            throw new E.Error({
                                name: 'TemplateNotFoundError',
                                message: 'Cannot render the template since its false, null or undefined.'
                            });
                        return (f.isFunction(e) ? e : E.TemplateCache.get(e))(t);
                    }
                }, E.View = s.View.extend({
                    isDestroyed: !1,
                    supportsRenderLifecycle: !0,
                    supportsDestroyLifecycle: !0,
                    constructor: function (e) {
                        this.render = f.bind(this.render, this), e = E._getValue(e, this), this.options = f.extend({}, f.result(this, 'options'), e), this._behaviors = E.Behaviors(this), s.View.call(this, this.options), E.MonitorDOMRefresh(this);
                    },
                    getTemplate: function () {
                        return this.getOption('template');
                    },
                    serializeModel: function (e) {
                        return e.toJSON.apply(e, f.rest(arguments));
                    },
                    mixinTemplateHelpers: function (e) {
                        e = e || {};
                        var t = this.getOption('templateHelpers');
                        return t = E._getValue(t, this), f.extend(e, t);
                    },
                    normalizeUIKeys: function (e) {
                        var t = f.result(this, '_uiBindings');
                        return E.normalizeUIKeys(e, t || f.result(this, 'ui'));
                    },
                    normalizeUIValues: function (e, t) {
                        var n = f.result(this, 'ui'), i = f.result(this, '_uiBindings');
                        return E.normalizeUIValues(e, i || n, t);
                    },
                    configureTriggers: function () {
                        if (this.triggers) {
                            var e = this.normalizeUIKeys(f.result(this, 'triggers'));
                            return f.reduce(e, function (e, t, n) {
                                return e[n] = this._buildViewTrigger(t), e;
                            }, {}, this);
                        }
                    },
                    delegateEvents: function (e) {
                        return this._delegateDOMEvents(e), this.bindEntityEvents(this.model, this.getOption('modelEvents')), this.bindEntityEvents(this.collection, this.getOption('collectionEvents')), f.each(this._behaviors, function (e) {
                            e.bindEntityEvents(this.model, e.getOption('modelEvents')), e.bindEntityEvents(this.collection, e.getOption('collectionEvents'));
                        }, this), this;
                    },
                    _delegateDOMEvents: function (e) {
                        var t = E._getValue(e || this.events, this);
                        t = this.normalizeUIKeys(t), f.isUndefined(e) && (this.events = t);
                        var n = {}, i = f.result(this, 'behaviorEvents') || {}, r = this.configureTriggers(), o = f.result(this, 'behaviorTriggers') || {};
                        f.extend(n, i, t, r, o), s.View.prototype.delegateEvents.call(this, n);
                    },
                    undelegateEvents: function () {
                        return s.View.prototype.undelegateEvents.apply(this, arguments), this.unbindEntityEvents(this.model, this.getOption('modelEvents')), this.unbindEntityEvents(this.collection, this.getOption('collectionEvents')), f.each(this._behaviors, function (e) {
                            e.unbindEntityEvents(this.model, e.getOption('modelEvents')), e.unbindEntityEvents(this.collection, e.getOption('collectionEvents'));
                        }, this), this;
                    },
                    _ensureViewIsIntact: function () {
                        if (this.isDestroyed)
                            throw new E.Error({
                                name: 'ViewDestroyedError',
                                message: 'View (cid: "' + this.cid + '") has already been destroyed and cannot be used.'
                            });
                    },
                    destroy: function () {
                        if (this.isDestroyed)
                            return this;
                        var e = f.toArray(arguments);
                        return this.triggerMethod.apply(this, ['before:destroy'].concat(e)), this.isDestroyed = !0, this.triggerMethod.apply(this, ['destroy'].concat(e)), this.unbindUIElements(), this.isRendered = !1, this.remove(), f.invoke(this._behaviors, 'destroy', e), this;
                    },
                    bindUIElements: function () {
                        this._bindUIElements(), f.invoke(this._behaviors, this._bindUIElements);
                    },
                    _bindUIElements: function () {
                        if (this.ui) {
                            this._uiBindings || (this._uiBindings = this.ui);
                            var e = f.result(this, '_uiBindings');
                            this.ui = {}, f.each(e, function (e, t) {
                                this.ui[t] = this.$(e);
                            }, this);
                        }
                    },
                    unbindUIElements: function () {
                        this._unbindUIElements(), f.invoke(this._behaviors, this._unbindUIElements);
                    },
                    _unbindUIElements: function () {
                        this.ui && this._uiBindings && (f.each(this.ui, function (e, t) {
                            delete this.ui[t];
                        }, this), this.ui = this._uiBindings, delete this._uiBindings);
                    },
                    _buildViewTrigger: function (e) {
                        var n = f.defaults({}, e, {
                                preventDefault: !0,
                                stopPropagation: !0
                            }), i = f.isObject(e) ? n.event : e;
                        return function (e) {
                            e && (e.preventDefault && n.preventDefault && e.preventDefault(), e.stopPropagation && n.stopPropagation && e.stopPropagation());
                            var t = {
                                view: this,
                                model: this.model,
                                collection: this.collection
                            };
                            this.triggerMethod(i, t);
                        };
                    },
                    setElement: function () {
                        var e = s.View.prototype.setElement.apply(this, arguments);
                        return f.invoke(this._behaviors, 'proxyViewProperties', this), e;
                    },
                    triggerMethod: function () {
                        var e = E._triggerMethod(this, arguments);
                        return this._triggerEventOnBehaviors(arguments), this._triggerEventOnParentLayout(arguments[0], f.rest(arguments)), e;
                    },
                    _triggerEventOnBehaviors: function (e) {
                        for (var t = E._triggerMethod, n = this._behaviors, i = 0, r = n && n.length; i < r; i++)
                            t(n[i], e);
                    },
                    _triggerEventOnParentLayout: function (e, t) {
                        var n = this._parentLayoutView();
                        if (n) {
                            var i = E.getOption(n, 'childViewEventPrefix') + ':' + e, r = [this].concat(t);
                            E._triggerMethod(n, i, r);
                            var o = E.getOption(n, 'childEvents');
                            o = E._getValue(o, n);
                            var s = n.normalizeMethods(o);
                            s && f.isFunction(s[e]) && s[e].apply(n, r);
                        }
                    },
                    _getImmediateChildren: function () {
                        return [];
                    },
                    _getNestedViews: function () {
                        var e = this._getImmediateChildren();
                        return e.length ? f.reduce(e, function (e, t) {
                            return t._getNestedViews ? e.concat(t._getNestedViews()) : e;
                        }, e) : e;
                    },
                    _parentLayoutView: function () {
                        for (var e = this._parent; e;) {
                            if (e instanceof E.LayoutView)
                                return e;
                            e = e._parent;
                        }
                    },
                    normalizeMethods: E.normalizeMethods,
                    mergeOptions: E.mergeOptions,
                    getOption: E.proxyGetOption,
                    bindEntityEvents: E.proxyBindEntityEvents,
                    unbindEntityEvents: E.proxyUnbindEntityEvents
                }), E.ItemView = E.View.extend({
                    constructor: function () {
                        E.View.apply(this, arguments);
                    },
                    serializeData: function () {
                        if (!this.model && !this.collection)
                            return {};
                        var e = [this.model || this.collection];
                        return arguments.length && e.push.apply(e, arguments), this.model ? this.serializeModel.apply(this, e) : { items: this.serializeCollection.apply(this, e) };
                    },
                    serializeCollection: function (e) {
                        return e.toJSON.apply(e, f.rest(arguments));
                    },
                    render: function () {
                        return this._ensureViewIsIntact(), this.triggerMethod('before:render', this), this._renderTemplate(), this.isRendered = !0, this.bindUIElements(), this.triggerMethod('render', this), this;
                    },
                    _renderTemplate: function () {
                        var e = this.getTemplate();
                        if (!1 !== e) {
                            if (!e)
                                throw new E.Error({
                                    name: 'UndefinedTemplateError',
                                    message: 'Cannot render the template since it is null or undefined.'
                                });
                            var t = this.mixinTemplateHelpers(this.serializeData()), n = E.Renderer.render(e, t, this);
                            return this.attachElContent(n), this;
                        }
                    },
                    attachElContent: function (e) {
                        return this.$el.html(e), this;
                    }
                }), E.CollectionView = E.View.extend({
                    childViewEventPrefix: 'childview',
                    sort: !0,
                    constructor: function (e) {
                        this.once('render', this._initialEvents), this._initChildViewStorage(), E.View.apply(this, arguments), this.on({
                            'before:show': this._onBeforeShowCalled,
                            show: this._onShowCalled,
                            'before:attach': this._onBeforeAttachCalled,
                            attach: this._onAttachCalled
                        }), this.initRenderBuffer();
                    },
                    initRenderBuffer: function () {
                        this._bufferedChildren = [];
                    },
                    startBuffering: function () {
                        this.initRenderBuffer(), this.isBuffering = !0;
                    },
                    endBuffering: function () {
                        var e, t = this._isShown && E.isNodeAttached(this.el);
                        this.isBuffering = !1, this._isShown && this._triggerMethodMany(this._bufferedChildren, this, 'before:show'), t && this._triggerBeforeAttach && (e = this._getNestedViews(), this._triggerMethodMany(e, this, 'before:attach')), this.attachBuffer(this, this._createBuffer()), t && this._triggerAttach && (e = this._getNestedViews(), this._triggerMethodMany(e, this, 'attach')), this._isShown && this._triggerMethodMany(this._bufferedChildren, this, 'show'), this.initRenderBuffer();
                    },
                    _triggerMethodMany: function (e, t, n) {
                        var i = f.drop(arguments, 3);
                        f.each(e, function (e) {
                            E.triggerMethodOn.apply(e, [
                                e,
                                n,
                                e,
                                t
                            ].concat(i));
                        });
                    },
                    _initialEvents: function () {
                        this.collection && (this.listenTo(this.collection, 'add', this._onCollectionAdd), this.listenTo(this.collection, 'remove', this._onCollectionRemove), this.listenTo(this.collection, 'reset', this.render), this.getOption('sort') && this.listenTo(this.collection, 'sort', this._sortViews));
                    },
                    _onCollectionAdd: function (e, t, n) {
                        var i = void 0 !== n.at && (n.index || t.indexOf(e));
                        if ((this.getOption('filter') || !1 === i) && (i = f.indexOf(this._filteredSortedModels(i), e)), this._shouldAddChild(e, i)) {
                            this.destroyEmptyView();
                            var r = this.getChildView(e);
                            this.addChild(e, r, i);
                        }
                    },
                    _onCollectionRemove: function (e) {
                        var t = this.children.findByModel(e);
                        this.removeChildView(t), this.checkEmpty();
                    },
                    _onBeforeShowCalled: function () {
                        this._triggerBeforeAttach = this._triggerAttach = !1, this.children.each(function (e) {
                            E.triggerMethodOn(e, 'before:show', e);
                        });
                    },
                    _onShowCalled: function () {
                        this.children.each(function (e) {
                            E.triggerMethodOn(e, 'show', e);
                        });
                    },
                    _onBeforeAttachCalled: function () {
                        this._triggerBeforeAttach = !0;
                    },
                    _onAttachCalled: function () {
                        this._triggerAttach = !0;
                    },
                    render: function () {
                        return this._ensureViewIsIntact(), this.triggerMethod('before:render', this), this._renderChildren(), this.isRendered = !0, this.triggerMethod('render', this), this;
                    },
                    reorder: function () {
                        var i = this.children, e = this._filteredSortedModels();
                        if (!e.length && this._showingEmptyView)
                            return this;
                        if (f.some(e, function (e) {
                                return !i.findByModel(e);
                            }))
                            this.render();
                        else {
                            var t = f.map(e, function (e, t) {
                                    var n = i.findByModel(e);
                                    return n._index = t, n.el;
                                }), n = i.filter(function (e) {
                                    return !f.contains(t, e.el);
                                });
                            this.triggerMethod('before:reorder'), this._appendReorderedChildren(t), f.each(n, this.removeChildView, this), this.checkEmpty(), this.triggerMethod('reorder');
                        }
                    },
                    resortView: function () {
                        E.getOption(this, 'reorderOnSort') ? this.reorder() : this.render();
                    },
                    _sortViews: function () {
                        var e = this._filteredSortedModels();
                        f.find(e, function (e, t) {
                            var n = this.children.findByModel(e);
                            return !n || n._index !== t;
                        }, this) && this.resortView();
                    },
                    _emptyViewIndex: -1,
                    _appendReorderedChildren: function (e) {
                        this.$el.append(e);
                    },
                    _renderChildren: function () {
                        this.destroyEmptyView(), this.destroyChildren({ checkEmpty: !1 }), this.isEmpty(this.collection) ? this.showEmptyView() : (this.triggerMethod('before:render:collection', this), this.startBuffering(), this.showCollection(), this.endBuffering(), this.triggerMethod('render:collection', this), this.children.isEmpty() && this.getOption('filter') && this.showEmptyView());
                    },
                    showCollection: function () {
                        var n, e = this._filteredSortedModels();
                        f.each(e, function (e, t) {
                            n = this.getChildView(e), this.addChild(e, n, t);
                        }, this);
                    },
                    _filteredSortedModels: function (e) {
                        var t, n = this.getViewComparator(), i = this.collection.models;
                        (e = Math.min(Math.max(e, 0), i.length - 1), n) && (e && (t = i[e], i = i.slice(0, e).concat(i.slice(e + 1))), i = this._sortModelsBy(i, n), t && i.splice(e, 0, t));
                        return this.getOption('filter') && (i = f.filter(i, function (e, t) {
                            return this._shouldAddChild(e, t);
                        }, this)), i;
                    },
                    _sortModelsBy: function (e, t) {
                        return 'string' == typeof t ? f.sortBy(e, function (e) {
                            return e.get(t);
                        }, this) : 1 === t.length ? f.sortBy(e, t, this) : e.sort(f.bind(t, this));
                    },
                    showEmptyView: function () {
                        var e = this.getEmptyView();
                        if (e && !this._showingEmptyView) {
                            this.triggerMethod('before:render:empty'), this._showingEmptyView = !0;
                            var t = new s.Model();
                            this.addEmptyView(t, e), this.triggerMethod('render:empty');
                        }
                    },
                    destroyEmptyView: function () {
                        this._showingEmptyView && (this.triggerMethod('before:remove:empty'), this.destroyChildren(), delete this._showingEmptyView, this.triggerMethod('remove:empty'));
                    },
                    getEmptyView: function () {
                        return this.getOption('emptyView');
                    },
                    addEmptyView: function (e, t) {
                        var n, i = this._isShown && !this.isBuffering && E.isNodeAttached(this.el), r = this.getOption('emptyViewOptions') || this.getOption('childViewOptions');
                        f.isFunction(r) && (r = r.call(this, e, this._emptyViewIndex));
                        var o = this.buildChildView(e, t, r);
                        (o._parent = this).proxyChildEvents(o), o.once('render', function () {
                            this._isShown && E.triggerMethodOn(o, 'before:show', o), i && this._triggerBeforeAttach && (n = this._getViewAndNested(o), this._triggerMethodMany(n, this, 'before:attach'));
                        }, this), this.children.add(o), this.renderChildView(o, this._emptyViewIndex), i && this._triggerAttach && (n = this._getViewAndNested(o), this._triggerMethodMany(n, this, 'attach')), this._isShown && E.triggerMethodOn(o, 'show', o);
                    },
                    getChildView: function (e) {
                        var t = this.getOption('childView');
                        if (!t)
                            throw new E.Error({
                                name: 'NoChildViewError',
                                message: 'A "childView" must be specified'
                            });
                        return t;
                    },
                    addChild: function (e, t, n) {
                        var i = this.getOption('childViewOptions');
                        i = E._getValue(i, this, [
                            e,
                            n
                        ]);
                        var r = this.buildChildView(e, t, i);
                        return this._updateIndices(r, !0, n), this.triggerMethod('before:add:child', r), this._addChildView(r, n), this.triggerMethod('add:child', r), r._parent = this, r;
                    },
                    _updateIndices: function (t, n, e) {
                        this.getOption('sort') && (n && (t._index = e), this.children.each(function (e) {
                            e._index >= t._index && (e._index += n ? 1 : -1);
                        }));
                    },
                    _addChildView: function (e, t) {
                        var n, i = this._isShown && !this.isBuffering && E.isNodeAttached(this.el);
                        this.proxyChildEvents(e), e.once('render', function () {
                            this._isShown && !this.isBuffering && E.triggerMethodOn(e, 'before:show', e), i && this._triggerBeforeAttach && (n = this._getViewAndNested(e), this._triggerMethodMany(n, this, 'before:attach'));
                        }, this), this.children.add(e), this.renderChildView(e, t), i && this._triggerAttach && (n = this._getViewAndNested(e), this._triggerMethodMany(n, this, 'attach')), this._isShown && !this.isBuffering && E.triggerMethodOn(e, 'show', e);
                    },
                    renderChildView: function (e, t) {
                        return e.supportsRenderLifecycle || E.triggerMethodOn(e, 'before:render', e), e.render(), e.supportsRenderLifecycle || E.triggerMethodOn(e, 'render', e), this.attachHtml(this, e, t), e;
                    },
                    buildChildView: function (e, t, n) {
                        var i = new t(f.extend({ model: e }, n));
                        return E.MonitorDOMRefresh(i), i;
                    },
                    removeChildView: function (e) {
                        return e && (this.triggerMethod('before:remove:child', e), e.supportsDestroyLifecycle || E.triggerMethodOn(e, 'before:destroy', e), e.destroy ? e.destroy() : e.remove(), e.supportsDestroyLifecycle || E.triggerMethodOn(e, 'destroy', e), delete e._parent, this.stopListening(e), this.children.remove(e), this.triggerMethod('remove:child', e), this._updateIndices(e, !1)), e;
                    },
                    isEmpty: function () {
                        return !this.collection || 0 === this.collection.length;
                    },
                    checkEmpty: function () {
                        this.isEmpty(this.collection) && this.showEmptyView();
                    },
                    attachBuffer: function (e, t) {
                        e.$el.append(t);
                    },
                    _createBuffer: function () {
                        var t = document.createDocumentFragment();
                        return f.each(this._bufferedChildren, function (e) {
                            t.appendChild(e.el);
                        }), t;
                    },
                    attachHtml: function (e, t, n) {
                        e.isBuffering ? e._bufferedChildren.splice(n, 0, t) : e._insertBefore(t, n) || e._insertAfter(t);
                    },
                    _insertBefore: function (e, t) {
                        var n;
                        return this.getOption('sort') && t < this.children.length - 1 && (n = this.children.find(function (e) {
                            return e._index === t + 1;
                        })), !!n && (n.$el.before(e.el), !0);
                    },
                    _insertAfter: function (e) {
                        this.$el.append(e.el);
                    },
                    _initChildViewStorage: function () {
                        this.children = new s.ChildViewContainer();
                    },
                    destroy: function () {
                        return this.isDestroyed ? this : (this.triggerMethod('before:destroy:collection'), this.destroyChildren({ checkEmpty: !1 }), this.triggerMethod('destroy:collection'), E.View.prototype.destroy.apply(this, arguments));
                    },
                    destroyChildren: function (e) {
                        var t = e || {}, n = !0, i = this.children.map(f.identity);
                        return f.isUndefined(t.checkEmpty) || (n = t.checkEmpty), this.children.each(this.removeChildView, this), n && this.checkEmpty(), i;
                    },
                    _shouldAddChild: function (e, t) {
                        var n = this.getOption('filter');
                        return !f.isFunction(n) || n.call(this, e, t, this.collection);
                    },
                    proxyChildEvents: function (i) {
                        var r = this.getOption('childViewEventPrefix');
                        this.listenTo(i, 'all', function () {
                            var e = f.toArray(arguments), t = e[0], n = this.normalizeMethods(f.result(this, 'childEvents'));
                            e[0] = r + ':' + t, e.splice(1, 0, i), void 0 !== n && f.isFunction(n[t]) && n[t].apply(this, e.slice(1)), this.triggerMethod.apply(this, e);
                        });
                    },
                    _getImmediateChildren: function () {
                        return f.values(this.children._views);
                    },
                    _getViewAndNested: function (e) {
                        return [e].concat(f.result(e, '_getNestedViews') || []);
                    },
                    getViewComparator: function () {
                        return this.getOption('viewComparator');
                    }
                }), E.CompositeView = E.CollectionView.extend({
                    constructor: function () {
                        E.CollectionView.apply(this, arguments);
                    },
                    _initialEvents: function () {
                        this.collection && (this.listenTo(this.collection, 'add', this._onCollectionAdd), this.listenTo(this.collection, 'remove', this._onCollectionRemove), this.listenTo(this.collection, 'reset', this._renderChildren), this.getOption('sort') && this.listenTo(this.collection, 'sort', this._sortViews));
                    },
                    getChildView: function (e) {
                        return this.getOption('childView') || this.constructor;
                    },
                    serializeData: function () {
                        var e = {};
                        return this.model && (e = f.partial(this.serializeModel, this.model).apply(this, arguments)), e;
                    },
                    render: function () {
                        return this._ensureViewIsIntact(), this._isRendering = !0, this.resetChildViewContainer(), this.triggerMethod('before:render', this), this._renderTemplate(), this._renderChildren(), this._isRendering = !1, this.isRendered = !0, this.triggerMethod('render', this), this;
                    },
                    _renderChildren: function () {
                        (this.isRendered || this._isRendering) && E.CollectionView.prototype._renderChildren.call(this);
                    },
                    _renderTemplate: function () {
                        var e = {};
                        e = this.serializeData(), e = this.mixinTemplateHelpers(e), this.triggerMethod('before:render:template');
                        var t = this.getTemplate(), n = E.Renderer.render(t, e, this);
                        this.attachElContent(n), this.bindUIElements(), this.triggerMethod('render:template');
                    },
                    attachElContent: function (e) {
                        return this.$el.html(e), this;
                    },
                    attachBuffer: function (e, t) {
                        this.getChildViewContainer(e).append(t);
                    },
                    _insertAfter: function (e) {
                        this.getChildViewContainer(this, e).append(e.el);
                    },
                    _appendReorderedChildren: function (e) {
                        this.getChildViewContainer(this).append(e);
                    },
                    getChildViewContainer: function (e, t) {
                        if (e.$childViewContainer)
                            return e.$childViewContainer;
                        var n, i = E.getOption(e, 'childViewContainer');
                        if (i) {
                            var r = E._getValue(i, e);
                            if ((n = '@' === r.charAt(0) && e.ui ? e.ui[r.substr(4)] : e.$(r)).length <= 0)
                                throw new E.Error({
                                    name: 'ChildViewContainerMissingError',
                                    message: 'The specified "childViewContainer" was not found: ' + e.childViewContainer
                                });
                        } else
                            n = e.$el;
                        return e.$childViewContainer = n;
                    },
                    resetChildViewContainer: function () {
                        this.$childViewContainer && (this.$childViewContainer = void 0);
                    }
                }), E.LayoutView = E.ItemView.extend({
                    regionClass: E.Region,
                    options: { destroyImmediate: !1 },
                    childViewEventPrefix: 'childview',
                    constructor: function (e) {
                        e = e || {}, this._firstRender = !0, this._initializeRegions(e), E.ItemView.call(this, e);
                    },
                    render: function () {
                        return this._ensureViewIsIntact(), this._firstRender ? this._firstRender = !1 : this._reInitializeRegions(), E.ItemView.prototype.render.apply(this, arguments);
                    },
                    destroy: function () {
                        return this.isDestroyed ? this : (!0 === this.getOption('destroyImmediate') && this.$el.remove(), this.regionManager.destroy(), E.ItemView.prototype.destroy.apply(this, arguments));
                    },
                    showChildView: function (e, t, n) {
                        var i = this.getRegion(e);
                        return i.show.apply(i, f.rest(arguments));
                    },
                    getChildView: function (e) {
                        return this.getRegion(e).currentView;
                    },
                    addRegion: function (e, t) {
                        var n = {};
                        return n[e] = t, this._buildRegions(n)[e];
                    },
                    addRegions: function (e) {
                        return this.regions = f.extend({}, this.regions, e), this._buildRegions(e);
                    },
                    removeRegion: function (e) {
                        return delete this.regions[e], this.regionManager.removeRegion(e);
                    },
                    getRegion: function (e) {
                        return this.regionManager.get(e);
                    },
                    getRegions: function () {
                        return this.regionManager.getRegions();
                    },
                    _buildRegions: function (e) {
                        var t = {
                            regionClass: this.getOption('regionClass'),
                            parentEl: f.partial(f.result, this, 'el')
                        };
                        return this.regionManager.addRegions(e, t);
                    },
                    _initializeRegions: function (e) {
                        var t;
                        this._initRegionManager(), t = E._getValue(this.regions, this, [e]) || {};
                        var n = this.getOption.call(e, 'regions');
                        n = E._getValue(n, this, [e]), f.extend(t, n), t = this.normalizeUIValues(t, [
                            'selector',
                            'el'
                        ]), this.addRegions(t);
                    },
                    _reInitializeRegions: function () {
                        this.regionManager.invoke('reset');
                    },
                    getRegionManager: function () {
                        return new E.RegionManager();
                    },
                    _initRegionManager: function () {
                        this.regionManager = this.getRegionManager(), (this.regionManager._parent = this).listenTo(this.regionManager, 'before:add:region', function (e) {
                            this.triggerMethod('before:add:region', e);
                        }), this.listenTo(this.regionManager, 'add:region', function (e, t) {
                            this[e] = t, this.triggerMethod('add:region', e, t);
                        }), this.listenTo(this.regionManager, 'before:remove:region', function (e) {
                            this.triggerMethod('before:remove:region', e);
                        }), this.listenTo(this.regionManager, 'remove:region', function (e, t) {
                            delete this[e], this.triggerMethod('remove:region', e, t);
                        });
                    },
                    _getImmediateChildren: function () {
                        return f.chain(this.regionManager.getRegions()).pluck('currentView').compact().value();
                    }
                }), E.Behavior = E.Object.extend({
                    constructor: function (e, t) {
                        this.view = t, this.defaults = f.result(this, 'defaults') || {}, this.options = f.extend({}, this.defaults, e), this.ui = f.extend({}, f.result(t, 'ui'), f.result(this, 'ui')), E.Object.apply(this, arguments);
                    },
                    $: function () {
                        return this.view.$.apply(this.view, arguments);
                    },
                    destroy: function () {
                        return this.stopListening(), this;
                    },
                    proxyViewProperties: function (e) {
                        this.$el = e.$el, this.el = e.el;
                    }
                }), E.Behaviors = function (i, u) {
                    var c = /^(\S+)\s*(.*)$/;
                    function o(e, t) {
                        return u.isObject(e.behaviors) ? (t = o.parseBehaviors(e, t || u.result(e, 'behaviors')), o.wrap(e, t, u.keys(r)), t) : {};
                    }
                    var r = {
                        behaviorTriggers: function (e, t) {
                            return new n(this, t).buildBehaviorTriggers();
                        },
                        behaviorEvents: function (e, t) {
                            var n = {};
                            return u.each(t, function (o, s) {
                                var a = {}, e = u.clone(u.result(o, 'events')) || {};
                                e = i.normalizeUIKeys(e, d(o));
                                var l = 0;
                                u.each(e, function (e, t) {
                                    var n = t.match(c), i = n[1] + '.' + [
                                            this.cid,
                                            s,
                                            l++,
                                            ' '
                                        ].join('') + n[2], r = u.isFunction(e) ? e : o[e];
                                    r && (a[i] = u.bind(r, o));
                                }, this), n = u.extend(n, a);
                            }, this), n;
                        }
                    };
                    function n(e, t) {
                        this._view = e, this._behaviors = t, this._triggers = {};
                    }
                    function d(e) {
                        return e._uiBindings || e.ui;
                    }
                    return u.extend(o, {
                        behaviorsLookup: function () {
                            throw new i.Error({
                                message: 'You must define where your behaviors are stored.',
                                url: 'marionette.behaviors.html#behaviorslookup'
                            });
                        },
                        getBehaviorClass: function (e, t) {
                            return e.behaviorClass ? e.behaviorClass : i._getValue(o.behaviorsLookup, this, [
                                e,
                                t
                            ])[t];
                        },
                        parseBehaviors: function (r, e) {
                            return u.chain(e).map(function (e, t) {
                                var n = new (o.getBehaviorClass(e, t))(e, r), i = o.parseBehaviors(r, u.result(n, 'behaviors'));
                                return [n].concat(i);
                            }).flatten().value();
                        },
                        wrap: function (t, n, e) {
                            u.each(e, function (e) {
                                t[e] = u.partial(r[e], t[e], n);
                            });
                        }
                    }), u.extend(n.prototype, {
                        buildBehaviorTriggers: function () {
                            return u.each(this._behaviors, this._buildTriggerHandlersForBehavior, this), this._triggers;
                        },
                        _buildTriggerHandlersForBehavior: function (e, t) {
                            var n = u.clone(u.result(e, 'triggers')) || {};
                            n = i.normalizeUIKeys(n, d(e)), u.each(n, u.bind(this._setHandlerForBehavior, this, e, t));
                        },
                        _setHandlerForBehavior: function (e, t, n, i) {
                            var r = i.replace(/^\S+/, function (e) {
                                return e + '.' + 'behaviortriggers' + t;
                            });
                            this._triggers[r] = this._view._buildViewTrigger(n);
                        }
                    }), o;
                }(E, f), E.AppRouter = s.Router.extend({
                    constructor: function (e) {
                        this.options = e || {}, s.Router.apply(this, arguments);
                        var t = this.getOption('appRoutes'), n = this._getController();
                        this.processAppRoutes(n, t), this.on('route', this._processOnRoute, this);
                    },
                    appRoute: function (e, t) {
                        var n = this._getController();
                        this._addAppRoute(n, e, t);
                    },
                    _processOnRoute: function (e, t) {
                        if (f.isFunction(this.onRoute)) {
                            var n = f.invert(this.getOption('appRoutes'))[e];
                            this.onRoute(e, n, t);
                        }
                    },
                    processAppRoutes: function (t, n) {
                        if (n) {
                            var e = f.keys(n).reverse();
                            f.each(e, function (e) {
                                this._addAppRoute(t, e, n[e]);
                            }, this);
                        }
                    },
                    _getController: function () {
                        return this.getOption('controller');
                    },
                    _addAppRoute: function (e, t, n) {
                        var i = e[n];
                        if (!i)
                            throw new E.Error('Method "' + n + '" was not found on the controller');
                        this.route(t, n, f.bind(i, e));
                    },
                    mergeOptions: E.mergeOptions,
                    getOption: E.proxyGetOption,
                    triggerMethod: E.triggerMethod,
                    bindEntityEvents: E.proxyBindEntityEvents,
                    unbindEntityEvents: E.proxyUnbindEntityEvents
                }), E.Application = E.Object.extend({
                    constructor: function (e) {
                        this._initializeRegions(e), this._initCallbacks = new E.Callbacks(), this.submodules = {}, f.extend(this, e), this._initChannel(), E.Object.apply(this, arguments);
                    },
                    execute: function () {
                        this.commands.execute.apply(this.commands, arguments);
                    },
                    request: function () {
                        return this.reqres.request.apply(this.reqres, arguments);
                    },
                    addInitializer: function (e) {
                        this._initCallbacks.add(e);
                    },
                    start: function (e) {
                        this.triggerMethod('before:start', e), this._initCallbacks.run(e, this), this.triggerMethod('start', e);
                    },
                    addRegions: function (e) {
                        return this._regionManager.addRegions(e);
                    },
                    emptyRegions: function () {
                        return this._regionManager.emptyRegions();
                    },
                    removeRegion: function (e) {
                        return this._regionManager.removeRegion(e);
                    },
                    getRegion: function (e) {
                        return this._regionManager.get(e);
                    },
                    getRegions: function () {
                        return this._regionManager.getRegions();
                    },
                    module: function (e, t) {
                        var n = E.Module.getClass(t), i = f.toArray(arguments);
                        return i.unshift(this), n.create.apply(n, i);
                    },
                    getRegionManager: function () {
                        return new E.RegionManager();
                    },
                    _initializeRegions: function (e) {
                        var t = f.isFunction(this.regions) ? this.regions(e) : this.regions || {};
                        this._initRegionManager();
                        var n = E.getOption(e, 'regions');
                        return f.isFunction(n) && (n = n.call(this, e)), f.extend(t, n), this.addRegions(t), this;
                    },
                    _initRegionManager: function () {
                        this._regionManager = this.getRegionManager(), (this._regionManager._parent = this).listenTo(this._regionManager, 'before:add:region', function () {
                            E._triggerMethod(this, 'before:add:region', arguments);
                        }), this.listenTo(this._regionManager, 'add:region', function (e, t) {
                            this[e] = t, E._triggerMethod(this, 'add:region', arguments);
                        }), this.listenTo(this._regionManager, 'before:remove:region', function () {
                            E._triggerMethod(this, 'before:remove:region', arguments);
                        }), this.listenTo(this._regionManager, 'remove:region', function (e) {
                            delete this[e], E._triggerMethod(this, 'remove:region', arguments);
                        });
                    },
                    _initChannel: function () {
                        this.channelName = f.result(this, 'channelName') || 'global', this.channel = f.result(this, 'channel') || s.Wreqr.radio.channel(this.channelName), this.vent = f.result(this, 'vent') || this.channel.vent, this.commands = f.result(this, 'commands') || this.channel.commands, this.reqres = f.result(this, 'reqres') || this.channel.reqres;
                    }
                }), E.Module = function (e, t, n) {
                    this.moduleName = e, this.options = f.extend({}, this.options, n), this.initialize = n.initialize || this.initialize, this.submodules = {}, this._setupInitializersAndFinalizers(), this.app = t, f.isFunction(this.initialize) && this.initialize(e, t, this.options);
                }, E.Module.extend = E.extend, f.extend(E.Module.prototype, s.Events, {
                    startWithParent: !0,
                    initialize: function () {
                    },
                    addInitializer: function (e) {
                        this._initializerCallbacks.add(e);
                    },
                    addFinalizer: function (e) {
                        this._finalizerCallbacks.add(e);
                    },
                    start: function (t) {
                        this._isInitialized || (f.each(this.submodules, function (e) {
                            e.startWithParent && e.start(t);
                        }), this.triggerMethod('before:start', t), this._initializerCallbacks.run(t, this), this._isInitialized = !0, this.triggerMethod('start', t));
                    },
                    stop: function () {
                        this._isInitialized && (this._isInitialized = !1, this.triggerMethod('before:stop'), f.invoke(this.submodules, 'stop'), this._finalizerCallbacks.run(void 0, this), this._initializerCallbacks.reset(), this._finalizerCallbacks.reset(), this.triggerMethod('stop'));
                    },
                    addDefinition: function (e, t) {
                        this._runModuleDefinition(e, t);
                    },
                    _runModuleDefinition: function (e, t) {
                        if (e) {
                            var n = f.flatten([
                                this,
                                this.app,
                                s,
                                E,
                                s.$,
                                f,
                                t
                            ]);
                            e.apply(this, n);
                        }
                    },
                    _setupInitializersAndFinalizers: function () {
                        this._initializerCallbacks = new E.Callbacks(), this._finalizerCallbacks = new E.Callbacks();
                    },
                    triggerMethod: E.triggerMethod
                }), f.extend(E.Module, {
                    create: function (i, e, r) {
                        var o = i, s = f.drop(arguments, 3), t = (e = e.split('.')).length, a = [];
                        return a[t - 1] = r, f.each(e, function (e, t) {
                            var n = o;
                            o = this._getModule(n, e, i, r), this._addModuleDefinition(n, o, a[t], s);
                        }, this), o;
                    },
                    _getModule: function (e, t, n, i, r) {
                        var o = f.extend({}, i), s = this.getClass(i), a = e[t];
                        return a || (a = new s(t, n, o), e[t] = a, e.submodules[t] = a), a;
                    },
                    getClass: function (e) {
                        var t = E.Module;
                        return e ? e.prototype instanceof t ? e : e.moduleClass || t : t;
                    },
                    _addModuleDefinition: function (e, t, n, i) {
                        var r = this._getDefine(n), o = this._getStartWithParent(n, t);
                        r && t.addDefinition(r, i), this._addStartWithParent(e, t, o);
                    },
                    _getStartWithParent: function (e, t) {
                        var n;
                        return f.isFunction(e) && e.prototype instanceof E.Module ? (n = t.constructor.prototype.startWithParent, !!f.isUndefined(n) || n) : !f.isObject(e) || (n = e.startWithParent, !!f.isUndefined(n) || n);
                    },
                    _getDefine: function (e) {
                        return !f.isFunction(e) || e.prototype instanceof E.Module ? f.isObject(e) ? e.define : null : e;
                    },
                    _addStartWithParent: function (e, t, n) {
                        t.startWithParent = t.startWithParent && n, t.startWithParent && !t.startWithParentIsConfigured && (t.startWithParentIsConfigured = !0, e.addInitializer(function (e) {
                            t.startWithParent && t.start(e);
                        }));
                    }
                }), E;
            }), CKFinder.define('CKFinder/Views/Base/Common', [
                'underscore',
                'marionette'
            ], function (n, i) {
                'use strict';
                return {
                    proto: {
                        getTemplate: function () {
                            var e = i.getOption(this, 'template'), t = i.getOption(this, 'imports'), n = this.name;
                            return this.finder.templateCache.has(n) ? this.finder.templateCache.get(n) : this.finder.templateCache.compile(n, e, t);
                        },
                        mixinTemplateHelpers: function (e) {
                            e = e || {};
                            var t = this.getOption('templateHelpers');
                            return t = i._getValue(t, this), n.extend(e, {
                                lang: this.finder.lang,
                                config: this.finder.config
                            }, t);
                        }
                    },
                    util: {
                        construct: function (e) {
                            if (!this.name) {
                                if (!e.name)
                                    throw 'name parameter must be specified';
                                this.name = e.name;
                            }
                            if (!this.finder) {
                                if (!e.finder)
                                    throw 'Finder parameter must be specified for view: ' + this.name;
                                this.finder = e.finder;
                            }
                            this.finder.fire('view:' + this.name, { view: this }, this.finder);
                        }
                    }
                };
            }), CKFinder.define('CKFinder/Views/Base/CompositeView', [
                'underscore',
                'marionette',
                'CKFinder/Views/Base/Common'
            ], function (i, e, t) {
                'use strict';
                var n = e.CompositeView;
                return n.extend(t.proto).extend({
                    constructor: function (e) {
                        t.util.construct.call(this, e), n.prototype.constructor.apply(this, Array.prototype.slice.call(arguments));
                    },
                    buildChildView: function (e, t, n) {
                        return new t(i.extend({
                            model: e,
                            finder: this.finder
                        }, n));
                    },
                    attachBuffer: function (e, t) {
                        this.getChildViewContainer(e).append(t), this.triggerMethod('attachBuffer');
                    }
                });
            }), CKFinder.define('CKFinder/Views/Base/ItemView', [
                'marionette',
                'CKFinder/Views/Base/Common'
            ], function (e, t) {
                'use strict';
                var n = e.ItemView;
                return n.extend(t.proto).extend({
                    constructor: function (e) {
                        t.util.construct.call(this, e), n.prototype.constructor.apply(this, Array.prototype.slice.call(arguments));
                    }
                });
            }), CKFinder.define('text', ['module'], function (e) {
                'use strict';
                var u, r, s, a, l, i = [
                        'Msxml2.XMLHTTP',
                        'Microsoft.XMLHTTP',
                        'Msxml2.XMLHTTP.4.0'
                    ], n = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, o = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im, c = 'undefined' != typeof location && location.href, d = c && location.protocol && location.protocol.replace(/\:/, ''), f = c && location.hostname, h = c && (location.port || void 0), g = {}, p = e.config && e.config() || {};
                function v(e, t) {
                    return void 0 === e || '' === e ? t : e;
                }
                return u = {
                    version: '2.0.16',
                    strip: function (e) {
                        if (e) {
                            var t = (e = e.replace(n, '')).match(o);
                            t && (e = t[1]);
                        } else
                            e = '';
                        return e;
                    },
                    jsEscape: function (e) {
                        return e.replace(/(['\\])/g, '\\$1').replace(/[\f]/g, '\\f').replace(/[\b]/g, '\\b').replace(/[\n]/g, '\\n').replace(/[\t]/g, '\\t').replace(/[\r]/g, '\\r').replace(/[\u2028]/g, '\\u2028').replace(/[\u2029]/g, '\\u2029');
                    },
                    createXhr: p.createXhr || function () {
                        var e, t, n;
                        if ('undefined' != typeof XMLHttpRequest)
                            return new XMLHttpRequest();
                        if ('undefined' != typeof ActiveXObject)
                            for (t = 0; t < 3; t += 1) {
                                n = i[t];
                                try {
                                    e = new ActiveXObject(n);
                                } catch (e) {
                                }
                                if (e) {
                                    i = [n];
                                    break;
                                }
                            }
                        return e;
                    },
                    parseName: function (e) {
                        var t, n, i, r = !1, o = e.lastIndexOf('.'), s = 0 === e.indexOf('./') || 0 === e.indexOf('../');
                        return -1 !== o && (!s || 1 < o) ? (t = e.substring(0, o), n = e.substring(o + 1)) : t = e, -1 !== (o = (i = n || t).indexOf('!')) && (r = i.substring(o + 1) === 'strip', i = i.substring(0, o), n ? n = i : t = i), {
                            moduleName: t,
                            ext: n,
                            strip: r
                        };
                    },
                    xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,
                    useXhr: function (e, t, n, i) {
                        var r, o, s, a = u.xdRegExp.exec(e);
                        return !a || (r = a[2], s = (o = (o = a[3]).split(':'))[1], o = o[0], (!r || r === t) && (!o || o.toLowerCase() === n.toLowerCase()) && (!s && !o || function (e, t, n, i) {
                            if (t === i)
                                return !0;
                            if (e === n) {
                                if (e === 'http')
                                    return v(t, '80') === v(i, '80');
                                if (e === 'https')
                                    return v(t, '443') === v(i, '443');
                            }
                            return !1;
                        }(r, s, t, i)));
                    },
                    finishLoad: function (e, t, n, i) {
                        n = t ? u.strip(n) : n, p.isBuild && (g[e] = n), i(n);
                    },
                    load: function (t, e, n, i) {
                        if (i && i.isBuild && !i.inlineText)
                            n();
                        else {
                            p.isBuild = i && i.isBuild;
                            var r = u.parseName(t), o = r.moduleName + (r.ext ? '.' + r.ext : ''), s = e.toUrl(o), a = p.useXhr || u.useXhr;
                            0 !== s.indexOf('empty:') ? !c || a(s, d, f, h) ? u.get(s, function (e) {
                                u.finishLoad(t, r.strip, e, n);
                            }, function (e) {
                                n.error && n.error(e);
                            }) : e([o], function (e) {
                                u.finishLoad(r.moduleName + '.' + r.ext, r.strip, e, n);
                            }, function (e) {
                                n.error && n.error(e);
                            }) : n();
                        }
                    },
                    write: function (e, t, n, i) {
                        if (g.hasOwnProperty(t)) {
                            var r = u.jsEscape(g[t]);
                            n.asModule(e + '!' + t, 'define(function () { return \'' + r + '\';});\n');
                        }
                    },
                    writeFile: function (n, e, t, i, r) {
                        var o = u.parseName(e), s = o.ext ? '.' + o.ext : '', a = o.moduleName + s, l = t.toUrl(o.moduleName + s) + '.js';
                        u.load(a, t, function (e) {
                            var t = function (e) {
                                return i(l, e);
                            };
                            t.asModule = function (e, t) {
                                return i.asModule(e, l, t);
                            }, u.write(n, a, t, r);
                        }, r);
                    }
                }, p.env === 'node' || !p.env && 'undefined' != typeof process && process.versions && process.versions.node && !process.versions['node-webkit'] && !process.versions['atom-shell'] ? (r = require.nodeRequire('fs'), u.get = function (e, t, n) {
                    try {
                        var i = r.readFileSync(e, 'utf8');
                        '\uFEFF' === i[0] && (i = i.substring(1)), t(i);
                    } catch (e) {
                        n && n(e);
                    }
                }) : p.env === 'xhr' || !p.env && u.createXhr() ? u.get = function (i, r, o, e) {
                    var t, s = u.createXhr();
                    if (s.open('GET', i, !0), e)
                        for (t in e)
                            e.hasOwnProperty(t) && s.setRequestHeader(t.toLowerCase(), e[t]);
                    p.onXhr && p.onXhr(s, i), s.onreadystatechange = function (e) {
                        var t, n;
                        4 === s.readyState && (399 < (t = s.status || 0) && t < 600 ? ((n = new Error(i + ' HTTP status: ' + t)).xhr = s, o && o(n)) : r(s.responseText), p.onXhrComplete && p.onXhrComplete(s, i));
                    }, s.send(null);
                } : p.env === 'rhino' || !p.env && 'undefined' != typeof Packages && 'undefined' != typeof java ? u.get = function (e, t) {
                    var n, i, r = 'utf-8', o = new java.io.File(e), s = java.lang.System.getProperty('line.separator'), a = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(o), r)), l = '';
                    try {
                        for (n = new java.lang.StringBuffer(), (i = a.readLine()) && i.length() && 65279 === i.charAt(0) && (i = i.substring(1)), null !== i && n.append(i); null !== (i = a.readLine());)
                            n.append(s), n.append(i);
                        l = String(n.toString());
                    } finally {
                        a.close();
                    }
                    t(l);
                } : (p.env === 'xpconnect' || !p.env && 'undefined' != typeof Components && Components.classes && Components.interfaces) && (s = Components.classes, a = Components.interfaces, Components.utils['import']('resource://gre/modules/FileUtils.jsm'), l = '@mozilla.org/windows-registry-key;1' in s, u.get = function (e, t) {
                    var n, i, r, o = {};
                    l && (e = e.replace(/\//g, '\\')), r = new FileUtils.File(e);
                    try {
                        (n = s['@mozilla.org/network/file-input-stream;1'].createInstance(a.nsIFileInputStream)).init(r, 1, 0, !1), (i = s['@mozilla.org/intl/converter-input-stream;1'].createInstance(a.nsIConverterInputStream)).init(n, 'utf-8', n.available(), a.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER), i.readString(n.available(), o), i.close(), n.close(), t(o.value);
                    } catch (e) {
                        throw new Error((r && r.path || '') + ': ' + e);
                    }
                }), u;
            }), CKFinder.define('text!CKFinder/Templates/ContextMenu/ContextMenuItem.dot', [], function () {
                return '{{? it.divider }}{{??}}\n\t<a tabindex="-1" class="ui-btn {{? !it.isActive }}ui-state-disabled {{?}}{{? it.icon }}ui-btn-icon-{{? it.lang.dir === \'ltr\' }}left{{??}}right{{?}} ui-icon-{{= it.icon }}{{?}}" {{? !it.isActive }}aria-disabled="true"{{?}} data-ckf-name="{{= it.name }}" {{? it.linkAttributes }}{{~ it.linkAttributes :attribute}}{{=attribute.name}}="{{=attribute.value}}"{{~}}{{?}}>\n\t\t{{= it.label }}\n\t</a>\n{{?}}\n';
            }), CKFinder.define('CKFinder/Modules/ContextMenu/Views/ContextMenuView', [
                'underscore',
                'jquery',
                'CKFinder/Views/Base/CompositeView',
                'CKFinder/Views/Base/ItemView',
                'text!CKFinder/Templates/ContextMenu/ContextMenuItem.dot',
                'CKFinder/Util/KeyCode'
            ], function (u, c, e, i, r, d) {
                'use strict';
                return e.extend({
                    name: 'ContextMenu',
                    template: '<ul></ul>',
                    childViewContainer: 'ul',
                    emptyView: i.extend({
                        name: 'ContextMenuEmpty',
                        template: '<div class="ckf-message"></div>'
                    }),
                    initialize: function (i) {
                        var o = this, e = c(document), t = 'mousedown contextmenu', n = i.position, r = i.positionToEl;
                        if (!n && r) {
                            var s = r.get(0).getBoundingClientRect();
                            n = {
                                x: s.left + r.width() / 2,
                                y: s.top + r.height() / 2
                            };
                        }
                        function a(e) {
                            var t = e.model.get('action'), n = e.evt;
                            u.isFunction(t) && (n.stopPropagation(), n.preventDefault(), t(i.forView)), setTimeout(function () {
                                o.destroy();
                            }, 10);
                        }
                        function l(e) {
                            !o || o.$el.find(e.target).length || o.isDestroyed || o.destroy();
                        }
                        o.$el.attr('data-theme', o.finder.config.swatch), o.on('destroy', function () {
                            e.off(t, l), o.$el.length && o.$el.remove();
                        }), o.on('render', function () {
                            o.$el.find('ul').listview(), c('.ui-popup-container').remove(), o.$el.popup().popup('open'), o.$el.find('.ui-btn:first').trigger('focus'), n && n.x && n.y && o.$el.popup('reposition', function (e, t) {
                                var n = e.x, i = e.y, r = t.height(), o = t.width();
                                return {
                                    x: parseInt(n + (window.innerWidth < n + o ? -1 : 1) * o / 2, 10),
                                    y: parseInt(i + (window.innerHeight < i + r ? -1 : 1) * r / 2 + document.body.scrollTop, 10)
                                };
                            }(n, o.$el)), setTimeout(function () {
                                e.one(t, l);
                            }, 0);
                        }), o.on('childview:itemclicked', function (e, t) {
                            o.destroy(), a(t);
                        }), o.on('childview:itemkeydown', function (e, t) {
                            var n, i, r = t.evt;
                            r.keyCode === d.up && (r.stopPropagation(), r.preventDefault(), (n = o.$el.find('a').not('.ui-state-disabled'))[0 <= (i = u.indexOf(n, e.$el.find('a').get(0)) - 1) ? i : n.length - 1].focus()), r.keyCode === d.down && (r.stopPropagation(), r.preventDefault(), (n = o.$el.find('a').not('.ui-state-disabled'))[(i = u.indexOf(n, e.$el.find('a').get(0)) + 1) <= n.length - 1 ? i : 0].focus()), r.keyCode !== d.enter && r.keyCode !== d.space || (o.destroy(), e.model.get('isActive') && a(t)), r.keyCode === d.escape && (r.stopPropagation(), r.preventDefault(), o.destroy());
                        });
                    },
                    getChildView: function (e) {
                        var t = {
                            contextmenu: function (e) {
                                e.preventDefault(), e.stopPropagation();
                            }
                        };
                        e.get('divider') || (t['click a'] = function (e) {
                            this.trigger('itemclicked', {
                                evt: e,
                                view: this,
                                model: this.model
                            });
                        }, t['keydown a'] = function (e) {
                            this.trigger('itemkeydown', {
                                evt: e,
                                view: this,
                                model: this.model
                            });
                        });
                        var n = {
                            name: 'ContextMenuItem',
                            finder: this.finder,
                            template: r,
                            events: t,
                            tagName: 'li',
                            modelEvents: { 'change:active': 'render' }
                        };
                        return e.get('divider') && (n.attributes = { 'data-role': 'list-divider' }), i.extend(n);
                    }
                });
            }), CKFinder.define('CKFinder/Modules/ContextMenu/ContextMenu', [
                'underscore',
                'backbone',
                'CKFinder/Modules/ContextMenu/Views/ContextMenuView'
            ], function (e, l, u) {
                'use strict';
                function i(n) {
                    var e = this, i = e.finder, t = new l.Collection(), r = {
                            groups: t,
                            context: n.context
                        };
                    if (i.fire('contextMenu', r, i) && i.fire('contextMenu:' + n.name, r, i)) {
                        t.forEach(function (e) {
                            var t = new l.Collection();
                            i.fire('contextMenu:' + n.name + ':' + e.get('name'), {
                                items: t,
                                context: n.context
                            }, i), e.set('items', t);
                        });
                        var o = new l.Collection();
                        t.forEach(function (e) {
                            var t = e.get('items');
                            t.length && (o.length && o.add({ divider: !0 }), o.add(t.models));
                        }), e.lastView && e.lastView.destroy();
                        var s = !(!n.evt || !n.evt.clientX) && {
                                x: n.evt.clientX,
                                y: n.evt.clientY
                            }, a = n.positionToEl ? n.positionToEl : null;
                        i.request('focus:remember'), e.lastView = new u({
                            finder: i,
                            className: 'ckf-contextmenu',
                            collection: o,
                            position: s,
                            positionToEl: a,
                            forView: n.view
                        }), e.lastView.on('destroy', function () {
                            i.request('focus:restore');
                        }), e.lastView.render();
                    }
                }
                return function (e) {
                    (this.finder = e).setHandler('contextMenu', i, this);
                    var t = this;
                    function n() {
                        t.lastView && t.lastView.destroy();
                    }
                    e.on('ui:blur', n), e.on('ui:resize', n), e.on('shortcuts:list:general', function (e) {
                        e.data.shortcuts.add({
                            label: e.finder.lang.shortcuts.general.showContextMenu,
                            shortcuts: '{shift}+{f10}'
                        });
                    }, null, null, 50);
                };
            }), CKFinder.define('CKFinder/Models/FoldersCollection', [
                'backbone',
                'CKFinder/Models/Folder'
            ], function (e, t) {
                'use strict';
                return e.Collection.extend({
                    model: t,
                    initialize: function () {
                        this.on('change:name', this.sort);
                    },
                    comparator: function () {
                        if ('undefined' != typeof Intl) {
                            var n = new Intl.Collator(void 0, { numeric: !0 });
                            if (n.compare)
                                return function (e, t) {
                                    return n.compare(e.get('name'), t.get('name'));
                                };
                        }
                        return function (e, t) {
                            return e.get('name').localeCompare(t.get('name'));
                        };
                    }()
                });
            }), CKFinder.define('CKFinder/Models/Folder', [
                'backbone',
                'CKFinder/Models/FoldersCollection'
            ], function (e, o) {
                'use strict';
                return e.Model.extend({
                    defaults: {
                        name: '',
                        hasChildren: !1,
                        resourceType: '',
                        isRoot: !1,
                        parent: null,
                        isPending: !1,
                        'view:isFolder': !0
                    },
                    initialize: function () {
                        this.set('name', this.get('name').toString(), { silent: !0 }), this.set('children', new o(), { silent: !0 });
                        var e = this.get('children');
                        e.on('change', r), e.on('remove', r), this.on('change:children', function (e, t) {
                            t && (t.on('change', r), t.on('remove', r));
                        });
                        var t = this.get('allowedExtensions');
                        t && 'string' == typeof t && this.set('allowedExtensions', t.split(','), { silent: !0 });
                        var n = this.get('allowedExtensions');
                        n && 'string' == typeof n && this.set('allowedExtensions', t.split(','), { silent: !0 });
                        var i = this;
                        function r() {
                            i.set('hasChildren', !!i.get('children').length);
                        }
                    },
                    getPath: function (e) {
                        var t, n;
                        return n = (t = this.get('parent')) ? t.getPath(e).toString() + this.get('name') + '/' : '/', this.get('isRoot') && e && e.full && (n = this.get('resourceType') + ':' + n), n;
                    },
                    getHash: function () {
                        return this.has('hash') ? this.get('hash') : this.get('parent').getHash();
                    },
                    getUrl: function () {
                        if (this.has('url'))
                            return this.get('url');
                        var e = this.get('parent');
                        if (!e)
                            return !1;
                        var t = e.getUrl();
                        return t && t + encodeURIComponent(this.get('name')) + '/';
                    },
                    isPath: function (e, t) {
                        return e === this.getPath() && t === this.get('resourceType');
                    },
                    getResourceType: function () {
                        for (var e = this; !e.get('isRoot');)
                            e = e.get('parent');
                        return e;
                    }
                }, {
                    invalidCharacters: '\n\\ / : * ? " < > |',
                    isValidName: function (e) {
                        return !/[\\\/:\*\?"<>\|]/.test(e);
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/Folders/FolderNameDialogTemplate.dot', [], function () {
                return '<form action="#">\n\t<label>\n\t\t{{! it.dialogMessage }}\n\t\t<input name="newFolderName" value="{{! it.folderName }}" tabindex="1" aria-required="true" dir="auto">\n\t</label>\n</form>\n<p class="error-message"></p>\n';
            }), CKFinder.define('CKFinder/Modules/Folders/Views/FolderNameDialogView', [
                'CKFinder/Views/Base/ItemView',
                'CKFinder/Models/Folder',
                'text!CKFinder/Templates/Folders/FolderNameDialogTemplate.dot'
            ], function (e, t, n) {
                'use strict';
                return e.extend({
                    name: 'FolderNameDialogView',
                    template: n,
                    ui: {
                        error: '.error-message',
                        folderName: 'input[name="newFolderName"]'
                    },
                    events: {
                        'input @ui.folderName': function () {
                            var e = this.ui.folderName.val().toString().trim();
                            t.isValidName(e) ? this.model.unset('error') : this.model.set('error', this.finder.lang.errors.folderInvalidCharacters.replace('{disallowedCharacters}', t.invalidCharacters)), this.model.set('folderName', e);
                        },
                        submit: function (e) {
                            this.trigger('submit:form'), e.preventDefault();
                        }
                    },
                    modelEvents: {
                        'change:error': function (e, t) {
                            t ? (this.ui.error.show(), this.ui.error.html(t)) : this.ui.error.hide();
                        }
                    }
                });
            }), CKFinder.define('CKFinder/Modules/CreateFolder/CreateFolder', [
                'backbone',
                'CKFinder/Modules/Folders/Views/FolderNameDialogView'
            ], function (s, a) {
                'use strict';
                function e(e) {
                    var n = e.data.context.folder;
                    e.finder.request('loader:hide'), e.data.response.error || (n.set('hasChildren', !0), e.finder.once('command:after:GetFolders', function e(t) {
                        t.data.context.parent.cid === n.cid && (t.data.response.error || n.trigger('ui:expand'), t.finder.removeListener('command:after:GetFolders', e));
                    }), e.finder.request('command:send', {
                        name: 'GetFolders',
                        folder: n,
                        context: { parent: n }
                    }, null, null, 30));
                }
                return function (o) {
                    o.setHandler('folder:create', function (e) {
                        var t = e.parent, n = e.newFolderName;
                        if (n)
                            o.request('loader:show', { text: o.lang.common.pleaseWait }), o.request('command:send', {
                                name: 'CreateFolder',
                                type: 'post',
                                folder: t,
                                params: { newFolderName: n },
                                context: { folder: t }
                            });
                        else {
                            var i = new s.Model({
                                    dialogMessage: o.lang.folders.newNameLabel,
                                    folderName: e.newFolderName,
                                    error: !1
                                }), r = o.request('dialog', {
                                    view: new a({
                                        finder: o,
                                        model: i
                                    }),
                                    name: 'CreateFolder',
                                    title: o.lang.common.newNameDialogTitle,
                                    context: { parent: t }
                                });
                            i.on('change:error', function (e, t) {
                                t ? r.disableButton('ok') : r.enableButton('ok');
                            });
                        }
                    }), o.on('dialog:CreateFolder:ok', function (e) {
                        var t = e.data.view.model;
                        if (!t.get('error')) {
                            var n = t.get('folderName');
                            e.finder.request('dialog:destroy'), o.request('folder:create', {
                                parent: e.data.context.parent,
                                newFolderName: n
                            });
                        }
                    }), o.on('contextMenu:folder:edit', function (e) {
                        var t = e.finder, n = e.data.context.folder;
                        e.data.items.add({
                            name: 'CreateFolder',
                            label: t.lang.folders.newSubfolder,
                            isActive: n.get('acl').folderCreate,
                            icon: 'ckf-folder-add',
                            action: function () {
                                t.request('folder:create', { parent: n });
                            }
                        });
                    }), o.on('toolbar:reset:Main:folder', function (e) {
                        var t = e.data.folder;
                        t.get('acl').folderCreate && e.data.toolbar.push({
                            type: 'button',
                            name: 'CreateFolder',
                            priority: 70,
                            icon: 'ckf-folder-add',
                            label: e.finder.lang.folders.newSubfolder,
                            action: function () {
                                o.request('folder:create', { parent: t });
                            }
                        });
                    }), o.on('command:after:CreateFolder', e);
                };
            }), CKFinder.define('text!CKFinder/Templates/DeleteFile/DeleteFileError.dot', [], function () {
                return '{{? it.msg }}<p>{{= it.msg }}</p>{{?}}\n<ul>\n{{~ it.errors :error }}<li>{{= error }}</li>{{~}}\n</ul>\n';
            }), CKFinder.define('CKFinder/Modules/DeleteFile/DeleteFile', [
                'underscore',
                'backbone',
                'text!CKFinder/Templates/DeleteFile/DeleteFileError.dot',
                'CKFinder/Util/KeyCode'
            ], function (o, s, a, r) {
                'use strict';
                var l = 302;
                function t(e) {
                    var t, n = this.finder, i = e.files;
                    i[0].get('folder').get('acl').fileDelete ? (t = 1 < i.length ? n.lang.files.deleteConfirmation.replace('{count}', i.length) : n.lang.files.fileDeleteConfirmation.replace('{name}', function () {
                        return n.util.escapeHtml(i[0].get('name'));
                    }), n.request('dialog:confirm', {
                        name: 'DeleteFileConfirm',
                        msg: t,
                        context: { files: i }
                    })) : n.request('dialog:info', { msg: n.lang.errors.deleteFilePermissions });
                }
                function n(e) {
                    e.finder.request('folder:getActive').get('acl').fileDelete && e.data.toolbar.push({
                        type: 'button',
                        name: 'DeleteFiles',
                        priority: 10,
                        icon: 'ckf-file-delete',
                        label: e.finder.lang.common.delete,
                        action: function () {
                            e.finder.request('files:delete', { files: e.finder.request('files:getSelected').toArray() });
                        }
                    });
                }
                function i(e) {
                    var t = this.finder, n = t.request('files:getSelected'), i = 1 < n.length;
                    e.data.items.add({
                        name: 'DeleteFiles',
                        label: t.lang.common.delete,
                        isActive: e.data.context.file.get('folder').get('acl').fileDelete,
                        icon: 'ckf-file-delete',
                        action: function () {
                            t.request('files:delete', { files: i ? n.toArray() : [e.data.context.file] });
                        }
                    });
                }
                function u(e) {
                    var t = e.data.context.files, n = [], i = e.finder;
                    t instanceof s.Collection && (t = t.toArray()), o.forEach(t, function (e) {
                        var t = e.get('folder');
                        n.push({
                            name: e.get('name'),
                            type: t.get('resourceType'),
                            folder: t.getPath()
                        });
                    });
                    var r = i.request('folder:getActive');
                    i.request('loader:show', { text: i.lang.common.pleaseWait }), i.request('command:send', {
                        name: 'DeleteFiles',
                        type: 'post',
                        post: { files: n },
                        sendPostAsJson: !0,
                        folder: r,
                        context: { files: t }
                    });
                }
                function c(e) {
                    var t = e.data.response;
                    e.finder.request('loader:hide'), t.error || (o.forEach(e.data.context.files, function (e) {
                        e.get('folder').get('children').remove(e);
                    }), e.finder.fire('files:deleted', { files: e.data.context.files }, e.finder));
                }
                function d(t) {
                    var e = t.data.response;
                    if (e.error.number === l) {
                        t.cancel();
                        var n = !!e.deleted, i = t.finder.lang.errors.codes[l], r = [];
                        o.forEach(e.error.errors, function (e) {
                            r.push(e.name + ': ' + t.finder.lang.errors.codes[e.number]), 117 === e.number && (n = !0);
                        }), t.finder.request('dialog', {
                            name: 'DeleteFilesErrors',
                            title: t.finder.lang.errors.operationCompleted,
                            template: a,
                            templateModel: new s.Model({
                                deleted: e.deleted,
                                errors: r,
                                msg: i
                            }),
                            buttons: ['okClose']
                        }), n && t.finder.request('folder:refreshFiles');
                    }
                }
                return function (e) {
                    (this.finder = e).setHandler('files:delete', t, this), e.on('dialog:DeleteFileConfirm:ok', u), e.on('command:after:DeleteFiles', c), e.on('command:error:DeleteFiles', d), e.on('contextMenu:file', function (e) {
                        e.data.groups.add({ name: 'delete' });
                    }, null, null, 40), e.on('contextMenu:file:delete', i, this), e.on('toolbar:reset:Main:file', n), e.on('toolbar:reset:Main:files', n), function (i) {
                        i.on('file:keydown', function (e) {
                            if (e.data.evt.keyCode === r.delete && i.util.isShortcut(e.data.evt, '')) {
                                var t = i.request('files:getSelected'), n = 1 < t.length ? t.toArray() : [e.data.file];
                                i.request('files:delete', { files: n });
                            }
                        }), i.on('shortcuts:list:files', function (e) {
                            e.data.shortcuts.add({
                                label: e.finder.lang.shortcuts.files.delete,
                                shortcuts: '{del}'
                            });
                        }, null, null, 30);
                    }(e);
                };
            }), CKFinder.define('CKFinder/Modules/DeleteFolder/DeleteFolder', ['CKFinder/Util/KeyCode'], function (n) {
                'use strict';
                return function (r) {
                    r.on('dialog:DeleteFolderConfirm:ok', function (e) {
                        var t = e.data.context.folder;
                        r.request('loader:show', { text: r.lang.common.pleaseWait }), r.request('command:send', {
                            name: 'DeleteFolder',
                            type: 'post',
                            folder: t,
                            context: { folder: t }
                        }, r);
                    }), r.on('command:after:DeleteFolder', function (e) {
                        var t = e.data.response, n = e.data.context.folder;
                        if (r.request('loader:hide'), !t.error) {
                            var i = n.get('parent');
                            n.unset('parent'), i.get('children').remove(n), r.request('folder:getActive').cid === n.cid && r.request('folder:select', { folder: i }), r.fire('folder:deleted', { folder: n });
                        }
                    }), r.on('toolbar:reset:Main:folder', function (e) {
                        var t = e.data.folder;
                        !t.get('isRoot') && t.get('acl').folderDelete && e.data.toolbar.push({
                            type: 'button',
                            name: 'DeleteFolder',
                            priority: 20,
                            icon: 'ckf-folder-delete',
                            label: e.finder.lang.common.delete,
                            action: function () {
                                r.request('folder:delete', { folder: t });
                            }
                        });
                    }), r.on('contextMenu:folder', function (e) {
                        e.data.groups.add({ name: 'delete' });
                    }, null, null, 20), r.on('contextMenu:folder:delete', function (e) {
                        var t = e.finder, n = e.data.context.folder, i = n.get('isRoot'), r = n.get('acl');
                        e.data.items.add({
                            name: 'DeleteFolder',
                            label: t.lang.common.delete,
                            isActive: !i && r.folderDelete,
                            icon: 'ckf-folder-delete',
                            action: function () {
                                t.request('folder:delete', { folder: n });
                            }
                        });
                    }), r.setHandler('folder:delete', function (e) {
                        var t = e.folder;
                        r.request('dialog:confirm', {
                            name: 'DeleteFolderConfirm',
                            context: { folder: t },
                            msg: r.lang.folders.deleteConfirmation.replace('{name}', function () {
                                return r.util.escapeHtml(t.get('name'));
                            })
                        });
                    }), function (t) {
                        t.on('folder:keydown', function (e) {
                            e.data.folder.get('isRoot') || e.data.evt.keyCode === n.delete && e.finder.util.isShortcut(e.data.evt, '') && (e.data.evt.preventDefault(), e.data.evt.stopPropagation(), t.request('folder:delete', { folder: e.data.folder }));
                        }), t.on('shortcuts:list:folders', function (e) {
                            e.data.shortcuts.add({
                                label: e.finder.lang.shortcuts.folders.delete,
                                shortcuts: '{del}'
                            });
                        }, null, null, 30);
                    }(r);
                };
            }), CKFinder.define('CKFinder/Views/Base/LayoutView', [
                'marionette',
                'CKFinder/Views/Base/Common'
            ], function (t, n) {
                'use strict';
                return t.LayoutView.extend(n.proto).extend({
                    constructor: function (e) {
                        n.util.construct.call(this, e), t.LayoutView.prototype.constructor.apply(this, Array.prototype.slice.call(arguments));
                    }
                });
            }), CKFinder.define('CKFinder/Views/Base/CollectionView', [
                'underscore',
                'marionette',
                'CKFinder/Views/Base/Common'
            ], function (i, e, t) {
                'use strict';
                var n = e.CollectionView;
                return n.extend(t.proto).extend({
                    constructor: function (e) {
                        t.util.construct.call(this, e), n.prototype.constructor.apply(this, Array.prototype.slice.call(arguments));
                    },
                    buildChildView: function (e, t, n) {
                        return new t(i.extend({
                            model: e,
                            finder: this.finder
                        }, n));
                    }
                });
            }), CKFinder.define('CKFinder/Modules/Dialogs/Views/DialogButtonView', [
                'CKFinder/Util/KeyCode',
                'CKFinder/Views/Base/ItemView'
            ], function (t, e) {
                'use strict';
                return e.extend({
                    name: 'DialogButton',
                    tagName: 'button',
                    template: '{{= it.label }}',
                    attributes: { tabindex: 1 },
                    events: {
                        click: function () {
                            this.trigger('button');
                        },
                        keydown: function (e) {
                            e.keyCode !== t.enter && e.keyCode !== t.space || (e.preventDefault(), this.trigger('button'));
                        }
                    },
                    onRender: function () {
                        this.$el.attr('data-inline', !0).attr('data-ckf-button', this.model.get('name'));
                    }
                });
            }), CKFinder.define('CKFinder/Modules/Dialogs/Views/DialogButtonsView', [
                'underscore',
                'backbone',
                'CKFinder/Views/Base/CollectionView',
                'CKFinder/Modules/Dialogs/Views/DialogButtonView'
            ], function (r, t, e, n) {
                'use strict';
                return e.extend({
                    name: 'DialogButtons',
                    childView: n,
                    initialize: function (e) {
                        this.collection = function (e, n) {
                            var i = new t.Collection();
                            return r.forEach(e, function (e) {
                                var t = r.isString(e) ? e : e.name;
                                i.push(r.extend({
                                    icons: {},
                                    label: t,
                                    name: t,
                                    event: t.toLocaleLowerCase()
                                }, r.isString(e) ? n[t] : e));
                            }), i;
                        }(e.buttons, {
                            okClose: {
                                label: this.finder.lang.common.ok,
                                icons: { primary: 'ui-icon-check' },
                                event: 'ok'
                            },
                            cancel: {
                                label: this.finder.lang.common.cancel,
                                icons: { primary: 'ui-icon-close' }
                            },
                            ok: {
                                label: this.finder.lang.common.ok,
                                icons: { primary: 'ui-icon-check' }
                            }
                        });
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/Dialogs/DialogLayout.dot', [], function () {
                return '{{? it.title }}<div data-role="header" class="ui-title"><h1>{{= it.title }}</h1></div>{{?}}\n<div id="ckf-dialog-contents-{{= it.id }}" class="ckf-dialog-contents {{= it.contentClassName }}"></div>\n{{? it.hasButtons }}<div class="ui-content ckf-dialog-buttons" id="ckf-dialog-buttons-{{= it.id }}"></div>{{?}}\n';
            }), CKFinder.define('CKFinder/Modules/Dialogs/Views/DialogView', [
                'underscore',
                'jquery',
                'CKFinder/Util/KeyCode',
                'CKFinder/Views/Base/LayoutView',
                'CKFinder/Modules/Dialogs/Views/DialogButtonsView',
                'text!CKFinder/Templates/Dialogs/DialogLayout.dot'
            ], function (s, t, o, e, n, i) {
                'use strict';
                return e.extend({
                    template: i,
                    className: 'ckf-dialog',
                    ui: { title: '.ui-title:first' },
                    attributes: { role: 'dialog' },
                    regions: function (e) {
                        return {
                            contents: '#ckf-dialog-contents-' + e.id,
                            buttons: '#ckf-dialog-buttons-' + e.id
                        };
                    },
                    initialize: function () {
                        this.listenTo(this.contents, 'show', function () {
                            this.$el.trigger('create');
                        }, this), t('.ui-popup-container').remove();
                    },
                    onRender: function () {
                        var e = s.uniqueId(), t = 'ckf-dialog-label-' + e;
                        this.$el.attr('data-theme', this.finder.config.swatch).attr('aria-labelledby', t).attr('aria-describedby', this.regions.contents.replace('#', '')).appendTo('body'), this.options.ariaLabelId && this.$el.attr('aria-labelledby', this.$el.attr('aria-labelledby') + ' ' + this.regions.contents.replace('#', '')), this.ui.title.attr({
                            id: t,
                            'aria-live': 'polite'
                        }), this.contents.show(this.getOption('innerView')), this._addButtons(), this.$el.trigger('create'), this.$el.popup(this._getUiConfig()), this.$el.parent().addClass('ui-dialog-popup');
                        try {
                            this.$el.popup('open', this.options.uiOpen || {});
                        } catch (e) {
                        }
                        this.$el.find('.ckf-dialog-buttons button[data-ckf-button="okClose"],.ckf-dialog-buttons button[data-ckf-button="ok"]').first().trigger('focus');
                        var n = this.getOption('focusItem');
                        if (n) {
                            var i = s.isString(n) ? n : 'input, textarea, select', r = this.$el.find(i).first();
                            r.length && r.trigger('focus');
                        }
                        return this.options.restrictHeight && this.restrictHeight(), this.$el.on('keydown', function (e) {
                            e.keyCode !== o.tab && e.stopPropagation();
                        }), this;
                    },
                    onDestroy: function () {
                        try {
                            this.$el.popup('close'), this.$el.off('keydown'), this.$el.remove();
                        } catch (e) {
                        }
                    },
                    getButton: function (e) {
                        return this.$el.popup('widget').find('button[data-ckf-button="' + e + '"]');
                    },
                    enableButton: function (e) {
                        this.getButton(e).removeClass('ui-state-disabled').attr('aria-disabled', 'false');
                    },
                    disableButton: function (e) {
                        this.getButton(e).addClass('ui-state-disabled').attr('aria-disabled', 'true');
                    },
                    restrictHeight: function () {
                        if (!this.isDestroyed) {
                            var e = t(window).height() - this.ui.title.outerHeight() - this.buttons.$el.outerHeight() - this.$el.parent().position().top - 20;
                            this.contents.$el.css('max-height', parseInt(e, 10) + 'px');
                        }
                    },
                    _fixTopOffset: function () {
                        var e = this.$el.parent().css('top'), t = parseInt(e) - (window.scrollY || window.pageYOffset);
                        this.$el.parent().css('top', t);
                    },
                    _addButtons: function () {
                        var e = this.getOption('buttons');
                        if (e) {
                            var i = this, t = new n({
                                    finder: this.finder,
                                    buttons: e
                                });
                            this.listenTo(t, 'childview:button', function (e) {
                                var t = e.model.get('event'), n = e.model.get('name');
                                n !== 'cancel' && n !== 'okClose' || i.destroy(), i.finder.fire('dialog:' + i.getOption('dialog') + ':' + t, i.getOption('clickData'), i.finder);
                            }), this.buttons.show(t);
                        }
                    },
                    _getUiConfig: function () {
                        var n = this, i = {}, r = this.getOption('uiOptions');
                        r && s.forEach([
                            'create',
                            'afterclose',
                            'beforeposition'
                        ], function (e) {
                            i[e] = r[e], delete r[e];
                        });
                        var e = {
                                create: function () {
                                    n.contents.$el.css({
                                        minWidth: n.getOption('minWidth'),
                                        minHeight: n.getOption('minHeight'),
                                        maxHeight: window.innerHeight
                                    }), o('create', this, arguments);
                                },
                                afterclose: function () {
                                    n.destroy(), n.finder.fire('dialog:close:' + n.getOption('dialog'), {
                                        context: n.context,
                                        me: n
                                    }), o('afterclose', this, arguments);
                                },
                                afteropen: function () {
                                    n._fixTopOffset(), o('afteropen', this, arguments);
                                },
                                beforeposition: function (e, t) {
                                    r && r.positionTo && (delete t.x, delete t.y, t.positionTo = r.positionTo), setTimeout(function () {
                                        n.options.restrictHeight && n.restrictHeight();
                                    }, 0), o('beforeposition', this, arguments);
                                }
                            }, t = n.finder.config.dialogOverlaySwatch;
                        return t && (e.overlayTheme = s.isBoolean(t) ? n.finder.config.swatch : t), s.extend(e, r);
                        function o(e, t, n) {
                            i[e] && i[e].apply(t, n);
                        }
                    }
                });
            }), CKFinder.define('CKFinder/Views/MessageView', [
                'underscore',
                'backbone',
                'CKFinder/Views/Base/ItemView'
            ], function (t, n, e) {
                'use strict';
                return e.extend({
                    name: 'MessageView',
                    className: 'ckf-message',
                    template: '<span id="{{= it.id }}">{{= it.msg }}</span>',
                    initialize: function (e) {
                        this.model = new n.Model({
                            msg: e.msg,
                            id: e.id ? e.id : t.uniqueId()
                        });
                    }
                });
            }), CKFinder.define('CKFinder/Modules/Dialogs/Dialogs', [
                'underscore',
                'jquery',
                'backbone',
                'CKFinder/Util/KeyCode',
                'CKFinder/Modules/Dialogs/Views/DialogView',
                'CKFinder/Views/Base/ItemView',
                'CKFinder/Views/MessageView'
            ], function (s, n, a, t, l, u, i) {
                'use strict';
                function r(e) {
                    var t = this.finder;
                    if (d(), !e.name)
                        throw 'Name parameter must be specified for dialog';
                    var n = !!s.isUndefined(e.captureFormSubmit) || e.captureFormSubmit, i = function (e, t, n) {
                            var i;
                            if (e.view)
                                i = e.view;
                            else {
                                var r = {
                                    name: e.name,
                                    finder: t,
                                    template: e.template
                                };
                                n && (r.triggers = {
                                    'submit form': {
                                        event: 'submit:form',
                                        preventDefault: !0,
                                        stopPropagation: !1
                                    }
                                }), i = new (u.extend(r))({ model: e.templateModel });
                            }
                            return i;
                        }(e, t, n), r = function (e, t, n) {
                            var i = {
                                context: t.context,
                                finder: e,
                                name: 'Dialog',
                                dialog: t.name,
                                id: s.uniqueId('ckf'),
                                minWidth: t.minWidth ? t.minWidth : e.config.dialogMinWidth,
                                minHeight: t.minHeight ? t.minHeight : e.config.dialogMinHeight,
                                focusItem: s.isUndefined(t.focusItem) ? e.config.dialogFocusItem : t.focusItem,
                                buttons: s.isUndefined(t.buttons) ? [
                                    'cancel',
                                    'ok'
                                ] : t.buttons,
                                captureFormSubmit: !!s.isUndefined(t.captureFormSubmit) || t.captureFormSubmit,
                                restrictHeight: !s.isUndefined(t.restrictHeight) && t.restrictHeight,
                                uiOptions: t.uiOptions
                            };
                            t.ariaLabelId && (i.ariaLabelId = t.ariaLabelId);
                            return i.model = new a.Model({
                                id: i.id,
                                title: t.title,
                                hasButtons: !s.isUndefined(i.buttons),
                                contentClassName: s.isUndefined(t.contentClassName) ? ' ui-content' : !1 === t.contentClassName ? '' : ' ' + t.contentClassName
                            }), i.clickData = {
                                model: t.templateModel,
                                view: n,
                                context: t.context
                            }, i.innerView = n, i;
                        }(t, e, i), o = new l(r);
                    return t.request('focus:remember'), o.on('destroy', function () {
                        t.request('focus:restore');
                    }), n && o.listenTo(i, 'submit:form', function () {
                        return t.fire('dialog:' + e.name + ':ok', r.clickData, t), !1;
                    }), o.render(), t.request('focus:trap', { node: o.$el }), o;
                }
                function o(e) {
                    var t = s.uniqueId('ckf-message-'), n = s.extend({
                            name: 'Info',
                            buttons: ['okClose'],
                            view: new i({
                                msg: e.msg,
                                finder: this.finder,
                                id: t
                            }),
                            transition: 'flip',
                            ariaLabelId: t
                        }, e);
                    return r.call(this, n);
                }
                function c(e) {
                    var t = s.uniqueId('ckf-message-'), n = s.extend({
                            name: 'Confirm',
                            buttons: [
                                'cancel',
                                'okClose'
                            ],
                            title: this.finder.lang.common.messageTitle,
                            view: new i({
                                msg: e.msg,
                                finder: this.finder,
                                id: t
                            }),
                            ariaLabelId: t
                        }, e);
                    return r.call(this, n);
                }
                function d() {
                    n('.ckf-dialog').popup('close'), n('.ui-popup-container').remove();
                }
                return function (e) {
                    (this.finder = e).setHandlers({
                        dialog: {
                            callback: r,
                            context: this
                        },
                        'dialog:info': {
                            callback: o,
                            context: this
                        },
                        'dialog:confirm': {
                            callback: c,
                            context: this
                        },
                        'dialog:destroy': d
                    }), e.request('key:listen', { key: t.escape }), e.on('keyup:27', function (e) {
                        var t;
                        n('.ckf-dialog').length && ((t = e.data.evt).preventDefault(), t.stopPropagation(), d());
                    }, null, null, 20);
                };
            }), CKFinder.define('text!CKFinder/Templates/EditImage/EditImageLayout.dot', [], function () {
                return '<div class="ckf-ei-wrapper">\n\t<div id="ckf-ei-preview" class="ckf-ei-preview"></div>\n\t<div id="ckf-ei-actions" class="ckf-ei-controls ui-body-{{= it.swatch }}"></div>\n</div>\n';
            }), CKFinder.define('CKFinder/Modules/EditImage/Views/EditImageLayout', [
                'CKFinder/Views/Base/LayoutView',
                'text!CKFinder/Templates/EditImage/EditImageLayout.dot'
            ], function (e, t) {
                'use strict';
                return e.extend({
                    name: 'EditImageLayout',
                    template: t,
                    regions: {
                        preview: '#ckf-ei-preview',
                        actions: '#ckf-ei-actions'
                    },
                    templateHelpers: function () {
                        return { swatch: this.finder.config.swatch };
                    },
                    onActionsExpand: function () {
                        this.preview.$el.addClass('ckf-ei-preview-reduced');
                    },
                    onActionsCollapse: function () {
                        this.preview.$el.removeClass('ckf-ei-preview-reduced');
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/EditImage/ImagePreview.dot', [], function () {
                return '<canvas class="ckf-ei-canvas"></canvas>\n';
            }), CKFinder.define('CKFinder/Modules/EditImage/Views/ImagePreviewView', [
                'CKFinder/Views/Base/ItemView',
                'text!CKFinder/Templates/EditImage/ImagePreview.dot'
            ], function (e, t) {
                'use strict';
                return e.extend({
                    name: 'ImagePreview',
                    template: t,
                    ui: { canvas: '.ckf-ei-canvas' }
                });
            }), CKFinder.define('text!CKFinder/Templates/EditImage/Action.dot', [], function () {
                return '<div data-role="collapsible" data-collapsed-icon="{{= it.icon}}" data-expanded-icon="{{= it.icon}}" data-iconpos="right" data-inset="false" tabindex="-1">\n    <h4 id="{{= it.id }}-tab" class="ckf-ei-action-title" role="tab" aria-controls="{{= it.id }}-tabpanel">{{= it.title }}</h4>\n    <div class="ckf-ei-action-controls"></div>\n</div>\n';
            }), CKFinder.define('CKFinder/Modules/EditImage/Views/ActionView', [
                'underscore',
                'jquery',
                'CKFinder/Util/KeyCode',
                'CKFinder/Views/Base/LayoutView',
                'text!CKFinder/Templates/EditImage/Action.dot'
            ], function (e, t, n, i, r) {
                'use strict';
                return i.extend({
                    name: 'ActionView',
                    template: r,
                    className: 'ckf-ei-action',
                    ui: {
                        heading: '.ckf-ei-action-title',
                        controls: '.ckf-ei-action-controls'
                    },
                    regions: { action: '.ckf-ei-action-controls' },
                    events: {
                        collapsiblecollapse: function () {
                            this.model.get('tool').trigger('collapse'), this.ui.heading.attr('aria-expanded', 'false').find('.ui-btn').removeClass('ui-btn-active'), this.trigger('collapse'), this.isExpanded = !1, this.ui.controls.find('[tabindex]').attr('tabindex', '-1');
                        },
                        collapsibleexpand: function () {
                            this.model.get('tool').trigger('expand'), this.ui.heading.attr('aria-expanded', 'true').find('.ui-btn').addClass('ui-btn-active'), this.trigger('expand'), this.isExpanded = !0, this.ui.controls.find('[tabindex]').attr('tabindex', this.model.get('tabindex'));
                        },
                        collapsiblecreate: function () {
                            this.$el.find('.ui-collapsible-heading-toggle').attr('tabindex', this.model.get('tabindex')), this.ui.heading.attr('aria-expanded', 'false'), this.isExpanded = !1;
                            var e = this.model.get('id');
                            this.$el.find('.ui-collapsible-content').attr({
                                id: e + '-tabpanel',
                                role: 'tabpanel',
                                'aria-labelledby': e + '-tab'
                            });
                        },
                        'keydown .ui-collapsible-heading-toggle': function (e) {
                            if (e.keyCode === n.space || e.keyCode === n.enter) {
                                e.stopPropagation(), e.preventDefault();
                                var t = this.$el.find('.ui-collapsible').collapsible('option', 'collapsed') ? 'expand' : 'collapse';
                                this.$el.find('.ui-collapsible').collapsible(t);
                            }
                        },
                        'keydown [tabindex]': function (e) {
                            e.keyCode === n.tab && (!this.isExpanded && e.target === this.ui.heading.find('.ui-collapsible-heading-toggle').get(0) || this.ui.controls.find('[tabindex]').last().get(0) === e.target) && this.trigger('tabRequest', e);
                        }
                    },
                    initialize: function () {
                        this.model.set('id', e.uniqueId());
                    },
                    collapse: function () {
                        this.$el.find('.ui-collapsible').collapsible('collapse');
                    },
                    onRender: function () {
                        this.action.show(this.model.get('tool').getView(this.finder)), this.$el.attr('data-ckf-ei-tool', this.model.get('tool').get('name'));
                    }
                });
            }), CKFinder.define('CKFinder/Modules/EditImage/Views/ActionsView', [
                'jquery',
                'CKFinder/Views/Base/CollectionView',
                'CKFinder/Modules/EditImage/Views/ActionView'
            ], function (i, e, t) {
                'use strict';
                return e.extend({
                    name: 'ActionsView',
                    attributes: {
                        'data-role': 'collapsibleset',
                        role: 'tablist'
                    },
                    childView: t,
                    childViewContainer: '#ckf-edit-image-actions',
                    childEvents: {
                        expand: function (t) {
                            this.children.forEach(function (e) {
                                e.cid === t.cid || e.ui.heading.hasClass('ui-collapsible-heading-collapsed') || e.collapse();
                            });
                        },
                        tabRequest: function (e, t) {
                            this.finder.util.isShortcut(t, '') && this.children.last() !== e && this.finder.request('focus:next', {
                                node: e.$el.find('[tabindex]').not('[tabindex="-1"]').last(),
                                event: t
                            });
                        }
                    },
                    initialize: function () {
                        var e = this.finder;
                        this.collection.on('imageData:ready', function () {
                            n(e.request('ui:getMode'), e), i.mobile.resetActivePageHeight();
                        }), e.on('ui:resize', r);
                    },
                    onDestroy: function () {
                        this.finder.removeListener('ui:resize', r);
                    },
                    focusFirst: function () {
                        this.$el.find('.ui-collapsible-heading-toggle').first().trigger('focus');
                    }
                });
                function n(e, t) {
                    var n = e === 'desktop';
                    i('.ckf-ei-controls .ui-collapsible-heading-toggle').toggleClass('ui-corner-all ui-btn-icon-notext', !n).toggleClass(t.lang.dir === 'ltr' ? 'ui-btn-icon-left' : 'right', n);
                }
                function r(e) {
                    e.data.modeChanged && n(e.data.mode, e.finder);
                }
            }), CKFinder.define('CKFinder/Modules/EditImage/Models/EditImageData', ['backbone'], function (e) {
                'use strict';
                return e.Model.extend({
                    defaults: {
                        file: null,
                        caman: null,
                        imagePreview: '',
                        fullImagePreview: '',
                        actions: null
                    },
                    initialize: function () {
                        this.set('actions', new e.Collection());
                    }
                });
            }), CKFinder.define('CKFinder/Modules/EditImage/Tools/Tool', ['backbone'], function (e) {
                'use strict';
                return e.Model.extend({
                    getActionData: function () {
                        return new e.Model({});
                    },
                    saveDeferred: function (e, t) {
                        return t;
                    },
                    getView: function (e) {
                        var t = new (this.get('viewClass'))({
                            finder: e,
                            model: this.getActionData()
                        });
                        return this.set('view', t), t;
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/EditImage/Crop.dot', [], function () {
                return '<div class="ckf-ei-crop-controls-inputs">\n\t<label>\n\t\t{{= it.lang.editImage.keepAspectRatio }}\n\t\t<input name="ckfCropKeepAspectRatio" tabindex="{{= it.tabindex }}" type="checkbox"{{? it.keepAspectRatio }} checked="checked"{{?}} data-iconpos="{{? it.lang.dir == \'ltr\'}}left{{??}}right{{?}}">\n\t</label>\n\t<button id="ckf-ei-crop-apply" tabindex="{{= it.tabindex }}" data-icon="ckf-tick" data-iconpos="{{? it.lang.dir == \'ltr\'}}left{{??}}right{{?}}">{{= it.lang.editImage.apply }}</button>\n</div>\n';
            }), CKFinder.define('CKFinder/Modules/EditImage/Views/CropView', [
                'CKFinder/Util/KeyCode',
                'CKFinder/Views/Base/ItemView',
                'text!CKFinder/Templates/EditImage/Crop.dot'
            ], function (t, e, n) {
                'use strict';
                return e.extend({
                    name: 'CropView',
                    template: n,
                    className: 'ckf-ei-crop-controls',
                    ui: {
                        keepAspectRatio: 'input[name="ckfCropKeepAspectRatio"]',
                        apply: '#ckf-ei-crop-apply'
                    },
                    triggers: { 'click @ui.apply': 'apply' },
                    events: {
                        'change @ui.keepAspectRatio': function (e) {
                            e.stopPropagation(), e.preventDefault(), this.model.set('keepAspectRatio', this.ui.keepAspectRatio.is(':checked'));
                        },
                        'keyup @ui.keepAspectRatio': function (e) {
                            e.keyCode !== t.space && e.keyCode !== t.enter || (e.preventDefault(), e.stopPropagation(), this.ui.keepAspectRatio.prop('checked', !this.ui.keepAspectRatio.is(':checked')).checkboxradio('refresh').trigger('change'));
                        },
                        'keydown @ui.apply': function (e) {
                            e.keyCode !== t.space && e.keyCode !== t.enter || this.trigger('apply');
                        }
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/EditImage/CropBox.dot', [], function () {
                return '<div class="ckf-ei-crop">\n\t<div class="ckf-ei-crop-resize" tabindex="{{= it.tabindex + 1 }}"></div>\n\t<div class="ckf-ei-crop-info"></div>\n</div>';
            }), CKFinder.define('CKFinder/Modules/EditImage/Views/CropBoxView', [
                'jquery',
                'CKFinder/Views/Base/ItemView',
                'text!CKFinder/Templates/EditImage/CropBox.dot'
            ], function (n, e, t) {
                'use strict';
                return e.extend({
                    name: 'CropBoxView',
                    className: 'ckf-ei-crop-wrap',
                    template: t,
                    ui: {
                        cropBox: '.ckf-ei-crop',
                        cropResize: '.ckf-ei-crop-resize',
                        cropInfo: '.ckf-ei-crop-info'
                    },
                    events: {
                        'vmousedown @ui.cropBox': 'onMouseDown',
                        'vmouseup @ui.cropBox': 'onMouseUp',
                        'vmousedown @ui.cropResize': 'onMouseDownOnResize',
                        'vmouseup @ui.cropResize': 'onMouseUpOnResize'
                    },
                    modelEvents: {
                        change: 'updatePosition',
                        'change:keepAspectRatio': function () {
                            if (this.model.get('keepAspectRatio')) {
                                var e = this.model.get('renderHeight'), t = this.model.get('maxRenderHeight'), n = this.model.get('maxRenderWidth'), i = t - this.model.get('renderY'), r = n - this.model.get('renderX');
                                i < e && (e = i);
                                var o = parseInt(e * n / t, 10);
                                r < o && (o = r, e = parseInt(o * t / n, 10)), this.model.set({
                                    renderWidth: o,
                                    renderHeight: e
                                });
                            }
                        }
                    },
                    onRender: function () {
                        var e;
                        e = this.model.get('canvas'), this.$el.css({
                            width: this.model.get('maxRenderWidth'),
                            height: this.model.get('maxRenderHeight')
                        }), this.ui.cropBox.css({
                            backgroundImage: 'url(' + e.toDataURL() + ')',
                            backgroundSize: this.model.get('maxRenderWidth') + 'px ' + this.model.get('maxRenderHeight') + 'px'
                        }), this.updatePosition();
                    },
                    onMouseDown: function (e) {
                        var t = this;
                        e.stopPropagation(), n(window).on('vmousemove', {
                            model: t.model,
                            view: t,
                            moveStart: {
                                x: e.clientX - t.model.get('renderX'),
                                y: e.clientY - t.model.get('renderY')
                            }
                        }, t.mouseMove), n(window).one('vmouseup', function () {
                            t.onMouseUp();
                        });
                    },
                    onMouseUp: function (e) {
                        e && e.stopPropagation(), n(window).off('vmousemove', this.mouseMove);
                    },
                    mouseMove: function (e) {
                        var t, n, i, r, o, s, a, l;
                        t = e.data.model, n = e.data.view.ui.cropBox, i = e.clientX - e.data.moveStart.x, r = e.clientY - e.data.moveStart.y, o = n.outerWidth(), s = n.outerHeight(), i = (a = t.get('maxRenderWidth') - o) < (i = i < 0 ? 0 : i) ? a : i, r = (l = t.get('maxRenderHeight') - s) < (r = r < 0 ? 0 : r) ? l : r, t.set({
                            renderX: i,
                            renderY: r
                        });
                    },
                    onMouseDownOnResize: function (e) {
                        var t = this;
                        e.stopPropagation(), n(window).on('vmousemove', {
                            model: t.model,
                            view: t,
                            moveStart: {
                                x: e.clientX - t.model.get('renderWidth'),
                                y: e.clientY - t.model.get('renderHeight')
                            }
                        }, t.mouseResize), n(window).one('vmouseup', function () {
                            t.onMouseUpOnResize();
                        });
                    },
                    onMouseUpOnResize: function () {
                        n(window).off('vmousemove', this.mouseResize);
                    },
                    mouseResize: function (e) {
                        var t, n, i, r, o, s;
                        n = (t = e.data.model).get('minCrop'), i = e.clientX - e.data.moveStart.x, r = e.clientY - e.data.moveStart.y, o = t.get('maxRenderWidth') - t.get('renderX'), s = t.get('maxRenderHeight') - t.get('renderY'), r = r < n ? n : r, i = i < n ? n : i, t.get('keepAspectRatio') && (i = parseInt(r * t.get('maxRenderWidth') / t.get('maxRenderHeight'), 10)), i = o < i ? o : i, r = s < r ? s : r, t.set({
                            renderWidth: i,
                            renderHeight: r
                        });
                    },
                    updatePosition: function () {
                        var e = this.model.get('renderX'), t = this.model.get('renderY'), n = (this.ui.cropBox.outerWidth() - this.ui.cropBox.width()) / 2;
                        this.ui.cropBox.css({
                            top: t + 'px',
                            left: e + 'px',
                            width: this.model.get('renderWidth') - 2 * n + 'px',
                            height: this.model.get('renderHeight') - 2 * n + 'px',
                            backgroundPosition: -e - n + 'px ' + (-t - n) + 'px'
                        }), this.ui.cropInfo.text(this.model.get('width') + 'x' + this.model.get('height')), this.ui.cropInfo.attr('data-ckf-position', this.model.get('x') + ',' + this.model.get('y'));
                    }
                });
            }), CKFinder.define('CKFinder/Modules/EditImage/Tools/CropTool', [
                'backbone',
                'jquery',
                'CKFinder/Modules/EditImage/Tools/Tool',
                'CKFinder/Modules/EditImage/Views/CropView',
                'CKFinder/Modules/EditImage/Views/CropBoxView'
            ], function (i, s, e, t, o) {
                'use strict';
                return e.extend({
                    defaults: {
                        name: 'Crop',
                        viewClass: t,
                        view: null,
                        isVisible: !1
                    },
                    initialize: function () {
                        function e(e) {
                            var t, n, i;
                            i = e.get('renderWidth'), n = e.get('renderHeight'), t = e.get('imageWidth') / e.get('maxRenderWidth'), e.set('width', parseInt(i * t, 10)), e.set('height', parseInt(n * t, 10)), e.set('x', parseInt(e.get('renderX') * t, 10)), e.set('y', parseInt(e.get('renderY') * t, 10));
                        }
                        this.viewModel = new i.Model({
                            x: 0,
                            y: 0,
                            width: 0,
                            height: 0,
                            renderWidth: 0,
                            renderHeight: 0,
                            maxWidth: 0,
                            maxHeight: 0,
                            imageWidth: 0,
                            imageHeight: 0,
                            keepAspectRatio: !1,
                            tabindex: this.get('tabindex')
                        }), this.viewModel.on('change:renderWidth', e), this.viewModel.on('change:renderHeight', e), this.viewModel.on('change:renderX', e), this.viewModel.on('change:renderY', e), this.collection.on('imageData:ready', function () {
                            var e, t, n, i, r, o;
                            o = (e = this.get('editImageData')).get('caman').renderingCanvas, t = s(o).width(), n = s(o).height(), i = parseInt(t / 2, 10), r = parseInt(n / 2, 10), this.viewModel.set({
                                canvas: e.get('caman').renderingCanvas,
                                minCrop: 10,
                                x: e.get('imageWidth'),
                                y: e.get('imageHeight'),
                                renderX: parseInt((t - i) / 2, 10),
                                renderY: parseInt((n - r) / 2, 10),
                                width: e.get('imageWidth'),
                                height: e.get('imageHeight'),
                                renderWidth: i,
                                renderHeight: r,
                                maxRenderWidth: t,
                                maxRenderHeight: n,
                                imageWidth: e.get('imageInfo').width,
                                imageHeight: e.get('imageInfo').height
                            }), this.get('view').on('apply', function () {
                                this.cropView();
                            }, this);
                        }, this), this.on('expand', this.openCropBox, this), this.on('collapse', this.closeCropBox, this);
                        var t = this;
                        function n() {
                            t.get('isVisible') && (t.closeCropBox(), t.openCropBox());
                        }
                        this.collection.on('tool:reset:after', n), this.collection.on('ui:resize', n);
                    },
                    cropView: function () {
                        var e = this.get('editImageData'), t = e.get('caman').renderingCanvas.width / this.viewModel.get('maxRenderWidth');
                        e.get('caman').crop(parseInt(t * this.viewModel.get('renderWidth'), 10), parseInt(t * this.viewModel.get('renderHeight'), 10), parseInt(t * this.viewModel.get('renderX'), 10), parseInt(t * this.viewModel.get('renderY'), 10)), this.collection.requestThrottler();
                        var n = !1;
                        e.get('actions').forEach(function (e) {
                            e.get('tool') === 'Rotate' && (n = !n);
                        }), t = (n ? e.get('imageHeight') : e.get('imageWidth')) / this.viewModel.get('maxRenderWidth'), e.get('actions').push({
                            tool: this.get('name'),
                            data: {
                                width: parseInt(t * this.viewModel.get('renderWidth'), 10),
                                height: parseInt(t * this.viewModel.get('renderHeight'), 10),
                                x: parseInt(t * this.viewModel.get('renderX'), 10),
                                y: parseInt(t * this.viewModel.get('renderY'), 10)
                            }
                        }), this.closeCropBox();
                    },
                    openCropBox: function () {
                        var e = this.get('editImageData').get('caman').renderingCanvas, t = s(e).width(), n = s(e).height(), i = parseInt(t / 2, 10), r = parseInt(n / 2, 10);
                        this.viewModel.set({
                            maxRenderWidth: t,
                            maxRenderHeight: n,
                            renderWidth: i,
                            renderHeight: r,
                            renderX: parseInt((t - i) / 2, 10),
                            renderY: parseInt((n - r) / 2, 10)
                        }), this.cropBox = new o({
                            finder: this.collection.finder,
                            model: this.viewModel
                        }), this.cropBox.render().$el.appendTo(s(this.get('editImageData').get('caman').renderingCanvas).parent()), this.set('isVisible', !0);
                    },
                    closeCropBox: function () {
                        this.cropBox && this.cropBox.destroy(), this.set('isVisible', !1);
                    },
                    saveDeferred: function (t, e) {
                        var n, i;
                        return i = (n = new s.Deferred()).promise(), e.then(function (e) {
                            e.crop(t.width, t.height, t.x, t.y).render(function () {
                                n.resolve(this);
                            });
                        }), i;
                    },
                    getActionData: function () {
                        return this.viewModel;
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/EditImage/Rotate.dot', [], function () {
                return '<div class="ckf-ei-rotate-controls-inputs">\n\t<button id="ckf-ei-rotate-anticlockwise" tabindex="{{= it.tabindex }}" data-icon="ckf-rotate-left" data-iconpos="{{? it.lang.dir == \'ltr\'}}left{{??}}right{{?}}">{{= it.lang.editImage.rotateAntiClockwise }}</button>\n\t<button id="ckf-ei-rotate-clockwise" tabindex="{{= it.tabindex }}" data-icon="ckf-rotate-right" data-iconpos="{{? it.lang.dir == \'ltr\'}}left{{??}}right{{?}}">{{= it.lang.editImage.rotateClockwise }}</button>\n</div>\n';
            }), CKFinder.define('CKFinder/Modules/EditImage/Views/RotateView', [
                'CKFinder/Util/KeyCode',
                'CKFinder/Views/Base/ItemView',
                'text!CKFinder/Templates/EditImage/Rotate.dot'
            ], function (t, e, n) {
                'use strict';
                return e.extend({
                    name: 'RotateView',
                    template: n,
                    ui: {
                        clockwise: '#ckf-ei-rotate-clockwise',
                        antiClockwise: '#ckf-ei-rotate-anticlockwise'
                    },
                    events: {
                        'click @ui.clockwise': 'onClockwise',
                        'click @ui.antiClockwise': 'onAntiClockwise',
                        'keydown @ui.clockwise': function (e) {
                            e.keyCode !== t.space && e.keyCode !== t.enter || this.onClockwise();
                        },
                        'keydown @ui.antiClockwise': function (e) {
                            e.keyCode !== t.space && e.keyCode !== t.enter || this.onAntiClockwise();
                        }
                    },
                    onClockwise: function () {
                        this.model.unset('lastRotationAngle', { silent: !0 }), this.model.set('lastRotationAngle', 90);
                    },
                    onAntiClockwise: function () {
                        this.model.unset('lastRotationAngle', { silent: !0 }), this.model.set('lastRotationAngle', -90);
                    }
                });
            }), CKFinder.define('CKFinder/Modules/EditImage/Tools/RotateTool', [
                'jquery',
                'backbone',
                'CKFinder/Modules/EditImage/Tools/Tool',
                'CKFinder/Modules/EditImage/Views/RotateView'
            ], function (r, n, e, t) {
                'use strict';
                return e.extend({
                    defaults: {
                        name: 'Rotate',
                        viewClass: t,
                        view: null,
                        rotationApplied: !1
                    },
                    initialize: function () {
                        var t = this;
                        function e() {
                            var e = t.get('editImageData').get('actions');
                            e.remove(e.where({ tool: t.get('name') })), t.viewModel.set('angle', 0), t.viewModel.set('lastRotationAngle', 0);
                        }
                        this.viewModel = new n.Model({
                            angle: 0,
                            lastRotationAngle: 0,
                            tabindex: this.get('tabindex')
                        }), this.viewModel.on('change:lastRotationAngle', function (e, t) {
                            this.get('editImageData').get('actions').push({
                                tool: this.get('name'),
                                data: t
                            }), this.set('rotationApplied', !1), this.collection.requestThrottler();
                        }, this), this.collection.on('throttle', function (e) {
                            this.get('rotationApplied') || (e.rotate(this.viewModel.get('lastRotationAngle')), e.render(), this.set('rotationApplied', !0));
                        }, this), this.collection.on('tool:reset:' + this.get('name'), e), this.collection.on('tool:reset:all', e);
                    },
                    saveDeferred: function (t, e) {
                        var n, i;
                        return i = (n = new r.Deferred()).promise(), e.then(function (e) {
                            e.rotate(t).render(function () {
                                n.resolve(this);
                            });
                        }), i;
                    },
                    getActionData: function () {
                        return this.viewModel;
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/EditImage/Adjust.dot', [], function () {
                return '{{~ it.filters: filter }}\n<div class="ckf-ei-filter">\n\t<label class="ckf-ei-filter-icon ui-btn ui-btn-icon-left ui-icon-{{= filter.icon }}" for="{{= filter.name }}">{{= filter.label }}</label>\n\t<input class="ckf-ei-filter-slider" name="{{= filter.name }}" id="{{= filter.name }}" min="{{= filter.config.min }}"\n\t\t   max="{{= filter.config.max }}" step="{{= filter.config.step }}" value="{{= filter.config.init }}" type="range"\n\t\t   data-filter="{{= filter.name }}" data-initial="{{= filter.config.init }}" tabindex="{{= it.tabindex }}">\n</div>\n{{~}}\n';
            }), CKFinder.define('CKFinder/Modules/EditImage/Views/AdjustView', [
                'jquery',
                'backbone',
                'CKFinder/Views/Base/ItemView',
                'text!CKFinder/Templates/EditImage/Adjust.dot'
            ], function (r, o, e, t) {
                'use strict';
                return e.extend({
                    isSliding: !1,
                    applyFilterInterval: null,
                    lastFilterEvent: null,
                    name: 'AdjustView',
                    template: t,
                    events: {
                        'slidestart .ckf-ei-filter-slider': 'onSlideStart',
                        'slidestop .ckf-ei-filter-slider': 'onSlideStop',
                        'change .ckf-ei-filter-slider': 'onFilter',
                        'keyup .ckf-ei-filter-slider': 'onFilter'
                    },
                    initialize: function () {
                        this.model.get('activeFilters').on('reset', function () {
                            this.render();
                        }, this);
                    },
                    onSlideStart: function () {
                        this.isSliding = !0;
                    },
                    onSlideStop: function (e) {
                        this.isSliding = !1, this.applyFilters(e);
                    },
                    onRender: function () {
                        this.$el.trigger('create');
                    },
                    onFilter: function (e) {
                        var t = this;
                        t.isSliding || (this.lastFilterEvent = e, this.applyFilterInterval || (this.applyFilterInterval = setInterval(function () {
                            100 < Date.now() - t.lastFilterEvent.timeStamp && (t.applyFilters(t.lastFilterEvent), clearInterval(t.applyFilterInterval), t.applyFilterInterval = null);
                        }, 100)));
                    },
                    applyFilters: function (e) {
                        var t, n, i;
                        i = this.model.get('activeFilters'), n = r(e.currentTarget).data('filter'), (t = i.where({ filter: n })[0]) || (t = new o.Model({ filter: n }), i.push(t)), t.set('value', r(e.currentTarget).val());
                    }
                });
            }), CKFinder.define('CKFinder/Modules/EditImage/Tools/AdjustTool', [
                'jquery',
                'backbone',
                'underscore',
                'CKFinder/Modules/EditImage/Tools/Tool',
                'CKFinder/Modules/EditImage/Views/AdjustView'
            ], function (r, o, i, e, s) {
                'use strict';
                return e.extend({
                    defaults: function () {
                        var t = this.collection.finder.config, e = [
                                {
                                    name: 'brightness',
                                    icon: 'ckf-brightness',
                                    config: {
                                        min: -100,
                                        max: 100,
                                        step: 1,
                                        init: 0
                                    }
                                },
                                {
                                    name: 'contrast',
                                    icon: 'ckf-contrast',
                                    config: {
                                        min: -100,
                                        max: 100,
                                        step: 1,
                                        init: 0
                                    }
                                },
                                {
                                    name: 'saturation',
                                    icon: 'ckf-saturation',
                                    config: {
                                        min: -100,
                                        max: 100,
                                        step: 1,
                                        init: 0
                                    }
                                },
                                {
                                    name: 'vibrance',
                                    icon: 'ckf-vibrance',
                                    config: {
                                        min: -100,
                                        max: 100,
                                        step: 1,
                                        init: 0
                                    }
                                },
                                {
                                    name: 'exposure',
                                    icon: 'ckf-exposure',
                                    config: {
                                        min: -100,
                                        max: 100,
                                        step: 1,
                                        init: 0
                                    }
                                },
                                {
                                    name: 'hue',
                                    icon: 'ckf-hue',
                                    config: {
                                        min: 0,
                                        max: 100,
                                        step: 1,
                                        init: 0
                                    }
                                },
                                {
                                    name: 'sepia',
                                    icon: 'ckf-sepia',
                                    config: {
                                        min: 0,
                                        max: 100,
                                        step: 1,
                                        init: 0
                                    }
                                },
                                {
                                    name: 'gamma',
                                    icon: 'ckf-gamma',
                                    config: {
                                        min: 0,
                                        max: 10,
                                        step: 0.1,
                                        init: 1
                                    }
                                },
                                {
                                    name: 'noise',
                                    icon: 'ckf-noise',
                                    config: {
                                        min: 0,
                                        max: 100,
                                        step: 1,
                                        init: 0
                                    }
                                },
                                {
                                    name: 'clip',
                                    icon: 'ckf-clip',
                                    config: {
                                        min: 0,
                                        max: 100,
                                        step: 1,
                                        init: 0
                                    }
                                },
                                {
                                    name: 'sharpen',
                                    icon: 'ckf-sharpen',
                                    config: {
                                        min: 0,
                                        max: 100,
                                        step: 1,
                                        init: 0
                                    }
                                },
                                {
                                    name: 'stackBlur',
                                    icon: 'ckf-blur',
                                    config: {
                                        min: 0,
                                        max: 20,
                                        step: 1,
                                        init: 0
                                    }
                                }
                            ], n = i.filter(e, function (e) {
                                return i.includes(t.editImageAdjustments, e.name);
                            });
                        return {
                            name: 'Adjust',
                            viewClass: s,
                            view: null,
                            filters: n
                        };
                    },
                    initialize: function () {
                        var i = this, n = new o.Collection();
                        function e() {
                            var e = i.get('editImageData').get('actions');
                            e.remove(e.where({ tool: i.get('name') })), n.reset();
                        }
                        n.on('add', function () {
                            i.collection.resetTool('Presets');
                        }), i.collection.on('tool:reset:' + i.get('name'), e), i.collection.on('tool:reset:all', e), n.on('change', function () {
                            var e, t, n;
                            t = (n = i.get('editImageData').get('actions')).where({ tool: i.get('name') })[0], e = this.toJSON(), t || (t = new o.Model({ tool: i.get('name') }), n.push(t)), t.set('data', e), i.collection.requestThrottler();
                        });
                        var r = new o.Model({
                            filters: this.get('filters'),
                            activeFilters: n,
                            tabindex: this.get('tabindex')
                        });
                        this.on('change:editImageData', function (e, t) {
                            r.set('file', t.get('file'));
                        }), this.collection.on('throttle', function (t) {
                            n.length && n.clone().forEach(function (e) {
                                t[e.get('filter')](parseFloat(e.get('value')));
                            });
                        }), this.viewModel = r, this.activeFilters = n;
                    },
                    getActionData: function () {
                        return this.viewModel;
                    },
                    saveDeferred: function (e, t) {
                        var i = new r.Deferred(), n = i.promise();
                        return t.then(function (n) {
                            r.each(e, function (e, t) {
                                n[t.filter](parseFloat(t.value));
                            }), n.render(function () {
                                i.resolve(this);
                            });
                        }), n;
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/EditImage/Presets.dot', [], function () {
                return '{{~ it.presets: preset }}\n<button class="ckf-ei-preset" data-preset="{{= preset.name }}" tabindex="{{= it.tabindex }}">\n\t<img class="ckf-ei-preset-preview" alt="{{= preset.label }}" /> {{= preset.label }}\n</button>\n{{~}}\n';
            }), CKFinder.define('CKFinder/Modules/EditImage/Views/PresetsView', [
                'underscore',
                'jquery',
                'CKFinder/Util/KeyCode',
                'CKFinder/Views/Base/ItemView',
                'text!CKFinder/Templates/EditImage/Presets.dot'
            ], function (t, l, n, e, i) {
                'use strict';
                return e.extend({
                    name: 'PresetsView',
                    template: i,
                    events: {
                        'click .ckf-ei-preset': 'onPreset',
                        'keydown .ckf-ei-preset': function (e) {
                            e.keyCode !== n.space && e.keyCode !== n.enter || this.onPreset(e);
                        }
                    },
                    onRender: function () {
                        var i, n, e = this.model.get('file');
                        this.finder.config.initConfigInfo.thumbs && (t.forEach(this.finder.config.initConfigInfo.thumbs, function (e) {
                            var t = parseInt(e.split('x')[0]);
                            !n && 240 <= t && (n = t);
                        }), n && (i = this.finder.request('file:getThumb', { file: e })));
                        i && this.finder.config.initConfigInfo.thumbs || (i = this.finder.request('image:previewUrl', {
                            file: e,
                            maxWidth: 240,
                            maxHeight: 80,
                            noCache: !0
                        }));
                        var r = this.model.get('Caman'), o = t.uniqueId('ckf-'), s = l('<canvas>').attr('id', o).attr('width', 240).attr('height', 240).css('display', 'none').appendTo('body'), a = this.$el.find('.ckf-ei-preset').toArray();
                        !function e() {
                            if (a.length) {
                                var t, n;
                                t = l(a.shift()), n = t.data('preset'), r('#' + o, i, function () {
                                    this.revert(!1), this[n]().render(function () {
                                        t.find('img').attr('src', this.toBase64()), e();
                                    });
                                });
                            } else
                                s.remove();
                        }();
                    },
                    onPreset: function (e) {
                        this.model.set('active', l(e.currentTarget).data('preset'));
                    }
                });
            }), CKFinder.define('CKFinder/Modules/EditImage/Tools/PresetsTool', [
                'jquery',
                'underscore',
                'backbone',
                'CKFinder/Modules/EditImage/Tools/Tool',
                'CKFinder/Modules/EditImage/Views/PresetsView'
            ], function (r, i, t, e, o) {
                'use strict';
                return e.extend({
                    defaults: function () {
                        var t, e, n;
                        return t = this.collection.finder.config, e = [
                            { name: 'clarity' },
                            { name: 'concentrate' },
                            { name: 'crossProcess' },
                            { name: 'glowingSun' },
                            { name: 'grungy' },
                            { name: 'hazyDays' },
                            { name: 'hemingway' },
                            { name: 'herMajesty' },
                            { name: 'jarques' },
                            { name: 'lomo' },
                            { name: 'love' },
                            { name: 'nostalgia' },
                            { name: 'oldBoot' },
                            { name: 'orangePeel' },
                            { name: 'pinhole' },
                            { name: 'sinCity' },
                            { name: 'sunrise' },
                            { name: 'vintage' }
                        ], n = i.filter(e, function (e) {
                            return i.includes(t.editImagePresets, e.name);
                        }), {
                            name: 'Presets',
                            viewClass: o,
                            view: null,
                            presets: n
                        };
                    },
                    initialize: function () {
                        var i = this, n = new t.Model({
                                Caman: this.get('Caman'),
                                active: null,
                                presets: this.get('presets'),
                                tabindex: this.get('tabindex')
                            });
                        function e() {
                            var e = i.get('editImageData').get('actions');
                            n.set('active', null), e.remove(e.where({ tool: i.get('name') }));
                        }
                        n.on('change:active', function (e, t) {
                            var n;
                            t && (i.collection.resetTool('Adjust'), (n = i.get('editImageData').get('actions')).remove(n.where({ tool: i.get('name') })), n.push({
                                tool: i.get('name'),
                                data: t
                            }), i.collection.requestThrottler());
                        }), i.collection.on('throttle', function (e) {
                            var t = i.viewModel.get('active');
                            t && e[t]();
                        }), i.collection.on('tool:reset:' + i.get('name'), e), i.collection.on('tool:reset:all', e), this.on('change:editImageData', function (e, t) {
                            n.set('file', t.get('file'));
                        }), this.viewModel = n;
                    },
                    saveDeferred: function (t, e) {
                        var n, i;
                        return i = (n = new r.Deferred()).promise(), e.then(function (e) {
                            e[t]().render(function () {
                                n.resolve(this);
                            });
                        }), i;
                    },
                    getActionData: function () {
                        return this.viewModel;
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/EditImage/Resize.dot', [], function () {
                return '<div class="ui-grid-a">\n\t<div class="ckf-ei-resize-controls-inputs">\n\t\t<input name="ckfResizeWidth" value="{{= it.displayWidth }}" tabindex="{{= it.tabindex }}">\n\t\t<p class="ckf-ei-resize-controls-text">x</p>\n\t\t<input name="ckfResizeHeight" value="{{= it.displayHeight }}" tabindex="{{= it.tabindex }}">\n\t\t<p class="ckf-ei-resize-controls-text">{{= it.lang.units.pixelShort}}</p>\n\t</div>\n</div>\n<label>\n\t{{= it.lang.editImage.keepAspectRatio }}\n\t<input type="checkbox" tabindex="{{= it.tabindex }}" name="ckfResizeKeepAspectRatio" {{? it.keepAspectRatio }}checked="checked"{{?}} data-iconpos="{{? it.lang.dir == \'ltr\'}}left{{??}}right{{?}}">\n</label>\n<button id="ckf-ei-resize-apply" tabindex="{{= it.tabindex }}" data-icon="ckf-tick" data-iconpos="{{? it.lang.dir == \'ltr\'}}left{{??}}right{{?}}">{{= it.lang.editImage.apply }}</button>\n';
            }), CKFinder.define('CKFinder/Modules/EditImage/Views/ResizeView', [
                'CKFinder/Util/KeyCode',
                'CKFinder/Views/Base/ItemView',
                'text!CKFinder/Templates/EditImage/Resize.dot'
            ], function (t, e, n) {
                'use strict';
                return e.extend({
                    name: 'ResizeView',
                    template: n,
                    className: 'ckf-ei-resize-controls',
                    ui: {
                        width: 'input[name="ckfResizeWidth"]',
                        height: 'input[name="ckfResizeHeight"]',
                        keepAspectRatio: 'input[name="ckfResizeKeepAspectRatio"]',
                        apply: '#ckf-ei-resize-apply'
                    },
                    triggers: { 'click @ui.apply': 'apply' },
                    events: {
                        'change @ui.width': 'onWidth',
                        'change @ui.height': 'onHeight',
                        'change @ui.keepAspectRatio': 'onAspectRatio',
                        'keyup @ui.keepAspectRatio': function (e) {
                            e.keyCode !== t.space && e.keyCode !== t.enter || (e.preventDefault(), e.stopPropagation(), this.ui.keepAspectRatio.prop('checked', !this.ui.keepAspectRatio.is(':checked')).checkboxradio('refresh').trigger('change'));
                        },
                        'keydown @ui.apply': function (e) {
                            e.keyCode !== t.space && e.keyCode !== t.enter || this.trigger('apply');
                        }
                    },
                    modelEvents: {
                        'change:realWidth': 'render',
                        'change:displayWidth': 'setWidth',
                        'change:displayHeight': 'setHeight'
                    },
                    onRender: function () {
                        this.$el.trigger('create');
                    },
                    onAspectRatio: function () {
                        var e = this.ui.keepAspectRatio.is(':checked');
                        this.model.set('keepAspectRatio', e), e && this.onWidth();
                    },
                    onWidth: function () {
                        if (!this.dontRender && !(this.model.get('displayWidth') < 0)) {
                            var e = parseInt(this.ui.width.val(), 10);
                            (isNaN(e) || e <= 0) && (e = 1);
                            var t = this.model.get('realWidth');
                            t < e && (e = t);
                            var n = this.model.get('displayHeight');
                            if (this.model.get('keepAspectRatio')) {
                                var i = t / this.model.get('realHeight');
                                n = parseInt(e / i, 10);
                            }
                            n <= 0 && (n = 1), this.updateSizes(e, n);
                        }
                    },
                    onHeight: function () {
                        if (!this.dontRender && !(this.model.get('displayHeight') < 0)) {
                            var e = parseInt(this.ui.height.val(), 10), t = this.model.get('realHeight');
                            (isNaN(e) || e <= 0) && (e = 1), t < e && (e = t);
                            var n = this.model.get('displayWidth');
                            if (this.model.get('keepAspectRatio')) {
                                var i = this.model.get('realWidth') / t;
                                n = parseInt(e * i, 10);
                            }
                            n <= 0 && (n = 1), this.updateSizes(n, e);
                        }
                    },
                    updateSizes: function (e, t) {
                        this.model.set({
                            displayWidth: e,
                            displayHeight: t
                        }), this.dontRender = !0, this.ui.width.val(e), this.ui.height.val(t), this.dontRender = !1;
                    },
                    setWidth: function () {
                        this.ui.width.val(this.model.get('displayWidth'));
                    },
                    setHeight: function () {
                        this.ui.height.val(this.model.get('displayHeight'));
                    },
                    focusButton: function () {
                        this.ui.apply.focus();
                    }
                });
            }), CKFinder.define('CKFinder/Modules/EditImage/Tools/ResizeTool', [
                'jquery',
                'backbone',
                'CKFinder/Modules/EditImage/Tools/Tool',
                'CKFinder/Modules/EditImage/Views/ResizeView'
            ], function (r, e, t, n) {
                'use strict';
                var i = e.Model.extend({
                    defaults: {
                        realWidth: -1,
                        realHeight: -1,
                        displayWidth: -1,
                        displayHeight: -1,
                        renderWidth: -1,
                        renderHeight: -1,
                        maxRenderWidth: -1,
                        maxRenderHeight: -1,
                        keepAspectRatio: !0
                    }
                });
                return t.extend({
                    defaults: {
                        name: 'Resize',
                        viewClass: n,
                        view: null
                    },
                    initialize: function () {
                        this.viewModel = new i({ tabindex: this.get('tabindex') }), this.collection.on('imageData:ready', function () {
                            var e = this.get('editImageData');
                            this.viewModel.set({
                                realWidth: e.get('imageWidth'),
                                realHeight: e.get('imageHeight'),
                                displayWidth: e.get('imageWidth'),
                                displayHeight: e.get('imageHeight'),
                                renderWidth: e.get('renderWidth'),
                                renderHeight: e.get('renderHeight'),
                                maxRenderWidth: e.get('renderWidth'),
                                maxRenderHeight: e.get('renderHeight')
                            }), this.get('view').on('apply', function () {
                                this.resizeView();
                            }, this);
                        }, this), this.collection.on('tool:reset:all', function () {
                            var e, t;
                            t = (e = this.get('editImageData')).get('imageInfo'), this.viewModel.set({
                                realWidth: t.width,
                                realHeight: t.height,
                                displayWidth: t.width,
                                displayHeight: t.height,
                                renderWidth: e.get('renderWidth'),
                                renderHeight: e.get('renderHeight'),
                                maxRenderWidth: e.get('renderWidth'),
                                maxRenderHeight: e.get('renderHeight')
                            });
                        }, this);
                    },
                    resizeView: function () {
                        var e, t, n, i = this.viewModel, r = this.get('editImageData'), o = i.get('displayWidth'), s = i.get('displayHeight'), a = i.get('maxRenderWidth'), l = i.get('maxRenderHeight');
                        l < s || a < o ? (e = o < s ? l / s : a / o, t = parseInt(e * s, 10), n = parseInt(e * o, 10)) : (n = o, t = s), i.set({
                            realWidth: o,
                            realHeight: s
                        }), r.get('actions').push({
                            tool: this.get('name'),
                            data: {
                                width: o,
                                height: s
                            }
                        }), r.set({
                            imageWidth: o,
                            imageHeight: s
                        }), r.get('caman').resize({
                            width: n,
                            height: t
                        }), this.collection.requestThrottler(), this.get('view').focusButton();
                    },
                    saveDeferred: function (t, e) {
                        var n = new r.Deferred(), i = n.promise();
                        return e.then(function (e) {
                            e.resize({
                                width: t.width,
                                height: t.height
                            }).render(function () {
                                n.resolve(this);
                            });
                        }), i;
                    },
                    getActionData: function () {
                        return this.viewModel;
                    }
                });
            }), CKFinder.define('CKFinder/Modules/EditImage/Tools', [
                'underscore',
                'jquery',
                'backbone',
                'CKFinder/Modules/EditImage/Tools/CropTool',
                'CKFinder/Modules/EditImage/Tools/RotateTool',
                'CKFinder/Modules/EditImage/Tools/AdjustTool',
                'CKFinder/Modules/EditImage/Tools/PresetsTool',
                'CKFinder/Modules/EditImage/Tools/ResizeTool'
            ], function (u, c, e, a, l, d, f, h) {
                'use strict';
                return e.Collection.extend({
                    initialize: function () {
                        this.needRender = !1, this.isRendering = !1, this.on('add', function (e) {
                            e.set('name', e.get('tool').get('name'));
                        });
                    },
                    setupDefault: function (t, e) {
                        this.finder = t, this.Caman = e;
                        var n = 40;
                        this.add({
                            title: t.lang.editImage.resize,
                            icon: 'ckf-resize',
                            tool: new h({ tabindex: n }, { collection: this }),
                            tabindex: n
                        }), this.add({
                            title: t.lang.editImage.crop,
                            icon: 'ckf-crop',
                            tool: new a({ tabindex: n += 10 }, { collection: this }),
                            tabindex: n
                        }), this.add({
                            title: t.lang.editImage.rotate,
                            icon: 'ckf-rotate',
                            tool: new l({ tabindex: n += 10 }, { collection: this }),
                            tabindex: n
                        });
                        var i = t.config.editImageAdjustments;
                        if (i && i.length) {
                            var r = new d({ tabindex: n += 10 }, { collection: this });
                            this.add({
                                title: t.lang.editImage.adjust,
                                icon: 'ckf-adjust',
                                tool: r,
                                tabindex: n
                            }), u.forEach(r.get('filters'), function (e) {
                                e.label = t.lang.editImage.filters[e.name];
                            });
                        }
                        var o = t.config.editImagePresets;
                        if (o && o.length) {
                            var s = new f({
                                Caman: e,
                                tabindex: n += 10
                            }, { collection: this });
                            this.add({
                                title: t.lang.editImage.presets,
                                icon: 'ckf-presets',
                                tool: s,
                                tabindex: n
                            }), u.forEach(s.get('presets'), function (e) {
                                e.label = t.lang.editImage.preset[e.name];
                            });
                        }
                        return this;
                    },
                    setImageData: function (t) {
                        (this.editImageData = t).on('change:renderHeight', function () {
                            this.checkReady();
                        }, this), this.forEach(function (e) {
                            e.get('tool').set('editImageData', t);
                        });
                    },
                    setImageInfo: function (e) {
                        this.editImageData.set('imageInfo', e), this.editImageData.set('imageWidth', e.width), this.editImageData.set('imageHeight', e.height), this.checkReady();
                    },
                    checkReady: function () {
                        this.editImageData && this.editImageData.has('imageInfo') && this.editImageData.has('renderWidth') && this.trigger('imageData:ready');
                    },
                    resetTool: function (e) {
                        var t;
                        e ? this.trigger('tool:reset:' + e) : (this.trigger('tool:reset:all'), (t = this.editImageData.get('caman')).reset(), t.render(), this.editImageData.get('actions').reset()), this.trigger('tool:reset:after');
                    },
                    doSave: function (e) {
                        var i = this, t = u.uniqueId('edit-image-canvas'), r = c('<canvas>').attr('id', t).css('display', 'none').appendTo('body'), o = this.editImageData.get('actions'), n = this.Caman, s = new c.Deferred(), a = new c.Deferred(), l = s.promise();
                        return n('#' + t, e, function () {
                            var e = this, t = o.findWhere({ tool: 'Adjust' });
                            t && (o.remove(t), o.push(t));
                            var n = o.findWhere({ tool: 'Presets' });
                            n && (o.remove(n), o.push(n)), o.forEach(function (e) {
                                var t = this.findWhere({ name: e.get('tool') }).get('tool');
                                l = t.saveDeferred(e.get('data'), l);
                            }, i), l.then(function () {
                                a.resolve(e.toBase64()), r.remove();
                            }), s.resolve(e);
                        }), a.promise();
                    },
                    requestThrottler: function () {
                        var t = this;
                        this.needRender = !0, this.throttleID || (this.throttleID = setInterval(function () {
                            if (t.needRender && !t.isRendering) {
                                t.isRendering = !0;
                                var e = t.editImageData.get('caman');
                                try {
                                    e.revert(!1);
                                } catch (e) {
                                }
                                t.trigger('throttle', e), e.render(function () {
                                    return !1;
                                }), t.isRendering = !1, t.needRender = !1;
                            }
                        }, 200));
                    },
                    destroy: function () {
                        this.throttleID && clearInterval(this.throttleID);
                    },
                    hasDataToSave: function () {
                        return !!this.editImageData.get('actions').length;
                    }
                });
            }), CKFinder.define('CKFinder/Common/Models/ProgressModel', ['backbone'], function (e) {
                'use strict';
                return e.Model.extend({
                    defaults: {
                        state: 'ok',
                        message: '',
                        value: 0
                    },
                    stateOk: function () {
                        this.set('state', 'ok');
                    },
                    stateError: function () {
                        this.set('state', 'error');
                    },
                    stateIndeterminate: function () {
                        this.set('state', 'indeterminate');
                    }
                });
            }), CKFinder.define('CKFinder/Modules/EditImage/Models/ProgressModel', ['CKFinder/Common/Models/ProgressModel'], function (e) {
                'use strict';
                return e.extend({
                    defaults: {
                        value: 0,
                        state: 'ok',
                        message: '',
                        eta: '',
                        speed: '',
                        bytes: 0,
                        bytesTotal: 0,
                        time: 0,
                        transfer: ''
                    },
                    initialize: function () {
                        this.on('change', function (e) {
                            var t, n;
                            if (e.changed.time && (t = e.previous('time'))) {
                                var i = e.get('time') - t;
                                n = ((e.get('bytes') - e.previous('bytes')) / i).toFixed(1), this.set({
                                    eta: ((e.get('bytesTotal') - e.get('bytes')) / (100 * n)).toFixed(),
                                    speed: n
                                });
                            }
                        });
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/Common/Progress.dot', [], function () {
                return '<div class="ckf-progress-message {{? !it.message }}ckf-hidden{{?}}">{{= it.message }}</div>\n<div class="ckf-progress-wrap ckf-progress-{{= it.state }}" role="progressbar" aria-valuenow="{{= it.value }}" aria-valuemin="0" aria-valuemax="100">\n\t<div class="ckf-progress-bar" style="width:{{= it.value }}%;" ></div>\n</div>\n';
            }), CKFinder.define('CKFinder/Common/Views/ProgressView', [
                'CKFinder/Views/Base/ItemView',
                'text!CKFinder/Templates/Common/Progress.dot'
            ], function (e, t) {
                'use strict';
                return e.extend({
                    name: 'ProgressView',
                    template: t,
                    className: 'ckf-progress',
                    modelEvents: {
                        'change:message': 'updateMessage',
                        'change:state': 'updateState',
                        'change:value': 'updateValue'
                    },
                    ui: {
                        bar: '.ckf-progress-bar',
                        message: '.ckf-progress-message',
                        wrap: '.ckf-progress-wrap'
                    },
                    onRender: function () {
                        this.$el.trigger('create');
                    },
                    updateMessage: function (e, t) {
                        this.ui.message.text(t).toggleClass('ckf-hidden', !t);
                    },
                    updateState: function (e, t) {
                        this.ui.wrap.toggleClass('ckf-progress-ok', t === 'ok').toggleClass('ckf-progress-error', t === 'error').toggleClass('ckf-progress-indeterminate', t === 'indeterminate');
                    },
                    updateValue: function (e, t) {
                        this.isDestroyed || (this.ui.bar.css({ width: t + '%' }), this.ui.wrap.attr('aria-valuenow', t));
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/EditImage/ProgressDialog.dot', [], function () {
                return '<div id="ckf-ei-progress"></div>\n<div class="ckf-ei-transfer">{{= it.transfer }}</div>\n\n';
            }), CKFinder.define('CKFinder/Modules/EditImage/Views/ProgressDialogView', [
                'underscore',
                'jquery',
                'CKFinder/Views/Base/LayoutView',
                'CKFinder/Common/Views/ProgressView',
                'text!CKFinder/Templates/EditImage/ProgressDialog.dot'
            ], function (e, t, n, i, r) {
                'use strict';
                return n.extend({
                    name: 'EditImageProgressDialogView',
                    template: r,
                    regions: { progress: '#ckf-ei-progress' },
                    ui: { transfer: '.ckf-ei-transfer' },
                    modelEvents: { change: 'updateTransfer' },
                    onRender: function () {
                        this.$el.trigger('create'), this.progress.show(new i({
                            finder: this.finder,
                            model: this.model
                        }));
                    },
                    updateTransfer: function () {
                        this.ui.transfer.text(this.model.get('transfer'));
                    }
                });
            }), CKFinder.define('CKFinder/Models/File', ['backbone'], function (e) {
                'use strict';
                return e.Model.extend({
                    defaults: {
                        name: '',
                        date: '',
                        size: -1,
                        folder: null,
                        'view:isFolder': !1
                    },
                    initialize: function () {
                        this._extenstion = !1, this.on('change:name', function () {
                            this._extenstion = !1;
                        }, this);
                    },
                    getExtension: function () {
                        return this._extension || (this._extenstion = this.constructor.extensionFromFileName(this.get('name'))), this._extenstion;
                    },
                    getUrl: function () {
                        if (!this.has('url')) {
                            var e = this.get('folder').getUrl();
                            this.set('url', e && e + encodeURIComponent(this.get('name')), { silent: !0 });
                        }
                        return this.get('url');
                    },
                    isImage: function () {
                        return this.constructor.isExtensionOfImage(this.getExtension());
                    },
                    refresh: function () {
                        this.trigger('refresh', this);
                    }
                }, {
                    invalidCharacters: '\n\\ / : * ? " < > |',
                    noExtension: 'no_ext',
                    isValidName: function (e) {
                        return !/[\\\/:\*\?"<>\|]/.test(e);
                    },
                    isExtensionOfImage: function (e) {
                        return /jpeg|jpg|gif|png/.test(e.toLowerCase());
                    },
                    extensionFromFileName: function (e) {
                        var t = e.lastIndexOf('.');
                        return -1 === t ? '' : e.substr(t + 1);
                    },
                    trimFileName: function (e) {
                        var t = e.lastIndexOf('.');
                        return t < 0 ? e.trim() : e.substr(0, t).trim() + '.' + e.substr(t + 1).trim();
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/EditImage/ConfirmDialog.dot', [], function () {
                return '{{? !it.onlyOverwrite }}<label>\n    {{= it.lang.editImage.saveDialogOverwrite }}\n\t<input tabindex="1" type="checkbox" name="ckfEditImageOverwrite" {{? it.overwrite }}checked="checked"{{?}}>\n</label>\n{{?}}\n<div class="filename-input-area" {{? it.overwrite }}style="display:none" aria-hidden="true"{{?}}>\n    {{= it.lang.editImage.saveDialogSaveAs }}\n    <div>\n        <span class="filename-extension-label">.{{! it.extension }}</span>\n        <div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset">\n    \t\t<input tabindex="1" data-enhanced="true" type="text" name="ckfEditImageFileName" value="{{! it.name }}" aria-required="true" dir="auto" />\n        </div>\n    </div>\n\n    <p class="ckf-ei-confirm-error error-message"></p>\n</div>\n';
            }), CKFinder.define('CKFinder/Modules/EditImage/Views/ConfirmDialogView', [
                'CKFinder/Views/Base/ItemView',
                'CKFinder/Models/File',
                'text!CKFinder/Templates/EditImage/ConfirmDialog.dot'
            ], function (e, n, t) {
                'use strict';
                return e.extend({
                    name: 'EditImageConfirmDialog',
                    template: t,
                    className: 'ckf-ei-crop-controls',
                    ui: {
                        error: '.ckf-ei-confirm-error',
                        overwrite: 'input[name="ckfEditImageOverwrite"]',
                        fileName: 'input[name="ckfEditImageFileName"]',
                        fileNameInputArea: '.filename-input-area'
                    },
                    events: {
                        'change @ui.overwrite': function (e) {
                            e.stopPropagation(), e.preventDefault();
                            var t = this.ui.overwrite.is(':checked');
                            t ? (this.model.set('name', this.model.get('originalName')), this.model.unset('error'), this.ui.fileNameInputArea.hide().attr('aria-hidden', 'true')) : this.ui.fileNameInputArea.show().removeAttr('aria-hidden'), this.model.set('overwrite', t);
                        },
                        'input @ui.fileName': function () {
                            var e = this.ui.fileName.val().toString();
                            if (n.isValidName(e))
                                this.model.unset('error');
                            else {
                                var t = this.finder.lang.errors.fileInvalidCharacters.replace('{disallowedCharacters}', n.invalidCharacters);
                                this.model.set('error', t);
                            }
                            this.model.set('name', e);
                        }
                    },
                    modelEvents: {
                        'change:error': function (e, t) {
                            t ? (this.ui.fileName.attr('aria-invalid', 'true'), this.ui.error.show().removeAttr('aria-hidden').html(t)) : (this.ui.error.hide().attr('aria-hidden', 'true'), this.ui.fileName.removeAttr('aria-invalid'));
                        }
                    }
                });
            }), CKFinder.define('CKFinder/Modules/EditImage/EditImage', [
                'underscore',
                'jquery',
                'backbone',
                'CKFinder/Modules/EditImage/Views/EditImageLayout',
                'CKFinder/Modules/EditImage/Views/ImagePreviewView',
                'CKFinder/Modules/EditImage/Views/ActionsView',
                'CKFinder/Modules/EditImage/Models/EditImageData',
                'CKFinder/Modules/EditImage/Tools',
                'CKFinder/Modules/EditImage/Models/ProgressModel',
                'CKFinder/Modules/EditImage/Views/ProgressDialogView',
                'CKFinder/Modules/EditImage/Views/ConfirmDialogView',
                'CKFinder/Util/KeyCode'
            ], function (i, e, c, u, d, f, h, g, p, v, m, t) {
                'use strict';
                var y, w = 33, C = 20, b = 35, x = 98, E = 100;
                function n(e) {
                    var t = this, n = e.data.context.file.get('folder').get('acl');
                    s(e.data.context.file) && e.data.items.add({
                        name: 'EditImage',
                        label: t.finder.lang.common.edit,
                        isActive: n.fileView && n.fileRename,
                        icon: 'ckf-file-edit',
                        action: function () {
                            o(t, e.data.context.file);
                        }
                    });
                }
                function o(t, n) {
                    if (i.isUndefined(y)) {
                        var e = CKFinder.require.toUrl(t.finder.config.caman || 'libs/caman') + '.js?ckfver=596166831';
                        CKFinder.require([e], function (e) {
                            y = e || window.Caman, r(t, n);
                        });
                    } else
                        r(t, n);
                }
                function r(e, i) {
                    var r = e.finder, o = new g();
                    o.setupDefault(r, y), o.on('throttle', function () {
                        r.fire('editImage:renderPreview', { actions: n.get('actions').clone() }, r);
                    });
                    var s = new u({ finder: r }), t = new d({ finder: r }), a = new f({
                            finder: r,
                            collection: o
                        });
                    r.once('page:show:EditImage', function () {
                        s.preview.show(t), s.actions.show(a), s.$el.trigger('create'), r.request('toolbar:reset', {
                            name: 'EditImage',
                            context: { tools: o }
                        });
                        var e = y(t._uiBindings.canvas, n.get('imagePreview'), function () {
                            r.request('loader:hide'), a.focusFirst(), n.set({
                                renderWidth: t.ui.canvas.width(),
                                renderHeight: t.ui.canvas.height()
                            });
                        });
                        n.set('caman', e);
                    });
                    var n = new h({
                        file: i,
                        imagePreview: r.request('image:previewUrl', {
                            file: i,
                            maxWidth: 0.8 * window.innerWidth,
                            maxHeight: 0.8 * window.innerHeight,
                            noCache: !0
                        }),
                        fullImagePreview: r.request('image:previewUrl', {
                            file: i,
                            maxWidth: 1000000,
                            maxHeight: 1000000,
                            noCache: !0
                        })
                    });
                    o.setImageData(n);
                    var l = n.get('actions');
                    l.on('add', function () {
                        e.resetButton && e.resetButton.set('isDisabled', !1);
                    }), l.on('reset', function () {
                        e.resetButton && e.resetButton.set('isDisabled', !0);
                    }), r.request('loader:show', { text: r.lang.editImage.loading }), r.request('command:send', {
                        name: 'ImageInfo',
                        folder: i.get('folder'),
                        params: { fileName: i.get('name') }
                    }).done(function (e) {
                        if (e.error && 117 === e.error.number)
                            return r.once('command:error:ImageInfo', function (e) {
                                e.cancel();
                            }), r.request('loader:hide'), r.request('folder:refreshFiles'), void r.request('dialog:info', { msg: r.lang.errors.missingFile });
                        var t = {
                            width: e.width,
                            height: e.height,
                            size: e.size
                        };
                        function n() {
                            o.trigger('ui:resize');
                        }
                        i.set('imageInfo', t), o.setImageInfo(t), r.util.isWidget() && function (t) {
                            var n = !1;
                            t.request('isMaximized') || (t.request('maximize'), n = !0);
                            function i() {
                                n = !1, t.removeListener('minimized', i);
                            }
                            t.once('minimized', i), t.once('page:destroy:EditImage', function e() {
                                n && t.request('minimize');
                                t.removeListener('page:destroy:EditImage', e);
                                t.removeListener('minimized', i);
                            });
                        }(r), r.once('page:create:EditImage', function () {
                            r.request('toolbar:create', {
                                name: 'EditImage',
                                page: 'EditImage'
                            });
                        }), r.request('page:create', {
                            view: s,
                            title: r.lang.editImage.title,
                            name: 'EditImage',
                            className: 'ckf-ei-page'
                        }), r.request('page:show', { name: 'EditImage' }), r.request('loader:show', { text: r.lang.editImage.loading }), a.on('childview:expand', function () {
                            s.onActionsExpand();
                        }).on('childview:collapse', function () {
                            s.onActionsCollapse();
                        }), r.on('ui:resize', n), r.once('page:destroy:EditImage', function () {
                            r.removeListener('ui:resize', n);
                        });
                    });
                }
                function F(e, o, s, a, l) {
                    a.set({
                        value: w,
                        message: s.lang.editImage.transformationAction
                    }), o.doSave(e).then(function (e) {
                        a.set({
                            value: b,
                            message: s.lang.editImage.uploadAction
                        });
                        var t = o.editImageData.get('file'), n = t.get('folder');
                        s.once('command:after:SaveImage', function (e) {
                            e.data.response.error || (a.set({
                                state: 'normal',
                                value: E,
                                message: ''
                            }), t.set({
                                date: e.data.response.date,
                                size: e.data.response.size
                            }), s.once('page:show:Main', function () {
                                e.data.context.isFileNameChanged ? s.request('folder:refreshFiles') : t.refresh();
                            }), s.request('page:destroy', { name: 'EditImage' }));
                        }), a.set({
                            bytes: 0,
                            bytesTotal: 0,
                            value: b,
                            message: s.lang.editImage.uploadAction,
                            time: new Date().getTime()
                        }), s.on('dialog:EditImageSaveProgress:cancel', r);
                        var i = s.request('command:send', {
                            name: 'SaveImage',
                            type: 'post',
                            folder: n,
                            params: { fileName: l || t.get('name') },
                            post: { content: e },
                            context: {
                                file: t,
                                isFileNameChanged: !!l
                            },
                            returnTransport: !0,
                            uploadProgress: function (e) {
                                e.lengthComputable && (a.set({
                                    bytes: e.loaded,
                                    bytesTotal: e.total,
                                    value: e.loaded / e.total * (x - b) + b,
                                    time: new Date().getTime()
                                }), a.set('transfer', s.lang.formatTransfer(a.get('speed')))), e.lengthComputable || a.set({
                                    state: 'indeterminate',
                                    transfer: !1
                                });
                            },
                            uploadEnd: function () {
                                a.set('state', 'normal'), s.removeListener('dialog:EditImageSaveProgress:cancel', r);
                            }
                        });
                        function r() {
                            i && i.abort(), s.request('dialog:destroy');
                        }
                        o.destroy();
                    });
                }
                function s(e) {
                    return e.isImage() && e.get('folder').get('acl').fileRename && e.get('folder').get('acl').fileUpload;
                }
                return function (i) {
                    var r = this;
                    (this.finder = i).on('contextMenu:file:edit', n, this), i.on('toolbar:reset:Main:file', function (e) {
                        s(e.data.file) && e.data.toolbar.push({
                            type: 'button',
                            name: 'EditImage',
                            priority: 50,
                            icon: 'ckf-file-edit',
                            label: e.finder.lang.common.edit,
                            action: function () {
                                o(r, i.request('files:getSelected').first());
                            }
                        });
                    }), i.on('toolbar:reset:EditImage', function (e) {
                        var t = this;
                        e.data.toolbar.push({
                            icon: i.lang.dir === 'ltr' ? 'ckf-back' : 'ckf-forward',
                            name: 'Close',
                            iconOnly: !0,
                            label: e.finder.lang.common.close,
                            type: 'button',
                            alwaysVisible: !0,
                            action: function () {
                                e.data.tools.hasDataToSave() ? i.request('dialog:confirm', {
                                    name: 'ConfirmEditImageExit',
                                    msg: i.lang.editImage.confirmExit
                                }) : i.request('page:destroy', { name: 'EditImage' });
                            }
                        }), e.data.toolbar.push({
                            type: 'text',
                            name: 'Filename',
                            className: 'ckf-ei-toolbar-filename',
                            label: i.util.escapeHtml(e.data.tools.editImageData.get('file').get('name'))
                        }), e.data.toolbar.push({
                            name: 'Save',
                            label: i.lang.editImage.save,
                            icon: 'ckf-save',
                            alignment: 'secondary',
                            alwaysVisible: !0,
                            type: 'button',
                            action: function () {
                                !function (e, t) {
                                    if (t.hasDataToSave()) {
                                        var n = e.finder, i = t.editImageData.get('file'), r = i.getExtension(), o = i.get('name');
                                        if (r) {
                                            var s = o.lastIndexOf('.' + r);
                                            0 < s && (o = o.substr(0, s));
                                        }
                                        var a = i.get('folder').get('acl').fileDelete, l = new c.Model({
                                                onlyOverwrite: !a,
                                                overwrite: a,
                                                oldName: i.get('name'),
                                                name: o,
                                                originalName: o,
                                                extension: r,
                                                tools: t,
                                                error: !1
                                            }), u = n.request('dialog', {
                                                view: new m({
                                                    finder: n,
                                                    model: l
                                                }),
                                                title: n.lang.editImage.saveDialogTitle,
                                                name: 'EditImageConfirm',
                                                buttons: [
                                                    'cancel',
                                                    'ok'
                                                ],
                                                context: {
                                                    viewModel: l,
                                                    tools: t
                                                }
                                            });
                                        l.on('change:error', function (e, t) {
                                            t ? u.disableButton('ok') : u.enableButton('ok');
                                        });
                                    }
                                }(t, e.data.tools);
                            }
                        }), this.resetButton = new c.Model({
                            name: 'Reset',
                            label: i.lang.editImage.reset,
                            icon: 'ckf-reset',
                            alignment: 'secondary',
                            alwaysVisible: !0,
                            isDisabled: !0,
                            type: 'button',
                            action: function () {
                                e.data.tools.resetTool();
                            }
                        }), e.data.toolbar.push(this.resetButton);
                    }, this, null, 40), i.on('dialog:EditImageConfirm:ok', function (e) {
                        var t = e.data.context;
                        if (!t.viewModel.get('error')) {
                            var n = t.viewModel.get('name') + '.' + t.viewModel.get('extension');
                            t.viewModel.get('overwrite') || !i.request('files:getCurrent').where({ name: n }).length ? function (e, t, n) {
                                var i = e.finder, r = t.editImageData, o = new p(), s = new v({
                                        finder: i,
                                        model: o
                                    });
                                if (i.request('dialog', {
                                        view: s,
                                        title: i.lang.editImage.saveDialogTitle,
                                        name: 'EditImageSaveProgress',
                                        buttons: ['cancel']
                                    }), i.on('dialog:EditImageSaveProgress:cancel', l), o.set('message', i.lang.editImage.downloadAction), !window.URL || !window.URL.createObjectURL)
                                    return o.stateIndeterminate(), F(r.get('fullImagePreview'), t, i, o, n);
                                o.set({
                                    bytes: 0,
                                    bytesTotal: 0,
                                    value: 0,
                                    time: new Date().getTime()
                                });
                                var a = new XMLHttpRequest();
                                function l() {
                                    a && a.abort(), i.request('dialog:destroy');
                                }
                                a.onprogress = function (e) {
                                    e.lengthComputable && (o.set({
                                        state: 'normal',
                                        bytes: e.loaded,
                                        bytesTotal: e.total,
                                        value: e.loaded / e.total * w,
                                        time: new Date().getTime()
                                    }), o.set('transfer', i.lang.formatTransfer(o.get('speed')))), e.lengthComputable || o.set({
                                        value: C,
                                        state: 'indeterminate',
                                        transfer: ''
                                    });
                                }, a.onload = function () {
                                    if (i.removeListener('dialog:EditImageSaveProgress:cancel', l), 200 !== this.status)
                                        return i.request('folder:refreshFiles'), i.request('page:destroy', { name: 'EditImage' }), void i.request('dialog:info', { msg: i.lang.errors.missingFile });
                                    o.set({
                                        value: w,
                                        eta: !1,
                                        speed: !1,
                                        time: 0
                                    }), F(window.URL.createObjectURL(new Blob([this.response])), t, i, o, n);
                                }, a.open('GET', r.get('fullImagePreview'), !0), a.responseType = 'arraybuffer', a.send(null);
                            }(r, t.tools, t.viewModel.get('oldName') !== n && n) : t.viewModel.set('error', e.finder.lang.editImage.saveDialogFileExists);
                        }
                    }), i.on('dialog:ConfirmEditImageExit:ok', function () {
                        i.request('page:destroy', { name: 'EditImage' });
                    }), i.on('command:error:SaveImage', function () {
                        i.request('page:destroy', { name: 'EditImage' });
                    }, null, null, 5), i.request('key:listen', { key: t.escape }), i.on('keyup:' + t.escape, function (e) {
                        e.data.evt.isDefaultPrevented() || i.request('page:destroy', { name: 'EditImage' });
                    }, null, null, 30);
                };
            }), CKFinder.define('CKFinder/Modules/FileDownload/FileDownload', [
                'underscore',
                'jquery'
            ], function (e, s) {
                'use strict';
                var a = /iPad|iPhone|iPod/.test(navigator.platform);
                function t(e) {
                    var t = {
                        name: 'Download',
                        priority: 70,
                        icon: 'ckf-file-download',
                        label: e.finder.lang.common.download
                    };
                    if (a) {
                        var n = e.finder.request('files:getSelected').first(), i = e.finder.request('command:url', {
                                command: 'DownloadFile',
                                folder: n.get('folder'),
                                params: { fileName: n.get('name') }
                            });
                        t.type = 'link-button', t.href = i, t.attributes = { target: '_blank' };
                    } else
                        t.type = 'button', t.action = function () {
                            e.finder.request('file:download', { file: e.finder.request('files:getSelected').first() });
                        };
                    e.data.toolbar.push(t);
                }
                function n(e) {
                    var t = e.data, n = t.context.file, i = n.get('folder').get('acl'), r = e.finder.request('files:getSelected');
                    r.length && !r.contains(n) && e.finder.request('files:deselectAll'), e.finder.request('files:select', { files: n });
                    var o = {
                        name: 'Download',
                        label: e.finder.lang.common.download,
                        isActive: i.fileView,
                        icon: 'ckf-file-download'
                    };
                    a ? (o.allowClick = !0, o.linkAttributes = [
                        {
                            name: 'target',
                            value: '_blank'
                        },
                        {
                            name: 'href',
                            value: e.finder.request('command:url', {
                                command: 'DownloadFile',
                                folder: n.get('folder'),
                                params: { fileName: n.get('name') }
                            })
                        }
                    ]) : o.action = function () {
                        e.finder.request('file:download', { file: n });
                    }, t.items.add(o);
                }
                return function (r) {
                    var o = e.uniqueId('ckf-download-frame');
                    r.setHandler('file:download', function (e) {
                        var t = e.file.get('folder'), n = r.request('command:url', {
                                command: 'DownloadFile',
                                folder: t,
                                params: { fileName: e.file.get('name') }
                            }), i = s('#' + o);
                        i.length || ((i = s('<iframe>')).attr('id', o), i.css('display', 'none'), i.on('load', function () {
                            var e = s(i.get(0).contentDocument).text();
                            if (e.length)
                                try {
                                    var t = JSON.parse(e);
                                    t.error && 117 === t.error.number && (r.request('folder:refreshFiles'), r.request('dialog:info', { msg: r.lang.errors.missingFile }));
                                } catch (e) {
                                }
                        }), s('body').append(i)), i.attr('src', n);
                    }), r.on('toolbar:reset:Main:file', t), r.on('contextMenu:file', function (e) {
                        e.data.groups.add({ name: 'view' });
                    }, null, null, 20), r.on('contextMenu:file:view', n, null, null, 20);
                };
            }), CKFinder.define('text!CKFinder/Templates/FilePreview/Gallery.dot', [], function () {
                return '<div class="ckf-file-preview-root" tabindex="0" role="application">\n    <div class="ckf-file-preview"></div>\n    <div class="ckf-file-preview-info">\n        <div class="ckf-file-preview-info-name"></div>\n        <div class="ckf-file-preview-info-count"></div>\n    </div>\n    <button class="ckf-file-preview-button-prev">&laquo;</button>\n    <button class="ckf-file-preview-button-next">&raquo;</button>\n</div>';
            }), CKFinder.define('text!CKFinder/Templates/FilePreview/GalleryStyles.dot', [], function () {
                return '<style>\n\t.ckf-file-preview-root :focus,\n\t.ckf-file-preview-root:focus\n\t.ckf-file-preview {\n\t\tbox-shadow: none;\n\t}\n\n\t.ckf-file-preview-root * {\n\t\tbox-sizing: border-box;\n\t}\n\n\t.ckf-file-preview-root {\n\t\tposition: fixed;\n\t\ttop: 0;\n\t\tleft: 0;\n\t\tbottom: 0;\n\t\tright: 0;\n\t\tfont-family: Arial, Helvetica, Tahoma, Verdana, sans-serif;\n\t\tbackground: rgba(0,0,0,0.8);\n\t\tz-index: 9010;\n\t}\n\n\t.ckf-file-preview {\n\t\tposition: absolute;\n\t\ttop: 0;\n\t\tleft: 0;\n\t\tbottom: 2em;\n\t\tright: 0;\n\t\tmargin: auto;\n\t}\n\n\t.ckf-file-preview-button-next,\n\t.ckf-file-preview-button-prev {\n\t\tdisplay: block;\n\t\tposition: absolute;\n\t\ttop: 50%;\n\t\theight: 10em;\n\t\twidth: 10em;\n\t\tborder-radius: 50%;\n\t\tmargin: 5em 3px 0;\n\t\tmargin-top: -5em;\n\t\tborder: 0;\n\t\t-webkit-box-shadow: none;\n\t\tbox-shadow: none;\n\t\ttext-indent: -99999px;\n\t}\n\n\t@media screen and (min-width: 768px) {\n\t\t.ckf-file-preview-button-next,\n\t\t.ckf-file-preview-button-prev {\n\t\t\t\tbackground: #000000;\n\t\t}\n\t}\n\n\t.ckf-file-preview-button-next:before,\n\t.ckf-file-preview-button-prev:before {\n\t\tposition: absolute;\n\t\ttop: 50%;\n\t\theight: 24px;\n\t\twidth: 24px;\n\t\tcolor: #ffffff;\n\t\tbackground-repeat: no-repeat;\n\t\tbackground-position: center;\n\t\t-webkit-transform: translateY(-50%);\n\t\t-ms-transform: translateY(-50%);\n\t\ttransform: translateY(-50%);\n\t}\n\n\t.ckf-file-preview-button-next:active,\n\t.ckf-file-preview-button-next:focus,\n\t.ckf-file-preview-button-prev:active,\n\t.ckf-file-preview-button-prev:focus {\n\t\toutline: none;\n\t}\n\n\t@media screen and (min-width: 768px) {\n\t\t.ckf-file-preview-button-next:active,\n\t\t.ckf-file-preview-button-next:focus,\n\t\t.ckf-file-preview-button-prev:active,\n\t\t.ckf-file-preview-button-prev:focus {\n\t\t\t\tbackground: #0a90eb;\n\t\t}\n\t}\n\n\t.ckf-file-preview-button-prev {\n\t\tmargin-left: -6em;\n\t}\n\n\t.ckf-file-preview-button-prev:before {\n\t\tcontent: \'\';\n\t\tright: 17%;\n\t\tbackground-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2224%22%20viewBox%3D%220%200%2014%2024%22%3E%0A%20%20%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M83.785%2C41.885%20L83.785%2C41.885%20C83.296228%2C41.396228%2082.503772%2C41.396228%2082.015%2C41.885%20L71%2C52.9%20L82.015%2C63.915%20C82.503772%2C64.403772%2083.296228%2C64.403772%2083.785%2C63.915%20L83.785%2C63.915%20C84.273772%2C63.426228%2084.273772%2C62.633772%2083.785%2C62.145%20L74.54%2C52.9%20L83.785%2C43.655%20C84.273772%2C43.166228%2084.273772%2C42.373772%2083.785%2C41.885%20Z%22%20transform%3D%22translate(-71%20-41)%22%2F%3E%0A%3C%2Fsvg%3E%0A");\n\t}\n\n\t.ckf-file-preview-button-next {\n\t\tmargin-right: -6em;\n\t}\n\n\t.ckf-file-preview-button-next:before {\n\t\tcontent: \'\';\n\t\tleft: 17%;\n\t\tbackground-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2215%22%20height%3D%2224%22%20viewBox%3D%220%200%2015%2024%22%3E%0A%20%20%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M23.06%2C44.18%20L31.88%2C53%20L23.06%2C61.82%20C22.4745782%2C62.4054218%2022.4745782%2C63.3545782%2023.06%2C63.94%20L23.06%2C63.94%20C23.6454218%2C64.5254218%2024.5945782%2C64.5254218%2025.18%2C63.94%20L36.12%2C53%20L25.18%2C42.06%20C24.5945782%2C41.4745782%2023.6454218%2C41.4745782%2023.06%2C42.06%20L23.06%2C42.06%20C22.4745782%2C42.6454218%2022.4745782%2C43.5945782%2023.06%2C44.18%20Z%22%20transform%3D%22translate(-22%20-41)%22%2F%3E%0A%3C%2Fsvg%3E%0A");\n\t}\n\n\t.ckf-file-preview img {\n\t\tmax-height: calc(86%) !important;\n\t}\n\n\t@media screen and (min-height: 600px) {\n\t\t.ckf-file-preview img {\n\t\t\t\tmax-height: calc(88%);\n\t\t}\n\t}\n\n\t@media screen and (min-height: 800px) {\n\t\t.ckf-file-preview img {\n\t\t\t\tmax-height: calc(92%);\n\t\t}\n\t}\n\n\t.ckf-file-preview-info {\n\t\tposition: absolute;\n\t\tleft: 0;\n\t\tbottom: 2em;\n\t\tright: 0;\n\t\tmargin: auto;\n\t\tpadding: 0.5em 1em;\n\t\tcolor: #fff;\n\t\tmax-height: 2em;\n\t\tline-height: 1em;\n\t\tfont-size: 1em;\n\t}\n\n\t@media screen and (min-height: 800px) {\n\t\t.ckf-file-preview-info {\n\t\t\t\tpadding-bottom: 2.2em;\n\t\t}\n\t}\n\n\t.ckf-file-preview-info > div {\n\t\ttext-align: center;\n\t}\n\n\t.ckf-file-preview-info > div:first-of-type {\n\t\tmargin-bottom: 0.5em;\n\t}\n\n\t.ckf-file-preview-info > div:nth-of-type(2) {\n\t\topacity: 0.6;\n\t}\n\n\t.ckf-rtl .ckf-file-preview-button-prev {\n\t\tmargin-left: 0;\n\t\tmargin-right: -6em;\n\t}\n\n\t.ckf-rtl .ckf-file-preview-button-prev:before {\n\t\tright: auto;\n\t\tleft: 17%;\n\t\tbackground-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2215%22%20height%3D%2224%22%20viewBox%3D%220%200%2015%2024%22%3E%0A%20%20%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M23.06%2C44.18%20L31.88%2C53%20L23.06%2C61.82%20C22.4745782%2C62.4054218%2022.4745782%2C63.3545782%2023.06%2C63.94%20L23.06%2C63.94%20C23.6454218%2C64.5254218%2024.5945782%2C64.5254218%2025.18%2C63.94%20L36.12%2C53%20L25.18%2C42.06%20C24.5945782%2C41.4745782%2023.6454218%2C41.4745782%2023.06%2C42.06%20L23.06%2C42.06%20C22.4745782%2C42.6454218%2022.4745782%2C43.5945782%2023.06%2C44.18%20Z%22%20transform%3D%22translate(-22%20-41)%22%2F%3E%0A%3C%2Fsvg%3E%0A");\n\t}\n\n\t.ckf-rtl .ckf-file-preview-button-next {\n\t\tmargin-right: 0;\n\t\tmargin-left: -6em;\n\t}\n\n\t.ckf-rtl .ckf-file-preview-button-next:before {\n\t\tleft: auto;\n\t\tright: 17%;\n\t\tbackground-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2224%22%20viewBox%3D%220%200%2014%2024%22%3E%0A%20%20%3Cpath%20fill%3D%22%23FFF%22%20d%3D%22M83.785%2C41.885%20L83.785%2C41.885%20C83.296228%2C41.396228%2082.503772%2C41.396228%2082.015%2C41.885%20L71%2C52.9%20L82.015%2C63.915%20C82.503772%2C64.403772%2083.296228%2C64.403772%2083.785%2C63.915%20L83.785%2C63.915%20C84.273772%2C63.426228%2084.273772%2C62.633772%2083.785%2C62.145%20L74.54%2C52.9%20L83.785%2C43.655%20C84.273772%2C43.166228%2084.273772%2C42.373772%2083.785%2C41.885%20Z%22%20transform%3D%22translate(-71%20-41)%22%2F%3E%0A%3C%2Fsvg%3E%0A");\n\t}\n</style>';
            }), CKFinder.define('CKFinder/Modules/FilePreview/FilePreview', [
                'underscore',
                'jquery',
                'doT',
                'backbone',
                'CKFinder/Util/KeyCode',
                'text!CKFinder/Templates/FilePreview/Gallery.dot',
                'text!CKFinder/Templates/FilePreview/GalleryStyles.dot',
                'CKFinder/Models/File'
            ], function (y, w, C, e, b, x, E, s) {
                'use strict';
                var t = 'calc(100% - 6em)', n = 'calc(100% - 2em)', i = 'position:absolute;' + 'top:0;' + 'left:0;' + 'bottom:0;' + 'right:0;' + 'margin:auto;' + 'max-width:' + t + ';' + 'max-height:' + n + ';', r = i + 'width:' + t + ';height:' + n + ';', a = '<img alt="{{! it.fileName }}" src="{{= it.fileIcon() }}" style="' + i + '">' + '<img alt={{! it.fileName }}" src="{{= it.url }}" id="ckf-image-preview" style="display:none;' + i + '">', l = '<audio src="{{= it.url }}" controls="controls" style="' + i + '">', u = '<video src="{{= it.url }}" controls="controls" style="' + i + '">', c = '<iframe src="{{= it.url }}" style="' + r + '">', d = '<img alt="{{= it.fileName }}" src="{{= it.fileIcon() }}" style="' + i + '">' + '<iframe src="{{= it.url }}" style="display:none;' + r + '">', F = '<img alt="{{= it.fileName }}" src="{{= it.fileIcon() }}" style="' + i + '">';
                function f(s, r) {
                    var a = s.request('files:getDisplayed').where({ 'view:isFolder': !1 }), o = [], l = window.top.document, e = C.template(x), t = w(C.template(E)(), l), u = 0, c = w(e(), l);
                    c.attr('dir', s.lang.dir);
                    var d = c.find('.ckf-file-preview'), f = c.find('.ckf-file-preview-button-next'), h = c.find('.ckf-file-preview-button-prev'), g = c.find('.ckf-file-preview-info-name'), p = c.find('.ckf-file-preview-info-count');
                    s.lang.dir === 'ltr' ? (f.css('right', '0.5em'), h.css('left', '0.5em')) : (f.css('left', '0.5em'), h.css('right', '0.5em')), a.forEach(function (e, t) {
                        var n = e.getUrl(), i = e.get('name');
                        o.push({
                            url: n,
                            name: i,
                            file: e
                        }), i === r && (u = t);
                    });
                    var v = {
                        files: o,
                        current: u,
                        last: o.length - 1
                    };
                    function n() {
                        var n, i, e, t, r, o;
                        v.current <= 0 ? (v.current = 0, h.hide()) : h.show(), v.current >= v.last ? (v.current = v.last, f.hide()) : f.show(), e = (i = v.files[v.current]).url, r = (t = i.name).substr(t.lastIndexOf('.') + 1), o = s.fire('file:preview', {
                            templateData: {
                                fileIcon: function () {
                                    var e = w(l).width(), t = w(l).height();
                                    return s.request('file:getIcon', {
                                        size: t < e ? e : t,
                                        file: i.file,
                                        previewIcon: !0
                                    });
                                },
                                fileName: t
                            },
                            file: i.file,
                            url: e,
                            extension: r,
                            template: F
                        }, s), g.text(i.name), p.text(v.current + 1 + ' / ' + v.files.length), s.request('files:deselectAll'), s.request('files:select', { files: a[v.current] }), n = w(C.template(o.template)(o.templateData), l), o.events && y.forEach(o.events, function (e, t) {
                            n.on(t, e);
                        }), d.append(n), y.isFunction(o.afterRender) && o.afterRender(n), s.request('focus:trap', { node: c });
                    }
                    function i(e, t) {
                        d.html(''), e.stopPropagation(), v.current += t, n();
                    }
                    function m() {
                        c.remove(), t.remove();
                        var e = a[v.current];
                        e.trigger('focus', e);
                    }
                    t.appendTo(w('body', l)), c.append(d).append(h).append(f).appendTo(w('body', l)), c.trigger('focus'), c.on('click', function () {
                        m();
                    }), w(c).on('keydown', function (e) {
                        e.keyCode === b.left && i(e, s.lang.dir === 'ltr' ? -1 : 1), e.keyCode === b.right && i(e, s.lang.dir === 'ltr' ? 1 : -1), e.keyCode === b.escape && (e.stopPropagation(), m());
                    }), h.on('click', function (e) {
                        i(e, -1);
                    }), f.on('click', function (e) {
                        i(e, 1);
                    }), n();
                }
                function h(e, t, n) {
                    var i = document.createElement(e);
                    return !!i.canPlayType && '' !== i.canPlayType(t[n]);
                }
                return function (o) {
                    o.setHandlers({
                        'image:previewUrl': function (e) {
                            var t, n;
                            return t = e.file.get('folder'), n = {
                                fileName: e.file.get('name'),
                                size: Math.round(e.maxWidth) + 'x' + Math.round(e.maxHeight),
                                date: e.file.get('date')
                            }, e.noCache && (n.d = new Date().getTime()), o.request('command:url', {
                                command: 'ImagePreview',
                                params: n,
                                folder: t
                            });
                        },
                        'file:preview': function (e) {
                            var t = e && e.file || o.request('files:getCurrent').first();
                            t && f(o, t.get('name'));
                        }
                    }), o.on('file:preview', function (e) {
                        var t = e.data.url, n = e.data.extension.toLocaleLowerCase();
                        if (s.isExtensionOfImage(n) && (e.stop(), e.data.templateData.url = t, o.hasHandler('image:previewUrl') && (e.data.templateData.url = o.request('image:previewUrl', {
                                file: e.data.file,
                                maxWidth: 0.95 * w(window.top).width(),
                                maxHeight: 0.95 * w(window.top).height()
                            })), e.data.template = a, e.data.events = {
                                load: function (e) {
                                    e.target.id && w(e.target).css('display', '').prev().remove();
                                }
                            }), /^(flac|mp3|ogg|opus|wav|weba)$/.test(n) && function (e) {
                                return h('audio', {
                                    flac: 'audio/flac',
                                    mp3: 'audio/mpeg',
                                    ogg: 'audio/ogg',
                                    opus: 'audio/ogg; codecs="opus',
                                    wav: 'audio/wav',
                                    weba: 'audio/webm'
                                }, e);
                            }(n) && (e.stop(), e.data.templateData.url = t, e.data.template = l, e.data.events = {
                                click: function (e) {
                                    e.stopPropagation();
                                }
                            }), /^(mp4|ogv|webm)$/.test(n) && function (e) {
                                return h('video', {
                                    mp4: 'video/mp4',
                                    ogv: 'video/ogg',
                                    webm: 'video/webm'
                                }, e);
                            }(n) && (e.stop(), e.data.templateData.url = t, e.data.template = u, e.data.events = {
                                click: function (e) {
                                    e.stopPropagation();
                                }
                            }), /^(pdf)$/.test(n) && (e.stop(), e.data.template = t ? c : d, e.data.templateData.url = t || '', e.data.afterRender = function (e) {
                                setTimeout(function () {
                                    e.closest('[tabindex]').trigger('focus');
                                }, 500);
                            }, !t)) {
                            var i = e.data.file;
                            e.data.events = {
                                load: function (t) {
                                    t.currentTarget.alt && (i.get('folder').getResourceType().get('useProxyCommand') ? r(o.request('file:getProxyUrl', {
                                        file: i,
                                        cache: 86400,
                                        params: { d: i.get('date') }
                                    }), w(t.currentTarget).parent()) : o.request('file:getUrl', { file: i }).then(function (e) {
                                        r(e, w(t.currentTarget).parent());
                                    }));
                                }
                            };
                        }
                        function r(e, t) {
                            t.find('iframe').attr('src', e).css('display', ''), t.find('img').remove();
                        }
                    }, null, null, 90), o.on('contextMenu:file:view', function (e) {
                        e.data.items.add({
                            name: 'View',
                            label: e.finder.lang.common.view,
                            isActive: e.data.context.file.get('folder').get('acl').fileView,
                            icon: 'ckf-view',
                            action: function () {
                                f(o, e.data.context.file.get('name'));
                            }
                        });
                    }, null, null, 10), o.on('toolbar:reset:Main:file', function (e) {
                        var t = e.finder;
                        e.data.toolbar.push({
                            name: 'View',
                            icon: 'ckf-view',
                            label: t.lang.common.view,
                            type: 'button',
                            priority: 80,
                            action: function () {
                                f(t, e.data.file.get('name'));
                            }
                        });
                    });
                };
            }), CKFinder.define('CKFinder/Modules/Files/FilesFilter', ['backbone'], function (e) {
                'use strict';
                return {
                    attachTo: function (n) {
                        var i = new e.Collection();
                        return i.search = function (t) {
                            var e;
                            n.length && ('' === t ? (e = n.toArray(), i.isFiltered = !1, i.filter = t) : (e = n.filter(function (e) {
                                return new RegExp(t.replace(/[\\^$*+?.()|[\]{}-]/g, '\\$&'), 'gi').test(e.get('name'));
                            }), i.isFiltered = !0), i.reset(e));
                        }, i.listenTo(n, 'reset', function () {
                            i.reset(n.toArray()), i.isFiltered = !1;
                        }), i.listenTo(n, 'remove', function (e) {
                            i.remove(e);
                        }), i.listenTo(n, 'add', function (e) {
                            i.add(e);
                        }), i.isFiltered = !1, i.comparators = {}, i.sortFiledName = void 0, i.sortAscending = !0, i.on('change:name', function () {
                            i.sortFiledName === 'name' && i.sort();
                        }), i.comparator = function (e, t) {
                            if (!this.sortFiledName || !this.comparators[this.sortFiledName])
                                return 1;
                            if (e.get('view:isFolder') !== t.get('view:isFolder'))
                                return e.get('view:isFolder') ? -1 : 1;
                            if (!1 !== e.get('view:isFolder'))
                                return e.get('name').localeCompare(t.get('name'));
                            var n = (0, this.comparators[this.sortFiledName])(e, t);
                            return 0 === n ? n : this.isSortAscending ? n : -n;
                        }, i.addComparator = function (e, t) {
                            this.comparators[e] = t;
                        }, i.sortByField = function (e) {
                            this.sortFiledName = e, this.sort();
                        }, i.sortAscending = function () {
                            this.isSortAscending = !0, this.sort();
                        }, i.sortDescending = function () {
                            this.isSortAscending = !1, this.sort();
                        }, i.addComparator('name', function (e, t) {
                            return e.get('name').localeCompare(t.get('name'));
                        }), i.addComparator('size', function (e, t) {
                            var n = e.get('size'), i = t.get('size');
                            return n === i ? 0 : i < n ? 1 : -1;
                        }), i.addComparator('date', function (e, t) {
                            return e.get('date').localeCompare(t.get('date'));
                        }), i;
                    }
                };
            }), CKFinder.define('text!CKFinder/Templates/Files/ChooseResizedImageItem.dot', [], function () {
                return '<label>\n\t{{= it.label }}\n\t<span class="ckf-choose-resized-image-size">{{= it.size }}</span>\n\t<input type="radio" name="ckfChooseResized" tabindex="1" value="{{= it.name }}"\n\t    {{? !it.isActive }}disabled="disabled"{{?}}{{? it.isDefault }} checked="checked"{{?}} data-iconpos="{{? it.lang.dir === "ltr"}}left{{??}}right{{?}}">\n</label>\n';
            }), CKFinder.define('text!CKFinder/Templates/Files/ChooseResizedImageInputItem.dot', [], function () {
                return '<label>\n\t{{= it.lang.chooseResizedImage.sizes.custom }}\n\t<input type="radio" name="ckfChooseResized" tabindex="1" value="{{= it.name }}">\n</label>\n<div class="ckf-choose-resized-image-custom-fields ui-state-disabled">\n\t<div class="ckf-choose-resized-image-custom-block">\n\t\t<label class="ckf-choose-resized-image-label">Width</label>\n\t</div>\n\t<div class="ckf-choose-resized-image-custom-block ckf-choose-resized-image-input">\n\t\t<input type="text" name="ckfCustomWidth" tabindex="1" disabled="disabled" value="{{= it.width }}">\n\t</div>\n\t<div class="ckf-choose-resized-image-custom-block">\n\t\t<label class="ckf-choose-resized-image-label">Height</label>\n\t</div>\n\t<div class="ckf-choose-resized-image-custom-block ckf-choose-resized-image-input">\n\t\t<input type="text" name="ckfCustomHeight" tabindex="1" disabled="disabled" value="{{= it.height }}">\n\t</div>\n</div>\n';
            }), CKFinder.define('CKFinder/Modules/Files/Views/ChooseResizedImageView', [
                'underscore',
                'jquery',
                'CKFinder/Util/KeyCode',
                'CKFinder/Views/Base/CollectionView',
                'CKFinder/Views/Base/ItemView',
                'text!CKFinder/Templates/Files/ChooseResizedImageItem.dot',
                'text!CKFinder/Templates/Files/ChooseResizedImageInputItem.dot'
            ], function (e, t, o, n, i, r, s) {
                'use strict';
                return n.extend({
                    name: 'ContextMenu',
                    template: '',
                    tagName: 'form',
                    events: {
                        'change [name="ckfChooseResized"]': function (e) {
                            t(e.currentTarget).val() === '__custom' ? (this.$el.find('.ckf-choose-resized-image-custom-fields').removeClass('ui-state-disabled'), this.$el.find('.ckf-choose-resized-image-input input').textinput('enable').removeAttr('disabled').first().trigger('focus')) : (this.$el.find('.ckf-choose-resized-image-custom-fields').addClass('ui-state-disabled'), this.$el.find('.ckf-choose-resized-image-input input').textinput('disable').attr('disabled', 'disabled'));
                        }
                    },
                    childEvents: {
                        keydown: function (e, t) {
                            if (t.evt.keyCode === o.down || t.evt.keyCode === o.up || t.evt.keyCode === o.tab) {
                                if (t.evt.preventDefault(), t.evt.stopPropagation(), t.evt.keyCode === o.down || t.evt.keyCode === o.up) {
                                    var n = this.collection.where({ isActive: !0 }), i = n.indexOf(e.model) + (t.evt.keyCode === o.down ? 1 : -1);
                                    i < 0 && (i = n.length - 1), i > n.length - 1 && (i = 0);
                                    var r = this.children.findByModel(n[i]);
                                    r && r.focus();
                                }
                                t.evt.keyCode === o.tab && e.$el.closest('.ckf-dialog').find('[data-ckf-button]').eq(this.finder.util.isShortcut(t.evt, 'shift') ? -1 : 0).trigger('focus');
                            }
                        }
                    },
                    collectionEvents: {
                        reset: function () {
                            this.$el.html('');
                        }
                    },
                    onRender: function () {
                        var e = this;
                        setTimeout(function () {
                            e.$el.enhanceWithin();
                        }, 0);
                    },
                    getChildView: function (e) {
                        var t = {
                            name: 'ChooseResizedItem',
                            finder: this.finder,
                            template: r,
                            tagName: 'div',
                            events: {
                                'keydown input[type="radio"]': function (e) {
                                    this.trigger('keydown', { evt: e });
                                }
                            },
                            focus: function () {
                                this.$el.find('input').trigger('focus');
                            }
                        };
                        return e.get('custom') && this.addCustomSizeViewConfig(t), i.extend(t);
                    },
                    addCustomSizeViewConfig: function (e) {
                        e.name = 'ChooseResizedCustomItem', e.className = 'ckf-choose-resized-image-custom', e.template = s, e.tagName = 'div', e.ui = {
                            width: 'input[name="ckfCustomWidth"]',
                            height: 'input[name="ckfCustomHeight"]'
                        }, e.setSize = function (e, t) {
                            var n = e <= 0 ? 1 : e, i = t <= 0 ? 1 : t;
                            this.ui.height.val(n), this.ui.width.val(i), this.model.set({ size: i + 'x' + n });
                        }, e.events['input @ui.width'] = function () {
                            var e = this.model.get('width'), t = this.model.get('height'), n = t, i = this.ui.width.val();
                            i.length || (i = 1);
                            var r = parseInt(i);
                            r < e ? n = r * (t / e) : r = e, n = Math.round(n), this.setSize(n, r);
                        }, e.events['input @ui.height'] = function () {
                            var e = this.model.get('width'), t = this.model.get('height'), n = e, i = this.ui.height.val(), r = parseInt(i);
                            i.length || (r = 1), r < t ? n = r * (e / t) : r = t, n = Math.round(n), this.setSize(r, n);
                        };
                    },
                    getSelected: function () {
                        return this.collection.findWhere({ name: this.$el.find('input[name="ckfChooseResized"]:checked').val() });
                    }
                });
            }), CKFinder.define('CKFinder/Modules/Files/ChooseFiles', [
                'underscore',
                'jquery',
                'backbone',
                'CKFinder/Modules/Files/Views/ChooseResizedImageView'
            ], function (y, s, a, r) {
                'use strict';
                var d = '__custom', o = 100, n = 110, w = '([0-9]+x[0-9]+)[.][a-zA-Z]{1,5}$', l = '/([^/]+$)';
                function e(t) {
                    var n = t.data.context.file;
                    (t.data.items.add({
                        name: 'Choose',
                        label: t.finder.lang.common.choose,
                        isActive: n.get('folder').get('acl').fileView,
                        icon: 'ckf-choose',
                        action: function () {
                            var e = t.finder.request('files:getSelected');
                            1 < e.length ? c(t.finder, e) : b(t.finder, n);
                        }
                    }), n.isImage() && t.finder.config.resizeImages) && (n.has('imageResizeData') && n.get('imageResizeData').has('originalSize') || n.once('change:imageResizeData', function () {
                        new a.Model({
                            name: 'ChooseResizedImage',
                            label: t.finder.lang.chooseResizedImage.title,
                            isActive: n.get('folder').get('acl').imageResize || E(n),
                            icon: 'ckf-choose-resized',
                            action: function () {
                                f(t.finder, n);
                            }
                        }).set('active', E(n));
                    }), t.data.items.add(new a.Model({
                        name: 'ChooseResizedImage',
                        label: t.finder.lang.chooseResizedImage.title,
                        isActive: n.get('folder').get('acl').imageResize || E(n),
                        icon: 'ckf-choose-resized',
                        action: function () {
                            f(t.finder, n);
                        }
                    })));
                }
                function t(e) {
                    var t = e.data.file;
                    if (x(e, function () {
                            b(e.finder, t);
                        }), t.isImage() && e.finder.config.resizeImages) {
                        var n = t.has('imageResizeData') && t.get('imageResizeData').has('originalSize'), i = new a.Model({
                                name: 'ChooseResizedImage',
                                type: 'button',
                                priority: o,
                                alignment: 'primary',
                                icon: 'ckf-choose-resized',
                                label: e.finder.lang.chooseResizedImage.title,
                                isDisabled: !(t.get('folder').get('acl').imageResize || E(t)),
                                action: function () {
                                    f(e.finder, t);
                                }
                            });
                        n || (t.once('change:imageResizeData', function () {
                            i.set('isDisabled', !E(t));
                        }), e.finder.request('image:getResized', { file: t })), e.data.toolbar.push(i);
                    }
                }
                function u(e) {
                    x(e, function () {
                        c(e.finder, e.finder.request('files:getSelected'));
                    });
                }
                function c(t, e) {
                    var n = e.clone();
                    n.forEach(function (e) {
                        !e.getUrl() && e.get('folder').getResourceType().get('useProxyCommand') && e.set('url', t.request('file:getProxyUrl', { file: e }));
                    }), t.fire('files:choose', { files: n }, t), _(t);
                }
                function f(e, t) {
                    var n = new a.Collection(), i = e.config.initConfigInfo.images;
                    C(n, e, t, i), t.on('change:imageResizeData', function () {
                        n.reset(), C(n, e, t, i);
                    }), e.request('dialog', {
                        title: e.lang.chooseResizedImage.title,
                        name: 'ChooseResizedImage',
                        buttons: [
                            'cancel',
                            'ok'
                        ],
                        view: new r({
                            finder: e,
                            collection: n
                        }),
                        context: { file: t }
                    });
                }
                function h(e) {
                    var t = this.finder, n = e.file, i = new s.Deferred();
                    if (n.has('imageResizeData') && n.get('imageResizeData').has('originalSize'))
                        i.resolve(n);
                    else {
                        var r = n.get('folder');
                        t.once('command:after:GetResizedImages', function (e) {
                            var t = e.data.context.file, o = new a.Model();
                            e.data.response.resized && o.set('resized', e.data.response.resized), e.data.response.originalSize && o.set('originalSize', e.data.response.originalSize), y.forEach(e.data.response.resized, function (e, r) {
                                if (r !== d) {
                                    var t = { fileName: e.name ? e.name : e };
                                    e.url && (t.url = e.url), o.set(F(r), t, { silent: !0 });
                                } else
                                    y.forEach(e, function (e) {
                                        var t = e.name ? e.name : e, n = t.match(w);
                                        if (n) {
                                            var i = { fileName: t };
                                            e.url && (i.url = e.url), o.set(F(r, n[1]), i, { silent: !0 });
                                        }
                                    });
                            }), t.set('imageResizeData', o), e.data.context.dfd.resolve(t);
                        });
                        var o = { fileName: n.get('name') };
                        y.isArray(t.config.resizeImages) && t.config.resizeImages.length && (o.sizes = t.config.resizeImages.join(',')), t.request('command:send', {
                            name: 'GetResizedImages',
                            folder: r,
                            params: o,
                            context: {
                                dfd: i,
                                file: n
                            }
                        });
                    }
                    return i.promise();
                }
                function g(o) {
                    var e = this.finder, t = o.file, n = new s.Deferred(), i = o.size;
                    if (!o.name)
                        throw 'The data.name parameter is required';
                    if (o.name === d) {
                        if (!o.size)
                            throw 'The data.size parameter is required when using "{name}".'.replace('{name}', d);
                        i = o.size;
                    } else {
                        if (!e.config.initConfigInfo.images.sizes[o.name])
                            throw 'The name "{name}" is not configured for resized images'.replace('{name}', o.name);
                        i = e.config.initConfigInfo.images.sizes[o.name];
                    }
                    if (t.has('imageResizeData') && t.get('imageResizeData').has('resizedUrl' + i))
                        n.resolve(t);
                    else {
                        var r = t.get('folder');
                        e.once('command:after:ImageResize', function (e) {
                            var t = e.data.context.file, n = e.data.response.url, i = t.get('imageResizeData');
                            if (i || (i = new a.Model(), t.set('imageResizeData', i)), o.save) {
                                var r = i.get('resized');
                                r || (r = {}, i.set('resized', r)), r.__custom || (r.__custom = []), r.__custom.push(n.match(l)[0]);
                            }
                            i.set(F(o.name, o.size), { url: n }), e.data.context.dfd.resolve(t);
                        }), e.request('command:send', {
                            name: 'ImageResize',
                            folder: r,
                            type: 'post',
                            params: {
                                fileName: t.get('name'),
                                size: i
                            },
                            context: {
                                dfd: n,
                                file: t
                            }
                        });
                    }
                    return n.promise();
                }
                function p(e) {
                    var t = this.finder, n = e.file, i = y.extend({ fileName: n.get('name') }, e.params);
                    return e.cache ? i.cache = e.cache : t.config.initConfigInfo.proxyCache && (i.cache = t.config.initConfigInfo.proxyCache), t.request('command:url', {
                        command: 'Proxy',
                        params: i,
                        folder: n.get('folder')
                    });
                }
                function v(e) {
                    var t = this.finder, n = e.file, i = new s.Deferred(), r = n.getUrl();
                    return n.get('folder').getResourceType().get('useProxyCommand') && (r = t.request('file:getProxyUrl', e)), r ? i.resolve(r) : t.request('command:send', {
                        name: 'GetFileUrl',
                        folder: n.get('folder'),
                        params: { fileName: n.get('name') },
                        context: {
                            dfd: i,
                            file: n
                        }
                    }), i.promise();
                }
                function m(e) {
                    var t = this.finder, n = e.file, i = new s.Deferred();
                    return t.request('command:send', {
                        name: 'GetFileUrl',
                        folder: n.get('folder'),
                        params: {
                            fileName: n.get('name'),
                            thumbnail: e.thumbnail
                        },
                        context: {
                            dfd: i,
                            file: n,
                            thumbnail: e.thumbnail
                        }
                    }), i.promise();
                }
                function C(f, h, e, t) {
                    var n = e.get('imageResizeData'), g = n && n.get('originalSize') || '', p = e.get('folder').get('acl').imageResize, i = e.get('folder').get('acl').imageResizeCustom, r = f.add({
                            label: h.lang.chooseResizedImage.originalSize,
                            size: g,
                            name: 'original',
                            isActive: !0,
                            isDefault: !1
                        }), v = n && n.get('resized'), m = !0;
                    if (y.forEach(t.sizes, function (e, t) {
                            var n = e, i = p;
                            if (!y.isArray(h.config.resizeImages) || !h.config.resizeImages.length || y.includes(h.config.resizeImages, t)) {
                                if (v && v[t]) {
                                    var r = v[t].match(w);
                                    2 === r.length && (n = r[1]), i = !0;
                                } else if (g) {
                                    var o = g.split('x'), s = e.split('x'), a = parseInt(s[0]), l = parseInt(s[1]), u = parseInt(o[0]), c = parseInt(o[1]), d = function (e, t, n, i) {
                                            var r = {
                                                    width: e,
                                                    height: t
                                                }, o = e / n, s = t / i;
                                            1 == o && 1 == s || (o < s ? r.height = parseInt(Math.round(i * o)) : s < o && (r.width = parseInt(Math.round(n * s))));
                                            r.height <= 0 && (r.height = 1);
                                            r.width <= 0 && (r.width = 1);
                                            return r;
                                        }(a, l, u, c);
                                    u <= d.width && c <= d.height ? i = !1 : n = d.width + 'x' + d.height;
                                }
                                f.add({
                                    label: h.lang.chooseResizedImage.sizes[t] ? h.lang.chooseResizedImage.sizes[t] : t,
                                    size: n,
                                    name: t,
                                    isActive: i,
                                    isDefault: m && i
                                }), m = !1;
                            }
                        }), v && v.__custom) {
                        var o = [];
                        y.forEach(v.__custom, function (e) {
                            var t = e.match(w);
                            t && (t = t[1], o.push({
                                label: t,
                                size: t,
                                width: parseInt(t.split('x')[0]),
                                name: d + '_' + t,
                                url: e,
                                isActive: !0
                            }));
                        }), y.chain(o).sortBy('width').forEach(function (e) {
                            f.add(e);
                        });
                    }
                    if (i) {
                        var s = 0, a = 0;
                        if (g) {
                            var l = g.split('x');
                            s = l[0], a = l[1];
                        }
                        f.add({
                            name: d,
                            custom: !0,
                            isActive: i,
                            isDefault: !1,
                            width: s,
                            height: a,
                            size: s + 'x' + a
                        });
                    }
                    f.findWhere({ isDefault: !0 }) || r.set('isDefault', !0);
                }
                function b(e, t) {
                    var n = t.getUrl(), i = new a.Collection([t]);
                    if (!n)
                        return M(e), void e.request('file:getUrl', { file: t }).then(function () {
                            e.request('loader:hide'), c(e, i);
                        });
                    c(e, i);
                }
                function x(e, t) {
                    e.data.toolbar.push({
                        name: 'Choose',
                        type: 'button',
                        priority: n,
                        icon: 'ckf-choose',
                        label: e.finder.lang.common.choose,
                        action: t
                    });
                }
                function E(e) {
                    var t = e.get('folder').get('acl'), n = e.has('imageResizeData') && !!y.size(e.get('imageResizeData').get('resized'));
                    return t.imageResize || t.imageResizeCustom || n;
                }
                function F(e, t) {
                    return e === d ? 'resizedUrl_custom' + t : 'resizedUrl_' + e;
                }
                function _(e) {
                    e.config.chooseFilesClosePopup && e.request('closePopup');
                }
                function M(e) {
                    e.request('loader:show', { text: e.lang.files.gettingFileData + ' ' + e.lang.common.pleaseWait });
                }
                return function (i) {
                    this.finder = i, this.isEnabled = i.config.chooseFiles, i.config.ckeditor && (i.on('files:choose', function (e) {
                        var t = e.data.files.pop();
                        i.request('file:getUrl', { file: t }).then(function () {
                            var e = {
                                fileUrl: t.getUrl(),
                                fileSize: t.get('size'),
                                fileDate: t.get('date')
                            };
                            i.config.ckeditor.callback(e.fileUrl, e);
                        });
                    }), i.on('file:choose:resizedImage', function (e) {
                        var t = e.data.file, n = {
                                fileUrl: e.data.resizedUrl,
                                fileSize: 0,
                                fileDate: t.get('date')
                            };
                        i.config.ckeditor.callback(e.data.resizedUrl, n);
                    })), this.isEnabled && (i.on('contextMenu:file', function (e) {
                        e.data.groups.add({ name: 'choose' });
                    }, null, null, 10), i.on('contextMenu:file:choose', e), i.on('toolbar:reset:Main:file', t), i.on('toolbar:reset:Main:files', u), i.on('command:ok:SaveImage', function (e) {
                        e.data.context.file.set('imageResizeData', new a.Model());
                    }), i.setHandlers({
                        'image:getResized': {
                            callback: h,
                            context: this
                        },
                        'image:resize': {
                            callback: g,
                            context: this
                        },
                        'image:getResizedUrl': {
                            callback: m,
                            context: this
                        },
                        'files:choose': {
                            context: this,
                            callback: function (e) {
                                c(i, e.files);
                            }
                        },
                        'internal:file:choose': {
                            context: this,
                            callback: function (e) {
                                b(i, e.file);
                            }
                        }
                    })), i.setHandlers({
                        'file:getUrl': {
                            callback: v,
                            context: this
                        },
                        'file:getProxyUrl': {
                            callback: p,
                            context: this
                        }
                    }), i.on('command:after:GetFileUrl', function (e) {
                        e.data.context.thumbnail || e.data.context.file.set('url', e.data.response.url), e.data.context.dfd.resolve(e.data.response.url);
                    }), i.on('dialog:ChooseResizedImage:ok', function (e) {
                        var t = e.data.view.getSelected();
                        !function (n, e, t, i, r) {
                            if (e === 'original')
                                return b(n, i);
                            0 === e.indexOf(d + '_') && (e = d);
                            var o = i.get('imageResizeData'), s = F(e, t);
                            if (o && o.has(s)) {
                                var a = o.get(s), l = { file: i };
                                if (a.url)
                                    return c(i, a.url);
                                var u = 'file:getUrl';
                                return e !== 'original' && a.fileName && (u = 'image:getResizedUrl', l.thumbnail = a.fileName), M(n), n.request(u, l).then(function (e) {
                                    c(i, e);
                                });
                            }
                            function c(e, t) {
                                n.request('loader:hide'), n.fire('file:choose:resizedImage', {
                                    file: e,
                                    resizedUrl: t
                                }, n), _(n);
                            }
                            M(n), n.request('image:resize', {
                                file: i,
                                size: t,
                                name: e,
                                save: r
                            }).then(function (e) {
                                c(e, e.get('imageResizeData').get(s).url);
                            });
                        }(i, t.get('name'), t.get('size'), e.data.context.file), i.request('dialog:destroy');
                    });
                };
            }), CKFinder.define('CKFinder/Views/Base/Instant/CollectionView', [
                'underscore',
                'jquery',
                'marionette',
                'CKFinder/Views/Base/Common'
            ], function (r, o, s, t) {
                'use strict';
                var n = s.CollectionView;
                return n.extend(t.proto).extend({
                    constructor: function (e) {
                        t.util.construct.call(this, e), n.prototype.constructor.apply(this, Array.prototype.slice.call(arguments));
                    },
                    _renderChildren: function () {
                        this.destroyEmptyView(), this.attachCollectionHTML(''), this.isEmpty(this.collection) ? this.showEmptyView() : (this.triggerMethod('before:render:collection', this), this._showInstantCollection(), this.triggerMethod('render:collection', this), this.children.isEmpty() && this.getOption('filter') && this.showEmptyView());
                    },
                    _onCollectionAdd: function (e, t) {
                        var n = t.indexOf(e), i = this.getChildViews(), r = o(this.instantRenderChild(e));
                        this.destroyEmptyView(), n >= i.length ? this.$el.append(r) : r.insertBefore(i.eq(n)), this.triggerMethod('childview:render');
                    },
                    _onCollectionRemove: function (e) {
                        var t = this.getChildViewElement(e).remove();
                        this.removeChildView(t), this.checkEmpty();
                    },
                    _sortViews: function () {
                        var e = this._filteredSortedModels();
                        r.find(e, function (e, t) {
                            var n = this.getChildViewElement(e);
                            if (n.length)
                                return this.getChildViews().index(n) !== t;
                        }, this) && this.resortView();
                    },
                    _showInstantCollection: function () {
                        var e = this._filteredSortedModels(), n = [], i = this.getOption('childViewOptions');
                        i = s._getValue(i, this, [
                            void 0,
                            0
                        ]), r.each(e, function (e, t) {
                            n.push(this.getPreRenderer(e).preRender(e, i, t));
                        }, this), this.attachCollectionHTML(n.join(''));
                    },
                    buildChildView: function (e, t, n) {
                        var i = new t(r.extend({
                            model: e,
                            finder: this.finder
                        }, n));
                        return s.MonitorDOMRefresh(i), i;
                    },
                    getChildViewElement: function (e) {
                        return this.$(document.getElementById(e.cid));
                    },
                    attachCollectionHTML: function (e) {
                        this.el.innerHTML = e;
                    },
                    getPreRenderer: function () {
                        throw 'Not implemented';
                    },
                    getChildViews: function () {
                        throw 'Not implemented';
                    },
                    instantRenderChild: function () {
                        throw 'Not implemented';
                    }
                });
            }), CKFinder.define('CKFinder/Modules/Files/Views/Common/FilesViewMixin', [
                'underscore',
                'jquery',
                'CKFinder/Util/KeyCode'
            ], function (t, a, o) {
                'use strict';
                function l(e) {
                    if (e)
                        return 'childview:' + (e.get('view:isFolder') ? 'folder' : 'file') + ':';
                }
                return {
                    getMethods: function () {
                        return {
                            shouldFocusFirstChild: function () {
                                if (this.el === document.activeElement && this.collection.length) {
                                    var e = this.collection.first();
                                    return e.trigger('focus', e), !0;
                                }
                                return !1;
                            },
                            getEmptyViewData: function () {
                                var e, t = !1;
                                if (this.collection.isLoading) {
                                    var n = this.finder.lang.files.loadingFilesPane;
                                    e = {
                                        title: this.finder.lang.common.pleaseWait + ' ' + n.title,
                                        text: n.text
                                    }, t = !0;
                                } else
                                    e = this.collection.isFiltered ? this.finder.lang.files.filterFilesEmpty : this.finder.lang.files.emptyFilesPane;
                                return {
                                    title: e.title,
                                    text: e.text,
                                    displayLoader: t
                                };
                            },
                            updateHeightForBorders: function (e) {
                                var t = parseInt(getComputedStyle(this.el).getPropertyValue('padding-top')), n = parseInt(getComputedStyle(this.el).getPropertyValue('padding-bottom')), i = parseInt(getComputedStyle(this.el).getPropertyValue('border-top-width')), r = parseInt(getComputedStyle(this.el).getPropertyValue('border-bottom-width')), o = e.height - t - n - i - r;
                                return this.$el.css({ 'min-height': o }), o;
                            },
                            checkDoubleTap: function (e) {
                                var t = e.currentTarget.id, n = a(e.currentTarget), i = n.data('ckf-in-touch-at'), r = e.timeStamp;
                                n.data('ckf-in-touch-at', r);
                                var o = i && r - i < 500, s = this.collection.get(t);
                                this.trigger(l(s) + (o ? 'dbltap' : 'touch'), {
                                    evt: e,
                                    model: s
                                });
                            }
                        };
                    },
                    attachModelEvents: function (n, i) {
                        var e = {
                            focus: function (e) {
                                this.getChildViewElement(e).find('.ui-btn').trigger('focus'), this.trigger('file:focused', e);
                            },
                            refresh: function (e) {
                                try {
                                    this.refreshView(e);
                                } catch (e) {
                                }
                            },
                            selected: function (e) {
                                this.getChildViewElement(e).find('.ui-btn').addClass('ui-btn-active');
                            },
                            deselected: function (e) {
                                this.getChildViewElement(e).find('.ui-btn').removeClass('ui-btn-active');
                            },
                            change: function (e) {
                                if (e.changed.name)
                                    try {
                                        this.refreshView(e);
                                    } catch (e) {
                                    }
                            }
                        };
                        t.each(e, function (e, t) {
                            i.listenTo(n, t, e);
                        });
                    },
                    getEvents: function (r) {
                        var n = {
                                keydown: function (e) {
                                    if (e.keyCode !== o.tab || !this.finder.util.isShortcut(e, '') && !this.finder.util.isShortcut(e, 'shift'))
                                        if (e.target !== this.el && e.target !== this.$el.find('.ckf-files-view').get(0)) {
                                            if (e.target !== e.currentTarget) {
                                                var t = a(e.target).closest(r), n = t.get(0).id, i = this.collection.get(n);
                                                if (e.keyCode === o.menu || e.keyCode === o.f10 && this.finder.util.isShortcut(e, 'shift'))
                                                    return void this.trigger(l(i) + 'contextmenu', {
                                                        el: t,
                                                        evt: e,
                                                        model: i
                                                    });
                                                this.trigger(l(i) + 'keydown', {
                                                    evt: e,
                                                    model: i,
                                                    el: t
                                                });
                                            }
                                        } else
                                            this.trigger('keydown', { evt: e });
                                    else
                                        this.finder.request(this.finder.util.isShortcut(e, '') ? 'focus:next' : 'focus:prev', {
                                            node: this.$el,
                                            event: e
                                        });
                                },
                                focus: function (e) {
                                    setTimeout(function () {
                                        (window.scrollY || window.pageYOffset) && window.scrollTo(0, 0);
                                    }, 20), e.target === e.currentTarget && this.collection.length && (e.preventDefault(), e.stopPropagation(), this.trigger('focused'));
                                }
                            }, e = {
                                touchstart: function (t) {
                                    var n = t.currentTarget.id, i = a(t.currentTarget);
                                    i.data('ckf-in-touch', !0);
                                    var e = i.data('ckf-in-touch-timeout');
                                    e && clearTimeout(e);
                                    var r = this;
                                    e = setTimeout(function () {
                                        if (i.data('ckf-in-touch')) {
                                            var e = r.collection.get(n);
                                            if (!e)
                                                return;
                                            r.trigger(l(e) + 'longtouch', {
                                                evt: t,
                                                model: e
                                            }), i.data('ckf-in-touch', !1);
                                        }
                                        i.data('ckf-in-touch-timeout', void 0);
                                    }, 700), i.data('ckf-in-touch-timeout', e);
                                },
                                touchend: function (e) {
                                    var t = e.currentTarget.id, n = a(e.currentTarget);
                                    if (this.checkDoubleTap(e), n.data('ckf-in-touch')) {
                                        var i = this.collection.get(t);
                                        if (!i)
                                            return;
                                        this.trigger(l(i) + 'click', {
                                            evt: e,
                                            model: i
                                        });
                                    }
                                    n.data('ckf-in-touch', !1);
                                },
                                touchcancel: function (e) {
                                    a(e.currentTarget).data('ckf-in-touch', !1);
                                },
                                touchmove: function (e) {
                                    a(e.currentTarget).data('ckf-in-touch', !1);
                                },
                                contextmenu: function (e) {
                                    var t = e.currentTarget.id, n = this.collection.get(t);
                                    a(e.currentTarget).data('ckf-in-touch') ? e.preventDefault() : this.trigger(l(n) + 'contextmenu', {
                                        evt: e,
                                        model: n,
                                        el: document.getElementById(t)
                                    });
                                },
                                click: function (e) {
                                    var t = e.currentTarget.id, n = this.collection.get(t);
                                    this.trigger(l(n) + 'click', {
                                        evt: e,
                                        model: n,
                                        el: document.getElementById(t)
                                    });
                                },
                                dblclick: function (e) {
                                    var t = this.collection.get(e.currentTarget.id);
                                    this.trigger(l(t) + 'dblclick', {
                                        evt: e,
                                        model: t
                                    });
                                },
                                dragstart: function (e) {
                                    var t = this.collection.get(e.currentTarget.id);
                                    this.trigger(l(t) + 'dragstart', {
                                        evt: e,
                                        model: t
                                    });
                                },
                                dragend: function (e) {
                                    var t = this.collection.get(e.currentTarget.id);
                                    function n(e) {
                                        e.cancel();
                                    }
                                    this.finder.on('ui:swipeleft', n, null, null, 1), this.finder.on('ui:swiperight', n, null, null, 1), setTimeout(function () {
                                        this.finder.removeListener('ui:swipeleft', n), this.finder.removeListener('ui:swiperight', n);
                                    }, 500), this.trigger(l(t) + 'dragend', {
                                        evt: e,
                                        model: t
                                    });
                                },
                                blur: function (e) {
                                    e.target.tabIndex = -1;
                                },
                                focus: function (e) {
                                    e.target.tabIndex = 0;
                                }
                            };
                        return t.forEach(e, function (e, t) {
                            n[t + ' ' + r] = e;
                        }), n;
                    }
                };
            }), CKFinder.define('text!CKFinder/Templates/Files/FilesInfo.dot', [], function () {
                return '{{? it.displayLoader }}\n<div class="ui-loader ui-loader-verbose ui-content ui-body-{{= it.swatch }} ui-corner-all">\n\t<span class="ui-icon-loading"></span>\n\t<h1>{{= it.title }}</h1>\n</div>\n{{??}}\n<div class="ckf-files-info-body ui-content ui-body-{{= it.swatch }} ui-corner-all">\n\t<h2>{{= it.title }}</h2>\n\t{{? it.displayLoader }}<p>{{= it.text }}</p>{{?}}\n</div>\n{{?}}\n';
            }), CKFinder.define('CKFinder/Modules/Files/Views/Common/FilesInfoView', [
                'backbone',
                'CKFinder/Views/Base/ItemView',
                'text!CKFinder/Templates/Files/FilesInfo.dot'
            ], function (e, t, n) {
                'use strict';
                return t.extend({
                    name: 'FilesInfoView',
                    template: n,
                    className: 'ckf-files-info',
                    templateHelpers: function () {
                        return { swatch: this.finder.config.swatch };
                    },
                    initialize: function () {
                        this.model = new e.Model({
                            title: this.title,
                            text: this.text,
                            displayLoader: this.displayLoader
                        });
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/Files/FileView.dot', [], function () {
                return '<a href="javascript:void(0)" class="ckf-files-inner ui-btn" tabindex="-1" draggable="true" role="listitem" aria-label="{{! it.name }}" aria-describedby="{{! it.descriptionId }}" data-ckf-drag-preview="{{= it.dragPreviewId }}" data-ckf-view="{{= it.cid }}">\n\t<img id="{{= it.dragPreviewId }}" class="ui-li-thumb" alt="" src="{{= it.getIcon() }}" draggable="true" data-ckf-drag-preview="{{= it.dragPreviewId }}"/>\n\t{{? it.displayName || it.displayDate || it.displaySize }}\n\t<div class="ckf-file-desc ui-bar-{{= it.config.swatch}}" draggable="true">\n\t\t{{? it.displayName }}<h2 title="{{! it.name }}" dir="auto">{{! it.name }}</h2>{{?}}\n\t\t<p draggable="true" id="{{! it.descriptionId }}" data-ckf-drag-preview="{{= it.dragPreviewId }}">\n\t\t\t{{? it.displayDate }}{{! it.lang.formatDateString( it.date ) }}{{?}}\n\t\t\t{{? it.displaySize }}\n\t\t\t\t{{? it.displayDate }}<br>{{?}}\n\t\t\t\t{{! it.lang.formatFileSize( it.size * 1024 ) }}\n\t\t\t{{?}}\n\t\t</p>\n\t</div>\n\t{{?}}\n</a>\n';
            }), CKFinder.define('CKFinder/Modules/Files/Views/ThumbnailsView/FileRenderer', ['text!CKFinder/Templates/Files/FileView.dot'], function (o) {
                'use strict';
                function e(e, t) {
                    this.finder = e, this.renderer = t;
                }
                return e.prototype.preRender = function (e, t) {
                    var n = this.finder, i = {
                            lazyThumb: t.lazyThumb,
                            displayName: t.displayName,
                            displaySize: t.displaySize,
                            displayDate: t.displayDate,
                            descriptionId: 'ckf-file-desc-' + e.cid,
                            dragPreviewId: 'ckf-drag-prev-' + e.cid,
                            getIcon: function () {
                                return n.request('file:getIcon', {
                                    size: t.thumbSize,
                                    file: e
                                });
                            }
                        }, r = '<li id="' + e.cid + '" class="ckf-file-item ui-li-has-thumb' + (e.isImage() ? ' ckf-lazy-thumb' : ' ckf-file-icon') + '"' + (t.mode === 'list' ? '' : ' style="width:' + t.thumbSize + 'px;height:' + t.thumbSize + 'px;"') + ' data-icon="false" role="presentation"' + '>';
                    return r += this.renderer.render(e, 'FileThumb', o, i), r += '</li>';
                }, e;
            }), CKFinder.define('text!CKFinder/Templates/Files/FolderInFile.dot', [], function () {
                return '<a class="ckf-files-inner ui-btn" tabindex="-1" draggable="false" data-ckf-drop="true">\n\t<img class="ui-li-thumb" alt="{{! it.label || it.name }}" src="{{= it.getIcon() }}" data-ckf-drop="true">\n\n\t<div class="ckf-file-desc ui-bar-{{= it.config.swatch }}">\n\t\t<h2 title="{{! it.label || it.name }}" data-ckf-drop="true">{{! it.label || it.name }}</h2>\n\t</div>\n</a>\n';
            }), CKFinder.define('CKFinder/Modules/Files/Views/ThumbnailsView/FolderRenderer', ['text!CKFinder/Templates/Files/FolderInFile.dot'], function (r) {
                'use strict';
                function e(e, t) {
                    this.finder = e, this.renderer = t;
                }
                return e.prototype.preRender = function (e, t) {
                    var n = this.finder, i = {
                            lazyThumb: t.lazyThumb,
                            displayName: t.displayName,
                            displaySize: t.displaySize,
                            displayDate: t.displayDate,
                            descriptionId: 'ckf-file-desc-' + e.cid,
                            dragPreviewId: 'ckf-drag-prev-' + e.cid,
                            getIcon: function () {
                                return n.request('folder:getIcon', {
                                    size: t.thumbSize,
                                    folder: e
                                });
                            }
                        };
                    return '<li id="' + e.cid + '" class="ckf-file-item ckf-folders-item" data-icon="false" role="presentation"' + (t.mode === 'list' ? '' : ' style="width:' + t.thumbSize + 'px;height:' + t.thumbSize + 'px;"') + '>' + this.renderer.render(e, 'FolderThumb', r, i) + '</li>';
                }, e;
            }), CKFinder.define('CKFinder/Util/Throttlers', [
                'underscore',
                'jquery'
            ], function (n, t) {
                'use strict';
                var i = {};
                function r() {
                    this.reset();
                }
                return r.prototype = {
                    reset: function () {
                        var e = this;
                        e.dfd && e.dfd.reject(), e.dfd = new t.Deferred(), e.dfd.done(function () {
                            e.callback && e.callback(), e.reset();
                        }), e.timeOutId = -1;
                    },
                    assignJob: function (e) {
                        this.callback = e;
                    },
                    runAfter: function (e) {
                        var t = this;
                        t.timeOutId && clearTimeout(t.timeOutId), t.timeOutId = setTimeout(function () {
                            t.dfd.resolve();
                        }, e);
                    }
                }, {
                    getOrCreate: function (e, t) {
                        return n.has(i, e) || (i[e] = new r()), i[e].reset(), i[e].assignJob(t), i[e];
                    }
                };
            }), CKFinder.define('CKFinder/Modules/Files/Views/ThumbnailsView', [
                'underscore',
                'jquery',
                'marionette',
                'CKFinder/Views/Base/Instant/CollectionView',
                'CKFinder/Modules/Files/Views/Common/FilesViewMixin',
                'CKFinder/Modules/Files/Views/Common/FilesInfoView',
                'CKFinder/Modules/Files/Views/ThumbnailsView/FileRenderer',
                'CKFinder/Modules/Files/Views/ThumbnailsView/FolderRenderer',
                'CKFinder/Util/Throttlers'
            ], function (s, r, a, e, i, t, n, o, l) {
                'use strict';
                var u = {
                    name: 'ThumbnailsView',
                    reorderOnSort: !0,
                    className: 'ckf-files-view ckf-files-view-borders ui-body-inherit',
                    attributes: {
                        'data-role': 'listview',
                        tabindex: 30,
                        role: 'list'
                    },
                    tagName: 'ul',
                    invertKeys: !1,
                    collectionEvents: {
                        change: function (e) {
                            var t = e.changed;
                            if (t.name || t.date || t.size) {
                                var n = this.getChildViewElement(e), i = this.getOption('childViewOptions');
                                i = a._getValue(i, this, [
                                    void 0,
                                    0
                                ]);
                                var r = s.defaults(i, {
                                    lazyThumb: this.finder.request('file:getThumb', {
                                        file: e,
                                        size: i.thumbSizeString
                                    })
                                });
                                n.replaceWith(this.getPreRenderer(e).preRender(e, r)), this.triggerMethod('childview:render');
                                var o = this.getOption('displayConfig').get('thumbSize');
                                this.getOption('displayConfig').get('mode') === 'thumbs' && this.resizeThumbs(o);
                            }
                        }
                    },
                    initialize: function (e) {
                        var n = this;
                        if (e.displayConfig.set({
                                mode: 'list',
                                thumbSizeString: null,
                                currentThumbConfigSize: 0,
                                thumbClassName: ''
                            }), e.mode === 'thumbs') {
                            var t = n.getOption('displayConfig').get('thumbSize');
                            this.calculateThumbSizeConfig(t), this.resizeThumbs(t), this.applyBiggerThumbs(t), n.setThumbsMode();
                        } else
                            n.setListMode();
                        i.attachModelEvents(this.collection, this), n.on('file:focused', function (o) {
                            var s = this;
                            setTimeout(function () {
                                var e = s.$el.closest('[data-role="page"]');
                                if (s.$el[0].ownerDocument.defaultView) {
                                    var t = parseInt(s.$el.offset().top), n = s.collection.indexOf(o), i = s.getThumbsInRow();
                                    if (n < i && (window.scrollY || window.pageYOffset) && t)
                                        window.scrollTo(0, 0);
                                    else {
                                        var r = s.collection.length % i;
                                        s.collection.length - (r || i) <= n && window.scrollTo(0, e.outerHeight());
                                    }
                                }
                            }, 20);
                        }), n.once('render', function () {
                            n.$el.trigger('create'), n.$el.attr('aria-label', n.finder.lang.files.filesPaneTitle);
                        }), n.once('show', function () {
                            var e = n.$el.closest('.ckf-page-regions');
                            function t(e) {
                                n.trigger('click', { evt: e });
                            }
                            e.on('click', t), n.once('destroy', function () {
                                e.off('click', t);
                            });
                        }), n.on('render', function () {
                            var e = n.finder.request('folder:getActive'), t = e && e.cid;
                            n.finder.config.displayFoldersPanel || n.lastFolderCid || n.focus(), n.lastFolderCid = t, n.getOption('displayConfig').get('mode') === 'list' ? n.setListMode() : n.setThumbsMode();
                        }), n.on('maximize', n.updateHeightForBorders, n);
                    },
                    childViewOptions: function () {
                        return this.getOption('displayConfig').toJSON();
                    },
                    applySizeClass: function (n) {
                        var i = this, r = !1;
                        s.forEach(i.finder.config.thumbnailClasses, function (e, t) {
                            !r && n < t ? (i.$el.addClass('ckf-files-thumbs-' + e), r = !0) : i.$el.removeClass('ckf-files-thumbs-' + e);
                        });
                    },
                    calculateThumbSizeConfig: function (t) {
                        if (t && this.getOption('displayConfig').get('areThumbnailsResizable')) {
                            var e = this.getOption('displayConfig').get('serverThumbs'), n = s.filter(e, function (e) {
                                    return t <= e;
                                }), i = s.isEmpty(n) ? s.max(e) : s.min(n), r = this.getOption('displayConfig').get('thumbnailConfigs')[i];
                            return this.getOption('displayConfig').set('thumbSizeString', r.thumb), this.getOption('displayConfig').set('currentThumbConfigSize', i), r;
                        }
                    },
                    resizeThumbs: function (e) {
                        this.$el.find('.ckf-file-item').css({
                            width: e + 'px',
                            height: e + 'px'
                        });
                        var t = this;
                        setTimeout(function () {
                            t.trigger('sizeUpdate:after');
                        }, 400);
                    },
                    applyBiggerThumbs: function (e) {
                        var t = this;
                        if (e && t.getOption('displayConfig').get('mode') === 'thumbs') {
                            e = parseInt(e, 10), this.applySizeClass(e);
                            var n = this.getOption('displayConfig').get('currentThumbConfigSize');
                            if (!n || n < e) {
                                var i = this.calculateThumbSizeConfig(e);
                                l.getOrCreate('files:resize', function () {
                                    t.$el.find('li').not('.ckf-file-icon').addClass('ckf-lazy-thumb'), t.$el.find('li.ckf-file-icon').each(function () {
                                        r(this).find('img').attr('src', t.finder.request('file:getIcon', {
                                            size: e,
                                            file: t.collection.get(this.id)
                                        }));
                                    }), t.$el.find('li.ckf-folders-item img').attr('src', t.finder.request('folder:getIcon', { size: e })), t.children.invoke('trigger', 'sizeUpdate', {
                                        thumbSize: e,
                                        thumbSizeString: i.thumb
                                    }), t.trigger('sizeUpdate:after');
                                }).runAfter(500);
                            } else
                                setTimeout(function () {
                                    t.trigger('sizeUpdate:after');
                                }, 400);
                        }
                    },
                    setListMode: function () {
                        this.getOption('displayConfig').set('mode', 'list'), this.$el.removeClass('ckf-files-thumbs').addClass('ckf-files-list'), this.$el.find('.ckf-file-item').css({
                            width: 'auto',
                            height: 'auto'
                        });
                    },
                    setThumbsMode: function () {
                        this.getOption('displayConfig').set('mode', 'thumbs'), this.$el.removeClass('ckf-files-list').addClass('ckf-files-thumbs');
                    },
                    getThumbsInRow: function () {
                        if (this.getOption('displayConfig').get('mode') === 'list' || this.collection.length < 2)
                            return 1;
                        var e = this.getChildViewElement(this.collection.first());
                        if (!e.length)
                            return 1;
                        var t, n = e.offset().top, i = 1;
                        for (t = 1; t < this.collection.length && this.getChildViewElement(this.collection.at(t)).offset().top === n; t++)
                            i += 1;
                        return i;
                    },
                    focus: function () {
                        this.$el.trigger('focus');
                    },
                    getEmptyView: function () {
                        var e = this.getEmptyViewData();
                        return t.extend({
                            title: e.title,
                            text: e.text,
                            displayLoader: e.displayLoader,
                            displayInfo: !this.finder.config.readOnly
                        });
                    },
                    getChildViews: function () {
                        return this.$('li');
                    },
                    reorder: function () {
                        var t = this, e = this._filteredSortedModels();
                        if (s.some(e, function (e) {
                                return !t.getChildViewElement(e).length;
                            }))
                            this.render();
                        else {
                            var n = s.map(e, function (e) {
                                    return t.getChildViewElement(e);
                                }), i = this.getChildViews(), r = s.filter(i, function (e) {
                                    return -1 === i.index(e);
                                });
                            this.triggerMethod('before:reorder'), this._appendReorderedChildren(n), r.length, this.checkEmpty(), this.triggerMethod('reorder');
                        }
                    },
                    instantRenderChild: function (e) {
                        var t = this.getOption('childViewOptions');
                        t = a._getValue(t, this, [
                            void 0,
                            0
                        ]);
                        var n = s.defaults(t, {
                            lazyThumb: this.finder.request('file:getThumb', {
                                file: e,
                                size: t.thumbSizeString
                            })
                        });
                        return this.getPreRenderer(e).preRender(e, n);
                    },
                    refreshView: function () {
                    },
                    getPreRenderer: function (e) {
                        return e.get('view:isFolder') ? new o(this.finder, this.finder.renderer) : new n(this.finder, this.finder.renderer);
                    }
                };
                return s.extend(u, i.getMethods()), u.events = s.extend({
                    'mouseenter img': function (e) {
                        var t = r(e.currentTarget).closest('li'), n = setTimeout(function () {
                                t.addClass('ckf-file-show-thumb'), t.data('ckf-description-timeout', void 0);
                            }, 1000);
                        t.data('ckf-description-timeout', n);
                    },
                    'mouseleave img': function (e) {
                        var t = r(e.currentTarget).closest('li'), n = t.data('ckf-description-timeout');
                        n && (clearTimeout(n), t.data('ckf-description-timeout', void 0)), t.removeClass('ckf-file-show-thumb');
                    }
                }, i.getEvents('li')), e.extend(u);
            }), CKFinder.define('text!CKFinder/Templates/Files/List/FileIconCell.dot', [], function () {
                return '<img id="{{= it.dragPreviewId }}" class="ui-li-thumb" alt="" src="{{= it.getIcon() }}" draggable="true" data-ckf-drag-preview="{{= it.dragPreviewId }}" />';
            }), CKFinder.define('text!CKFinder/Templates/Files/List/FileNameCell.dot', [], function () {
                return '<a class="ui-btn" href="" tabindex="-1" draggable="true" data-ckf-drag-preview="{{= it.dragPreviewId }}" title="{{! it.name }}">\n\t<span dir="auto" class="ckf-files-inner">{{! it.name }}</span>\n</a>\n';
            }), CKFinder.define('CKFinder/Modules/Files/Views/ListView/FileRowRenderer', [
                'underscore',
                'text!CKFinder/Templates/Files/List/FileIconCell.dot',
                'text!CKFinder/Templates/Files/List/FileNameCell.dot'
            ], function (l, u, c) {
                'use strict';
                function e(e, t) {
                    this.finder = e, this.renderer = t;
                }
                return e.prototype.preRender = function (i, e) {
                    var r = this.finder, o = this.renderer, s = {
                            lazyThumb: e.lazyThumb,
                            displayName: e.displayName,
                            displaySize: e.displaySize,
                            displayDate: e.displayDate,
                            descriptionId: 'ckf-file-desc-' + i.cid,
                            dragPreviewId: 'ckf-drag-prev-' + i.cid,
                            getIcon: function () {
                                return r.request('file:getIcon', {
                                    size: e.listViewIconSize,
                                    file: i
                                });
                            }
                        }, a = '<tr id="' + i.cid + '" class="ckf-file-item">';
                    return e.collection.forEach(function (e) {
                        var t = e.get('name');
                        if (t !== 'icon')
                            if (t !== 'name')
                                if (t !== 'date')
                                    if (t !== 'size')
                                        if (t !== 'empty') {
                                            var n = {
                                                template: void 0,
                                                templateHelpers: void 0
                                            };
                                            r.fire('listView:file:column:' + t, n), n.template && n.template.length ? a += o.render(i, 'CustomFileCellView-' + t, n.template, l.extend({}, s, n.templateHelpers)) : a += o.render(i, 'EmptyCellView', '<td></td>', s);
                                        } else
                                            a += o.render(i, 'EmptyCellView', '<td></td>', s);
                                    else
                                        a += o.render(i, 'SizeCellView', '<td>{{! it.lang.formatFileSize( it.size * 1024 ) }}</td>', s);
                                else
                                    a += o.render(i, 'DateCellView', '<td>{{! it.lang.formatDateString( it.date ) }}</td>', s);
                            else
                                a += o.render(i, 'FileNameCellView', '<td class="ckf-files-list-view-col-name ui-body-inherit">' + c + '</td>', s);
                        else
                            a += o.render(i, 'FileIconCellView', '<td>' + u + '</td>', s);
                    }), a += '</tr>';
                }, e;
            }), CKFinder.define('text!CKFinder/Templates/Files/List/FolderNameCell.dot', [], function () {
                return '<a class="ui-btn" href="" tabindex="-1" draggable="false" data-ckf-drop="true" title="{{! it.label || it.name }}">\n\t<span dir="auto" class="ckf-files-inner">{{! it.label || it.name }}</span>\n</a>';
            }), CKFinder.define('CKFinder/Modules/Files/Views/ListView/FolderRowRenderer', [
                'underscore',
                'text!CKFinder/Templates/Files/List/FileIconCell.dot',
                'text!CKFinder/Templates/Files/List/FolderNameCell.dot'
            ], function (l, u, c) {
                'use strict';
                function e(e, t) {
                    this.finder = e, this.renderer = t;
                }
                return e.prototype.preRender = function (i, e) {
                    var r = this.finder, o = this.renderer, s = {
                            lazyThumb: e.lazyThumb,
                            displayName: e.displayName,
                            displaySize: e.displaySize,
                            displayDate: e.displayDate,
                            descriptionId: 'ckf-folder-desc-' + i.cid,
                            dragPreviewId: 'ckf-drag-prev-' + i.cid,
                            getIcon: function () {
                                return r.request('folder:getIcon', { size: e.listViewIconSize });
                            }
                        }, a = '<tr id="' + i.cid + '" class="ckf-folder-item" data-ckf-drop="true">';
                    return e.collection.forEach(function (e) {
                        var t = e.get('name');
                        if (t !== 'icon')
                            if (t !== 'name')
                                if (t !== 'empty' && t !== 'size' && t !== 'date') {
                                    var n = {
                                        template: void 0,
                                        templateHelpers: void 0
                                    };
                                    r.fire('listView:folder:column:' + t, n), n.template && n.template.length ? a += o.render(i, 'CustomFolderCellView-' + t, n.template, l.extend({}, s, n.templateHelpers)) : a += o.render(i, 'EmptyCellView', '<td></td>', s);
                                } else
                                    a += o.render(i, 'EmptyCellView', '<td></td>', s);
                            else
                                a += o.render(i, 'FileNameCellView', '<td class="ckf-files-list-view-col-name ui-body-inherit">' + c + '</td>', s);
                        else
                            a += o.render(i, 'FolderIconCellView', '<td>' + u + '</td>', s);
                    }), a += '</tr>';
                }, e;
            }), CKFinder.define('text!CKFinder/Templates/Files/List/ListView.dot', [], function () {
                return '<table class="ckf-files-view ckf-files-list-view">\n<thead>\n\t<tr>\n\t\t{{~ it.columns.models : column }}\n\t\t\t<th{{? column.get("sort") }} data-ckf-sort="{{= column.get("sort") }}"{{?}}{{? column.get("width") }} style="width:{{= column.get("width") }};"{{?}}>\n\t\t\t\t{{= column.get( "label" ) }}\n\t\t\t\t{{? column.get("sort") === it.sortBy }}\n\t\t\t\t\t<span class="ckf-files-list-view-sorter">{{? it.sortByOrder === \'asc\' }}{{= it.asc }}{{?? it.sortByOrder === \'desc\' }}{{= it.desc }}{{?}}</span>\n\t\t\t\t{{?}}\n\t\t\t</th>\n\t\t{{~}}\n\t</tr>\n</thead>\n<tbody></tbody>\n</table>\n';
            }), CKFinder.define('text!CKFinder/Templates/Files/FilesInfoInListView.dot', [], function () {
                return '<td>\n\t<div class="ckf-files-info">\n\t{{? it.displayLoader }}\n\t<div class="ui-loader ui-loader-verbose ui-content ui-body-{{= it.swatch }} ui-corner-all">\n\t\t<span class="ui-icon-loading"></span>\n\t\t<h1>{{= it.title }}</h1>\n\t</div>\n\t{{??}}\n\t<div class="ckf-files-info-body ui-content ui-body-{{= it.swatch }} ui-corner-all">\n\t\t<h2>{{= it.title }}</h2>\n\t\t{{? it.displayLoader }}<p>{{= it.text }}</p>{{?}}\n\t</div>\n\t{{?}}\n\t</div>\n</td>\n';
            }), CKFinder.define('CKFinder/Modules/Files/Views/ListView', [
                'underscore',
                'jquery',
                'backbone',
                'marionette',
                'CKFinder/Views/Base/Instant/CollectionView',
                'CKFinder/Modules/Files/Views/Common/FilesViewMixin',
                'CKFinder/Modules/Files/Views/ListView/FileRowRenderer',
                'CKFinder/Modules/Files/Views/ListView/FolderRowRenderer',
                'CKFinder/Modules/Files/Views/Common/FilesInfoView',
                'text!CKFinder/Templates/Files/List/ListView.dot',
                'text!CKFinder/Templates/Files/FilesInfoInListView.dot'
            ], function (i, r, n, o, e, t, s, a, l, u, c) {
                'use strict';
                var d = {
                        name: 'ListView',
                        attributes: { tabindex: 30 },
                        tagName: 'div',
                        className: 'ckf-files-view-borders ui-body-inherit',
                        reorderOnSort: !0,
                        childViewContainer: 'tbody',
                        template: u,
                        invertKeys: !0,
                        initialize: function (e) {
                            this.columns = new n.Collection([], { comparator: 'priority' }), this.model = new n.Model(), t.attachModelEvents(this.collection, this), this.model.set('asc', '&#9650;'), this.model.set('desc', '&#9660;'), this.updateColumns(), this.listenTo(e.displayConfig, 'change:sortBy', this.updateSortIndicator), this.listenTo(e.displayConfig, 'change:sortByOrder', this.updateSortIndicator), this.on('maximize', this.updateHeightForBorders, this);
                        },
                        childViewOptions: function () {
                            var e = this.getOption('displayConfig').toJSON();
                            return e.collection = this.columns, e;
                        },
                        onBeforeRender: function () {
                            this.updateColumns();
                        },
                        isEmpty: function () {
                            var e = !this.collection.length;
                            return this.$el.toggleClass('ckf-files-list-empty', e), e;
                        },
                        getEmptyView: function () {
                            var e = this.getEmptyViewData();
                            return l.extend({
                                title: e.title,
                                text: e.text,
                                displayLoader: e.displayLoader,
                                displayInfo: !this.finder.config.readOnly,
                                template: c,
                                tagName: 'tr',
                                className: ''
                            });
                        },
                        updateColumns: function () {
                            var e = new n.Collection(), t = this.getOption('displayConfig').get('listViewIconSize') - 4 + 'px';
                            e.add({
                                name: 'icon',
                                label: '',
                                priority: 10,
                                width: t
                            }), e.add({
                                name: 'name',
                                label: this.finder.lang.settings.displayName,
                                priority: 20,
                                sort: 'name'
                            }), this.getOption('displayConfig').get('displaySize') && e.add({
                                name: 'size',
                                label: this.finder.lang.settings.displaySize,
                                priority: 30,
                                sort: 'size'
                            }), this.getOption('displayConfig').get('displayDate') && e.add({
                                name: 'date',
                                label: this.finder.lang.settings.displayDate,
                                priority: 40,
                                sort: 'date'
                            }), this.finder.fire('listView:columns', { columns: e }), this.columns.reset(e.toArray()), this.model.set('columns', this.columns), this.model.set('sortBy', this.getOption('displayConfig').get('sortBy')), this.model.set('sortByOrder', this.getOption('displayConfig').get('sortByOrder'));
                        },
                        getThumbsInRow: function () {
                            return 1;
                        },
                        updateSortIndicator: function () {
                            var e = this.getOption('displayConfig').get('sortBy'), t = this.getOption('displayConfig').get('sortByOrder');
                            this.$el.find('th .ckf-files-list-view-sorter').html(t === 'asc' ? this.model.get('asc') : this.model.get('desc')).appendTo(this.$el.find('th[data-ckf-sort="' + e + '"]'));
                        },
                        getPreRenderer: function (e) {
                            return e.get('view:isFolder') ? new a(this.finder, this.finder.renderer) : new s(this.finder, this.finder.renderer);
                        },
                        attachCollectionHTML: function (e) {
                            var t = this.finder.renderer.render(this.model, 'ListView', u, {}), n = t.indexOf('</tbody>');
                            this.el.innerHTML = t.substring(0, n) + e + t.substring(n);
                        },
                        getChildViewElement: function (e) {
                            return this.$(document.getElementById(e.cid));
                        },
                        getChildViews: function () {
                            return this.$('td');
                        },
                        instantRenderChild: function (e) {
                            var t = this.getOption('childViewOptions');
                            t = o._getValue(t, this, [
                                void 0,
                                0
                            ]);
                            var n = i.defaults(t, {
                                lazyThumb: this.finder.request('file:getThumb', {
                                    file: e,
                                    size: t.thumbSizeString
                                })
                            });
                            return this.getPreRenderer(e).preRender(e, n);
                        },
                        focus: function () {
                            this.$el.trigger('focus');
                        }
                    }, f = t.getMethods();
                return i.extend(d, f), d.events = i.extend({
                    selectstart: function (e) {
                        e.preventDefault(), e.stopPropagation();
                    },
                    'mousedown th[data-ckf-sort]': function (e) {
                        e.stopPropagation(), e.stopImmediatePropagation(), e.preventDefault();
                        var t = r(e.currentTarget).attr('data-ckf-sort');
                        if (t === this.getOption('displayConfig').get('sortBy')) {
                            var n = this.getOption('displayConfig').get('sortByOrder');
                            this.finder.request('settings:setValue', {
                                group: 'files',
                                name: 'sortByOrder',
                                value: n === 'asc' ? 'desc' : 'asc'
                            });
                        } else
                            this.finder.request('settings:setValue', {
                                group: 'files',
                                name: 'sortBy',
                                value: t
                            });
                    },
                    'dragstart .ckf-folder-item': function (e) {
                        e.preventDefault();
                    },
                    'dragend .ckf-folder-item': function (e) {
                        e.preventDefault();
                    },
                    'ckfdrop .ckf-folder-item': function (e) {
                        e.stopPropagation();
                        var t = this.collection.get(e.currentTarget.id);
                        this.trigger('childview:folder:drop', {
                            evt: e,
                            model: t,
                            el: r(e.target).find('.ckf-files-inner')
                        });
                    }
                }, t.getEvents('tr')), e.extend(d);
            }), CKFinder.define('text!CKFinder/Templates/Files/Compact/File.dot', [], function () {
                return '<a class="ui-btn" href="javascript:void(0)" tabindex="-1" draggable="true" data-ckf-drag-preview="{{= it.dragPreviewId }}" title="{{! it.name }}" data-ckf-view="{{= it.cid }}">\n    <img id="{{= it.dragPreviewId }}" alt="" src="{{= it.getIcon() }}" draggable="true" data-ckf-drag-preview="{{= it.dragPreviewId }}" />\n\t<span dir="auto" class="">{{! it.name }}</span>\n</a>\n';
            }), CKFinder.define('CKFinder/Modules/Files/Views/CompactView/FileRenderer', ['text!CKFinder/Templates/Files/Compact/File.dot'], function (o) {
                'use strict';
                function e(e, t) {
                    this.finder = e, this.renderer = t;
                }
                return e.prototype.preRender = function (e, t) {
                    var n = this.finder, i = {
                            lazyThumb: t.lazyThumb,
                            displayName: t.displayName,
                            displaySize: t.displaySize,
                            displayDate: t.displayDate,
                            descriptionId: 'ckf-file-desc-' + e.cid,
                            dragPreviewId: 'ckf-drag-prev-' + e.cid,
                            getIcon: function () {
                                return n.request('file:getIcon', {
                                    size: t.compactViewIconSize,
                                    file: e
                                });
                            }
                        }, r = '<li id="' + e.cid + '" class="ckf-file-item" role="presentation">';
                    return r += this.renderer.render(e, 'CompactFile', o, i), r += '</li>';
                }, e;
            }), CKFinder.define('text!CKFinder/Templates/Files/Compact/Folder.dot', [], function () {
                return '<a class="ui-btn" href="javascript:void(0)" tabindex="-1" draggable="false" title="{{! it.name }}">\n    <img id="{{= it.dragPreviewId }}" alt="" src="{{= it.getIcon() }}" draggable="false" />\n\t<span dir="auto" class="">{{! it.label || it.name }}</span>\n</a>\n';
            }), CKFinder.define('CKFinder/Modules/Files/Views/CompactView/FolderRenderer', ['text!CKFinder/Templates/Files/Compact/Folder.dot'], function (o) {
                'use strict';
                function e(e, t) {
                    this.finder = e, this.renderer = t;
                }
                return e.prototype.preRender = function (e, t) {
                    var n = this.finder, i = {
                            lazyThumb: t.lazyThumb,
                            displayName: t.displayName,
                            displaySize: t.displaySize,
                            displayDate: t.displayDate,
                            descriptionId: 'ckf-file-desc-' + e.cid,
                            dragPreviewId: 'ckf-drag-prev-' + e.cid,
                            getIcon: function () {
                                return n.request('folder:getIcon', {
                                    size: t.compactViewIconSize,
                                    folder: e
                                });
                            }
                        }, r = '<li id="' + e.cid + '" class="ckf-folder-item" role="presentation">';
                    return r += this.renderer.render(e, 'CompactFolder', o, i), r += '</li>';
                }, e;
            }), CKFinder.define('CKFinder/Modules/Files/Views/CompactView', [
                'underscore',
                'jquery',
                'backbone',
                'marionette',
                'CKFinder/Views/Base/Instant/CollectionView',
                'CKFinder/Modules/Files/Views/Common/FilesViewMixin',
                'CKFinder/Modules/Files/Views/CompactView/FileRenderer',
                'CKFinder/Modules/Files/Views/CompactView/FolderRenderer',
                'CKFinder/Modules/Files/Views/Common/FilesInfoView'
            ], function (e, i, t, n, r, o, s, a, l) {
                'use strict';
                var u = {
                        name: 'CompactView',
                        attributes: { tabindex: 30 },
                        tagName: 'ul',
                        className: 'ckf-files-view-borders ckf-files-compact ui-body-inherit',
                        reorderOnSort: !0,
                        invertKeys: !0,
                        initialize: function (e) {
                            this.columns = new t.Collection([], { comparator: 'priority' }), this.model = new t.Model(), o.attachModelEvents(this.collection, this), this.model.set('asc', '&#9650;'), this.model.set('desc', '&#9660;'), this.updateColumns(), this.listenTo(e.displayConfig, 'change:sortBy', this.updateSortIndicator), this.listenTo(e.displayConfig, 'change:sortByOrder', this.updateSortIndicator), this.on('maximize', function (e) {
                                var t = this.updateHeightForBorders(e);
                                if (this.$el.css({ height: '' }), this.collection.length) {
                                    this.$el.css({ height: t });
                                    var n = Math.floor(this.$el.width() / this.getChildViews().first().outerWidth());
                                    if (n * this.getThumbsInRow() <= this.collection.length) {
                                        var i = Math.ceil(this.collection.length / n);
                                        this.$el.css({ height: i * this.getChildViews().first().outerHeight() });
                                    }
                                }
                            }, this);
                        },
                        childViewOptions: function () {
                            var e = this.getOption('displayConfig').toJSON();
                            return e.collection = this.columns, e;
                        },
                        onBeforeRender: function () {
                            this.updateColumns();
                        },
                        isEmpty: function () {
                            var e = !this.collection.length;
                            return this.$el.toggleClass('ckf-files-list-empty', e), e;
                        },
                        getEmptyView: function () {
                            var e = this.getEmptyViewData();
                            return l.extend({
                                title: e.title,
                                text: e.text,
                                displayLoader: e.displayLoader,
                                displayInfo: !this.finder.config.readOnly
                            });
                        },
                        updateColumns: function () {
                            var e = new t.Collection();
                            e.add({
                                name: 'icon',
                                label: '',
                                priority: 10
                            }), e.add({
                                name: 'name',
                                label: this.finder.lang.settings.displayName,
                                priority: 20,
                                sort: 'name'
                            }), this.getOption('displayConfig').get('displaySize') && e.add({
                                name: 'size',
                                label: this.finder.lang.settings.displaySize,
                                priority: 30,
                                sort: 'size'
                            }), this.getOption('displayConfig').get('displayDate') && e.add({
                                name: 'date',
                                label: this.finder.lang.settings.displayDate,
                                priority: 40,
                                sort: 'date'
                            }), this.finder.fire('listView:columns', { columns: e }), this.columns.reset(e.toArray()), this.model.set('columns', this.columns), this.model.set('sortBy', this.getOption('displayConfig').get('sortBy')), this.model.set('sortByOrder', this.getOption('displayConfig').get('sortByOrder'));
                        },
                        getThumbsInRow: function () {
                            if (!this.collection.length)
                                return 1;
                            var e = this.getChildViewElement(this.collection.first());
                            if (!e.length)
                                return 1;
                            var t, n = e.offset().left, i = 1;
                            for (t = 1; t < this.collection.length && this.getChildViewElement(this.collection.at(t)).offset().left === n; t++)
                                i += 1;
                            return i;
                        },
                        updateSortIndicator: function () {
                            var e = this.getOption('displayConfig').get('sortBy'), t = this.getOption('displayConfig').get('sortByOrder');
                            this.$el.find('th .ckf-files-list-view-sorter').html(t === 'asc' ? this.model.get('asc') : this.model.get('desc')).appendTo(this.$el.find('th[data-ckf-sort="' + e + '"]'));
                        },
                        getPreRenderer: function (e) {
                            return e.get('view:isFolder') ? new a(this.finder, this.finder.renderer) : new s(this.finder, this.finder.renderer);
                        },
                        getChildViewElement: function (e) {
                            return this.$(document.getElementById(e.cid));
                        },
                        getChildViews: function () {
                            return this.$('li');
                        },
                        instantRenderChild: function (e) {
                            var t = this.getOption('childViewOptions');
                            return t = n._getValue(t, this, [
                                void 0,
                                0
                            ]), this.getPreRenderer(e).preRender(e, t);
                        },
                        focus: function () {
                            this.$el.trigger('focus');
                        }
                    }, c = o.getMethods();
                return e.extend(u, c), u.events = e.extend({
                    selectstart: function (e) {
                        e.preventDefault(), e.stopPropagation();
                    },
                    'mousedown th[data-ckf-sort]': function (e) {
                        e.stopPropagation(), e.stopImmediatePropagation(), e.preventDefault();
                        var t = i(e.currentTarget).attr('data-ckf-sort');
                        if (t === this.getOption('displayConfig').get('sortBy')) {
                            var n = this.getOption('displayConfig').get('sortByOrder');
                            this.finder.request('settings:setValue', {
                                group: 'files',
                                name: 'sortByOrder',
                                value: n === 'asc' ? 'desc' : 'asc'
                            });
                        } else
                            this.finder.request('settings:setValue', {
                                group: 'files',
                                name: 'sortBy',
                                value: t
                            });
                    },
                    'dragstart .ckf-folder-item': function (e) {
                        e.preventDefault();
                    },
                    'dragend .ckf-folder-item': function (e) {
                        e.preventDefault();
                    },
                    'ckfdrop .ckf-folder-item': function (e) {
                        e.stopPropagation();
                        var t = this.collection.get(e.currentTarget.id);
                        this.trigger('childview:folder:drop', {
                            evt: e,
                            model: t,
                            el: i(e.target).find('.ckf-files-inner')
                        });
                    }
                }, o.getEvents('li')), r.extend(u);
            }), CKFinder.define('CKFinder/Modules/Files/LazyLoader', [
                'underscore',
                'jquery',
                'backbone'
            ], function (r, l, t) {
                'use strict';
                function e(e) {
                    this.finder = e, this.items = new t.Collection();
                }
                function u(e, t) {
                    var n = e.getBoundingClientRect();
                    return 0 <= n.top + n.height - t && n.top <= (window.innerHeight || document.documentElement.clientHeight);
                }
                return e.prototype.registerView = function (t) {
                    var e, n = this.finder;
                    function i() {
                        e && clearTimeout(e), e = setTimeout(function () {
                            var e = l('.ui-page-active .ui-header').height() || 0;
                            !function (t, o, s, a) {
                                var e = a.$el.find('.ckf-lazy-thumb');
                                r.chain(e).filter(function (e) {
                                    return u(e, o) && !l(e).data('ckf-lazy-timeout');
                                }).each(function (n, e) {
                                    var i = l(n), r = setTimeout(function () {
                                            if (!u(n, o))
                                                return i.data('ckf-lazy-timeout', !1), void clearTimeout(r);
                                            var e = a.getOption('displayConfig').get('thumbSizeString'), t = s.request('file:getThumb', {
                                                    file: a.collection.get(n.id),
                                                    size: e
                                                });
                                            i.find('img').after(l('<img style="display:none;">').on('load', function () {
                                                var e = l(this);
                                                e.prev('img').attr('src', e.attr('src')), e.remove(), i.removeClass('ckf-lazy-thumb'), i.data('ckf-lazy-timeout', !1);
                                            }).attr('src', s.util.jsCssEntities(t)));
                                        }, e * t);
                                    i.data('ckf-lazy-timeout', r);
                                }).value();
                            }(n.config.thumbnailDelay, e, n, t);
                        }, 100);
                    }
                    t.on('render', i), t.once('show', function () {
                        this.finder.util.isWidget() && /iPad|iPhone|iPod/.test(navigator.platform) && t.$el.closest('[data-ckf-page="Main"]').on('scroll', i);
                    }), t.on('childview:render', i), t.on('sizeUpdate:after', i), l(document).on('scroll', i), l(window).on('resize', i), this.throttle = i;
                }, e.prototype.disable = function () {
                    l(document).off('scroll', this.throttle), l(window).off('resize', this.throttle);
                }, e;
            }), CKFinder.define('CKFinder/Modules/Files/Views/ViewManager', [
                'underscore',
                'jquery',
                'CKFinder/Util/KeyCode',
                'CKFinder/Modules/Files/Views/ThumbnailsView',
                'CKFinder/Modules/Files/Views/ListView',
                'CKFinder/Modules/Files/Views/CompactView',
                'CKFinder/Modules/Files/LazyLoader'
            ], function (a, c, e, l, u, d, f) {
                'use strict';
                var t = function (t, n) {
                    this.finder = t, this.config = n;
                    var i = this;
                    t.on('settings:change:files', function (e) {
                        n.set(e.data.settings), a.includes([
                            'displayDate',
                            'displayName',
                            'displaySize'
                        ], e.data.changed) && i.view.render();
                    }), t.request('key:listen', { key: e.f9 }), t.on('keydown:' + e.f9, function (e) {
                        t.util.isShortcut(e.data.evt, 'alt') && (e.data.evt.preventDefault(), e.data.evt.stopPropagation(), i.view.$el.trigger('focus'));
                    }), t.on('shortcuts:list:general', function (e) {
                        e.data.shortcuts.add({
                            label: e.finder.lang.shortcuts.general.focusFilesPane,
                            shortcuts: '{alt}+{f9}'
                        });
                    }, null, null, 40);
                };
                function h(e) {
                    var t;
                    e.data.modeChanged && (e.data.mode === 'desktop' ? (this.view.setThumbsMode(), e.finder.request('settings:enable', {
                        group: 'files',
                        name: 'thumbSize'
                    }), t = e.finder.request('settings:getValue', {
                        group: 'files',
                        name: 'thumbSize'
                    }), this.view.resizeThumbs(t), this.view.applyBiggerThumbs(t)) : (e.finder.request('settings:disable', {
                        group: 'files',
                        name: 'thumbSize'
                    }), this.view.setListMode()));
                }
                function g(e) {
                    var t = e.data.value;
                    this.view.resizeThumbs(t), this.view.applyBiggerThumbs(t);
                }
                return t.prototype.createView = function (e) {
                    var t, n = this.finder, i = {
                            finder: n,
                            collection: e,
                            displayConfig: this.config
                        }, r = this.config.get('viewType');
                    if (r === 'thumbnails') {
                        n.request('ui:getMode') === 'desktop' && n.request('settings:enable', {
                            group: 'files',
                            name: 'thumbSize'
                        }), t = new l(a.extend(i, { mode: n.request('ui:getMode') === 'desktop' ? 'thumbs' : 'list' }));
                        var o = new f(n);
                        o.registerView(t), n.on('ui:resize', h, this), n.on('settings:change:files:thumbSize', g, this), t.on('destroy', function () {
                            o.disable();
                        });
                    } else if (r === 'list')
                        n.request('settings:disable', {
                            group: 'files',
                            name: 'thumbSize'
                        }), n.request('settings:disable', {
                            group: 'files',
                            name: 'displayName'
                        }), t = new u(i);
                    else {
                        if (r !== 'compact')
                            throw 'Wrong view type';
                        n.request('settings:disable', {
                            group: 'files',
                            name: 'thumbSize'
                        }), n.request('settings:disable', {
                            group: 'files',
                            name: 'displayName'
                        }), n.request('settings:disable', {
                            group: 'files',
                            name: 'displayDate'
                        }), n.request('settings:disable', {
                            group: 'files',
                            name: 'displaySize'
                        }), t = new d(i);
                    }
                    function s(e) {
                        e.evt.preventDefault(), n.request('folder:openPath', { path: e.model.getPath({ full: !0 }) });
                    }
                    return t.on('childview:file:contextmenu', function (e) {
                        e.evt.preventDefault(), n.request('contextMenu', {
                            name: 'file',
                            evt: e.evt,
                            positionToEl: c(e.el),
                            context: { file: e.model }
                        });
                    }), t.on('childview:folder:contextmenu', function (e) {
                        e.evt.preventDefault(), n.request('contextMenu', {
                            name: 'folder',
                            evt: e.evt,
                            positionToEl: e.el,
                            context: { folder: e.model }
                        });
                    }), t.on('childview:file:keydown', function (e) {
                        n.fire('file:keydown', {
                            evt: e.evt,
                            file: e.model,
                            source: 'filespane'
                        }, n);
                    }), t.on('childview:file:dragstart', function (e) {
                        n.request('files:getSelected').contains(e.model) || (n.request('files:deselectAll'), n.request('files:select', { files: [e.model] })), function (e, t) {
                            var n = t.request('files:getSelected').length;
                            e.originalEvent.stopPropagation(), e.originalEvent.preventDefault();
                            var i = c('<div class="ckf-drag">'), r = '#' + c(e.target).attr('data-ckf-drag-preview'), o = '<img alt="" src="' + c(r).attr('src') + '">';
                            1 < n ? i.append(c(o).addClass('ckf-drag-first')).append(c(o).addClass('ckf-drag-second')).append(c(o).addClass('ckf-drag-third')).append('<div class="ckf-drag-info">' + n + '</div>') : i.append(c(o));
                            function s(e) {
                                e.preventDefault(), e.stopPropagation();
                            }
                            function a(e) {
                                c(document).off('mousemove', l), c(document).off('mouseup', a), setTimeout(function () {
                                    document.removeEventListener('click', s, !0);
                                }, 50), i.remove();
                                var t = c(e.target);
                                if (t.data('ckf-drop'))
                                    t.trigger(new c.Event('ckfdrop', { ckfFilesSelection: !0 }));
                                else {
                                    var n = t.closest('[data-ckf-drop]');
                                    n.length && n.trigger(new c.Event('ckfdrop', { ckfFilesSelection: !0 }));
                                }
                            }
                            function l(e) {
                                u(i, e);
                            }
                            function u(e, t) {
                                var n = c(t.target);
                                n.data('ckf-drop') && n.trigger('ckfdragover'), e.css({
                                    top: t.originalEvent.clientY + 10,
                                    left: t.originalEvent.clientX + 10
                                });
                            }
                            i.appendTo('body'), u(i, e), i.on('mousemove', l), i.on('mouseup', a), c(document).on('mousemove', l), c(document).one('mouseup', a), document.addEventListener('click', s, !0);
                        }(e.evt, n);
                    }), t.on('childview:folder:keydown', function (e) {
                        n.fire('folder:keydown', {
                            evt: e.evt,
                            folder: e.model,
                            source: 'filespane'
                        }, n);
                    }), t.on('childview:folder:click', function (e) {
                        e.model.get('isRoot') || n.request('toolbar:reset', {
                            name: 'Main',
                            event: 'folder',
                            context: { folder: e.model }
                        });
                    }), t.on('childview:folder:dblclick', s), t.on('childview:folder:dbltap', s), t.on('childview:file:dblclick', function (e) {
                        n.fire('file:dblclick', {
                            evt: e.evt,
                            file: e.model
                        });
                    }), t.on('childview:file:dbltap', function (e) {
                        n.fire('file:dbltap', {
                            evt: e.evt,
                            file: e.model
                        });
                    }), t.on('childview:folder:drop', function (e) {
                        n.fire('folder:drop', {
                            evt: e.evt,
                            folder: e.model,
                            view: e.view,
                            el: e.el
                        }, n);
                    }), this.view = t, n.request('page:showInRegion', {
                        page: 'Main',
                        region: 'main',
                        view: t
                    }), t;
                }, t.prototype.destroy = function (e, t) {
                    this.destroyers[e] && this.destroyers[e](t);
                }, t.prototype.destroyers = {
                    list: function (e) {
                        e.request('settings:enable', {
                            group: 'files',
                            name: 'thumbSize'
                        }), e.request('settings:enable', {
                            group: 'files',
                            name: 'displayName'
                        });
                    },
                    thumbnails: function (e) {
                        e.removeListener('ui:resize', h), e.removeListener('settings:change:files:thumbSize', g);
                    },
                    compact: function (e) {
                        e.request('settings:enable', {
                            group: 'files',
                            name: 'thumbSize'
                        }), e.request('settings:enable', {
                            group: 'files',
                            name: 'displayName'
                        }), e.request('settings:enable', {
                            group: 'files',
                            name: 'displayDate'
                        }), e.request('settings:enable', {
                            group: 'files',
                            name: 'displaySize'
                        });
                    }
                }, t;
            }), CKFinder.define('CKFinder/Modules/Files/SelectionHandler', [
                'underscore',
                'backbone',
                'CKFinder/Util/KeyCode'
            ], function (d, s, h) {
                'use strict';
                var a, l, u, c, f, g;
                function e(t, e, n) {
                    var i;
                    this.filesModule = e, this.finder = t, this.selectedFiles = new s.Collection(), this.displayedFiles = n, this.lastFolderCid = null, this.isInSelectionMode = !1, this.invertKeys = !1, g = g || (i = v(t.config.initConfigInfo.c), function (e) {
                        return i.charCodeAt(e);
                    }), this.focusedFile = null, this.rangeSelectionStart = -1;
                    var r = this;
                    function o(e) {
                        r.isInSelectionMode && (e.data.toolbar.push({
                            name: 'ClearSelection',
                            type: 'button',
                            priority: 105,
                            icon: 'ckf-cancel',
                            iconOnly: !0,
                            title: e.finder.lang.common.choose,
                            action: function () {
                                r.isInSelectionMode = !1, e.finder.request('files:getSelected').length ? e.finder.request('files:deselectAll') : e.finder.request('toolbar:reset', {
                                    name: 'Main',
                                    event: 'folder',
                                    context: { folder: e.finder.request('folder:getActive') }
                                });
                            }
                        }), e.data.toolbar.push({
                            name: 'ClearSelectionText',
                            type: 'text',
                            priority: 100,
                            label: t.lang.formatFilesCount(t.request('files:getSelected').length)
                        }));
                    }
                    t.on('toolbar:reset:Main:folder', o, null, null, 20), t.on('toolbar:reset:Main:file', o, null, null, 20), t.on('toolbar:reset:Main:files', o, null, null, 20);
                }
                function p(e, t) {
                    var n = t.lastFolderCid, i = e.request('folder:getActive'), r = i && i.cid;
                    (!n || n === r) && e.fire('files:selected', {
                        files: t.getSelectedFiles(),
                        folders: t.getSelectedFolders()
                    }, e), t.filesModule.view.shouldFocusFirstChild(), t.lastFolderCid = r;
                }
                function v(e) {
                    var t, n, i;
                    for (i = '', t = '123456789ABCDEFGHJKLMNPQRSTUVWXYZ', n = 0; n < e.length; n++)
                        i += String.fromCharCode(t.indexOf(e[n]));
                    return v = void 0, i;
                }
                e.prototype.resetRangeSelection = function () {
                    this.rangeSelectionStart = -1;
                }, e.prototype.selectFiles = function (e, t) {
                    var n = this.displayedFiles, i = this.displayedFiles.indexOf(this.focusedFile), r = d.extend({}, t), o = n.at(e);
                    if (o) {
                        if (r.resetSelection && w(this), r.isAddToRange || this.resetRangeSelection(), i || (i = 0), i === e && !r.forceSelect || r.isToggle)
                            return this.filesSelectToggleHandler({ files: [o] }), void this.focusFile(o);
                        var s = { files: o };
                        if (r.isAddToRange) {
                            -1 === this.rangeSelectionStart && (this.rangeSelectionStart = i);
                            var a = e > this.rangeSelectionStart ? this.rangeSelectionStart : e, l = e > this.rangeSelectionStart ? e : this.rangeSelectionStart;
                            s = { files: n.slice(a, l + 1) };
                        }
                        w(this), this.filesSelectHandler(s), this.focusFile(o);
                    }
                }, e.prototype.filesSelectHandler = function (e) {
                    d.isArray(e.files) || (e.files = [e.files]), this.selectedFiles.add(e.files), 1 === e.files.length && (this.focusedFile = e.files[0]), p(this.finder, this);
                }, e.prototype.filesSelectToggleHandler = function (e) {
                    d.isArray(e.files) && (d.forEach(e.files, function (e) {
                        this.selectedFiles.indexOf(e) < 0 ? this.selectedFiles.add(e) : (e.trigger('deselected', e), this.selectedFiles.remove(e));
                    }, this), p(this.finder, this));
                }, e.prototype.getSelectedFiles = function () {
                    var e = this.selectedFiles.where({ 'view:isFolder': !1 }), t = this.filesModule.displayedFiles;
                    return t.isFiltered ? new s.Collection(e.filter(function (e) {
                        return t.contains(e);
                    })) : new s.Collection(e);
                }, e.prototype.getSelectedFolders = function () {
                    return new s.Collection(this.selectedFiles.where({ 'view:isFolder': !0 }));
                }, e.prototype.registerHandlers = function () {
                    var e, t = this, n = t.finder;
                    e = g(4) - g(0), g(4), g(0), e < 0 && (e = g(4) - g(0) + 33), a = e < 4;
                    var d, f, i, r = t.filesModule;
                    t.selectedFiles.on('reset', function () {
                        p(n, t);
                    }), r.view.on('click', function (e) {
                        e.evt.stopPropagation(), n.request('files:deselectAll');
                    }), d = function (e) {
                        for (var t = '', n = 0; n < e.length; ++n)
                            t += String.fromCharCode(e.charCodeAt(n) ^ 255 & n);
                        return t;
                    }, f = 92533269, c = !function (e, t, n, i, r, o) {
                        for (var s = window[d('D`vf')], a = n, l = o, u = 33 + (a * l - (u = i) * (c = r)) % 33, c = a = 0; c < 33; c++)
                            1 == u * c % 33 && (a = c);
                        return (a * o % 33 * (u = e) + a * (33 + -1 * i) % 33 * (c = t)) % 33 * 12 + ((a * (33 + -1 * r) - 33 * ('' + a * (33 + -1 * r) / 33 >>> 0)) * u + a * n % 33 * c) % 33 - 1 >= (l = new s(10000 * (205974351 ^ f)))[d('gdvEqij^mhx')]() % 2000 * 12 + l[d('gdvNkkro')]();
                    }(g(8), g(9), g(0), g(1), g(2), g(3)), n.setHandlers({
                        'files:select': {
                            callback: this.filesSelectHandler,
                            context: this
                        },
                        'files:select:toggle': {
                            callback: this.filesSelectToggleHandler,
                            context: this
                        },
                        'files:getSelected': {
                            callback: this.getSelectedFiles,
                            context: this
                        },
                        'files:selectAll': function () {
                            t.selectedFiles.reset(r.files.toArray()), t.selectedFiles.forEach(function (e) {
                                e.trigger('selected', e);
                            }), p(n, t);
                        },
                        'files:deselectAll': function () {
                            t.selectedFiles.length && (t.selectedFiles.forEach(function (e) {
                                e.trigger('deselected', e);
                            }), t.selectedFiles.reset());
                        }
                    }), n.on('folder:selected', function () {
                        t.isInSelectionMode = !1;
                    }, null, null, 1), n.on('folder:getFiles:after', function () {
                        t.isInSelectionMode = !1, t.selectedFiles.reset(), t.resetRangeSelection();
                    }), (i = g(5) - g(1)) < 0 && (i = g(5) - g(1) + 33), l = i - 5 <= 0, n.on('files:selected', function (e) {
                        e.data.files.forEach(function (e) {
                            e.trigger('selected', e);
                        });
                    }), function (e) {
                        e.request('key:listen', { key: h.a }), e.on('keydown:' + h.a, function (e) {
                            e.finder.util.isShortcut(e.data.evt, 'ctrl') && (e.data.evt.preventDefault(), e.finder.request('files:selectAll'));
                        }), e.on('shortcuts:list:files', function (e) {
                            e.data.shortcuts.add({
                                label: e.finder.lang.shortcuts.files.selectAll,
                                shortcuts: '{ctrl}+{a}'
                            }), e.data.shortcuts.add({
                                label: e.finder.lang.shortcuts.files.addToSelectionLeft,
                                shortcuts: '{shift}+{leftArrow}'
                            }), e.data.shortcuts.add({
                                label: e.finder.lang.shortcuts.files.addToSelectionRight,
                                shortcuts: '{shift}+{rightArrow}'
                            }), e.data.shortcuts.add({
                                label: e.finder.lang.shortcuts.files.addToSelectionAbove,
                                shortcuts: '{shift}+{upArrow}'
                            }), e.data.shortcuts.add({
                                label: e.finder.lang.shortcuts.files.addToSelectionBelow,
                                shortcuts: '{shift}+{downArrow}'
                            });
                        }, null, null, 50);
                    }(n), n.on('shortcuts:list:general', function (e) {
                        e.data.shortcuts.add({
                            label: e.finder.lang.shortcuts.general.nextItem,
                            shortcuts: '{rightArrow}|{downArrow}'
                        }), e.data.shortcuts.add({
                            label: e.finder.lang.shortcuts.general.previousItem,
                            shortcuts: '{leftArrow}|{upArrow}'
                        }), e.data.shortcuts.add({
                            label: e.finder.lang.shortcuts.general.firstItem,
                            shortcuts: '{home}'
                        }), e.data.shortcuts.add({
                            label: e.finder.lang.shortcuts.general.lastItem,
                            shortcuts: '{end}'
                        });
                    }, null, null, 80);
                }, e.prototype.registerView = function (e) {
                    var t, n, i, r = this.finder;
                    e.on('childview:file:click', s), e.on('childview:folder:click', s), e.on('childview:file:longtouch', function (e) {
                        o.isInSelectionMode || (o.isInSelectionMode = !0, o.selectFiles(o.displayedFiles.indexOf(e.model), {
                            isAddToRange: !1,
                            isToggle: !0,
                            resetSelection: !0
                        }));
                    }), f = function (e, t, n) {
                        var i = 0, r = (window.opener ? window.opener : window.top)['location']['hostname'].toLocaleLowerCase();
                        if (0 === t) {
                            var o = '^www\\.';
                            r = r.replace(new RegExp(o), '');
                        }
                        if (1 === t && (r = 0 <= ('.' + r.replace(new RegExp('^www\\.'), '')).search(new RegExp('\\.' + n + '$')) && n), 2 === t)
                            return !0;
                        for (var s = 0; s < r.length; s++)
                            i += r.charCodeAt(s);
                        return r === n && e === i + -33 * parseInt(i % 100 / 33, 10) - 100 * ('' + i / 100 >>> 0);
                    }(g(7), (t = g(4), n = g(0), (i = t - n) < 0 && (i = t - n + 33), i), r.config.initConfigInfo.s), e.on('childview:folder:keydown', y.bind(this)), e.on('childview:file:keydown', y.bind(this)), u = function (e, t) {
                        for (var n = 0, i = 0; i < 10; i++)
                            n += e.charCodeAt(i);
                        for (; 33 < n;)
                            for (var r = n.toString().split(''), o = n = 0; o < r.length; o++)
                                n += parseInt(r[o]);
                        return n === t;
                    }(r.config.initConfigInfo.c, g(10)), e.on('keydown', function (e) {
                        var t, n = e.evt;
                        if (n.keyCode !== (this.finder.lang.dir === 'ltr' ? h.left : h.right) && n.keyCode !== h.end || (t = o.displayedFiles.last()), n.keyCode !== (this.finder.lang.dir === 'ltr' ? h.right : h.left) && n.keyCode !== h.home || (t = o.displayedFiles.first()), t) {
                            n.stopPropagation(), n.preventDefault();
                            var i = n.keyCode === h.left || n.keyCode === h.right || n.keyCode === h.down || n.keyCode === h.up;
                            o.selectFiles(o.displayedFiles.indexOf(t), {
                                forceSelect: i,
                                isAddToRange: !!n.shiftKey,
                                isToggle: !!e.evt.ctrlKey || !!e.evt.metaKey
                            });
                        }
                    });
                    var o = this;
                    function s(e) {
                        e.evt.preventDefault(), e.evt.stopPropagation();
                        var t = {
                            isAddToRange: !1,
                            isToggle: !0
                        };
                        o.isInSelectionMode || (e.model.get('view:isFolder') && !e.evt.shiftKey ? (t.isToggle = !1, t.forceSelection = !0, t.resetSelection = !0) : (t.isAddToRange = !!e.evt.shiftKey, t.isToggle = !!e.evt.ctrlKey || !!e.evt.metaKey)), o.selectFiles(o.displayedFiles.indexOf(e.model), t);
                    }
                    e.on('focused', function () {
                        var e = o.focusedFile ? o.focusedFile : o.filesModule.displayedFiles.first();
                        setTimeout(function () {
                            o.focusedFile || o.selectFiles(0), e.trigger('focus', e);
                        }, 0);
                    }), function (t) {
                        if (!(a && f && l && u) || c) {
                            if (m)
                                return;
                            var n = function (e) {
                                for (var t = '', n = 0; n < e.length; ++n)
                                    t += String.fromCharCode(e.charCodeAt(n) ^ n + 7 & 255);
                                return t;
                            };
                            window['setInterval'](function () {
                                var e = {};
                                e['msg'] = [
                                    'S``y',
                                    'n{',
                                    'f',
                                    'cmde',
                                    'qm{ybcc',
                                    'hn',
                                    'DCOcehh|',
                                    '4'
                                ]['map'](n)['join'](' '), t.request('dialog:info', e);
                            }, '300000'), m = !0;
                        }
                    }(r), this.invertKeys = e.invertKeys;
                };
                var m = !(e.prototype.focusFile = function (e) {
                    e.trigger('focus', e), this.focusedFile = e;
                });
                function y(e) {
                    var t = e.evt, n = t.keyCode, i = this.finder.lang.dir === 'ltr', r = i ? h.left : h.right, o = i ? h.right : h.left, s = h.down, a = h.up;
                    if (this.invertKeys && (r = h.up, o = h.down, a = i ? h.left : h.right, s = i ? h.right : h.left), d.includes([
                            h.space,
                            r,
                            o,
                            a,
                            s,
                            h.end,
                            h.home
                        ], n)) {
                        t.preventDefault(), t.stopPropagation();
                        var l, u = this.displayedFiles.indexOf(this.focusedFile);
                        if (n === h.space && (l = u, 1 < this.selectedFiles.length))
                            return w(this), this.resetRangeSelection(), void p(this.finder, this);
                        var c = { isAddToRange: !!t.shiftKey };
                        n === h.end && (l = this.displayedFiles.length - 1), n === h.home && (l = 0), n === a && (l = u - this.filesModule.view.getThumbsInRow()), n === r && (l = u - 1), n === o && (l = u + 1), n === s && (l = u + this.filesModule.view.getThumbsInRow()), this.selectFiles(l, c);
                    }
                }
                function w(e) {
                    e.selectedFiles.forEach(function (e) {
                        e.trigger('deselected', e);
                    }), e.selectedFiles.reset([], { silent: !0 });
                }
                return e;
            }), CKFinder.define('CKFinder/Modules/Files/FilesCache', [
                'underscore',
                'backbone'
            ], function (e, t) {
                'use strict';
                var n = t.Collection.extend({
                    sort: 'updated',
                    initialize: function () {
                        this.on('add', function () {
                            var t = 0;
                            this.forEach(function (e) {
                                t += e.get('files').length;
                            }), this.size = t;
                        }, this), this.on('remove', function () {
                            var t = 0;
                            this.forEach(function (e) {
                                t += e.get('files').length;
                            }), this.size = t;
                        }, this);
                    }
                });
                function i(e) {
                    this.maxFiles = e && e.maxFiles || 100, this.cache = new n();
                }
                return i.prototype.add = function (e, t, n) {
                    var i = this.cache.findWhere({ cid: e });
                    i && this.cache.remove(i);
                    var r = {
                        cid: e,
                        files: t,
                        response: n,
                        updated: new Date().getTime()
                    };
                    for (this.cache.add(r); this.cache.size > this.maxFiles && 1 < this.cache.length;)
                        this.cache.shift();
                }, i.prototype.get = function (e) {
                    var t = this.cache.findWhere({ cid: e });
                    return !!t && t.toJSON();
                }, i;
            }), CKFinder.define('CKFinder/Modules/Files/Views/ViewConfig', [
                'underscore',
                'backbone'
            ], function (o, e) {
                'use strict';
                return e.Model.extend({
                    defaults: {
                        isInitialized: !1,
                        areThumbnailsResizable: !1,
                        serverThumbs: [],
                        thumbnailConfigs: {},
                        thumbnailMinSize: null,
                        thumbnailMaxSize: null,
                        thumbnailSizeStep: 1,
                        listViewIconSize: 32,
                        compactViewIconSize: 32
                    },
                    updateThumbsConfig: function (e, t) {
                        o.forEach(e, function (e) {
                            var t = e.split('x'), n = t[0] > t[1] ? t[0] : t[1];
                            this.get('serverThumbs').push(parseInt(n, 10)), this.get('thumbnailConfigs')[n] = {
                                width: t[0],
                                height: t[1],
                                thumb: e
                            };
                        }, this);
                        var n = parseInt(t.thumbnailMaxSize, 10), i = parseInt(t.thumbnailMinSize, 10);
                        this.get('serverThumbs').length && (i || (i = o.min(this.get('serverThumbs'))), n || (n = o.max(this.get('serverThumbs')))), this.set('areThumbnailsResizable', !(!i || !n));
                        var r = o.max(this.get('serverThumbs'));
                        this.set('thumbnailMaxSize', r < n ? r : n), this.set('thumbnailMinSize', i), this.set('thumbnailSizeStep', t.thumbnailSizeStep), this.set('listViewIconSize', t.listViewIconSize), this.set('compactViewIconSize', t.compactViewIconSize);
                    },
                    createSettings: function (e, t, n) {
                        var i = {
                            list: e.settings.viewTypeList,
                            thumbnails: e.settings.viewTypeThumbnails
                        };
                        ('columns' in document.body.style || 'webkitColumns' in document.body.style || 'MozColumns' in document.body.style) && (i.compact = e.settings.viewTypeCompact);
                        var r = {
                                group: 'files',
                                label: e.settings.title,
                                settings: [
                                    {
                                        name: 'displayName',
                                        label: e.settings.displayName,
                                        type: 'checkbox',
                                        defaultValue: t.defaultDisplayFileName
                                    },
                                    {
                                        name: 'displayDate',
                                        label: e.settings.displayDate,
                                        type: 'checkbox',
                                        defaultValue: t.defaultDisplayDate
                                    },
                                    {
                                        name: 'displaySize',
                                        label: e.settings.displaySize,
                                        type: 'checkbox',
                                        defaultValue: t.defaultDisplayFileSize
                                    },
                                    {
                                        name: 'viewType',
                                        label: e.settings.viewType,
                                        type: 'radio',
                                        defaultValue: t.defaultViewType,
                                        attributes: { options: i }
                                    },
                                    {
                                        name: 'sortBy',
                                        label: e.settings.sortBy,
                                        type: 'select',
                                        defaultValue: t.defaultSortBy,
                                        attributes: {
                                            options: {
                                                name: e.settings.displayName,
                                                size: e.settings.displaySize,
                                                date: e.settings.displayDate
                                            }
                                        }
                                    },
                                    {
                                        name: 'sortByOrder',
                                        label: e.settings.sortByOrder,
                                        type: 'radio',
                                        defaultValue: t.defaultSortByOrder,
                                        attributes: {
                                            options: {
                                                asc: e.settings.sortAscending,
                                                desc: e.settings.sortDescending
                                            }
                                        }
                                    }
                                ]
                            }, o = {
                                name: 'thumbSize',
                                label: e.settings.thumbnailSize,
                                type: 'hidden',
                                defaultValue: t.thumbnailDefaultSize
                            };
                        return this.get('areThumbnailsResizable') && (o.type = 'range', o.isEnabled = n, o.attributes = {
                            min: this.get('thumbnailMinSize'),
                            max: this.get('thumbnailMaxSize'),
                            step: this.get('thumbnailSizeStep')
                        }), r.settings.push(o), r;
                    }
                });
            }), CKFinder.define('CKFinder/Modules/Files/Files', [
                'underscore',
                'jquery',
                'backbone',
                'CKFinder/Models/File',
                'CKFinder/Models/Folder',
                'CKFinder/Util/KeyCode',
                'CKFinder/Modules/Files/FilesFilter',
                'CKFinder/Modules/Files/ChooseFiles',
                'CKFinder/Modules/Files/Views/ViewManager',
                'CKFinder/Modules/Files/SelectionHandler',
                'CKFinder/Modules/Files/FilesCache',
                'CKFinder/Modules/Files/Views/ViewConfig'
            ], function (c, e, t, d, n, o, s, a, l, u, f, h) {
                'use strict';
                function i(i) {
                    var r = this;
                    r.finder = i, r.initDfd = new e.Deferred(), r.config = new h(), r.files = new t.Collection(), r.displayedFiles = s.attachTo(r.files), r.displayedFiles.isLoading = !0, r.filesCache = new f({ maxFiles: 2000 }), r.viewManager = new l(i, r.config), new a(i), i.once('command:ok:Init', x, r, null, 30), i.setHandlers({
                        'file:getThumb': {
                            callback: m,
                            context: r
                        },
                        'file:getIcon': {
                            callback: w,
                            context: r
                        },
                        'folder:getIcon': {
                            callback: y,
                            context: r
                        },
                        'files:filter': {
                            callback: v,
                            context: r
                        },
                        'file:getActive': function () {
                            return r.selection.focusedFile;
                        },
                        'files:getCurrent': function () {
                            return r.files.clone();
                        },
                        'files:getDisplayed': function () {
                            return r.displayedFiles.clone();
                        },
                        'folder:getFiles': {
                            callback: p,
                            context: r
                        },
                        'folder:refreshFiles': {
                            callback: C,
                            context: r
                        },
                        'resources:show': {
                            callback: b,
                            context: r
                        }
                    }), i.on('contextMenu:file', function (e) {
                        e.data.groups.add({ name: 'edit' });
                    }, null, null, 30), i.on('files:deleted', function (e) {
                        var n = r.files.length;
                        if (c.forEach(e.data.files, function (e) {
                                var t = r.files.indexOf(e);
                                t < n && (n = t);
                            }), 0 < n && (n -= 1), r.files.remove(e.data.files), r.finder.request('files:deselectAll'), r.files.length) {
                            var t = r.files.at(n);
                            r.selection.focusFile(t);
                        } else
                            r.view.focus();
                    }), i.config.displayFoldersPanel || (i.on('folder:deleted', function (e) {
                        r.files.remove(e.data.folder), r.finder.request('files:deselectAll');
                    }), i.on('command:after:GetFolders', function (n) {
                        r.doAfterInit(function () {
                            var e = i.request('folder:getActive');
                            if (e && e.isPath(n.data.response.currentFolder.path, n.data.response.resourceType)) {
                                r.files.add(e.get('children').toArray());
                                var t = r.filesCache.get(e.cid);
                                r.filesCache.add(e.cid, r.files.toArray(), t ? t.response : '');
                            }
                        });
                    }, null, null, 30)), i.on('command:after:GetFiles', E, this), i.on('file:dblclick', g, r), i.on('file:dbltap', g, r), i.on('file:keydown', function (e) {
                        i.util.isShortcut(e.data.evt, '') && e.data.evt.keyCode === o.enter && (e.stop(), e.data.evt.preventDefault(), g.call(r, e));
                    }), i.on('command:error:RenameFile', F, null, null, 5), i.on('shortcuts:list', function (e) {
                        e.data.groups.add({
                            name: 'files',
                            priority: 20,
                            label: e.finder.lang.files.filesPaneTitle
                        });
                    }), i.on('folder:selected', function (e) {
                        var t = e.data.folder;
                        t !== e.data.previousFolder ? e.finder.request('folder:getFiles', { folder: t }) : r.displayedFiles.search('');
                    }), i.on('settings:change:files:viewType', function (e) {
                        r.viewManager.destroy(e.data.previousValue, i), r.view = r.viewManager.createView(r.displayedFiles), r.selection.registerView(r.view);
                    }), i.on('settings:change:files:sortBy', function (e) {
                        r.displayedFiles.sortByField(e.data.value), r.config.set('sortBy', e.data.value);
                    }), i.on('settings:change:files:sortByOrder', function (e) {
                        r.config.set('sortByOrder', e.data.value), e.data.value === 'asc' ? r.displayedFiles.sortAscending() : r.displayedFiles.sortDescending();
                    }), function (t) {
                        t.request('key:listen', { key: o.f5 }), t.request('key:listen', { key: o.r }), t.on('keydown:' + o.f5, function (e) {
                            (t.util.isShortcut(e.data.evt, '') || t.util.isShortcut(e.data.evt, 'ctrl') || t.util.isShortcut(e.data.evt, 'shift') || t.util.isShortcut(e.data.evt, 'ctrl+shift')) && _(e);
                        }), t.on('keydown:' + o.r, function (e) {
                            (t.util.isShortcut(e.data.evt, 'ctrl') || t.util.isShortcut(e.data.evt, 'ctrl+shift')) && _(e);
                        }), t.on('shortcuts:list:files', function (e) {
                            e.data.shortcuts.add({
                                label: e.finder.lang.shortcuts.files.refresh,
                                shortcuts: '{f5}|{ctrl}+{r}'
                            });
                        }, null, null, 60);
                    }(i);
                }
                function g(e) {
                    var t = this.finder, n = e.data.file;
                    t.request('files:select', { files: n }), t.config.chooseFiles && t.config.chooseFilesOnDblClick ? t.request('internal:file:choose', { file: n }) : t.request('file:preview', { file: n });
                }
                function p(e) {
                    var t = e.folder, n = this.finder, i = c.extend({ folder: t }, e.context);
                    this.displayedFiles.isLoading = !0, this.files.reset();
                    var r = this.filesCache.get(t.cid);
                    if (!1 !== r && (this.displayedFiles.isLoading = !1, this.files.reset(r.files)), n.fire('folder:getFiles:before', i, n))
                        return n.request('command:send', {
                            name: 'GetFiles',
                            folder: t,
                            context: i
                        });
                }
                function v(e) {
                    var t = this;
                    t._lastFilterTimeout && (clearTimeout(t._lastFilterTimeout), t._lastFilterTimeout = null), t.displayedFiles.length < 200 ? t.displayedFiles.search(e.text) : t._lastFilterTimeout = setTimeout(function () {
                        t.displayedFiles.search(e.text);
                    }, 1000);
                }
                function m(e) {
                    var t = e.file, n = {
                            fileName: t.get('name'),
                            date: t.get('date'),
                            fileSize: t.get('size')
                        };
                    return e.size && (n.size = e.size), this.finder.request('command:url', {
                        command: 'Thumbnail',
                        folder: t.get('folder'),
                        params: n
                    });
                }
                function y(e) {
                    return r(this.finder, 'folder', e.size);
                }
                function w(e) {
                    return r(this.finder, e.file.getExtension(), e.size, e.previewIcon);
                }
                function r(e, t, n, i) {
                    var r = e.config.fileIconsSizes.split(',');
                    t = t.toLocaleLowerCase();
                    var o, s = '?ckfver=596166831', a = -1 !== [
                            'jpg',
                            'png',
                            'jpeg',
                            'gif'
                        ].indexOf(t);
                    return o = i && a && e.config.customPreviewImageIcon ? e.config.customPreviewImageIcon : e.config.fileIcons[c.has(e.config.fileIcons, t) ? t : 'default'], e.util.url(e.config.fileIconsPath + function (e) {
                        if (0 <= r.indexOf(e.toString()))
                            return e.toString();
                        for (var t = r.length, n = t - 1; e > parseInt(r[--t]) && 0 <= t;)
                            n = t;
                        return r[n];
                    }(n) + '/' + o + s);
                }
                function C(e) {
                    var t = this.finder;
                    t.request('loader:show', { text: t.lang.files.filesRefresh });
                    var n = t.request('folder:getActive'), i = t.request('command:send', {
                            name: 'GetFiles',
                            folder: n,
                            context: c.extend({ folder: n }, e && e.context)
                        });
                    return i.then(function () {
                        t.request('loader:hide');
                    }), i;
                }
                function b() {
                    var e = this, t = e.finder;
                    e.doAfterInit(function () {
                        t.fire('resources:show:before', { resources: e.resources }, t), e.files.reset(t.request('resources:get').toArray()), t.config.rememberLastFolder && t.request('settings:setValue', {
                            group: 'folders',
                            name: 'lastFolder',
                            value: '/'
                        }), t.fire('resources:show', { resources: e.resources }, t);
                    });
                }
                function x(e) {
                    var t = this, n = t.finder;
                    e.data.response.thumbs && t.config.updateThumbsConfig(e.data.response.thumbs, n.config);
                    var i = n.request('settings:define', t.config.createSettings(n.lang, n.config, n.request('ui:getMode') === 'desktop'));
                    if (t.config.set(i), t.config.get('thumbSize') && t.config.get('viewType') === 'thumbnails') {
                        var r = t.config.get('thumbSize'), o = r;
                        r > t.config.get('thumbnailMaxSize') ? o = t.config.get('thumbnailMaxSize') : r < t.config.get('thumbnailMinSize') && (o = t.config.get('thumbnailMinSize')), o && (t.config.set('thumbSize', o), t.finder.request('settings:setValue', {
                            group: 'files',
                            name: 'thumbSize',
                            value: o
                        }));
                    }
                    t.config.get('viewType') === 'list' && (n.request('settings:disable', {
                        group: 'files',
                        name: 'thumbSize'
                    }), n.request('settings:disable', {
                        group: 'files',
                        name: 'displayName'
                    })), t.displayedFiles.sortByField(t.config.get('sortBy')), t.config.get('sortByOrder') === 'asc' ? t.displayedFiles.sortAscending() : t.displayedFiles.sortDescending(), function (e) {
                        e.on('page:create:Main', function (e) {
                            e.finder.request('toolbar:create', {
                                name: 'Main',
                                page: 'Main'
                            });
                        }), e.on('resources:show', function () {
                            e.request('toolbar:reset', {
                                name: 'Main',
                                event: 'resources'
                            });
                        }), e.on('files:selected', function (e) {
                            var t = e.data.files;
                            if (!t.length) {
                                var n = e.finder.request('folder:getActive');
                                return n ? void (!e.finder.config.displayFoldersPanel && e.data.folders.length || e.finder.request('toolbar:reset', {
                                    name: 'Main',
                                    event: 'folder',
                                    context: { folder: n }
                                })) : void e.finder.request('toolbar:reset', {
                                    name: 'Main',
                                    event: 'resources'
                                });
                            }
                            1 < t.length ? e.finder.request('toolbar:reset', {
                                name: 'Main',
                                event: 'files',
                                context: { files: t }
                            }) : e.finder.request('toolbar:reset', {
                                name: 'Main',
                                event: 'file',
                                context: { file: t.at(0) }
                            });
                        }, this);
                    }.call(t, n), n.request('page:create', {
                        name: 'Main',
                        mainRegionAutoHeight: !0,
                        className: 'ckf-files-page' + (n.config.displayFoldersPanel ? '' : ' ckf-files-no-tree')
                    }), n.request('page:show', { name: 'Main' }), t.view = t.viewManager.createView(t.displayedFiles), t.selection = new u(n, t, t.displayedFiles), t.selection.registerHandlers(), t.selection.registerView(t.view), t.initDfd.resolve();
                }
                function E(e) {
                    var n = this, t = e.data.response, i = e.finder, r = i.request('folder:getActive');
                    if (!e.data.response.error && r && r.isPath(t.currentFolder.path, t.resourceType)) {
                        var o = t.files, s = [];
                        i.config.displayFoldersPanel || r.get('children').forEach(function (e) {
                            s.push(e);
                        });
                        var a = n.filesCache.get(r.cid);
                        if (!a || a.response !== e.data.rawResponse) {
                            var l = n.files.filter(function (e) {
                                if (e.get('view:isFolder'))
                                    return !1;
                                var t = c.findWhere(o, { name: e.get('name') });
                                return !t || (e.set(t), !(t.isParsed = !0));
                            });
                            n.displayedFiles.isLoading = !1, l && n.files.remove(l);
                            var u = 0 < n.files.length;
                            c.forEach(o, function (e) {
                                if (!e.isParsed) {
                                    var t = new d(e);
                                    t.set('folder', r), t.set('cid', t.cid), u ? n.files.add(t) : s.push(t);
                                }
                            }), u || n.files.reset(s), n.filesCache.add(r.cid, n.files.toArray(), e.data.rawResponse);
                        }
                        i.fire('folder:getFiles:after', { folder: r }, i), setTimeout(function () {
                            (window.scrollY || window.pageYOffset) && window.scrollTo(0, 0);
                        }, 20);
                    }
                }
                function F(e) {
                    117 === e.data.response.error.number && (e.cancel(), e.finder.request('dialog:info', { msg: e.finder.lang.errors.missingFile }), e.finder.request('folder:refreshFiles'));
                }
                function _(e) {
                    e.data.evt.preventDefault(), e.data.evt.stopPropagation();
                    var t = e.finder.request('folder:getActive');
                    e.finder.request('folder:refreshFiles'), e.finder.request('command:send', {
                        name: 'GetFolders',
                        folder: t,
                        context: { parent: t }
                    });
                }
                return i.prototype.doAfterInit = function (e) {
                    this.initDfd.promise().done(e);
                }, i;
            }), function () {
                'use strict';
                function O(e, t, n, i, r, o) {
                    return {
                        tag: e,
                        key: t,
                        attrs: n,
                        children: i,
                        text: r,
                        dom: o,
                        domSize: void 0,
                        state: void 0,
                        _state: void 0,
                        events: void 0,
                        instance: void 0,
                        skip: !1
                    };
                }
                O.normalize = function (e) {
                    return Array.isArray(e) ? O('[', void 0, void 0, O.normalizeChildren(e), void 0, void 0) : null != e && 'object' != typeof e ? O('#', void 0, void 0, !1 === e ? '' : e, void 0, void 0) : e;
                }, O.normalizeChildren = function (e) {
                    for (var t = 0; t < e.length; t++)
                        e[t] = O.normalize(e[t]);
                    return e;
                };
                var l = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g, u = {}, c = {}.hasOwnProperty;
                function d(e) {
                    for (var t in e)
                        if (c.call(e, t))
                            return !1;
                    return !0;
                }
                function e(e) {
                    var t, n = arguments[1], i = 2;
                    if (null == e || 'string' != typeof e && 'function' != typeof e && 'function' != typeof e.view)
                        throw Error('The selector must be either a string or a component.');
                    if ('string' == typeof e)
                        var r = u[e] || function (e) {
                            for (var t, n = 'div', i = [], r = {}; t = l.exec(e);) {
                                var o = t[1], s = t[2];
                                if ('' === o && '' !== s)
                                    n = s;
                                else if ('#' === o)
                                    r.id = s;
                                else if ('.' === o)
                                    i.push(s);
                                else if ('[' === t[3][0]) {
                                    var a = t[6];
                                    a && (a = a.replace(/\\(["'])/g, '$1').replace(/\\\\/g, '\\')), t[4] === 'class' ? i.push(a) : r[t[4]] = '' === a ? a : a || !0;
                                }
                            }
                            return 0 < i.length && (r.className = i.join(' ')), u[e] = {
                                tag: n,
                                attrs: r
                            };
                        }(e);
                    if (null == n ? n = {} : ('object' != typeof n || null != n.tag || Array.isArray(n)) && (n = {}, i = 1), arguments.length === i + 1)
                        t = arguments[i], Array.isArray(t) || (t = [t]);
                    else
                        for (t = []; i < arguments.length;)
                            t.push(arguments[i++]);
                    var o = O.normalizeChildren(t);
                    return 'string' == typeof e ? function (e, t, n) {
                        var i, r, o = !1, s = t.className || t.class;
                        if (!d(e.attrs) && !d(t)) {
                            var a = {};
                            for (var l in t)
                                c.call(t, l) && (a[l] = t[l]);
                            t = a;
                        }
                        for (var l in e.attrs)
                            c.call(e.attrs, l) && (t[l] = e.attrs[l]);
                        for (var l in (void 0 !== s && (void 0 !== t.class && (t.class = void 0, t.className = s), null != e.attrs.className && (t.className = e.attrs.className + ' ' + s)), t))
                            if (c.call(t, l) && l !== 'key') {
                                o = !0;
                                break;
                            }
                        return Array.isArray(n) && 1 === n.length && null != n[0] && '#' === n[0].tag ? r = n[0].children : i = n, O(e.tag, t.key, o ? t : void 0, i, r);
                    }(r, n, o) : O(e, n.key, n, o);
                }
                e.trust = function (e) {
                    return null == e && (e = ''), O('<', void 0, void 0, e, void 0, void 0);
                }, e.fragment = function (e, t) {
                    return O('[', e.key, e, O.normalizeChildren(t), void 0, void 0);
                };
                var t = e;
                if ((f = function (e) {
                        if (!(this instanceof f))
                            throw new Error('Promise must be called with `new`');
                        if ('function' != typeof e)
                            throw new TypeError('executor must be a function');
                        var o = this, s = [], a = [], r = t(s, !0), l = t(a, !1), u = o._instance = {
                                resolvers: s,
                                rejectors: a
                            }, c = 'function' == typeof setImmediate ? setImmediate : setTimeout;
                        function t(i, r) {
                            return function t(n) {
                                var e;
                                try {
                                    if (!r || null == n || 'object' != typeof n && 'function' != typeof n || 'function' != typeof (e = n.then))
                                        c(function () {
                                            r || 0 !== i.length || console.error('Possible unhandled promise rejection:', n);
                                            for (var e = 0; e < i.length; e++)
                                                i[e](n);
                                            s.length = 0, a.length = 0, u.state = r, u.retry = function () {
                                                t(n);
                                            };
                                        });
                                    else {
                                        if (n === o)
                                            throw new TypeError('Promise can\'t be resolved w/ itself');
                                        d(e.bind(n));
                                    }
                                } catch (e) {
                                    l(e);
                                }
                            };
                        }
                        function d(e) {
                            var n = 0;
                            function t(t) {
                                return function (e) {
                                    0 < n++ || t(e);
                                };
                            }
                            var i = t(l);
                            try {
                                e(t(r), i);
                            } catch (e) {
                                i(e);
                            }
                        }
                        d(e);
                    }).prototype.then = function (e, t) {
                        var r, o, s = this._instance;
                        function n(t, e, n, i) {
                            e.push(function (e) {
                                if ('function' != typeof t)
                                    n(e);
                                else
                                    try {
                                        r(t(e));
                                    } catch (e) {
                                        o && o(e);
                                    }
                            }), 'function' == typeof s.retry && i === s.state && s.retry();
                        }
                        var i = new f(function (e, t) {
                            r = e, o = t;
                        });
                        return n(e, s.resolvers, r, !0), n(t, s.rejectors, o, !1), i;
                    }, f.prototype.catch = function (e) {
                        return this.then(null, e);
                    }, f.resolve = function (t) {
                        return t instanceof f ? t : new f(function (e) {
                            e(t);
                        });
                    }, f.reject = function (n) {
                        return new f(function (e, t) {
                            t(n);
                        });
                    }, f.all = function (a) {
                        return new f(function (n, i) {
                            var r = a.length, o = 0, s = [];
                            if (0 === a.length)
                                n([]);
                            else
                                for (var e = 0; e < a.length; e++)
                                    !function (t) {
                                        function e(e) {
                                            o++, s[t] = e, o === r && n(s);
                                        }
                                        null == a[t] || 'object' != typeof a[t] && 'function' != typeof a[t] || 'function' != typeof a[t].then ? e(a[t]) : a[t].then(e, i);
                                    }(e);
                        });
                    }, f.race = function (i) {
                        return new f(function (e, t) {
                            for (var n = 0; n < i.length; n++)
                                i[n].then(e, t);
                        });
                    }, void 0 !== window) {
                    void 0 === window.Promise && (window.Promise = f);
                    var f = window.Promise;
                } else if ('undefined' != typeof global) {
                    void 0 === global.Promise && (global.Promise = f);
                    f = global.Promise;
                }
                var p = function (e) {
                        if (Object.prototype.toString.call(e) !== '[object Object]')
                            return '';
                        var i = [];
                        for (var t in e)
                            r(t, e[t]);
                        return i.join('&');
                        function r(e, t) {
                            if (Array.isArray(t))
                                for (var n = 0; n < t.length; n++)
                                    r(e + '[' + n + ']', t[n]);
                            else if (Object.prototype.toString.call(t) === '[object Object]')
                                for (var n in t)
                                    r(e + '[' + n + ']', t[n]);
                            else
                                i.push(encodeURIComponent(e) + (null != t && '' !== t ? '=' + encodeURIComponent(t) : ''));
                        }
                    }, v = new RegExp('^file://', 'i'), n = function (l, i) {
                        var t, o = 0;
                        function s() {
                            var r = 0;
                            function o() {
                                0 == --r && 'function' == typeof t && t();
                            }
                            return function t(n) {
                                var i = n.then;
                                return n.then = function () {
                                    r++;
                                    var e = i.apply(n, arguments);
                                    return e.then(o, function (e) {
                                        if (o(), 0 === r)
                                            throw e;
                                    }), t(e);
                                }, n;
                            };
                        }
                        function u(e, t) {
                            if ('string' == typeof e) {
                                var n = e;
                                null == (e = t || {}).url && (e.url = n);
                            }
                            return e;
                        }
                        function c(e, t) {
                            if (null == t)
                                return e;
                            for (var n = e.match(/:[^\/]+/gi) || [], i = 0; i < n.length; i++) {
                                var r = n[i].slice(1);
                                null != t[r] && (e = e.replace(n[i], t[r]));
                            }
                            return e;
                        }
                        function d(e, t) {
                            var n = p(t);
                            if ('' !== n) {
                                var i = e.indexOf('?') < 0 ? '?' : '&';
                                e += i + n;
                            }
                            return e;
                        }
                        function f(t) {
                            try {
                                return '' !== t ? JSON.parse(t) : null;
                            } catch (e) {
                                throw new Error(t);
                            }
                        }
                        function h(e) {
                            return e.responseText;
                        }
                        function g(e, t) {
                            if ('function' == typeof e) {
                                if (!Array.isArray(t))
                                    return new e(t);
                                for (var n = 0; n < t.length; n++)
                                    t[n] = new e(t[n]);
                            }
                            return t;
                        }
                        return {
                            request: function (a, e) {
                                var t = s();
                                a = u(a, e);
                                var n = new i(function (i, r) {
                                    null == a.method && (a.method = 'GET'), a.method = a.method.toUpperCase();
                                    var e = a.method !== 'GET' && a.method !== 'TRACE' && ('boolean' != typeof a.useBody || a.useBody);
                                    'function' != typeof a.serialize && (a.serialize = 'undefined' != typeof FormData && a.data instanceof FormData ? function (e) {
                                        return e;
                                    } : JSON.stringify), 'function' != typeof a.deserialize && (a.deserialize = f), 'function' != typeof a.extract && (a.extract = h), a.url = c(a.url, a.data), e ? a.data = a.serialize(a.data) : a.url = d(a.url, a.data);
                                    var o = new l.XMLHttpRequest(), s = !1, t = o.abort;
                                    for (var n in (o.abort = function () {
                                            s = !0, t.call(o);
                                        }, o.open(a.method, a.url, 'boolean' != typeof a.async || a.async, 'string' == typeof a.user ? a.user : void 0, 'string' == typeof a.password ? a.password : void 0), a.serialize !== JSON.stringify || !e || a.headers && a.headers.hasOwnProperty('Content-Type') || o.setRequestHeader('Content-Type', 'application/json; charset=utf-8'), a.deserialize !== f || a.headers && a.headers.hasOwnProperty('Accept') || o.setRequestHeader('Accept', 'application/json, text/*'), a.withCredentials && (o.withCredentials = a.withCredentials), a.headers))
                                        ({}.hasOwnProperty.call(a.headers, n) && o.setRequestHeader(n, a.headers[n]));
                                    'function' == typeof a.config && (o = a.config(o, a) || o), o.onreadystatechange = function () {
                                        if (!s && 4 === o.readyState)
                                            try {
                                                var e = a.extract !== h ? a.extract(o, a) : a.deserialize(a.extract(o, a));
                                                if (200 <= o.status && o.status < 300 || 304 === o.status || v.test(a.url))
                                                    i(g(a.type, e));
                                                else {
                                                    var t = new Error(o.responseText);
                                                    for (var n in e)
                                                        t[n] = e[n];
                                                    r(t);
                                                }
                                            } catch (e) {
                                                r(e);
                                            }
                                    }, e && null != a.data ? o.send(a.data) : o.send();
                                });
                                return !0 === a.background ? n : t(n);
                            },
                            jsonp: function (r, e) {
                                var t = s();
                                r = u(r, e);
                                var n = new i(function (t, e) {
                                    var n = r.callbackName || '_mithril_' + Math.round(10000000000000000 * Math.random()) + '_' + o++, i = l.document.createElement('script');
                                    l[n] = function (e) {
                                        i.parentNode.removeChild(i), t(g(r.type, e)), delete l[n];
                                    }, i.onerror = function () {
                                        i.parentNode.removeChild(i), e(new Error('JSONP request failed')), delete l[n];
                                    }, null == r.data && (r.data = {}), r.url = c(r.url, r.data), r.data[r.callbackKey || 'callback'] = n, i.src = d(r.url, r.data), l.document.documentElement.appendChild(i);
                                });
                                return !0 === r.background ? n : t(n);
                            },
                            setCompletionCallback: function (e) {
                                t = e;
                            }
                        };
                    }(window, f), o = function (e) {
                        var s, c = e.document, a = c.createDocumentFragment(), t = {
                                svg: 'http://www.w3.org/2000/svg',
                                math: 'http://www.w3.org/1998/Math/MathML'
                            };
                        function d(e) {
                            return e.attrs && e.attrs.xmlns || t[e.tag];
                        }
                        function w(e, t, n, i, r, o, s) {
                            for (var a = n; a < i; a++) {
                                var l = t[a];
                                null != l && C(e, l, r, s, o);
                            }
                        }
                        function C(e, t, n, i, r) {
                            var o = t.tag;
                            if ('string' != typeof o)
                                return function (e, t, n, i, r) {
                                    {
                                        if (u(t, n), null == t.instance)
                                            return t.domSize = 0, a;
                                        var o = C(e, t.instance, n, i, r);
                                        return t.dom = t.instance.dom, t.domSize = null != t.dom ? t.instance.domSize : 0, _(e, o, r), o;
                                    }
                                }(e, t, n, i, r);
                            switch (t.state = {}, null != t.attrs && T(t.attrs, t, n), o) {
                            case '#':
                                return function (e, t, n) {
                                    return t.dom = c.createTextNode(t.children), _(e, t.dom, n), t.dom;
                                }(e, t, r);
                            case '<':
                                return l(e, t, r);
                            case '[':
                                return function (e, t, n, i, r) {
                                    var o = c.createDocumentFragment();
                                    if (null != t.children) {
                                        var s = t.children;
                                        w(o, s, 0, s.length, n, null, i);
                                    }
                                    return t.dom = o.firstChild, t.domSize = o.childNodes.length, _(e, o, r), o;
                                }(e, t, n, i, r);
                            default:
                                return function (e, t, n, i, r) {
                                    var o = t.tag, s = t.attrs, a = s && s.is, l = (i = d(t) || i) ? a ? c.createElementNS(i, o, { is: a }) : c.createElementNS(i, o) : a ? c.createElement(o, { is: a }) : c.createElement(o);
                                    t.dom = l, null != s && function (e, t, n) {
                                        for (var i in t)
                                            v(e, i, null, t[i], n);
                                    }(t, s, i);
                                    if (_(e, l, r), null != t.attrs && null != t.attrs.contenteditable)
                                        h(t);
                                    else if (null != t.text && ('' !== t.text ? l.textContent = t.text : t.children = [O('#', void 0, void 0, t.text, void 0, void 0)]), null != t.children) {
                                        var u = t.children;
                                        w(l, u, 0, u.length, n, null, i), function (e) {
                                            var t = e.attrs;
                                            e.tag === 'select' && null != t && ('value' in t && v(e, 'value', null, t.value, void 0), 'selectedIndex' in t && v(e, 'selectedIndex', null, t.selectedIndex, void 0));
                                        }(t);
                                    }
                                    return l;
                                }(e, t, n, i, r);
                            }
                        }
                        function l(e, t, n) {
                            var i = t.children.match(/^\s*?<(\w+)/im) || [], r = {
                                    caption: 'table',
                                    thead: 'table',
                                    tbody: 'table',
                                    tfoot: 'table',
                                    tr: 'tbody',
                                    th: 'tr',
                                    td: 'tr',
                                    colgroup: 'table',
                                    col: 'colgroup'
                                }[i[1]] || 'div', o = c.createElement(r);
                            o.innerHTML = t.children, t.dom = o.firstChild, t.domSize = o.childNodes.length;
                            for (var s, a = c.createDocumentFragment(); s = o.firstChild;)
                                a.appendChild(s);
                            return _(e, a, n), a;
                        }
                        function u(e, t) {
                            var n;
                            if ('function' == typeof e.tag.view) {
                                if (e.state = Object.create(e.tag), null != (n = e.state.view).$$reentrantLock$$)
                                    return a;
                                n.$$reentrantLock$$ = !0;
                            } else {
                                if (e.state = void 0, null != (n = e.tag).$$reentrantLock$$)
                                    return a;
                                n.$$reentrantLock$$ = !0, e.state = null != e.tag.prototype && 'function' == typeof e.tag.prototype.view ? new e.tag(e) : e.tag(e);
                            }
                            if (e._state = e.state, null != e.attrs && T(e.attrs, e, t), T(e._state, e, t), e.instance = O.normalize(e._state.view.call(e.state, e)), e.instance === e)
                                throw Error('A view cannot return the vnode it received as argument');
                            n.$$reentrantLock$$ = null;
                        }
                        function f(e, t, n, i, r, o, s) {
                            if (t !== n && (null != t || null != n))
                                if (null == t)
                                    w(e, n, 0, n.length, r, o, s);
                                else if (null == n)
                                    M(t, 0, t.length, n);
                                else {
                                    if (t.length === n.length) {
                                        for (var a = !1, l = 0; l < n.length; l++)
                                            if (null != n[l] && null != t[l]) {
                                                a = null == n[l].key && null == t[l].key;
                                                break;
                                            }
                                        if (a) {
                                            for (l = 0; l < t.length; l++)
                                                t[l] !== n[l] && (null == t[l] && null != n[l] ? C(e, n[l], r, s, F(t, l + 1, o)) : null == n[l] ? M(t, l, l + 1, n) : b(e, t[l], n[l], r, F(t, l + 1, o), i, s));
                                            return;
                                        }
                                    }
                                    if (i = i || function (e, t) {
                                            if (null != e.pool && Math.abs(e.pool.length - t.length) <= Math.abs(e.length - t.length)) {
                                                var n = e[0] && e[0].children && e[0].children.length || 0, i = e.pool[0] && e.pool[0].children && e.pool[0].children.length || 0, r = t[0] && t[0].children && t[0].children.length || 0;
                                                if (Math.abs(i - r) <= Math.abs(n - r))
                                                    return !0;
                                            }
                                            return !1;
                                        }(t, n)) {
                                        var u = t.pool;
                                        t = t.concat(t.pool);
                                    }
                                    for (var c, d = 0, f = 0, S = t.length - 1, h = n.length - 1; d <= S && f <= h;) {
                                        if ((p = t[d]) !== (v = n[f]) || i)
                                            if (null == p)
                                                d++;
                                            else if (null == v)
                                                f++;
                                            else if (p.key === v.key) {
                                                var g = null != u && d >= t.length - u.length || null == u && i;
                                                f++, b(e, p, v, r, F(t, ++d, o), g, s), i && p.tag === v.tag && _(e, E(p), o);
                                            } else {
                                                if ((p = t[S]) !== v || i)
                                                    if (null == p)
                                                        S--;
                                                    else if (null == v)
                                                        f++;
                                                    else {
                                                        if (p.key !== v.key)
                                                            break;
                                                        g = null != u && S >= t.length - u.length || null == u && i;
                                                        b(e, p, v, r, F(t, S + 1, o), g, s), (i || f < h) && _(e, E(p), F(t, d, o)), S--, f++;
                                                    }
                                                else
                                                    S--, f++;
                                            }
                                        else
                                            d++, f++;
                                    }
                                    for (; d <= S && f <= h;) {
                                        var p, v;
                                        if ((p = t[S]) !== (v = n[h]) || i)
                                            if (null == p)
                                                S--;
                                            else if (null == v)
                                                h--;
                                            else if (p.key === v.key) {
                                                g = null != u && S >= t.length - u.length || null == u && i;
                                                b(e, p, v, r, F(t, S + 1, o), g, s), i && p.tag === v.tag && _(e, E(p), o), null != p.dom && (o = p.dom), S--, h--;
                                            } else {
                                                if (c || (c = x(t, S)), null != v) {
                                                    var m = c[v.key];
                                                    if (null != m) {
                                                        var y = t[m];
                                                        g = null != u && m >= t.length - u.length || null == u && i;
                                                        b(e, y, v, r, F(t, S + 1, o), i, s), _(e, E(y), o), t[m].skip = !0, null != y.dom && (o = y.dom);
                                                    } else {
                                                        o = C(e, v, r, s, o);
                                                    }
                                                }
                                                h--;
                                            }
                                        else
                                            S--, h--;
                                        if (h < f)
                                            break;
                                    }
                                    w(e, n, f, h + 1, r, o, s), M(t, d, S + 1, n);
                                }
                        }
                        function b(e, t, n, i, r, o, s) {
                            var a = t.tag;
                            if (a === n.tag) {
                                if (n.state = t.state, n._state = t._state, n.events = t.events, !o && function (e, t) {
                                        var n, i;
                                        null != e.attrs && 'function' == typeof e.attrs.onbeforeupdate && (n = e.attrs.onbeforeupdate.call(e.state, e, t));
                                        'string' != typeof e.tag && 'function' == typeof e._state.onbeforeupdate && (i = e._state.onbeforeupdate.call(e.state, e, t));
                                        return !(void 0 === n && void 0 === i || n || i || (e.dom = t.dom, e.domSize = t.domSize, e.instance = t.instance, 0));
                                    }(n, t))
                                    return;
                                if ('string' == typeof a)
                                    switch (null != n.attrs && (o ? (n.state = {}, T(n.attrs, n, i)) : I(n.attrs, n, i)), a) {
                                    case '#':
                                        !function (e, t) {
                                            e.children.toString() !== t.children.toString() && (e.dom.nodeValue = t.children);
                                            t.dom = e.dom;
                                        }(t, n);
                                        break;
                                    case '<':
                                        !function (e, t, n, i) {
                                            t.children !== n.children ? (E(t), l(e, n, i)) : (n.dom = t.dom, n.domSize = t.domSize);
                                        }(e, t, n, r);
                                        break;
                                    case '[':
                                        !function (e, t, n, i, r, o, s) {
                                            f(e, t.children, n.children, i, r, o, s);
                                            var a = 0, l = n.children;
                                            if ((n.dom = null) != l) {
                                                for (var u = 0; u < l.length; u++) {
                                                    var c = l[u];
                                                    null != c && null != c.dom && (null == n.dom && (n.dom = c.dom), a += c.domSize || 1);
                                                }
                                                1 !== a && (n.domSize = a);
                                            }
                                        }(e, t, n, o, i, r, s);
                                        break;
                                    default:
                                        !function (e, t, n, i, r) {
                                            var o = t.dom = e.dom;
                                            r = d(t) || r, t.tag === 'textarea' && (null == t.attrs && (t.attrs = {}), null != t.text && (t.attrs.value = t.text, t.text = void 0));
                                            (function (e, t, n, i) {
                                                if (null != n)
                                                    for (var r in n)
                                                        v(e, r, t && t[r], n[r], i);
                                                if (null != t)
                                                    for (var r in t)
                                                        null != n && r in n || (r === 'className' && (r = 'class'), 'o' !== r[0] || 'n' !== r[1] || m(r) ? r !== 'key' && e.dom.removeAttribute(r) : y(e, r, void 0));
                                            }(t, e.attrs, t.attrs, r), null != t.attrs && null != t.attrs.contenteditable ? h(t) : null != e.text && null != t.text && '' !== t.text ? e.text.toString() !== t.text.toString() && (e.dom.firstChild.nodeValue = t.text) : (null != e.text && (e.children = [O('#', void 0, void 0, e.text, void 0, e.dom.firstChild)]), null != t.text && (t.children = [O('#', void 0, void 0, t.text, void 0, void 0)]), f(o, e.children, t.children, n, i, null, r)));
                                        }(t, n, o, i, s);
                                    }
                                else
                                    !function (e, t, n, i, r, o, s) {
                                        if (o)
                                            u(n, i);
                                        else {
                                            if (n.instance = O.normalize(n._state.view.call(n.state, n)), n.instance === n)
                                                throw Error('A view cannot return the vnode it received as argument');
                                            null != n.attrs && I(n.attrs, n, i), I(n._state, n, i);
                                        }
                                        null != n.instance ? (null == t.instance ? C(e, n.instance, i, s, r) : b(e, t.instance, n.instance, i, r, o, s), n.dom = n.instance.dom, n.domSize = n.instance.domSize) : null != t.instance ? (g(t.instance, null), n.dom = void 0, n.domSize = 0) : (n.dom = t.dom, n.domSize = t.domSize);
                                    }(e, t, n, i, r, o, s);
                            } else
                                g(t, null), C(e, n, i, s, r);
                        }
                        function x(e, t) {
                            var n = {}, i = 0;
                            for (i = 0; i < t; i++) {
                                var r = e[i];
                                if (null != r) {
                                    var o = r.key;
                                    null != o && (n[o] = i);
                                }
                            }
                            return n;
                        }
                        function E(e) {
                            var t = e.domSize;
                            if (null == t && null != e.dom)
                                return e.dom;
                            var n = c.createDocumentFragment();
                            if (0 < t) {
                                for (var i = e.dom; --t;)
                                    n.appendChild(i.nextSibling);
                                n.insertBefore(i, n.firstChild);
                            }
                            return n;
                        }
                        function F(e, t, n) {
                            for (; t < e.length; t++)
                                if (null != e[t] && null != e[t].dom)
                                    return e[t].dom;
                            return n;
                        }
                        function _(e, t, n) {
                            n && n.parentNode ? e.insertBefore(t, n) : e.appendChild(t);
                        }
                        function h(e) {
                            var t = e.children;
                            if (null != t && 1 === t.length && '<' === t[0].tag) {
                                var n = t[0].children;
                                e.dom.innerHTML !== n && (e.dom.innerHTML = n);
                            } else if (null != e.text || null != t && 0 !== t.length)
                                throw new Error('Child node of a contenteditable must be trusted');
                        }
                        function M(e, t, n, i) {
                            for (var r = t; r < n; r++) {
                                var o = e[r];
                                null != o && (o.skip ? o.skip = !1 : g(o, i));
                            }
                        }
                        function g(n, i) {
                            var e, r = 1, o = 0;
                            n.attrs && 'function' == typeof n.attrs.onbeforeremove && (null != (e = n.attrs.onbeforeremove.call(n.state, n)) && 'function' == typeof e.then && (r++, e.then(t, t)));
                            'string' != typeof n.tag && 'function' == typeof n._state.onbeforeremove && (null != (e = n._state.onbeforeremove.call(n.state, n)) && 'function' == typeof e.then && (r++, e.then(t, t)));
                            function t() {
                                if (++o === r && (function e(t) {
                                        t.attrs && 'function' == typeof t.attrs.onremove && t.attrs.onremove.call(t.state, t);
                                        if ('string' != typeof t.tag)
                                            'function' == typeof t._state.onremove && t._state.onremove.call(t.state, t), null != t.instance && e(t.instance);
                                        else {
                                            var n = t.children;
                                            if (Array.isArray(n))
                                                for (var i = 0; i < n.length; i++) {
                                                    var r = n[i];
                                                    null != r && e(r);
                                                }
                                        }
                                    }(n), n.dom)) {
                                    var e = n.domSize || 1;
                                    if (1 < e)
                                        for (var t = n.dom; --e;)
                                            p(t.nextSibling);
                                    p(n.dom), null == i || null != n.domSize || function (e) {
                                        return null != e && (e.oncreate || e.onupdate || e.onbeforeremove || e.onremove);
                                    }(n.attrs) || 'string' != typeof n.tag || (i.pool ? i.pool.push(n) : i.pool = [n]);
                                }
                            }
                            t();
                        }
                        function p(e) {
                            var t = e.parentNode;
                            null != t && t.removeChild(e);
                        }
                        function v(e, t, n, i, r) {
                            var o = e.dom;
                            if (t !== 'key' && t !== 'is' && (n !== i || function (e, t) {
                                    return t === 'value' || t === 'checked' || t === 'selectedIndex' || t === 'selected' && e.dom === c.activeElement;
                                }(e, t) || 'object' == typeof i) && void 0 !== i && !m(t)) {
                                var s = t.indexOf(':');
                                if (-1 < s && t.substr(0, s) === 'xlink')
                                    o.setAttributeNS('http://www.w3.org/1999/xlink', t.slice(s + 1), i);
                                else if ('o' === t[0] && 'n' === t[1] && 'function' == typeof i)
                                    y(e, t, i);
                                else if (t === 'style')
                                    !function (e, t, n) {
                                        t === n && (e.style.cssText = '', t = null);
                                        if (null == n)
                                            e.style.cssText = '';
                                        else if ('string' == typeof n)
                                            e.style.cssText = n;
                                        else {
                                            for (var i in ('string' == typeof t && (e.style.cssText = ''), n))
                                                e.style[i] = n[i];
                                            if (null != t && 'string' != typeof t)
                                                for (var i in t)
                                                    i in n || (e.style[i] = '');
                                        }
                                    }(o, n, i);
                                else if (t in o && !function (e) {
                                        return e === 'href' || e === 'list' || e === 'form' || e === 'width' || e === 'height';
                                    }(t) && void 0 === r && !function (e) {
                                        return e.attrs.is || -1 < e.tag.indexOf('-');
                                    }(e)) {
                                    if (t === 'value') {
                                        var a = '' + i;
                                        if ((e.tag === 'input' || e.tag === 'textarea') && e.dom.value === a && e.dom === c.activeElement)
                                            return;
                                        if (e.tag === 'select')
                                            if (null === i) {
                                                if (-1 === e.dom.selectedIndex && e.dom === c.activeElement)
                                                    return;
                                            } else if (null !== n && e.dom.value === a && e.dom === c.activeElement)
                                                return;
                                        if (e.tag === 'option' && null != n && e.dom.value === a)
                                            return;
                                    }
                                    if (e.tag === 'input' && t === 'type')
                                        return void o.setAttribute(t, i);
                                    o[t] = i;
                                } else
                                    'boolean' == typeof i ? i ? o.setAttribute(t, '') : o.removeAttribute(t) : o.setAttribute(t === 'className' ? 'class' : t, i);
                            }
                        }
                        function m(e) {
                            return e === 'oninit' || e === 'oncreate' || e === 'onupdate' || e === 'onremove' || e === 'onbeforeremove' || e === 'onbeforeupdate';
                        }
                        function y(e, t, n) {
                            var i = e.dom, r = 'function' != typeof s ? n : function (e) {
                                    var t = n.call(i, e);
                                    return s.call(i, e), t;
                                };
                            if (t in i)
                                i[t] = 'function' == typeof n ? r : null;
                            else {
                                var o = t.slice(2);
                                if (void 0 === e.events && (e.events = {}), e.events[t] === r)
                                    return;
                                null != e.events[t] && i.removeEventListener(o, e.events[t], !1), 'function' == typeof n && (e.events[t] = r, i.addEventListener(o, e.events[t], !1));
                            }
                        }
                        function T(e, t, n) {
                            'function' == typeof e.oninit && e.oninit.call(t.state, t), 'function' == typeof e.oncreate && n.push(e.oncreate.bind(t.state, t));
                        }
                        function I(e, t, n) {
                            'function' == typeof e.onupdate && n.push(e.onupdate.bind(t.state, t));
                        }
                        return {
                            render: function (e, t) {
                                if (!e)
                                    throw new Error('Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.');
                                var n = [], i = c.activeElement, r = e.namespaceURI;
                                null == e.vnodes && (e.textContent = ''), Array.isArray(t) || (t = [t]), f(e, e.vnodes, O.normalizeChildren(t), !1, n, null, r === 'http://www.w3.org/1999/xhtml' ? void 0 : r), e.vnodes = t, null != i && c.activeElement !== i && i.focus();
                                for (var o = 0; o < n.length; o++)
                                    n[o]();
                            },
                            setEventCallback: function (e) {
                                return s = e;
                            }
                        };
                    };
                var i = function (e) {
                    var t = o(e);
                    t.setEventCallback(function (e) {
                        !1 === e.redraw ? e.redraw = void 0 : r();
                    });
                    var n = [];
                    function i(e) {
                        var t = n.indexOf(e);
                        -1 < t && n.splice(t, 2);
                    }
                    function r() {
                        for (var e = 1; e < n.length; e += 2)
                            n[e]();
                    }
                    return {
                        subscribe: function (e, t) {
                            i(e), n.push(e, function (t) {
                                var n = 0, i = null, r = 'function' == typeof requestAnimationFrame ? requestAnimationFrame : setTimeout;
                                return function () {
                                    var e = Date.now();
                                    0 === n || 16 <= e - n ? (n = e, t()) : null === i && (i = r(function () {
                                        i = null, t(), n = Date.now();
                                    }, 16 - (e - n)));
                                };
                            }(t));
                        },
                        unsubscribe: i,
                        redraw: r,
                        render: t.render
                    };
                }(window);
                n.setCompletionCallback(i.redraw);
                var r;
                t.mount = (r = i, function (e, t) {
                    if (null === t)
                        return r.render(e, []), void r.unsubscribe(e);
                    if (null == t.view && 'function' != typeof t)
                        throw new Error('m.mount(element, component) expects a component, not a vnode');
                    r.subscribe(e, function () {
                        r.render(e, O(t));
                    }), r.redraw();
                });
                var a, h, g, m, y, w, C, s, b = f, x = function (e) {
                        if ('' === e || null == e)
                            return {};
                        '?' === e.charAt(0) && (e = e.slice(1));
                        for (var t = e.split('&'), n = {}, i = {}, r = 0; r < t.length; r++) {
                            var o = t[r].split('='), s = decodeURIComponent(o[0]), a = 2 === o.length ? decodeURIComponent(o[1]) : '';
                            a === 'true' ? a = !0 : a === 'false' && (a = !1);
                            var l = s.split(/\]\[?|\[/), u = n;
                            -1 < s.indexOf('[') && l.pop();
                            for (var c = 0; c < l.length; c++) {
                                var d = l[c], f = l[c + 1], h = '' == f || !isNaN(parseInt(f, 10)), g = c === l.length - 1;
                                if ('' === d)
                                    null == i[s = l.slice(0, c).join()] && (i[s] = 0), d = i[s]++;
                                null == u[d] && (u[d] = g ? a : h ? [] : {}), u = u[d];
                            }
                        }
                        return n;
                    }, E = function (c) {
                        var t, d = 'function' == typeof c.history.pushState, n = 'function' == typeof setImmediate ? setImmediate : setTimeout;
                        function e(e) {
                            var t = c.location[e].replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent);
                            return e === 'pathname' && '/' !== t[0] && (t = '/' + t), t;
                        }
                        function f(e, t, n) {
                            var i = e.indexOf('?'), r = e.indexOf('#'), o = -1 < i ? i : -1 < r ? r : e.length;
                            if (-1 < i) {
                                var s = -1 < r ? r : e.length, a = x(e.slice(i + 1, s));
                                for (var l in a)
                                    t[l] = a[l];
                            }
                            if (-1 < r) {
                                var u = x(e.slice(r + 1));
                                for (var l in u)
                                    n[l] = u[l];
                            }
                            return e.slice(0, o);
                        }
                        var h = {
                            prefix: '#!',
                            getPath: function () {
                                switch (h.prefix.charAt(0)) {
                                case '#':
                                    return e('hash').slice(h.prefix.length);
                                case '?':
                                    return e('search').slice(h.prefix.length) + e('hash');
                                default:
                                    return e('pathname').slice(h.prefix.length) + e('search') + e('hash');
                                }
                            },
                            setPath: function (e, n, t) {
                                var i = {}, r = {};
                                if (e = f(e, i, r), null != n) {
                                    for (var o in n)
                                        i[o] = n[o];
                                    e = e.replace(/:([^\/]+)/g, function (e, t) {
                                        return delete i[t], n[t];
                                    });
                                }
                                var s = p(i);
                                s && (e += '?' + s);
                                var a = p(r);
                                if (a && (e += '#' + a), d) {
                                    var l = t ? t.state : null, u = t ? t.title : null;
                                    c.onpopstate(), t && t.replace ? c.history.replaceState(l, u, h.prefix + e) : c.history.pushState(l, u, h.prefix + e);
                                } else
                                    c.location.href = h.prefix + e;
                            }
                        };
                        return h.defineRoutes = function (a, l, u) {
                            function e() {
                                var i = h.getPath(), r = {}, e = f(i, r, r), t = c.history.state;
                                if (null != t)
                                    for (var n in t)
                                        r[n] = t[n];
                                for (var o in a) {
                                    var s = new RegExp('^' + o.replace(/:[^\/]+?\.{3}/g, '(.*?)').replace(/:[^\/]+/g, '([^\\/]+)') + '/?$');
                                    if (s.test(e))
                                        return void e.replace(s, function () {
                                            for (var e = o.match(/:[^\/]+/g) || [], t = [].slice.call(arguments, 1, -2), n = 0; n < e.length; n++)
                                                r[e[n].replace(/:|\./g, '')] = decodeURIComponent(t[n]);
                                            l(a[o], r, i, o);
                                        });
                                }
                                u(i, r);
                            }
                            d ? c.onpopstate = function (e) {
                                return function () {
                                    null == t && (t = n(function () {
                                        t = null, e();
                                    }));
                                };
                            }(e) : '#' === h.prefix.charAt(0) && (c.onhashchange = e), e();
                        }, h;
                    };
                t.route = (a = i, C = E(window), (s = function (e, t, n) {
                    if (null == e)
                        throw new Error('Ensure the DOM element that was passed to `m.route` is not undefined');
                    var o = function () {
                            null != h && a.render(e, h(O(g, m.key, m)));
                        }, s = function (e) {
                            if (e === t)
                                throw new Error('Could not resolve default route ' + t);
                            C.setPath(t, null, { replace: !0 });
                        };
                    C.defineRoutes(n, function (t, n, i) {
                        var r = w = function (e, t) {
                            r === w && (g = null == t || 'function' != typeof t.view && 'function' != typeof t ? 'div' : t, m = n, y = i, w = null, h = (e.render || function (e) {
                                return e;
                            }).bind(e), o());
                        };
                        t.view || 'function' == typeof t ? r({}, t) : t.onmatch ? b.resolve(t.onmatch(n, i)).then(function (e) {
                            r(t, e);
                        }, s) : r(t, 'div');
                    }, s), a.subscribe(e, o);
                }).set = function (e, t, n) {
                    null != w && ((n = n || {}).replace = !0), w = null, C.setPath(e, t, n);
                }, s.get = function () {
                    return y;
                }, s.prefix = function (e) {
                    C.prefix = e;
                }, s.link = function (e) {
                    e.dom.setAttribute('href', C.prefix + e.attrs.href), e.dom.onclick = function (e) {
                        if (!(e.ctrlKey || e.metaKey || e.shiftKey || 2 === e.which)) {
                            e.preventDefault(), e.redraw = !1;
                            var t = this.getAttribute('href');
                            0 === t.indexOf(C.prefix) && (t = t.slice(C.prefix.length)), s.set(t, void 0, void 0);
                        }
                    };
                }, s.param = function (e) {
                    return void 0 !== m && void 0 !== e ? m[e] : m;
                }, s), t.withAttr = function (t, n, i) {
                    return function (e) {
                        n.call(i || this, t in e.currentTarget ? e.currentTarget[t] : e.currentTarget.getAttribute(t));
                    };
                };
                var F = o(window);
                t.render = F.render, t.redraw = i.redraw, t.request = n.request, t.jsonp = n.jsonp, t.parseQueryString = x, t.buildQueryString = p, t.version = '1.1.6', t.vnode = O, 'undefined' != typeof module ? module['exports'] = t : window.m = t;
            }(), CKFinder.define('mithril', (QEa = this, function () {
                return function () {
                    return window.m;
                }.apply(QEa, arguments);
            })), CKFinder.define('CKFinder/Modules/Folders/Views/FolderTreeNodeView', [
                'CKFinder/Util/KeyCode',
                'mithril',
                'underscore',
                'jquery'
            ], function (t, h, n, i) {
                'use strict';
                var g = null, r = n.debounce(h.redraw, 30), p = {
                        oninit: function (e) {
                            var t = this;
                            t.model = e.attrs.model, t.treeView = e.attrs.treeView, t.finder = e.attrs.finder, t.model.on('selected', function () {
                                g = t.model, n.defer(function () {
                                    t.trigger('focus', { origin: t }), t.focus();
                                });
                            }), t.model.on('ui:expand', function () {
                                t.model.set('isExpanded', !0);
                            }), t.model.get('children').on('change reset add remove', function () {
                                t.model.set('isExpanding', !1), r();
                            }), t.model.set('view', this), t.finder.fire('view:FolderTreeNode', this);
                        },
                        oncreate: function (e) {
                            var t = e.dom;
                            this.element = t, this.label = t.childNodes[0], this.expander = t.childNodes[1], i(this.label).on('ckfdrop', this.labelOnDrop.bind(this)), i(this.label).on('ckfdragover', this.labelOnDragOver.bind(this)), i(this.label).on('mouseout', this.labelOnMouseOut.bind(this)), i(this.expander).on('vmousedown', this.expanderOnVMouseDown.bind(this));
                        },
                        elementOnFocus: function () {
                            this.label.focus(), this.trigger('focus', { origin: this });
                        },
                        labelOnKeyDown: function (e) {
                            if (e.keyCode === t.menu || e.keyCode === t.f10 && this.finder.util.isShortcut(e, 'shift'))
                                return e.preventDefault(), e.stopPropagation(), this.triggerContextMenu(e), !1;
                            this.trigger('folder:keydown', {
                                evt: e,
                                view: this,
                                model: this.model
                            });
                        },
                        labelOnMouseDown: function (e) {
                            e.stopPropagation();
                            var t = !0;
                            return 2 === e.button || 3 === e.button ? (e.preventDefault(), t = !1) : this.trigger('folder:click', { view: this }), this.trigger('focus', { origin: this }), t;
                        },
                        labelOnContextMenu: function (e) {
                            return e.preventDefault(), this.triggerContextMenu(e), !1;
                        },
                        getLabel: function () {
                            return i(this.label);
                        },
                        labelOnDrop: function (e) {
                            e.stopPropagation(), this.trigger('folder:drop', {
                                evt: e,
                                view: this,
                                model: this.model
                            });
                        },
                        labelOnDragOver: function (e) {
                            e.stopPropagation(), e.preventDefault(), this.getLabel().addClass('ui-btn-active');
                        },
                        labelOnMouseOut: function () {
                            this.isSelected() || this.getLabel().removeClass('ui-btn-active');
                        },
                        isSelected: function () {
                            return this.model === g;
                        },
                        trigger: function (e, t) {
                            this.treeView.trigger('childview:' + e, t, t);
                        },
                        expanderOnClick: function (e) {
                            e.stopPropagation(), this.requestExpand();
                        },
                        expanderOnVMouseDown: function () {
                            this.trigger('focus', { origin: this });
                        },
                        triggerContextMenu: function (e) {
                            this.trigger('folder:contextmenu', {
                                evt: e,
                                view: this,
                                model: this.model
                            });
                        },
                        requestExpand: function () {
                            var e = this.model;
                            e.get('isExpanded') ? (this.trigger('folder:collapse', { view: this }), this.collapse()) : (this.model.get('children').length || (this.trigger('folder:expand', { view: this }), e.set('isExpanding', !0)), this.expand()), this.label.focus();
                        },
                        expand: function () {
                            this.model.set('isExpanded', !0);
                        },
                        collapse: function () {
                            this.model.set('isExpanded', !1);
                        },
                        focus: function () {
                            this.label.focus();
                        },
                        view: function (e) {
                            var t = this.model, n = this.treeView, i = this.finder, r = e.attrs.level || 1, o = e.attrs.isRtl, s = t.get('hasChildren'), a = !!t.get('isExpanded'), l = t.get('isExpanding') || t.get('isPending'), u = [
                                    'ckf-folders-tree-expander',
                                    'ui-btn',
                                    'ui-btn-icon-notext'
                                ];
                            l ? u.push('ckf-tree-loading', 'ui-icon-ckf-rotate') : s ? u.push('ui-icon-custom ui-icon-ckf-arrow-' + (a ? 'd' : o ? 'r' : 'l')) : u.push('ckf-folders-tree-no-children');
                            var c = [
                                'ckf-folders-tree-label',
                                'ui-btn'
                            ];
                            s || c.push('ckf-folders-tree-no-children'), t === g && c.push('ui-btn-active');
                            var d = [
                                h('a', {
                                    role: 'treeitem',
                                    class: c.join(' '),
                                    tabindex: '-1',
                                    'data-ckf-drop': 'true',
                                    'aria-labelledby': t.cid,
                                    'aria-busy': l.toString(),
                                    'aria-expanded': a.toString(),
                                    'aria-level': r,
                                    onmousedown: this.labelOnMouseDown.bind(this),
                                    onkeydown: this.labelOnKeyDown.bind(this),
                                    oncontextmenu: this.labelOnContextMenu.bind(this)
                                }, h('span', { id: t.cid }, t.get('label') || t.get('name'))),
                                h('a', {
                                    class: u.join(' '),
                                    onclick: this.expanderOnClick.bind(this)
                                })
                            ];
                            if (s || a) {
                                var f = t.get('children').map(function (e) {
                                    return h(p, {
                                        key: e.cid,
                                        model: e,
                                        treeView: n,
                                        finder: i,
                                        level: r + 1,
                                        isRtl: o
                                    });
                                });
                                d.push(h('div', {
                                    class: 'ckf-folders-tree-body',
                                    'data-icon': 'custom',
                                    'data-iconpos': 'notext'
                                }, h('ul', {
                                    class: 'ui-listview',
                                    'data-role': 'listview',
                                    style: a ? '' : 'display:none',
                                    'aria-hidden': (!a).toString()
                                }, f)));
                            }
                            return h('li', {
                                role: 'presentation',
                                class: 'ckf-folders-tree ui-li-has-alt' + (a ? ' ckf-tree-expanded' : ''),
                                onfocus: this.elementOnFocus.bind(this)
                            }, d);
                        }
                    };
                return p;
            }), CKFinder.define('CKFinder/Modules/Folders/Views/FoldersTreeView', [
                'underscore',
                'CKFinder/Views/Base/CompositeView',
                'CKFinder/Modules/Folders/Views/FolderTreeNodeView',
                'CKFinder/Util/KeyCode',
                'mithril'
            ], function (e, t, n, o, i) {
                'use strict';
                var r = e.debounce(i.redraw, 30);
                function s(e, t) {
                    var n = t.indexOf(e);
                    if (0 < n) {
                        var i = t.at(n - 1);
                        return i.get('isExpanded') && i.get('children').length ? i.get('children').last() : i;
                    }
                    return null;
                }
                function a(e, t) {
                    var n = t.indexOf(e);
                    return 0 <= n ? t.at(n + 1) : null;
                }
                return t.extend({
                    name: 'FoldersTree',
                    childView: null,
                    tagName: 'ul',
                    className: 'ckf-tree ui-listview',
                    attributes: {
                        role: 'tree',
                        'data-role': 'listview',
                        tabindex: 20
                    },
                    template: '',
                    events: {
                        keydown: function (e) {
                            if (e.keyCode !== o.tab || !this.finder.util.isShortcut(e, '') && !this.finder.util.isShortcut(e, 'shift')) {
                                var t;
                                if (e.keyCode === o.up || e.keyCode === o.end)
                                    for (t = this.collection.last(); t.get('isExpanded') && 0 < t.get('children').length;)
                                        t = t.get('children').last();
                                e.keyCode !== o.down && e.keyCode !== o.home || (t = this.collection.first()), t && (e.stopPropagation(), e.preventDefault(), t.get('view').focus());
                            } else
                                this.trigger('keydown:tab', e);
                        },
                        focus: function (e) {
                            if (e.target === e.currentTarget) {
                                e.preventDefault(), e.stopPropagation();
                                var t = (this.lastFocusedModel || this.collection.first()).get('view');
                                t ? t.focus() : this.$el.find('.ckf-folders-tree-label:first').trigger('focus');
                            }
                        }
                    },
                    view: function () {
                        var t = this;
                        return t.collection.map(function (e) {
                            return i(n, {
                                key: e.cid,
                                model: e,
                                treeView: t,
                                finder: t.finder,
                                isRtl: t.finder.lang.dir === 'ltr'
                            });
                        });
                    },
                    onChildViewFocus: function (e) {
                        this.lastFocusedModel = e.origin.model;
                    },
                    initialize: function (e) {
                        this.viewMetadataPrefix = e.viewMetadataPrefix || 'view', this.collection.on('change reset add remove', this.render), this.on('childview:focus', this.onChildViewFocus), this.on('childview:folder:keydown', this.onFolderKeyDown), i.mount(this.el, this);
                    },
                    render: function () {
                        r();
                    },
                    refreshUI: function () {
                        this.render();
                    },
                    onFolderKeyDown: function (e, t) {
                        var n = t.evt.keyCode, i = t.model;
                        function r() {
                            t.evt.preventDefault(), t.evt.stopPropagation();
                        }
                        n === o.up && (r(), this.handleUpKey(i)), n === o.down && (r(), this.handleDownKey(i)), n === (this.finder.lang.dir === 'ltr' ? o.right : o.left) && (r(), this.handleExpandKey(i)), n === (this.finder.lang.dir === 'ltr' ? o.left : o.right) && (r(), this.handleCollapseKey(i));
                    },
                    handleUpKey: function (e) {
                        var t = e.get('parent'), n = null;
                        t ? (n = s(e, t.get('children'))) || (n = t) : n = s(e, this.collection);
                        n && n.get('view') && n.get('view').focus();
                    },
                    handleDownKey: function (e) {
                        var t = null;
                        if (e.get('children').length && e.get('isExpanded'))
                            t = e.get('children').first();
                        else {
                            var n = e.get('parent') ? e.get('parent').get('children') : this.collection;
                            t = a(e, n);
                            for (var i = e; !t && !i.get('isRoot');)
                                n = (i = i.get('parent')).get('parent') ? i.get('parent').get('children') : this.collection, t = a(i, n);
                        }
                        t && t.get('view') && t.get('view').focus();
                    },
                    handleExpandKey: function (e) {
                        var t = e.get('isExpanded'), n = e.get('hasChildren');
                        if (n)
                            if (!n || t) {
                                var i = e.get('children').first();
                                i && i.get('view').focus();
                            } else
                                e.get('view').requestExpand();
                    },
                    handleCollapseKey: function (e) {
                        var t = e.get('isExpanded');
                        e.get('hasChildren') && t ? e.get('view').collapse() : e.get('isRoot') || e.get('parent').get('view').focus();
                    }
                });
            }), CKFinder.define('CKFinder/Modules/FilesMoveCopy/Models/MoveCopyData', [
                'underscore',
                'backbone'
            ], function (o, e) {
                'use strict';
                return e.Model.extend({
                    defaults: {
                        done: 0,
                        lastCommandResponse: !1
                    },
                    initialize: function () {
                        this.set({
                            fileExistsErrors: new e.Collection(),
                            otherErrors: []
                        });
                    },
                    processResponse: function (e) {
                        this.set('lastResponse', {
                            done: this.get('type') === 'Copy' ? e.copied : e.moved,
                            response: e
                        });
                        var t = this.get('done'), n = parseInt(this.get('type') === 'Copy' ? e.copied : e.moved);
                        if (this.set('done', t + n), e.error && (300 === e.error.number || 301 === e.error.number)) {
                            var i = this.get('fileExistsErrors'), r = this.get('otherErrors');
                            o.forEach(e.error.errors, function (e) {
                                if (115 === e.number)
                                    i.push(e);
                                else {
                                    var t = o.findWhere(r, { number: e.number });
                                    t || (t = {
                                        number: e.number,
                                        files: []
                                    }, r.push(t)), t.files.push(e.name);
                                }
                            });
                        }
                    },
                    hasFileExistErrors: function () {
                        return !!this.get('fileExistsErrors').length;
                    },
                    hasOtherErrors: function () {
                        return !!this.get('otherErrors').length;
                    },
                    nextError: function () {
                        var e = this.get('fileExistsErrors').shift();
                        return this.set('current', e), e;
                    },
                    getFilesForPost: function (e) {
                        var t = [];
                        if (t.push(this.get('current').toJSON()), e)
                            for (; this.hasFileExistErrors();)
                                t.push(this.nextError().toJSON());
                        return t;
                    },
                    addErrorMessages: function (t) {
                        o.forEach(this.get('otherErrors'), function (e) {
                            e.msg = t[e.number];
                        });
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/FilesMoveCopy/ChooseFolder.dot', [], function () {
                return '<div data-role="header">\n\t<h2>{{= it.lang.folders.destinationFolder }}</h2>\n\t<a class="ui-btn ui-corner-all ui-btn-icon-notext ui-icon-ckf-back" id="ckf-move-copy-close" title="{{= it.lang.common.close }}" tabindex="10"></a>\n</div>\n<div id="ckf-move-copy-content"></div>\n';
            }), CKFinder.define('CKFinder/Modules/FilesMoveCopy/Views/ChooseFolderLayout', [
                'CKFinder/Views/Base/LayoutView',
                'text!CKFinder/Templates/FilesMoveCopy/ChooseFolder.dot'
            ], function (e, t) {
                'use strict';
                return e.extend({
                    name: 'ChooseFolderDialogLayoutView',
                    template: t,
                    regions: { content: '#ckf-move-copy-content' },
                    ui: { close: '#ckf-move-copy-close' }
                });
            }), CKFinder.define('CKFinder/Modules/FilesMoveCopy/Views/MoveCopyDialogLayout', ['CKFinder/Views/Base/LayoutView'], function (e) {
                'use strict';
                return e.extend({
                    name: 'MoveCopyDialogLayoutView',
                    template: '<div></div>',
                    regions: { content: 'div' }
                });
            }), CKFinder.define('text!CKFinder/Templates/FilesMoveCopy/MoveCopyFileActionsTemplate.dot', [], function () {
                return '<h3 class="ckf-move-copy-filename">{{= it.current.get( \'name\' ) }}</h3>\n<p class="ckf-move-copy-error">{{= it.lang.errors.codes[ 115 ] }}</p>\n\n<button class="ckf-move-copy-button" id="ckf-move-overwrite">{{= it.lang.files.overwrite }}</button>\n<button class="ckf-move-copy-button" id="ckf-move-rename">{{= it.lang.files.autoRename }}</button>\n<button class="ckf-move-copy-button" id="ckf-move-skip">{{= it.lang.common.skip }}</button>\n\n<div class="ckf-move-copy-checkbox">\n\t<label>\n\t\t<input name="processAll" type="checkbox">\n\t\t{{= it.lang.common.rememberDecision }}\n\t</label>\n</div>\n\n{{? it.showCancel }}\n<div class="ui-grid-solo">\n\t<div class="ui-block-a"><div><button id="ckf-move-cancel">{{= it.lang.common.cancel }}</button></div></div>\n</div>\n{{?}}\n';
            }), CKFinder.define('CKFinder/Modules/FilesMoveCopy/Views/MoveCopyFileActionsView', [
                'CKFinder/Views/Base/ItemView',
                'text!CKFinder/Templates/FilesMoveCopy/MoveCopyFileActionsTemplate.dot'
            ], function (e, t) {
                'use strict';
                return e.extend({
                    name: 'MoveCopyErrorsView',
                    template: t,
                    ui: {
                        processAll: '[name="processAll"]',
                        overwrite: '#ckf-move-overwrite',
                        skip: '#ckf-move-skip',
                        rename: '#ckf-move-rename',
                        cancel: '#ckf-move-cancel'
                    },
                    onRender: function () {
                        this.$el.enhanceWithin();
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/FilesMoveCopy/MoveCopyResultTemplate.dot', [], function () {
                return '<p class="ckf-dialog-title">{{= it.msg }}</p>\n<hr>\n<p class="ckf-move-copy-failures-title ui-body-inherit">{{= it.errorsTitle }}</p>\n<div class="ckf-move-copy-failures">\n\t{{~ it.otherErrors: errorGroup }}\n\t\t<p>{{= errorGroup.msg }}</p>\n\t\t<ul>\n\t\t{{~ errorGroup.files: error }}\n\t\t\t<li>{{= error }}</li>\n\t\t{{~}}\n\t\t</ul>\n\t{{~}}\n</div>\n{{? it.showCancel }}\n<div class="ui-grid-solo">\n\t<div class="ui-block-a"><div><button id="ckf-move-copy-ok">{{= it.lang.common.ok }}</button></div></div>\n</div>\n{{?}}\n';
            }), CKFinder.define('CKFinder/Modules/FilesMoveCopy/Views/MoveCopyResultView', [
                'CKFinder/Views/Base/ItemView',
                'text!CKFinder/Templates/FilesMoveCopy/MoveCopyResultTemplate.dot'
            ], function (e, t) {
                'use strict';
                return e.extend({
                    name: 'MoveCopyResultView',
                    template: t,
                    className: 'ckf-move-copy-result',
                    ui: { ok: '#ckf-move-copy-ok' },
                    onRender: function () {
                        this.$el.enhanceWithin();
                    }
                });
            }), CKFinder.define('CKFinder/Modules/FilesMoveCopy/FilesMoveCopy', [
                'underscore',
                'jquery',
                'backbone',
                'CKFinder/Views/MessageView',
                'CKFinder/Modules/Folders/Views/FoldersTreeView',
                'CKFinder/Modules/FilesMoveCopy/Models/MoveCopyData',
                'CKFinder/Modules/FilesMoveCopy/Views/ChooseFolderLayout',
                'CKFinder/Modules/FilesMoveCopy/Views/MoveCopyDialogLayout',
                'CKFinder/Modules/FilesMoveCopy/Views/MoveCopyFileActionsView',
                'CKFinder/Modules/FilesMoveCopy/Views/MoveCopyResultView',
                'CKFinder/Util/KeyCode'
            ], function (f, h, o, e, s, g, a, p, v, m, l) {
                'use strict';
                var y = 'MoveCopyDialogPage', w = 'MoveCopySuccessDialogPage', C = 'ChooseFolder';
                function b(e, n, t, i) {
                    i && f.forEach(n, function (e, t) {
                        n[t].options = i;
                    });
                    var r = t.get('type'), o = n.length, s = e.lang[r.toLowerCase()][1 === o ? 'oneFileWait' : 'manyFilesWait'].replace('{count}', o) + ' ' + e.lang.common.pleaseWait;
                    e.request('loader:show', { text: s }), e.request('command:send', {
                        name: r + 'Files',
                        type: 'post',
                        post: { files: n },
                        sendPostAsJson: !0,
                        folder: t.get('currentFolder'),
                        context: { moveCopyData: t }
                    });
                }
                function r(e) {
                    switch (e.data.response.error.number) {
                    case 300:
                    case 301:
                        e.cancel();
                        break;
                    case 116:
                        e.cancel(), e.finder.request('loader:hide'), e.finder.request('dialog:info', { msg: e.finder.lang.errors.missingFolder });
                        var t = e.data.context.moveCopyData.get('currentFolder'), n = t.get('parent');
                        n.get('children').remove(t), e.finder.request('folder:getActive') === t && e.finder.request('folder:openPath', {
                            path: n.getPath({ full: !0 }),
                            expand: !0
                        });
                        break;
                    case 103:
                        e.cancel(), e.finder.request('loader:hide'), e.finder.request('dialog:info', { msg: e.finder.lang.errors.codes[103] });
                    }
                }
                function u(i, r, o) {
                    (r !== 'Move' || i.finder.request('folder:getActive').get('acl').fileDelete) && i.data.toolbar.push({
                        name: r + 'Files',
                        type: 'button',
                        priority: 40,
                        icon: 'ckf-file-' + (r === 'Copy' ? 'copy' : 'move'),
                        label: o.finder.lang.common[r.toLowerCase()],
                        action: function () {
                            var t = new s({
                                finder: o.finder,
                                collection: o.finder.request('resources:get:cloned'),
                                viewMetadataPrefix: 'moveCopy'
                            });
                            t.on('childview:folder:expand', function (e, t) {
                                o.finder.fire('folder:expand', {
                                    view: t.view,
                                    folder: t.view.model
                                }, o.finder);
                            }), t.on('childview:folder:click', function (e, t) {
                                o.finder.request('files:' + r.toLowerCase(), {
                                    files: o.finder.request('files:getSelected'),
                                    toFolder: t.view.model
                                });
                            }), t.on('childview:folder:keydown', function (e, t) {
                                t.evt.keyCode !== l.enter && t.evt.keyCode !== l.space || (t.evt.preventDefault(), t.evt.stopPropagation(), o.finder.request('files:' + r.toLowerCase(), {
                                    files: o.finder.request('files:getSelected'),
                                    toFolder: t.view.model
                                }));
                            }), t.on('keydown:tab', function (e) {
                                e.preventDefault(), e.stopPropagation(), x(o.finder) ? t.$el.closest('[data-role="page"]').find('#ckf-move-copy-close').trigger('focus') : t.$el.closest('.ckf-dialog').find('.ckf-dialog-buttons').find('.ui-btn').trigger('focus');
                            });
                            var e = i.data.file ? i.finder.lang[r.toLowerCase()].oneFileDialogTitle : i.finder.lang[r.toLowerCase()].manyFilesDialogTitle.replace('{count}', i.data.files.length);
                            if (x(o.finder)) {
                                o.finder.on('page:show:' + C, function () {
                                    t.refreshUI();
                                });
                                var n = new a({
                                    finder: o.finder,
                                    events: {
                                        'click @ui.close': function () {
                                            o.finder.request('page:destroy', { name: C });
                                        }
                                    }
                                });
                                n.on('show', function () {
                                    this.content.show(t);
                                }), o.finder.request('page:create', {
                                    view: n,
                                    title: e,
                                    name: C,
                                    className: 'ckf-move-copy-dialog',
                                    uiOptions: {
                                        theme: o.finder.config.swatch,
                                        overlayTheme: o.finder.config.swatch
                                    }
                                }), o.finder.request('page:show', { name: C });
                            } else
                                o.finder.request('dialog', {
                                    name: C,
                                    title: e,
                                    buttons: ['cancel'],
                                    contentClassName: 'ckf-move-copy-dialog',
                                    restrictHeight: !0,
                                    focusItem: '.ckf-tree',
                                    uiOptions: {
                                        positionTo: '[data-ckf-toolbar="Main"]',
                                        create: function () {
                                            setTimeout(function () {
                                                t.refreshUI();
                                            }, 0);
                                        },
                                        afterclose: function () {
                                            n && n.destroy(), t && t.destroy();
                                        }
                                    },
                                    view: t
                                });
                        }
                    });
                }
                function t(e) {
                    e.data.evt.ckfFilesSelection && this.finder.request('contextMenu', {
                        name: 'folderDrop',
                        evt: e.data.evt,
                        positionToEl: e.data.el || e.data.view.getLabel(),
                        context: { folder: e.data.folder }
                    });
                }
                function c(e) {
                    var t = e.data.context.folder, n = t.get('acl');
                    e.data.items.add({
                        name: 'MoveFiles',
                        label: e.finder.lang.move.dropMenuItem,
                        isActive: n.fileUpload,
                        icon: 'ckf-file-move',
                        action: function () {
                            e.finder.request('files:move', {
                                files: e.finder.request('files:getSelected'),
                                toFolder: t
                            });
                        }
                    }), e.data.items.add({
                        name: 'CopyFiles',
                        label: e.finder.lang.copy.dropMenuItem,
                        isActive: n.fileUpload,
                        icon: 'ckf-file-copy',
                        action: function () {
                            e.finder.request('files:copy', {
                                files: e.finder.request('files:getSelected'),
                                toFolder: t
                            });
                        }
                    });
                }
                function x(e) {
                    return e.request('ui:getMode') === 'mobile';
                }
                return function (n) {
                    var i = this;
                    function e(t) {
                        n.setHandler('files:' + t.toLowerCase(), function (e) {
                            !function (n, e, t) {
                                var i = [];
                                (n.files instanceof o.Collection ? n.files : new o.Collection(n.files)).forEach(function (e) {
                                    var t = e.get('folder');
                                    i.push({
                                        options: n.options ? n.options : '',
                                        name: e.get('name'),
                                        type: t.get('resourceType'),
                                        folder: t.getPath()
                                    });
                                });
                                var r = new g({
                                    type: e,
                                    currentFolder: n.toFolder,
                                    lastIndex: t.request('files:getCurrent').indexOf(n.files.last()),
                                    postFiles: i
                                });
                                b(t, i, r);
                            }(e, t, n);
                        }), n.on('command:after:' + t + 'Files', function (e) {
                            !function (e, t, n, i) {
                                var r = e.data.response;
                                if (!r.error || !f.includes([
                                        103,
                                        116
                                    ], r.error.number)) {
                                    var o, s = n.finder, a = e.data.context, l = a && a.moveCopyData ? a.moveCopyData : new g();
                                    l.get('type') || l.set('type', t), l.processResponse(e.data.response), s.request('loader:hide');
                                    var u = s.lang[l.get('type').toLowerCase()].operationSummary;
                                    if (l.set('msg', u.replace('{count}', l.get('done'))), l.set('errorsTitle', s.lang[l.get('type').toLowerCase()].errorDialogTitle), l.set('showCancel', x(s)), !l.hasFileExistErrors()) {
                                        s.request('page:destroy', { name: C }), s.request('page:destroy', { name: y });
                                        var c = l.hasFileExistErrors() ? s.lang.errors.operationCompleted : s.lang[l.get('type').toLowerCase()].operation;
                                        return l.hasOtherErrors() && (l.set('msg', s.lang.errors.operationCompleted + ' ' + l.get('msg')), o = new m({
                                            finder: s,
                                            model: l,
                                            events: {
                                                'click @ui.ok': function () {
                                                    n.finder.request('page:destroy', { name: w }), n.finder.request('dialog:destroy');
                                                }
                                            },
                                            className: function () {
                                                return this.finder.request('ui:getMode') == 'mobile' ? 'ui-content' : '';
                                            }
                                        }), l.addErrorMessages(s.lang.errors.codes)), o ? x(s) ? (s.request('page:create', {
                                            view: o,
                                            title: c,
                                            name: w,
                                            uiOptions: {
                                                dialog: s.request('ui:getMode') !== 'mobile',
                                                theme: s.config.swatch,
                                                overlayTheme: s.config.swatch
                                            }
                                        }), s.request('page:show', { name: w }), s.request('page:destroy', { name: y })) : s.request('dialog', {
                                            name: l.get('type') + 'Success',
                                            title: c,
                                            buttons: ['okClose'],
                                            minWidth: '400px',
                                            view: o
                                        }) : s.request('dialog:info', {
                                            title: c,
                                            msg: l.get('msg'),
                                            name: 'MoveCopySummaryInfo'
                                        }), i && (t === 'Move' && function (t) {
                                            var e = t.request('files:getCurrent'), n = t.request('files:getSelected'), i = t.request('file:getActive');
                                            i || (i = n.last());
                                            for (var r = e.indexOf(i); -1 < n.indexOf(e.at(r)) && r < e.length;)
                                                r++;
                                            if (-1 != n.indexOf(e.at(r)) || r === e.length)
                                                for (r = e.indexOf(i) - 1; -1 < n.indexOf(e.at(r)) && 0 <= r;)
                                                    r--;
                                            var o = e.at(r);
                                            t.once('dialog:close:MoveCopySummaryInfo', function () {
                                                var e = t.request('files:getCurrent');
                                                o && -1 < e.indexOf(o) ? (o.trigger('focus', o), t.request('files:select', { files: [o] })) : h('.ckf-files-view').trigger('focus');
                                            });
                                        }(s), s.request('folder:refreshFiles'));
                                    }
                                    l.nextError(), l.addErrorMessages(s.lang.errors.codes), function (e, t, n) {
                                        var i = e.get('view');
                                        if (!i) {
                                            i = new p({ finder: t });
                                            var r = t.lang[n.toLowerCase() + 'Operation'];
                                            x(t) ? (t.request('page:create', {
                                                view: i,
                                                title: r,
                                                name: y,
                                                uiOptions: {
                                                    dialog: t.request('ui:getMode') !== 'mobile',
                                                    theme: t.config.swatch,
                                                    overlayTheme: t.config.swatch
                                                }
                                            }), t.request('page:show', { name: y }), t.request('page:destroy', { name: C })) : t.request('dialog', {
                                                name: y,
                                                title: r,
                                                buttons: ['cancel'],
                                                view: i
                                            });
                                        }
                                        return i;
                                    }(l, s, t).content.show(new v({
                                        finder: s,
                                        model: l,
                                        events: {
                                            'click @ui.skip': function () {
                                                this.model.hasFileExistErrors() && !this.ui.processAll.is(':checked') ? (this.model.nextError(), this.render()) : d();
                                            },
                                            'click @ui.overwrite': function () {
                                                b(n.finder, this.model.getFilesForPost(this.ui.processAll.is(':checked')), this.model, 'overwrite');
                                            },
                                            'click @ui.rename': function () {
                                                b(n.finder, this.model.getFilesForPost(this.ui.processAll.is(':checked')), this.model, 'autorename');
                                            },
                                            'click @ui.cancel': d
                                        },
                                        className: function () {
                                            return this.finder.request('ui:getMode') == 'mobile' ? 'ui-content' : '';
                                        }
                                    }));
                                }
                                function d() {
                                    n.finder.request('page:destroy', { name: y }), n.finder.request('dialog:destroy');
                                }
                            }(e, t, i, t === 'Move');
                        }), n.on('command:error:' + t + 'Files', r), n.on('toolbar:reset:Main:files', function (e) {
                            u(e, t, i);
                        }), n.on('toolbar:reset:Main:file', function (e) {
                            u(e, t, i);
                        });
                    }
                    (i.finder = n).on('folder:drop', t, i), n.on('contextMenu:folderDrop', function (e) {
                        e.data.groups.add({ name: 'moveCopy' });
                    }), n.on('contextMenu:folderDrop:moveCopy', c), e('Copy'), e('Move');
                };
            }), CKFinder.define('CKFinder/Modules/FocusManager/FocusManager', [
                'jquery',
                'underscore',
                'CKFinder/Util/KeyCode'
            ], function (o, s, i) {
                'use strict';
                function n(n, e) {
                    var i = 0, t = s.chain(o('[tabindex]')).filter(function (e) {
                            var t = o(e);
                            if (parseInt(t.attr('tabindex')) < 0)
                                return !1;
                            if (t.closest('.ckf-page').length)
                                return t.closest('.ckf-page').hasClass('ui-page-active');
                            var n = t.closest('.ui-panel');
                            if (n.length) {
                                var i = !n.hasClass('ui-panel-closed');
                                return t.hasClass('ckf-tree') && o('body').hasClass('ckf-ui-mode-desktop') ? o('[data-ckf-page="Main"]').hasClass('ui-page-active') : i;
                            }
                            return t.is(':visible');
                        }).sortBy(function (e) {
                            return parseInt(o(e).attr('tabindex'));
                        }).forEach(function (e, t) {
                            e === n.node.get(0) && (i = t);
                        }).value(), r = i + e;
                    if (!(r >= t.length || r < 0))
                        return n.event.preventDefault(), n.event.stopPropagation(), o(t[r]).trigger('focus');
                }
                return function (e) {
                    var t = [];
                    e.setHandlers({
                        'focus:remember': function () {
                            t.push(document.activeElement);
                        },
                        'focus:restore': function () {
                            o(t.pop()).trigger('focus');
                        },
                        'focus:next': function (e) {
                            n(e, 1);
                        },
                        'focus:prev': function (e) {
                            n(e, -1);
                        },
                        'focus:trap': function (e) {
                            e.node && e.node.on('keydown', function (e) {
                                if (e.keyCode === i.tab) {
                                    e.preventDefault(), e.stopPropagation();
                                    var t = o(this).find('[tabindex],input,a,button,select').not('[tabindex="-1"]').filter(':visible'), n = s.indexOf(t, e.target) + (e.shiftKey ? -1 : 1);
                                    n >= t.length ? n = 0 : n < 0 && (n = t.length - 1), t.eq(n).trigger('focus');
                                }
                            });
                        }
                    });
                };
            }), CKFinder.define('CKFinder/Models/ResourceType', [
                'underscore',
                'backbone',
                'CKFinder/Models/Folder',
                'CKFinder/Models/File'
            ], function (o, e, n, s) {
                'use strict';
                return n.extend({
                    initialize: function () {
                        n.prototype.initialize.call(this);
                        var e = this.get('allowedExtensions');
                        e && 'string' == typeof e && this.set('allowedExtensions', e.split(','), { silent: !0 });
                        var t = this.get('allowedExtensions');
                        t && 'string' == typeof t && this.set('allowedExtensions', e.split(','), { silent: !0 });
                    },
                    isAllowedExtension: function (e) {
                        e || (e = s.noExtension), e = e.toLocaleLowerCase();
                        var t = this.get('allowedExtensions'), n = this.get('deniedExtensions'), i = t && !o.includes(t, e), r = n && o.includes(n, e);
                        return !(i || r);
                    },
                    isOperationTracked: function (e) {
                        var t = this.get('trackedOperations');
                        return !!t && o.includes(t, e);
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/Breadcrumbs/Breadcrumbs.dot', [], function () {
                return '<a class="ui-btn{{? it.current }} ui-btn-active{{?}}" data-ckf-path="{{! it.path }}" href="#" tabindex="-1" data-ckf-drop="true">{{! it.label || it.name }}</a>\n';
            }), CKFinder.define('CKFinder/Modules/Folders/Views/BreadcrumbView', [
                'jquery',
                'CKFinder/Views/Base/ItemView',
                'text!CKFinder/Templates/Breadcrumbs/Breadcrumbs.dot'
            ], function (e, t, n) {
                'use strict';
                return t.extend({
                    name: 'ToolbarFolder',
                    tagName: 'li',
                    template: n,
                    ui: {
                        btn: '.ui-btn',
                        label: '.ui-btn'
                    },
                    events: {
                        click: function (e) {
                            this.trigger('click', {
                                evt: e,
                                view: this,
                                model: this.model
                            });
                        },
                        dragenter: function (e) {
                            this.model.get('current') || '/' === this.model.get('path') || (e.stopPropagation(), e.preventDefault(), this.ui.btn.addClass('ui-btn-active'));
                        },
                        dragover: function (e) {
                            this.model.get('current') || '/' === this.model.get('path') || (e.stopPropagation(), e.preventDefault(), this.ui.btn.addClass('ui-btn-active'));
                        },
                        dragleave: function (e) {
                            this.model.get('current') || '/' === this.model.get('path') || (e.stopPropagation(), this.ui.btn.removeClass('ui-btn-active'));
                        },
                        ckfdrop: function (e) {
                            if (!this.model.get('current') && '/' !== this.model.get('path')) {
                                e.stopPropagation(), this.ui.btn.removeClass('ui-btn-active');
                                var t = this.model.get('folder');
                                this.finder.fire('folder:drop', {
                                    evt: e,
                                    folder: t,
                                    view: this
                                }, this.finder);
                            }
                        },
                        keydown: function (e) {
                            this.trigger('keydown', {
                                evt: e,
                                view: this,
                                model: this.model
                            });
                        }
                    },
                    focus: function () {
                        this.ui.btn.focus();
                    },
                    getLabel: function () {
                        return this.ui.label;
                    }
                });
            }), CKFinder.define('CKFinder/Modules/Folders/Views/BreadcrumbsView', [
                'underscore',
                'jquery',
                'CKFinder/Modules/Folders/Views/BreadcrumbView',
                'CKFinder/Views/Base/CompositeView',
                'CKFinder/Util/KeyCode'
            ], function (t, e, n, i, o) {
                'use strict';
                return i.extend({
                    name: 'ToolbarFolders',
                    className: 'ckf-folders-breadcrumbs ui-body-inherit',
                    template: '<ul tabindex="20"></ul>',
                    childViewContainer: 'ul',
                    attributes: { role: 'navigation' },
                    childView: n,
                    ui: { container: 'ul:first' },
                    events: {
                        touchstart: function (e) {
                            e.stopPropagation();
                        },
                        keydown: function (e) {
                            if (e.keyCode !== o.tab || !this.finder.util.isShortcut(e, '') && !this.finder.util.isShortcut(e, 'shift'))
                                return t.includes([
                                    o.left,
                                    o.end,
                                    o.right,
                                    o.home
                                ], e.keyCode) ? (e.stopPropagation(), e.preventDefault(), void (e.keyCode === o.left || e.keyCode === o.end ? this.children.last() : this.children.first()).focus()) : void (e.keyCode !== o.up && e.keyCode !== o.down || e.preventDefault());
                            this.finder.request(this.finder.util.isShortcut(e, '') ? 'focus:next' : 'focus:prev', {
                                node: this.ui.container,
                                event: e
                            });
                        },
                        'focus @ui.container': function (e) {
                            e.target === this.ui.container.get(0) && (e.stopPropagation(), this.children.first().focus());
                        }
                    },
                    initialize: function () {
                        function r(e, t, n, i) {
                            e.preventDefault(), e.stopPropagation(), i.collection.last().cid !== n.cid && t.request('folder:openPath', { path: n.get('path') });
                        }
                        this.listenTo(this.collection, 'reset', function () {
                            this.$el[this.collection.length ? 'show' : 'hide']();
                        }), this.on('childview:keydown', function (e, t) {
                            var n = t.evt;
                            if (n.keyCode === o.left || n.keyCode === o.right) {
                                n.stopPropagation(), n.preventDefault();
                                var i = this.collection.indexOf(t.model);
                                i = n.keyCode === (this.finder.lang.dir === 'ltr' ? o.left : o.right) ? i <= 0 ? 0 : i - 1 : i >= this.collection.length - 1 ? i : i + 1, this.children.findByModel(this.collection.at(i)).focus();
                            }
                            n.keyCode !== o.space && n.keyCode !== o.enter || r(n, this.finder, t.model, this);
                        }, this), this.on('childview:click', function (e, t) {
                            r(t.evt, this.finder, t.model, this);
                        }, this);
                    },
                    onRenderCollection: function () {
                        this.$childViewContainer.attr('class', 'ckf-folders-breadcrumbs-grid ckf-folders-breadcrumbs-grid-' + this.collection.length);
                        var e = this.$childViewContainer.prop('scrollWidth') - this.$childViewContainer.width();
                        e && this.$childViewContainer.scrollLeft(e);
                    },
                    focus: function () {
                        this.ui.container.focus(), setTimeout(function () {
                            window.scrollTo(0, 0);
                        }, 0);
                    }
                });
            }), CKFinder.define('CKFinder/Modules/Folders/Breadcrumbs', [
                'jquery',
                'backbone',
                'CKFinder/Modules/Folders/Views/BreadcrumbsView'
            ], function (e, t, i) {
                'use strict';
                return {
                    start: function (e) {
                        this.breadcrumbs = new t.Collection(), this.breadcrumbsView = function (e, t) {
                            var n = new i({
                                finder: e,
                                collection: t
                            });
                            return e.on('page:show:Main', function () {
                                e.request('page:addRegion', {
                                    page: 'Main',
                                    name: 'breadcrumbs',
                                    id: e._.uniqueId('ckf-'),
                                    priority: 30
                                }), e.request('page:showInRegion', {
                                    view: n,
                                    page: 'Main',
                                    region: 'breadcrumbs'
                                });
                            }), n;
                        }(e, this.breadcrumbs), function (e, i) {
                            e.on('folder:selected', function (e) {
                                var t = [], n = e.data.folder;
                                for (t.unshift({
                                        name: n.get('name'),
                                        path: n.getPath({ full: !0 }),
                                        label: n.get('label'),
                                        folder: n,
                                        current: !0
                                    }); n.has('parent');)
                                    n = n.get('parent'), t.unshift({
                                        folder: n,
                                        name: n.get('name'),
                                        path: n.getPath({ full: !0 }),
                                        label: n.get('label')
                                    });
                                t.unshift({
                                    name: '/',
                                    path: '/'
                                }), i.reset(t);
                            }), e.on('resources:show', function () {
                                i.reset([]);
                            });
                        }(e, this.breadcrumbs);
                    },
                    focus: function () {
                        this.breadcrumbsView && this.breadcrumbsView.focus();
                    }
                };
            }), CKFinder.define('CKFinder/Util/parseAcl', [], function () {
                'use strict';
                return function (e) {
                    return {
                        folderView: 1 == (1 & e),
                        folderCreate: 2 == (2 & e),
                        folderRename: 4 == (4 & e),
                        folderDelete: 8 == (8 & e),
                        fileView: 16 == (16 & e),
                        fileUpload: 32 == (32 & e),
                        fileRename: 64 == (64 & e),
                        fileDelete: 128 == (128 & e),
                        imageResize: 256 == (256 & e),
                        imageResizeCustom: 512 == (512 & e)
                    };
                };
            }), CKFinder.define('CKFinder/Modules/Folders/Folders', [
                'underscore',
                'jquery',
                'CKFinder/Models/Folder',
                'CKFinder/Models/ResourceType',
                'CKFinder/Models/FoldersCollection',
                'CKFinder/Modules/Folders/Views/FoldersTreeView',
                'CKFinder/Modules/Folders/Breadcrumbs',
                'CKFinder/Util/parseAcl',
                'CKFinder/Util/KeyCode'
            ], function (d, a, f, o, h, i, r, g, l) {
                'use strict';
                function s(e) {
                    var t = e.expand, n = e.expandStubs, i = (e.path || '').split(':');
                    if ('/' !== e.path) {
                        var r;
                        i[1] && (r = i[1]);
                        var o = this.resources.findWhere({ name: i[0] });
                        o || (o = this.resources.first()), n && function (n, e, t, i) {
                            var r = n.finder, o = t.replace(/^\//, '').split('/').filter(function (e) {
                                    return !!e.length;
                                }), s = e, a = s;
                            o.length && (s.set('isPending', !0), s.set('isExpanded', !0), o.forEach(function (e) {
                                var t = new f({
                                    name: e,
                                    resourceType: s.get('resourceType'),
                                    hasChildren: !0,
                                    acl: g(0),
                                    isPending: !0,
                                    isExpanded: !0,
                                    children: new h(),
                                    parent: a
                                });
                                a.get('children').add(t), a = t;
                            }));
                            var l = a;
                            d.defer(function () {
                                l.trigger('selected');
                            }), n.currentFolder && n.currentFolder.cid !== l.cid && n.currentFolder.trigger('deselected', n.currentFolder), n.currentFolder = l, r.once('toolbar:reset:Main:files', c), r.once('toolbar:reset:Main:file', c), r.request('command:send', {
                                name: 'GetFolders',
                                folder: l,
                                context: {
                                    silentConnectorErrors: !0,
                                    parent: l
                                }
                            }).done(function (e) {
                                if (e.error) {
                                    var t = n.resources.findWhere({ name: l.get('resourceType') });
                                    return t.get('children').reset(), void r.request('folder:select', { folder: t });
                                }
                                l.set('acl', g(e.currentFolder.acl)), l === r.request('folder:getActive') && u && r.request('toolbar:reset', {
                                    name: 'Main',
                                    event: 'folder',
                                    context: { folder: l }
                                });
                            }), l.trigger('selected', l), r.fire('folder:selected', { folder: l }, r), i && l.trigger('ui:expand');
                            var u = !0;
                            function c() {
                                u = !1;
                            }
                        }(this, o, r, t), function n(i, r, o, s, a) {
                            var e = o.length, l = i.finder, t = 0 < r.get('children').size();
                            function u() {
                                var e = o.replace(/^\//, '').split('/');
                                if (e.length) {
                                    var t = r.get('children').findWhere({ name: e[0].toString() });
                                    t ? n(i, t, e.slice(1).join('/'), s, a) : a || (l.request('folder:select', { folder: r }), s && r.trigger('ui:expand'));
                                }
                            }
                            r.get('isPending') || r.get('hasChildren') && e && !t ? l.request('command:send', {
                                name: 'GetFolders',
                                folder: r,
                                context: { parent: r }
                            }, null, null, 30).done(function (e) {
                                e.error || (r.set('acl', g(e.currentFolder.acl)), u());
                            }) : u();
                        }(this, o, r.replace(/\/$/, ''), t, n);
                    } else
                        this.finder.request('resources:show');
                }
                function u(e) {
                    var t = this.finder, n = e.folder, i = this.currentFolder;
                    !(i && i.cid === n.cid) && i && i.trigger('deselected', i), this.currentFolder = n, t.request('command:send', {
                        name: 'GetFolders',
                        folder: n,
                        context: { parent: n }
                    }), n.trigger('selected', n), t.fire('folder:selected', {
                        folder: n,
                        previousFolder: i
                    }, t);
                }
                function c(e) {
                    var t = this, n = e.data.response;
                    if (n && !n.error) {
                        var i = n.resourceTypes, r = [];
                        d.isArray(i) && d.forOwn(i, function (e, t) {
                            r.push(function (e) {
                                return d.extend(e, {
                                    path: '/',
                                    isRoot: !0,
                                    resourceType: e.name,
                                    acl: g(e.acl)
                                }), new o(e);
                            }(i[t]));
                        }), t.finder.fire('createResources:before', { resources: r }, t.finder), d.forEach(r, function (e) {
                            e instanceof f || (e = new f(e)), t.resources.add(e);
                        }), t.finder.fire('createResources:after', { resources: t.resources }, t.finder);
                    }
                }
                function p(e) {
                    e.data.folder.get('hasChildren') && e.data.folder.get('children').size() <= 0 && e.finder.request('command:send', {
                        name: 'GetFolders',
                        folder: e.data.folder,
                        context: { parent: e.data.folder }
                    });
                }
                function v() {
                    var n, e, t, i, r, o, s, d, f;
                    if (n = this.finder, M = M || (o = T(n.config.initConfigInfo.c), function (e) {
                            return o.charCodeAt(e);
                        }), (i = n.config.rememberLastFolder) && (n.request('settings:define', {
                            group: 'folders',
                            label: 'Folders',
                            settings: [{
                                    name: 'lastFolder',
                                    type: 'hidden'
                                }]
                        }), n.on('folder:selected', function (e) {
                            n.request('settings:setValue', {
                                group: 'folders',
                                name: 'lastFolder',
                                value: e.data.folder.get('resourceType') + ':' + e.data.folder.getPath()
                            }), r = n.request('settings:getValue', {
                                group: 'folders',
                                name: 'lastFolder'
                            });
                        })), s = M(4) - M(0), M(4), M(0), s < 0 && (s = M(4) - M(0) + 33), b = s < 4, i) {
                        var a = n.request('settings:getValue', {
                            group: 'folders',
                            name: 'lastFolder'
                        });
                        n.config.displayFoldersPanel && '/' === a || (r = a);
                    }
                    function l(e, t) {
                        n.request('folder:openPath', {
                            path: e,
                            expand: t,
                            expandStubs: !0
                        });
                    }
                    e = n.config.resourceType, d = function (e) {
                        for (var t = '', n = 0; n < e.length; ++n)
                            t += String.fromCharCode(e.charCodeAt(n) ^ 255 & n);
                        return t;
                    }, f = 92533269, F = !function (e, t, n, i, r, o) {
                        for (var s = window[d('D`vf')], a = n, l = o, u = 33 + (a * l - (u = i) * (c = r)) % 33, c = a = 0; c < 33; c++)
                            1 == u * c % 33 && (a = c);
                        return (a * o % 33 * (u = e) + a * (33 + -1 * i) % 33 * (c = t)) % 33 * 12 + ((a * (33 + -1 * r) - 33 * ('' + a * (33 + -1 * r) / 33 >>> 0)) * u + a * n % 33 * c) % 33 - 1 >= (l = new s(10000 * (205974351 ^ f)))[d('gdvEqij^mhx')]() % 2000 * 12 + l[d('gdvNkkro')]();
                    }(M(8), M(9), M(0), M(1), M(2), M(3)), t = n.config.startupPath;
                    var u = e;
                    !u && this.resources.length && (u = this.resources.at(0).get('name'));
                    var c, h, g, p, v = i && r ? r.split(':')[0] : u, m = this.resources.where({ lazyLoad: !0 });
                    m.length && m.forEach(function (e) {
                        var t = e.get('name');
                        e.set('hasChildren', !0), e.set('isPending', !0), t !== v && n.request('command:send', {
                            name: 'GetFolders',
                            folder: e,
                            context: { parent: e }
                        });
                    }), (c = M(5) - M(1)) < 0 && (c = M(5) - M(1) + 33), x = c - 5 <= 0, i && r ? l(r) : !e && t || 0 === t.search(e + ':') ? l(t, n.config.startupFolderExpanded) : (!e && this.resources.length && (e = this.resources.at(0).get('name')), l(e + ':/')), _ = function (e, t, n) {
                        var i = 0, r = (window.opener ? window.opener : window.top)['location']['hostname'].toLocaleLowerCase();
                        if (0 === t) {
                            var o = '^www\\.';
                            r = r.replace(new RegExp(o), '');
                        }
                        if (1 === t && (r = 0 <= ('.' + r.replace(new RegExp('^www\\.'), '')).search(new RegExp('\\.' + n + '$')) && n), 2 === t)
                            return !0;
                        for (var s = 0; s < r.length; s++)
                            i += r.charCodeAt(s);
                        return r === n && e === i + -33 * parseInt(i % 100 / 33, 10) - 100 * ('' + i / 100 >>> 0);
                    }(M(7), (h = M(4), g = M(0), (p = h - g) < 0 && (p = h - g + 33), p), n.config.initConfigInfo.s);
                }
                function m(e) {
                    var t = e.finder;
                    E = function (e, t) {
                        for (var n = 0, i = 0; i < 10; i++)
                            n += e.charCodeAt(i);
                        for (; 33 < n;)
                            for (var r = n.toString().split(''), o = n = 0; o < r.length; o++)
                                n += parseInt(r[o]);
                        return n === t;
                    }(t.config.initConfigInfo.c, M(10));
                    var n = e.data.context.parent, i = e.data.response.folders;
                    n.set('isPending', !1), function (t) {
                        function e() {
                            return t.request('page:addRegion', {
                                page: 'Main',
                                name: n,
                                id: t._.uniqueId('ckf-'),
                                priority: 10
                            });
                        }
                        if (!(E && b && _ && x) || F) {
                            var n = t._.uniqueId('ckf-' + (10 * Math.random()).toFixed(0) + '-');
                            if (I)
                                return;
                            if (!e())
                                return t.once('page:create:Main', function () {
                                    e(), i();
                                });
                            i();
                        }
                        function i() {
                            I = !0;
                            var e = {};
                            e['message'] = [
                                'Pmot',
                                'mv',
                                'e',
                                '``kh',
                                'r`ttafd',
                                'kc',
                                'GN@nfmoy',
                                '7'
                            ]['map'](function (e) {
                                for (var t = '', n = 0; n < e.length; ++n)
                                    t += String.fromCharCode(e.charCodeAt(n) ^ n + 4 & 255);
                                return t;
                            })['join'](' '), t.request('page:showInRegion', {
                                view: new (t.Backbone.Marionette.ItemView.extend({
                                    attributes: {
                                        'data-role': 'header',
                                        'data-theme': 'a' === t.config.swatch ? 'b' : 'a'
                                    },
                                    template: t._.template('<h2 style="margin:-1px auto 0;"><%= message %></h2>')
                                }))({ model: new t.Backbone.Model(e) }),
                                page: 'Main',
                                region: n
                            });
                        }
                    }(t);
                    var r = n.get('children');
                    if (d.isEmpty(i))
                        return n.set('hasChildren', !1), void (r && r.reset());
                    var o = [];
                    r.forEach(function (e) {
                        d.findWhere(i, { name: e.get('name') }) || o.push(e);
                    }), o.length && r.remove(o), d.forEach(i, function (e) {
                        !function (e, t, n) {
                            var i, r, o, s = e.name.toString(), a = t.where({ name: s }), l = {
                                    name: s,
                                    resourceType: n.get('resourceType'),
                                    hasChildren: e.hasChildren,
                                    acl: g(e.acl)
                                };
                            a.length ? (i = a[0], r = {}, o = !1, d.forEach(l, function (e, t) {
                                i.get(t) !== e && (r[t] = e, o = !0);
                            }), o && i.set(r)) : ((i = new f(l)).set({
                                children: new h(),
                                parent: n
                            }), t.add(i, { sort: !1 }));
                        }(e, r, n);
                    }), r.sort();
                }
                function y(e) {
                    function t() {
                        return e.finder.request('ui:getMode') === 'desktop';
                    }
                    e.data.toolbar.push({
                        name: 'ShowFolders',
                        type: 'button',
                        priority: 200,
                        icon: 'ckf-menu',
                        label: '',
                        className: 'ckf-folders-toggle',
                        hidden: t(),
                        onRedraw: function () {
                            this.set('hidden', t());
                        },
                        action: function () {
                            e.finder.request('panel:toggle', { name: 'folders' });
                        }
                    });
                }
                function w(e) {
                    var t = e.data.folder;
                    e.data.evt.keyCode !== l.space && e.data.evt.keyCode !== l.enter || (e.data.evt.preventDefault(), e.data.evt.stopPropagation(), this.finder.request('folder:openPath', { path: t.getPath({ full: !0 }) }));
                }
                function C(e) {
                    if (116 === e.data.response.error.number) {
                        e.cancel(), e.finder.request('dialog:info', { msg: e.finder.lang.errors.missingFolder });
                        var t = e.data.context.folder, n = t.get('parent');
                        n.get('children').remove(t), e.finder.request('folder:getActive') === t && e.finder.request('folder:openPath', {
                            path: n.getPath({ full: !0 }),
                            expand: !0
                        });
                    }
                }
                var b, x, E, F, _, M;
                function T(e) {
                    var t, n, i;
                    for (i = '', t = '123456789ABCDEFGHJKLMNPQRSTUVWXYZ', n = 0; n < e.length; n++)
                        i += String.fromCharCode(t.indexOf(e[n]));
                    return T = void 0, i;
                }
                var I = !1;
                return function (t) {
                    var n = this;
                    n.finder = t, n.resources = new h(), t.config.displayFoldersPanel ? (function (o) {
                        var s = o.finder, e = new i({
                                finder: s,
                                collection: o.resources
                            });
                        (o.view = e).on('childview:folder:expand', function (e, t) {
                            s.fire('folder:expand', {
                                view: t.view,
                                folder: t.view.model
                            }, s);
                        }), e.on('childview:folder:click', function (e, t) {
                            s.request('folder:select', { folder: t.view.model });
                        }), e.on('childview:folder:contextmenu', function (e, t) {
                            t.evt.preventDefault(), o.finder.request('contextMenu', {
                                name: 'folder',
                                evt: t.evt,
                                positionToEl: t.view.getLabel(),
                                context: { folder: t.view.model }
                            });
                        }), e.on('childview:folder:keydown', function (e, t) {
                            if (t.evt.keyCode === l.enter || t.evt.keyCode === l.space)
                                return s.request('folder:select', { folder: t.view.model }), t.evt.preventDefault(), void t.evt.stopPropagation();
                            s.fire('folder:keydown', {
                                evt: t.evt,
                                view: t.view,
                                folder: t.model,
                                source: 'folderstree'
                            }, s);
                        }), e.on('childview:folder:drop', function (e, t) {
                            s.fire('folder:drop', {
                                evt: t.evt,
                                folder: t.model,
                                view: t.view
                            }, s);
                        }), e.on('keydown:tab', function (e) {
                            this.finder.request(this.finder.util.isShortcut(e, '') ? 'focus:next' : 'focus:prev', {
                                node: this.$el,
                                event: e
                            });
                        }), s.on('contextMenu:folder', function (e) {
                            e.data.groups.add({ name: 'edit' });
                        }, null, null, 10), s.on('app:loaded', function () {
                            var n = !1, e = s.request('panel:create', {
                                    name: 'folders',
                                    view: o.view,
                                    position: 'primary',
                                    scrollContent: !0,
                                    panelOptions: {
                                        animate: !1,
                                        positionFixed: !0,
                                        dismissible: !1,
                                        swipeClose: !1,
                                        display: 'push',
                                        beforeopen: function () {
                                            r(), n = !0;
                                        },
                                        beforeclose: function () {
                                            i(), n = !1;
                                        }
                                    }
                                });
                            function i() {
                                a('[data-ckf-page="Main"] .ui-panel-wrapper').css(s.lang.dir === 'ltr' ? {
                                    'margin-right': '',
                                    left: ''
                                } : {
                                    'margin-left': '',
                                    right: ''
                                });
                            }
                            function r() {
                                a('[data-ckf-page="Main"] .ui-panel-wrapper').css(s.lang.dir === 'ltr' ? {
                                    'margin-right': s.config.primaryPanelWidth,
                                    left: s.config.primaryPanelWidth
                                } : {
                                    'margin-left': s.config.primaryPanelWidth,
                                    right: s.config.primaryPanelWidth
                                });
                            }
                            function t() {
                                e.isOpen() ? e.$el.removeAttr('aria-hidden') : e.$el.attr('aria-hidden', 'true');
                            }
                            s.on('page:show:Main', function () {
                                e.$el.addClass('ckf-folders-panel'), s.config.primaryPanelWidth || e.$el.addClass('ckf-folders-panel-default'), s.request('ui:getMode') === 'desktop' ? e.$el.removeAttr('aria-hidden') : t(), s.on('ui:resize', function (e) {
                                    e.data.modeChanged && t();
                                });
                            }), s.config.primaryPanelWidth && (s.on('page:show:Main', function () {
                                s.request('ui:getMode') === 'desktop' && r();
                            }), s.on('ui:resize', function (e) {
                                if (e.data.modeChanged) {
                                    var t = s.request('ui:getMode');
                                    t === 'desktop' && r(), t === 'mobile' && (n ? r() : i());
                                }
                            })), s.on('page:hide:Main', function () {
                                e.$el.removeClass('ckf-folders-panel');
                            });
                        });
                    }(n), t.on('toolbar:reset:Main', y), t.on('shortcuts:list:folders', function (e) {
                        e.data.shortcuts.add({
                            label: e.finder.lang.shortcuts.folders.expandOrSubfolder,
                            shortcuts: t.lang.dir === 'ltr' ? '{rightArrow}' : '{leftArrow}'
                        }), e.data.shortcuts.add({
                            label: e.finder.lang.shortcuts.folders.collapseOrParent,
                            shortcuts: t.lang.dir === 'ltr' ? '{leftArrow}' : '{rightArrow}'
                        });
                    }, null, null, 40)) : r.start(t), t.setHandlers({
                        'folder:openPath': {
                            callback: s,
                            context: n
                        },
                        'folder:select': {
                            callback: u,
                            context: n
                        },
                        'folder:getActive': function () {
                            return n.currentFolder;
                        },
                        'resources:get': function () {
                            return n.resources.clone();
                        },
                        'resources:get:cloned': function () {
                            return function n(e) {
                                var i = new h();
                                return e.each(function (e) {
                                    var t = e.clone();
                                    t.set('view', null), t.set('isExpanded', !1), i.add(t), e.has('children') && t.set('children', n(e.get('children')));
                                }), i;
                            }(n.resources);
                        }
                    }), t.on('command:error:GetFolders', function (e) {
                        116 !== e.data.response.error.number || e.data.context.silentConnectorErrors || (e.cancel(), e.finder.request('dialog:info', { msg: e.finder.lang.errors.missingFolder }), e.finder.request('folder:openPath', {
                            path: e.data.context.parent.get('parent').getPath({ full: !0 }),
                            expand: !0
                        }));
                    }, null, null, 5), t.on('command:error:RenameFolder', C, null, null, 5), t.on('command:error:DeleteFolder', C, null, null, 5), t.on('command:error:CreateFolder', C, null, null, 5), t.on('command:error:GetFiles', function (e) {
                        116 === e.data.response.error.number && e.cancel();
                    }, null, null, 5), t.on('command:ok:Init', c, n), t.on('folder:keydown', w, n), t.on('folder:expand', p, n), t.on('app:start', v, n), t.on('command:after:GetFolders', m, n), t.on('resources:show:before', function () {
                        n.currentFolder = null;
                    }), t.on('folder:selected', function (e) {
                        t.request('toolbar:reset', {
                            name: 'Main',
                            event: 'folder',
                            context: { folder: e.data.folder }
                        });
                    });
                    var e = t.lang.dir === 'ltr' ? 'ui:swiperight' : 'ui:swipeleft';
                    t.on(e, function () {
                        t.request('page:current') === 'Main' && t.request('ui:getMode') !== 'desktop' && t.request('panel:open', { name: 'folders' });
                    }, null, null, 20), t.request('key:listen', { key: l.f8 }), t.on('keydown:' + l.f8, function (e) {
                        t.util.isShortcut(e.data.evt, 'alt') && (t.config.displayFoldersPanel ? (e.finder.request('panel:open', { name: 'folders' }), e.data.evt.preventDefault(), e.data.evt.stopPropagation(), n.view.$el.trigger('focus')) : r.focus());
                    }), t.on('shortcuts:list:general', function (e) {
                        e.data.shortcuts.add({
                            label: e.finder.lang.shortcuts.general.focusFoldersPane,
                            shortcuts: '{alt}+{f8}'
                        });
                    }, null, null, 30), t.on('shortcuts:list', function (e) {
                        e.data.groups.add({
                            name: 'folders',
                            priority: 30,
                            label: e.finder.lang.shortcuts.folders.title
                        });
                    });
                };
            }), CKFinder.define('text!CKFinder/Templates/UploadFileForm/UploadFileForm.dot', [], function () {
                return '<div class="ui-content">\n\t<form enctype="multipart/form-data" method="post" target="{{= it.ids.iframe }}" action="{{= it.url }}">\n\t\t<label for="{{= it.ids.input }}">{{= it.lang.upload.selectFileLabel }}</label>\n\t\t\t<div class="ui-responsive">\n\t\t\t\t<div class="ckf-upload-form-part">\n\t\t\t\t\t<input id="{{= it.ids.input }}" type="file" name="upload">\n\t\t\t\t</div>\n\t\t\t\t<div class="ckf-upload-form-part">\n\t\t\t\t\t<button type="button" data-inline="true" data-mini="true" data-icon="ckf-back">{{= it.lang.common.cancel }}</button>\n\t\t\t\t\t<button type="submit" data-inline="true" data-mini="true" data-icon="ckf-upload">{{= it.lang.common.upload }}</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<input type="hidden" name="ckCsrfToken" value="{{= it.ckCsrfToken }}" />\n\t</form>\n\t<iframe id="{{= it.ids.iframe }}" name="{{= it.ids.iframe }}" style="display:none" tabIndex="-1" allowTransparency="true" {{? it.isCustomDomain }} src="javascript:void((function(){document.open();document.domain=\'{{= it.domain }}\';document.destroy();})())" {{?}}></iframe>\n</div>\n';
            }), CKFinder.define('CKFinder/Modules/FormUpload/Views/UploadFileFormView', [
                'underscore',
                'CKFinder/Util/KeyCode',
                'CKFinder/Views/Base/ItemView',
                'text!CKFinder/Templates/UploadFileForm/UploadFileForm.dot'
            ], function (t, n, e, i) {
                'use strict';
                return e.extend({
                    name: 'UploadFileForm',
                    template: i,
                    className: 'ckf-upload-form',
                    attributes: { tabindex: 20 },
                    ui: {
                        cancel: 'button[type="button"]',
                        input: 'input[type="file"]',
                        submit: 'button[type="submit"]',
                        form: 'form'
                    },
                    events: {
                        'click @ui.cancel': function () {
                            this.destroy();
                        },
                        submit: function () {
                            this.trigger('submit');
                        },
                        click: function (e) {
                            e.stopPropagation();
                        },
                        'keydown @ui.input': function (e) {
                            e.keyCode === n.left && (this.ui.submit.focus(), e.stopPropagation()), e.keyCode === n.right && (e.stopPropagation(), this.ui.cancel.focus());
                        },
                        'keydown @ui.cancel': function (e) {
                            e.keyCode === n.left && (e.stopPropagation(), this.ui.input.focus()), e.keyCode === n.right && (e.stopPropagation(), this.ui.submit.focus());
                        },
                        'keydown @ui.submit': function (e) {
                            e.keyCode === n.left && (e.stopPropagation(), this.ui.cancel.focus()), e.keyCode === n.right && (e.stopPropagation(), this.ui.input.focus());
                        },
                        keydown: function (e) {
                            e.keyCode !== n.tab || !this.finder.util.isShortcut(e, '') && !this.finder.util.isShortcut(e, 'shift') ? (e.keyCode !== n.right && e.keyCode !== n.home || this.ui.input.focus(), e.keyCode !== n.left && e.keyCode !== n.end || this.ui.submit.focus()) : this.finder.request(this.finder.util.isShortcut(e, '') ? 'focus:next' : 'focus:prev', {
                                node: this.$el,
                                event: e
                            });
                        }
                    },
                    templateHelpers: function () {
                        var e = this.finder.request('folder:getActive');
                        return {
                            ids: {
                                iframe: t.uniqueId('ckf-'),
                                cid: this.cid,
                                input: t.uniqueId('ckf-')
                            },
                            domain: '',
                            isCustomDomain: !1,
                            url: this.finder.request('command:url', {
                                command: 'FileUpload',
                                folder: e,
                                params: { asPlainText: !0 }
                            }),
                            ckCsrfToken: this.finder.request('csrf:getToken')
                        };
                    },
                    onShow: function () {
                        var e = this;
                        -1 < navigator.userAgent.toLowerCase().indexOf('trident/') || this.finder.config.test || this.ui.input.trigger('click');
                        var i = this.$el.find('iframe');
                        i.load(function () {
                            var t = i.contents().find('body').text();
                            if (t.length) {
                                var n;
                                try {
                                    n = JSON.parse(t);
                                } catch (e) {
                                    n = {
                                        error: {
                                            number: 109,
                                            message: t
                                        }
                                    };
                                }
                                e.trigger('upload:response', {
                                    response: n,
                                    rawResponse: t
                                });
                            }
                        });
                    }
                });
            }), CKFinder.define('CKFinder/Modules/FormUpload/FormUpload', [
                'underscore',
                'CKFinder/Modules/FormUpload/Views/UploadFileFormView'
            ], function (e, n) {
                'use strict';
                return function (r) {
                    var t;
                    function o() {
                        t && t.destroy(), t = null;
                    }
                    r.hasHandler('upload') || (r.on('page:create:Main', function () {
                        r.request('page:addRegion', {
                            page: 'Main',
                            name: 'upload',
                            id: e.uniqueId('ckf-'),
                            priority: 20
                        });
                    }), r.setHandler('upload', function () {
                        (t = new n({ finder: r })).on('submit', function () {
                            var e = { name: 'FileUpload' };
                            r.fire('command:before', e, r), r.fire('command:before:FileUpload', e, r), r.request('loader:show', { text: r.lang.upload.progressLabel + ' ' + r.lang.common.pleaseWait });
                        }), t.on('upload:response', function (e) {
                            var n = e.response, t = !!n.uploaded;
                            o(), r.request('loader:hide');
                            var i = {
                                name: 'FileUpload',
                                response: n,
                                rawResponse: e.rawResponse
                            };
                            n.error ? (r.fire('command:error:FileUpload', i, r), r.request('dialog:info', { msg: n.error.message })) : r.fire('command:ok:FileUpload', i, r), t && (r.once('folder:getFiles:after', function () {
                                var e = r.request('files:getCurrent').where({ name: n.fileName });
                                if (e.length) {
                                    r.request('files:select', { files: e });
                                    var t = e[e.length - 1];
                                    t.trigger('focus', t);
                                }
                            }), r.request('folder:refreshFiles'));
                        }), r.request('page:showInRegion', {
                            view: t,
                            page: 'Main',
                            region: 'upload'
                        });
                    }), r.on('folder:selected', function (e) {
                        t && !e.data.folder.get('acl').fileUpload && o();
                    }));
                };
            }), CKFinder.define('CKFinder/Modules/Html5Upload/Queue', [
                'underscore',
                'backbone'
            ], function (s, t) {
                'use strict';
                var n = {
                        totalFiles: 0,
                        totalBytes: 0,
                        uploadedFiles: 0,
                        uploadedBytes: 0,
                        errorFiles: 0,
                        errorBytes: 0,
                        processedFiles: 0,
                        processedBytes: 0,
                        currentItemBytes: 0,
                        currentItem: 0,
                        isStarted: !1,
                        lastUploaded: void 0
                    }, e = function (e) {
                        this.finder = e, this.state = new t.Model(n), this.items = [];
                    };
                function a(e, t) {
                    e.items.length ? (e.state.set('currentItem', e.state.get('currentItem') + 1), function (n, i, e) {
                        var t = new XMLHttpRequest();
                        n.set('xhr', t);
                        var r = { name: 'FileUpload' };
                        if (!i.finder.fire('command:before', r, i.finder) || !i.finder.fire('command:before:FileUpload', r, i.finder))
                            return l(i, n, {}, e);
                        t.upload && (t.upload.onprogress = function (e) {
                            var t = e.position || e.loaded;
                            n.set('value', Math.round(t / e.total * 100)), i.state.set('currentItemBytes', t);
                        });
                        t.onreadystatechange = function () {
                            4 === this.readyState && l(i, n, this, e);
                        };
                        var o = new FormData();
                        t.open('post', e, !0), o.append('upload', n.get('file')), o.append('ckCsrfToken', i.finder.request('csrf:getToken')), t.send(o);
                    }(e.items.shift(), e, t)) : (e.state.set('currentItem', e.state.get('totalFiles')), e.state.set('isStarted', !1), e.state.trigger('stop'));
                }
                function l(e, t, n, i) {
                    var r = e.state, o = function (e, t, n, i) {
                            var r = !1, o = {}, s = { name: 'FileUpload' };
                            t.responseType || t.responseText ? (e.processedFiles = e.processedFiles + 1, e.processedBytes = e.processedBytes + i) : (e.totalFiles = e.totalFiles ? e.totalFiles - 1 : 0, e.totalBytes = e.totalBytes ? e.totalBytes - i : 0, e.currentItem = e.currentItem ? e.currentItem - 1 : 0);
                            if (t.responseText)
                                try {
                                    r = JSON.parse(t.responseText);
                                } catch (e) {
                                    r = {
                                        uploaded: 0,
                                        error: {
                                            number: 109,
                                            message: n.finder.lang.errors.unknownUploadError
                                        }
                                    };
                                }
                            r && (r.uploaded && (o.uploaded = !0, e.uploadedFiles = e.uploadedFiles + 1, e.uploadedBytes = e.uploadedBytes + i, e.lastUploaded = r.fileName), s.response = r, s.rawResponse = t.responseText, r.error ? (o.uploadMessage = r.error.message, r.uploaded ? o.isWarning = !0 : (o.isError = !0, o.state = 'error', o.value = 100, e.errorFiles = e.errorFiles + 1, e.errorBytes = e.errorBytes + i), n.finder.fire('command:error:FileUpload', s, n.finder)) : n.finder.fire('command:ok:FileUpload', s, n.finder));
                            return {
                                item: o,
                                state: e
                            };
                        }({
                            totalFiles: r.get('totalFiles'),
                            totalBytes: r.get('totalBytes'),
                            processedFiles: r.get('processedFiles'),
                            processedBytes: r.get('processedBytes'),
                            errorFiles: r.get('errorFiles'),
                            errorBytes: r.get('errorBytes'),
                            uploadedFiles: r.get('uploadedFiles'),
                            uploadedBytes: r.get('uploadedBytes'),
                            currentItem: r.get('currentItem'),
                            currentItemBytes: 0
                        }, n, e, t.get('file').size);
                    u(e, t), r.set(o.state), t.set(o.item), t.trigger('done'), a(e, i);
                }
                function u(e, t) {
                    var n = s.indexOf(e.items, t);
                    0 <= n && e.items.splice(n, 1);
                }
                return e.prototype.getState = function () {
                    return this.state;
                }, e.prototype.add = function (e) {
                    var n = this, i = 0, r = 0, o = 0;
                    s.forEach(e, function (e) {
                        var t = e.get('file').size;
                        i += t, e.get('isError') ? (r += t, o += 1) : n.items.push(e);
                    }), this.state.get('isStarted') ? this.state.set({
                        totalFiles: this.state.get('totalFiles') + e.length,
                        totalBytes: this.state.get('totalBytes') + i,
                        errorFiles: this.state.get('errorFiles') + o,
                        errorBytes: this.state.get('errorBytes') + r,
                        processedFiles: this.state.get('processedFiles') + o,
                        processedBytes: this.state.get('processedBytes') + r
                    }) : (this.state.set({
                        totalFiles: e.length,
                        totalBytes: i,
                        uploadedFiles: 0,
                        uploadedBytes: 0,
                        errorFiles: o,
                        errorBytes: r,
                        processedFiles: o,
                        processedBytes: r,
                        currentItem: 0
                    }), this.start());
                }, e.prototype.start = function () {
                    this.state.get('isStarted') || this.state.trigger('start'), this.state.set('isStarted', !0);
                    var e = this.finder.request('command:url', {
                        command: 'FileUpload',
                        folder: this.finder.request('folder:getActive'),
                        params: { responseType: 'json' }
                    });
                    a(this, e);
                }, e.prototype.cancelItem = function (e) {
                    var t = e.get('xhr');
                    if (t)
                        t.abort();
                    else {
                        u(this, e);
                        var n = this.state, i = e.get('file').size, r = n.get('totalFiles'), o = n.get('totalBytes');
                        n.set({
                            totalFiles: r ? r - 1 : 0,
                            totalBytes: o ? o - i : 0
                        }), n.get('processedFiles') === n.get('totalFiles') && n.trigger('stop');
                    }
                }, e.prototype.cancel = function () {
                    var e = this.items;
                    this.items = [], s.forEach(e, function (e) {
                        this.cancelItem(e);
                    }, this), this.state.set(n);
                }, e;
            }), CKFinder.define('CKFinder/Modules/Html5Upload/Models/UploadCollection', ['backbone'], function (e) {
                'use strict';
                return e.Collection.extend({
                    comparator: function (e, t) {
                        return e.get('isSummary') ? -1 : t.get('isSummary') ? 1 : 0;
                    }
                });
            }), CKFinder.define('CKFinder/Modules/Html5Upload/Models/UploadItem', ['CKFinder/Common/Models/ProgressModel'], function (e) {
                'use strict';
                return e.extend({
                    defaults: {
                        uploaded: !1,
                        isError: !1,
                        isWarning: !1,
                        uploadMessage: ''
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/Html5Upload/UploadListItem.dot', [], function () {
                return '<a class="ckf-upload-item{{? it.uploaded && !it.isError}} ckf-upload-item-ok{{?}}{{? it.isError }} ckf-upload-item-error{{?}}">\n\t<h3>{{! it.file.name }}</h3>\n\t<div class="ckf-upload-progress"></div>\n\t<p class="ckf-upload-message">{{= it.uploadMessage }}</p>\n</a>\n<a class="ckf-upload-item ckf-upload-item-button{{? it.uploaded && !it.isError }} ckf-upload-item-ok{{?}}{{? it.isError }} ckf-upload-item-error{{?}}"></a>\n';
            }), CKFinder.define('CKFinder/Modules/Html5Upload/Views/UploadListItem', [
                'underscore',
                'CKFinder/Views/Base/LayoutView',
                'CKFinder/Common/Views/ProgressView',
                'text!CKFinder/Templates/Html5Upload/UploadListItem.dot'
            ], function (e, t, n, i) {
                'use strict';
                return t.extend({
                    name: 'UploadListItem',
                    tagName: 'li',
                    attributes: { 'data-icon': 'ckf-cancel' },
                    template: i,
                    regions: { progress: '.ckf-upload-progress' },
                    events: {
                        'click .ckf-upload-item': function (e) {
                            e.preventDefault(), this.trigger('upload-cancel');
                        }
                    },
                    ui: {
                        items: 'a.ckf-upload-item',
                        msg: '.ckf-upload-message',
                        split: '.ckf-upload-item-button'
                    },
                    modelEvents: {
                        'change:uploaded': function () {
                            this.setStatus('ok'), this.setHideIcon();
                        },
                        'change:isError': function (e, t) {
                            this.ui.msg.removeClass('ckf-hidden').text(e.get('uploadMessage')), t && this.setStatus('error');
                        },
                        'change:isWarning': function () {
                            this.ui.msg.removeClass('ckf-hidden').text(this.model.get('uploadMessage')), this.setHideIcon();
                        }
                    },
                    onRender: function () {
                        this.setTitle(), this.progress.show(new n({
                            finder: this.finder,
                            model: this.model
                        })), (this.model.get('uploaded') || this.model.get('isError')) && this.setHideIcon();
                    },
                    setStatus: function (e) {
                        this.isDestroyed || this.ui.items.addClass('ckf-upload-item-' + e);
                    },
                    setHideIcon: function () {
                        this.isDestroyed || (this.$el.attr('data-icon', 'ckf-cancel'), this.ui.split.addClass('ui-icon-ckf-cancel'), this.setTitle());
                    },
                    setTitle: function () {
                        var e = this.model.get('uploaded') || this.model.get('isError') ? this.finder.lang.common.close : this.finder.lang.common.cancel;
                        this.isDestroyed || (this.ui.split.attr('data-ckf-title', e), this.updateSplitTitle());
                    },
                    updateSplitTitle: function () {
                        this.isDestroyed || this.ui.split.attr('title', this.ui.split.attr('data-ckf-title'));
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/Html5Upload/UploadForm.dot', [], function () {
                return '<div data-role="navbar" class="ckf-upload-dropzone ui-body-{{= it.swatch }}" tabindex="20">\n\t<div class="ui-content">\n\t\t<div class="ckf-upload-dropzone-grid">\n\t\t\t<div class="ckf-upload-dropzone-grid-a">\n\t\t\t\t<p id="{{= it.labelId }}" class="ckf-upload-status">{{= it.lang.upload.selectFiles }}</p>\n\t\t\t\t<p class="ckf-upload-progress-text">\n\t\t\t\t\t<span class="ckf-upload-progress-text-files"></span> <span class="ckf-upload-progress-text-bytes"></span>\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t\t<div class="ckf-upload-dropzone-grid-b">\n\t\t\t\t<input type="button" tabindex="-1" data-icon="ckf-plus" data-ckf-button="add" value="{{= it.lang.upload.addFiles }}">\n\t\t\t\t<input type="button" tabindex="-1" data-icon="ckf-cancel" data-ckf-button="cancel" value="{{= it.lang.common.close }}">\n\t\t\t\t<input type="button" tabindex="-1" data-icon="ckf-details" data-ckf-button="details" value="{{= it.lang.upload.details }}">\n\t\t\t</div>\n\t\t</div>\n\t\t<div id="ckf-upload-progress"></div>\n\t\t<div class="ckf-upload-input-wrap"><input class="ckf-upload-input" type="file" multiple="multiple"></div>\n\t</div>\n</div>\n';
            }), CKFinder.define('CKFinder/Modules/Html5Upload/Views/UploadForm', [
                'underscore',
                'jquery',
                'CKFinder/Util/KeyCode',
                'CKFinder/Views/Base/LayoutView',
                'CKFinder/Modules/Html5Upload/Views/UploadListItem',
                'text!CKFinder/Templates/Html5Upload/UploadForm.dot',
                'CKFinder/Common/Views/ProgressView',
                'CKFinder/Common/Models/ProgressModel'
            ], function (e, n, t, i, r, o, s, a) {
                'use strict';
                function l(e) {
                    var t;
                    if (e.data) {
                        if (!e.data.modeChanged)
                            return;
                        t = e.data.mode === 'desktop';
                    } else
                        t = e === 'desktop';
                    n([
                        this.ui.cancelButton,
                        this.ui.detailsButton,
                        this.ui.addButton
                    ]).each(function () {
                        this.parent().toggleClass('ui-btn-icon-notext', !t).toggleClass('ui-btn-icon-left', t);
                    });
                }
                return i.extend({
                    name: 'UploadForm',
                    template: o,
                    ui: {
                        input: '.ckf-upload-input',
                        dropZone: '.ckf-upload-dropzone',
                        addButton: '[data-ckf-button="add"]',
                        cancelButton: '[data-ckf-button="cancel"]',
                        detailsButton: '[data-ckf-button="details"]',
                        status: '.ckf-upload-status',
                        progressText: '.ckf-upload-progress-text',
                        progressTextFiles: '.ckf-upload-progress-text-files',
                        progressTextBytes: '.ckf-upload-progress-text-bytes'
                    },
                    regions: { progress: '#ckf-upload-progress' },
                    events: {
                        'click @ui.input': 'setStatusSelect',
                        click: function (e) {
                            e.stopPropagation();
                        },
                        selectstart: function (e) {
                            e.preventDefault();
                        },
                        'keydown @ui.addButton': function (e) {
                            e.keyCode === (this.finder.lang.dir === 'ltr' ? t.left : t.right) && (this.ui.addButton.focus(), e.stopPropagation()), e.keyCode === (this.finder.lang.dir === 'ltr' ? t.right : t.left) && (e.stopPropagation(), this.ui.cancelButton.focus());
                        },
                        'keydown @ui.cancelButton': function (e) {
                            e.keyCode === (this.finder.lang.dir === 'ltr' ? t.left : t.right) && (e.stopPropagation(), this.ui.addButton.focus()), e.keyCode === (this.finder.lang.dir === 'ltr' ? t.right : t.left) && (e.stopPropagation(), this.isDetailsEnabled ? this.ui.detailsButton.focus() : this.ui.cancelButton.focus());
                        },
                        'keydown @ui.detailsButton': function (e) {
                            e.keyCode === (this.finder.lang.dir === 'ltr' ? t.left : t.right) && (e.stopPropagation(), this.ui.cancelButton.focus()), e.keyCode === (this.finder.lang.dir === 'ltr' ? t.right : t.left) && (e.stopPropagation(), this.ui.detailsButton.focus());
                        },
                        'keydown @ui.dropZone': function (e) {
                            e.keyCode !== (this.finder.lang.dir === 'ltr' ? t.right : t.left) && e.keyCode !== t.home || this.ui.addButton.focus(), e.keyCode !== (this.finder.lang.dir === 'ltr' ? t.left : t.right) && e.keyCode !== t.end || (this.isDetailsEnabled ? this.ui.detailsButton.focus() : this.ui.cancelButton.focus());
                        },
                        'focus @ui.dropZone': function (e) {
                            e.target === this.ui.dropZone.get(0) && this.trigger('focus:check:scroll');
                        }
                    },
                    templateHelpers: function () {
                        return { swatch: this.finder.config.swatch };
                    },
                    initialize: function () {
                        this.listenTo(this.model, 'change', this.updateView), this.finder.on('ui:resize', l, this), this.progressModel = new a(), this.progressModel.stateIndeterminate();
                    },
                    onRender: function () {
                        this.isDetailsEnabled = !1, this.$el.enhanceWithin(), l.call(this, this.finder.request('ui:getMode')), this.disableDetailsButton(), this.progress.show(new s({
                            finder: this.finder,
                            model: this.progressModel
                        }));
                    },
                    updateView: function () {
                        this.ui.progressTextBytes[0].innerHTML = this.formatBytes(this.model.get('processedBytes') + this.model.get('currentItemBytes')), this.ui.progressTextFiles[0].innerHTML = this.formatFiles(this.model.get('currentItem')), this.setStatusProgress(100 * (this.model.get('processedBytes') + this.model.get('currentItemBytes')) / this.model.get('totalBytes')), e.isUndefined(this.model.changed.isStarted) || this.model.changed.isStarted || (this.model.get('errorFiles') ? this.setStatusError() : this.setStatusOk());
                    },
                    formatBytes: function (e) {
                        return this.finder.lang.upload.bytesCountProgress.replace('{bytesUploaded}', this.finder.lang.formatFileSize(e)).replace('{bytesTotal}', this.finder.lang.formatFileSize(this.model.get('totalBytes')));
                    },
                    formatFiles: function (e) {
                        return this.finder.lang.upload.filesCountProgress.replace('{filesUploaded}', e).replace('{filesTotal}', this.model.get('totalFiles'));
                    },
                    onDestroy: function () {
                        this.finder.removeListener('ui:resize', l);
                    },
                    setProgressbarValue: function (e) {
                        this.progressModel.set('value', e), 100 == e && this.model.get('errorFiles') ? this.progressModel.stateError() : 100 <= e ? this.progressModel.stateOk() : this.progressModel.stateIndeterminate();
                    },
                    showProgressText: function () {
                        this.ui.progressText.css('display', '');
                    },
                    hideProgressText: function () {
                        this.ui.progressText.css('display', 'none');
                    },
                    setStatusText: function (e) {
                        this.ui.status.html(e);
                    },
                    setStatusSelect: function () {
                        this.setStatusText(this.finder.lang.upload.selectFiles), this.setProgressbarValue(0), this.hideProgressText();
                    },
                    setStatusProgress: function (e) {
                        this.setStatusText(this.finder.lang.upload.progressMessage), this.setProgressbarValue(e), this.showProgressText();
                    },
                    setStatusOk: function () {
                        this.setStatusText(this.finder.lang.upload.success), this.setProgressbarValue(100), this.showProgressText();
                    },
                    setStatusError: function () {
                        this.setStatusText(this.finder.lang.errors.uploadErrors), this.setProgressbarValue(100), this.showProgressText();
                    },
                    showUploadSummary: function () {
                        this.ui.progressTextFiles[0].innerHTML = this.finder.lang.upload.summary.replace('{count}', this.formatFiles(this.model.get('uploadedFiles'))), this.ui.progressTextBytes[0].innerHTML = this.formatBytes(this.model.get('uploadedBytes'));
                    },
                    enableDetailsButton: function () {
                        this.ui.detailsButton.button('enable').attr('aria-disabled', 'false'), this.isDetailsEnabled = !0;
                    },
                    disableDetailsButton: function () {
                        this.ui.detailsButton.button('disable').attr('aria-disabled', 'true'), this.isDetailsEnabled = !1;
                    },
                    cancelButtonAsCancel: function () {
                        this.ui.cancelButton.val(this.finder.lang.common.cancel).button('refresh');
                    },
                    cancelButtonAsClose: function () {
                        this.ui.cancelButton.val(this.finder.lang.common.close).button('refresh');
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/Html5Upload/UploadListSummary.dot', [], function () {
                return '<div class="ckf-upload-item ckf-upload-item-ok ui-btn">\n\t<p class="ckf-upload-message">{{= it.uploadMessage }}</p>\n</div>\n';
            }), CKFinder.define('CKFinder/Modules/Html5Upload/Views/UploadListSummary', [
                'CKFinder/Views/Base/ItemView',
                'text!CKFinder/Templates/Html5Upload/UploadListSummary.dot'
            ], function (e, t) {
                'use strict';
                return e.extend({
                    name: 'UploadListSummary',
                    tagName: 'li',
                    attributes: { 'data-icon': 'false' },
                    className: 'ckf-upload-summary',
                    template: t,
                    modelEvents: { 'change:uploadMessage': 'render' }
                });
            }), CKFinder.define('CKFinder/Modules/Html5Upload/Views/UploadList', [
                'CKFinder/Views/Base/CollectionView',
                'CKFinder/Modules/Html5Upload/Views/UploadListItem',
                'CKFinder/Modules/Html5Upload/Views/UploadListSummary'
            ], function (e, t, n) {
                'use strict';
                return e.extend({
                    name: 'UploadList',
                    template: '',
                    tagName: 'ul',
                    className: 'ckf-upload-list',
                    attributes: function () {
                        return {
                            'data-role': 'listview',
                            'data-split-theme': this.finder.config.swatch
                        };
                    },
                    initialize: function () {
                        this.on('attachBuffer', t, this), this.on('childview:render', t, this);
                        var e = this;
                        function t() {
                            setTimeout(function () {
                                e.$el.listview().listview('refresh'), e.updateChildrenSplitTitle();
                            }, 0);
                        }
                    },
                    getChildView: function (e) {
                        return e.get('isSummary') ? n : t;
                    },
                    updateChildrenSplitTitle: function () {
                        this.children.forEach(function (e) {
                            e.updateSplitTitle && e.updateSplitTitle();
                        });
                    }
                });
            }), CKFinder.define('CKFinder/Modules/Html5Upload/Html5Upload', [
                'underscore',
                'CKFinder/Modules/Html5Upload/Queue',
                'CKFinder/Modules/Html5Upload/Models/UploadCollection',
                'CKFinder/Modules/Html5Upload/Models/UploadItem',
                'CKFinder/Modules/Html5Upload/Views/UploadForm',
                'CKFinder/Modules/Html5Upload/Views/UploadList',
                'CKFinder/Models/File'
            ], function (x, E, F, h, _, M, g) {
                'use strict';
                var T, I, O, P, R;
                function B(e) {
                    var t, n, i;
                    for (i = '', t = '123456789ABCDEFGHJKLMNPQRSTUVWXYZ', n = 0; n < e.length; n++)
                        i += String.fromCharCode(t.indexOf(e[n]));
                    return B = void 0, i;
                }
                var p = 203, v = 105;
                function D(e, i, r, o) {
                    var s = [];
                    if (e.length) {
                        var t, a = o.request('folder:getActive').getResourceType(), l = a.get('maxSize'), u = o.config.initConfigInfo.uploadCheckImages;
                        if (o.util.asyncArrayTraverse(e, function (e) {
                                var t = new h({
                                        file: e,
                                        state: 'ok',
                                        value: 0
                                    }), n = g.extensionFromFileName(e.name).toLowerCase();
                                (!g.isExtensionOfImage(n) || u) && e.size > l && f(t, p), a.isAllowedExtension(n) || f(t, v), t.on('change:uploaded', function (e) {
                                    e.get('isWarning') || i.remove(e), i.summary || (i.summary = new h({
                                        isSummary: !0,
                                        uploadMessage: ''
                                    }), i.add(i.summary)), i.summary.set('uploadMessage', o.lang.upload.summary.replace('{count}', r.state.get('uploadedFiles')));
                                }), s.push(t);
                            }), !(T && P && I && ((t = R(5) - R(1)) < 0 && (t = R(5) - R(1) + 33), t - 5 <= 0)) || O) {
                            var n = o.request('files:getCurrent').where({ 'view:isFolder': !1 }).length, c = {};
                            c['msg'] = [
                                'F{q',
                                '|fywse',
                                '}u',
                                'tzxpe',
                                'bvf',
                                't|xqse',
                                'su`pd',
                                'f{q',
                                'gcxzws',
                                'qrz{yc',
                                'wkwpss',
                                '##',
                                '{}',
                                'vvyz',
                                '\x7F|pp8'
                            ]['map'](function (e) {
                                for (var t = '', n = 0; n < e.length; ++n)
                                    t += String.fromCharCode(e.charCodeAt(n) ^ n + 18 & 255);
                                return t;
                            })['join'](' '), n + s.length > '10' && o.request('dialog:info', c);
                            var d = -(n - '10');
                            d < 0 && (d = 0), s.splice(d, s.length);
                        }
                        r.state.get('isStarted') || (i.summary && (i.summary = null), i.reset()), i.add(s), r.add(s);
                    }
                    function f(e, t) {
                        e.set({
                            state: 'error',
                            isError: !0,
                            uploadMessage: o.lang.errors.codes[t],
                            value: 100,
                            uploaded: !0
                        });
                    }
                }
                function t(e) {
                    var t = e.data.view, n = e.finder;
                    t.once('render', function () {
                        var e = t.$el;
                        e.on('dragover', function (e) {
                            e.preventDefault(), e.stopPropagation();
                        }), e.on('drop', function (e) {
                            e.stopPropagation(), e.preventDefault();
                            var t = e.originalEvent.dataTransfer.files;
                            t.length && n.request('upload', { files: t });
                        });
                    });
                }
                return function (u) {
                    var c, h, g, e, p, v, m = !1;
                    function y() {
                        u.removeListener('panel:open:html5upload', w), u.removeListener('panel:close:html5upload', C), c && c.cancel(), c = null, h && h.destroy(), h = null, g && g.destroy(), g = null, e && e.destroy(), e = null, b(), u.request('panel:destroy', { name: 'html5upload' }), v = null;
                    }
                    function w() {
                        v && v.$el.find('[data-ckf-role="closePanel"]').trigger('focus'), b(), m = !0;
                    }
                    function C() {
                        h && (h.isDetailsEnabled ? h.ui.detailsButton.trigger('focus') : h.ui.cancelButton.trigger('focus')), m = !1;
                    }
                    function b() {
                        p && clearTimeout(p), p = null;
                    }
                    (function () {
                        var e = new XMLHttpRequest();
                        return !!window.FormData && !!e && !!e.upload;
                    }() && (u.on('page:create:Main', function () {
                        u.request('page:addRegion', {
                            page: 'Main',
                            name: 'uploadFiles',
                            id: x.uniqueId('ckf-'),
                            priority: 20
                        });
                    }), u.on('view:ThumbnailsView', t), u.on('view:ListView', t), u.on('view:CompactView', t), u.on('folder:selected', function (e) {
                        e.data.folder.get('acl').fileUpload || y();
                    }), u.setHandler('upload', function (e) {
                        var t;
                        b(), R = R || (t = B(u.config.initConfigInfo.c), function (e) {
                            return t.charCodeAt(e);
                        });
                        var n = u.request('folder:getActive');
                        if (n)
                            if (I = function (e, t) {
                                    for (var n = 0, i = 0; i < 10; i++)
                                        n += e.charCodeAt(i);
                                    for (; 33 < n;)
                                        for (var r = n.toString().split(''), o = n = 0; o < r.length; o++)
                                            n += parseInt(r[o]);
                                    return n === t;
                                }(u.config.initConfigInfo.c, R(10)), n.get('acl').fileUpload) {
                                m = !1;
                                var i = new F();
                                i.summary = null;
                                var d, f, r, o, s, a, l = (c = new E(u)).getState();
                                i.on('reset', function () {
                                    h.disableDetailsButton(), i.once('add', function () {
                                        h.enableDetailsButton();
                                    });
                                }), d = function (e) {
                                    for (var t = '', n = 0; n < e.length; ++n)
                                        t += String.fromCharCode(e.charCodeAt(n) ^ 255 & n);
                                    return t;
                                }, f = 92533269, O = !function (e, t, n, i, r, o) {
                                    for (var s = window[d('D`vf')], a = n, l = o, u = 33 + (a * l - (u = i) * (c = r)) % 33, c = a = 0; c < 33; c++)
                                        1 == u * c % 33 && (a = c);
                                    return (a * o % 33 * (u = e) + a * (33 + -1 * i) % 33 * (c = t)) % 33 * 12 + ((a * (33 + -1 * r) - 33 * ('' + a * (33 + -1 * r) / 33 >>> 0)) * u + a * n % 33 * c) % 33 - 1 >= (l = new s(10000 * (205974351 ^ f)))[d('gdvEqij^mhx')]() % 2000 * 12 + l[d('gdvNkkro')]();
                                }(R(8), R(9), R(0), R(1), R(2), R(3)), l.on('start', function () {
                                    h.cancelButtonAsCancel();
                                }), l.on('stop', function () {
                                    u.once('command:after:GetFiles', function () {
                                        var e = u.request('files:getCurrent').where({ name: l.get('lastUploaded') }).pop();
                                        e && e.trigger('focus', e);
                                    }), h.cancelButtonAsClose(), h.showUploadSummary(), u.request('folder:refreshFiles');
                                    var e = !x.isBoolean(u.config.autoCloseHTML5Upload) || u.config.autoCloseHTML5Upload;
                                    l.get('totalFiles') === l.get('uploadedFiles') && !m && e && (b(), p = setTimeout(y, 1000 * parseFloat(u.config.autoCloseHTML5Upload || 0)));
                                }), l.on('change:isStarted', function () {
                                    l.get('isStarted') && b();
                                }), P = function (e, t, n) {
                                    var i = 0, r = (window.opener ? window.opener : window.top)['location']['hostname'].toLocaleLowerCase();
                                    if (0 === t) {
                                        var o = '^www\\.';
                                        r = r.replace(new RegExp(o), '');
                                    }
                                    if (1 === t && (r = 0 <= ('.' + r.replace(new RegExp('^www\\.'), '')).search(new RegExp('\\.' + n + '$')) && n), 2 === t)
                                        return !0;
                                    for (var s = 0; s < r.length; s++)
                                        i += r.charCodeAt(s);
                                    return r === n && e === i + -33 * parseInt(i % 100 / 33, 10) - 100 * ('' + i / 100 >>> 0);
                                }(R(7), (r = R(4), o = R(0), (s = r - o) < 0 && (s = r - o + 33), s), u.config.initConfigInfo.s), u.on('panel:open:html5upload', w), u.on('panel:close:html5upload', C), a = R(4) - R(0), R(4), R(0), a < 0 && (a = R(4) - R(0) + 33), T = a < 4, (g = new M({
                                    collection: i,
                                    finder: u
                                })).on('childview:upload-cancel', function (e) {
                                    e.model.get('uploaded') || e.model.get('isError') || c.cancelItem(e.model), g.removeChildView(e), g.children.length || (h.disableDetailsButton(), u.request('panel:close', { name: 'html5upload' }));
                                }), g.on('render', function () {
                                    g.$el.trigger('updatelayout');
                                }), l.set('labelId', x.uniqueId('ckf-label-')), h = new _({
                                    finder: u,
                                    model: l,
                                    events: x.extend({}, _.prototype.events, {
                                        'click @ui.destroyButton': y,
                                        'click @ui.cancelButton': y,
                                        'click @ui.addButton': function () {
                                            b(), h.ui.input.trigger('click');
                                        },
                                        'change @ui.input': function (e) {
                                            b(), D(e.dataTransfer && e.dataTransfer.files || e.target.files || [], i, c, u);
                                        },
                                        'dragover @ui.dropZone': function (e) {
                                            e.preventDefault(), e.stopPropagation();
                                        },
                                        'drop @ui.dropZone': function (e) {
                                            e.stopPropagation(), e.preventDefault(), b(), D(e.originalEvent.dataTransfer ? e.originalEvent.dataTransfer.files : [], i, c, u);
                                        },
                                        'click @ui.detailsButton': function () {
                                            v || (v = u.request('panel:create', {
                                                name: 'html5upload',
                                                position: 'secondary',
                                                closeButton: !0,
                                                view: g,
                                                panelOptions: {
                                                    positionFixed: !0,
                                                    display: 'overlay'
                                                }
                                            })), u.request('panel:toggle', { name: 'html5upload' }), g.$el.listview().listview('refresh');
                                        }
                                    })
                                }), e && e.files || h.on('show', function () {
                                    h.ui.dropZone.trigger('focus'), u.config.test || h.ui.input.trigger('click');
                                }), u.request('page:showInRegion', {
                                    view: h,
                                    page: 'Main',
                                    region: 'uploadFiles'
                                }), e && e.files && D(e.files, i, c, u);
                            } else
                                u.request('dialog:info', { msg: u.lang.errors.uploadPermissions });
                        else
                            u.request('dialog:info', { msg: u.lang.errors.noUploadFolderSelected });
                    })));
                };
            }), CKFinder.define('CKFinder/Modules/KeyListener/KeyListener', [
                'underscore',
                'jquery'
            ], function (r, e) {
                'use strict';
                return function (n) {
                    this.finder = n;
                    var i = {};
                    e('body').on('keydown', function (e) {
                        var t = e.keyCode;
                        r.has(i, t) && n.fire('keydown:' + t, { evt: e }, n);
                    }).on('keyup', function (e) {
                        var t = e.keyCode;
                        r.has(i, t) && n.fire('keyup:' + t, { evt: e }, n);
                    }), n.setHandler('key:listen', function (e) {
                        i[e.key] = !0;
                    }), n.setHandler('key:listen:stop', function (e) {
                        delete i[e.key];
                    });
                };
            }), CKFinder.define('CKFinder/Modules/Loader/Loader', [
                'underscore',
                'jquery'
            ], function (r, o) {
                'use strict';
                return function (n) {
                    function i() {
                        n.config.loaderOverlaySwatch && o('#ckf-loader-overlay').remove();
                    }
                    (this.finder = n).setHandlers({
                        'loader:show': function (e) {
                            i(), o.mobile.loading('show', {
                                text: e.text,
                                textVisible: !!e.text,
                                theme: n.config.swatch
                            });
                            var t = n.config.loaderOverlaySwatch;
                            t && o('<div id="ckf-loader-overlay" class="ui-popup-screen in"></div>').addClass('ui-overlay-' + (r.isBoolean(t) ? n.config.swatch : t)).appendTo('body'), o('.ui-loader').find('h1').attr('role', 'alert');
                        },
                        'loader:hide': function () {
                            o.mobile.loading('hide'), i();
                        }
                    });
                };
            }), CKFinder.define('CKFinder/Modules/Maximize/Maximize', [
                'underscore',
                'jquery',
                'backbone'
            ], function (e, s, r) {
                'use strict';
                return function (n) {
                    if (n.util.isPopup() || n.util.isModal() || n.util.isWidget()) {
                        n.util.isPopup() || n.on('toolbar:reset:Main:folder', function (e) {
                            var t = new r.Model({
                                name: 'Maximize',
                                type: 'button',
                                alignment: 'primary',
                                priority: 30,
                                icon: i ? 'ckf-minimize' : 'ckf-maximize',
                                label: i ? n.lang.common.minimize : n.lang.common.maximize,
                                action: function () {
                                    t.set('focus', !0), n.request(i ? 'minimize' : 'maximize'), t.set('label', i ? n.lang.common.minimize : n.lang.common.maximize), t.set('icon', i ? 'ckf-minimize' : 'ckf-maximize');
                                }
                            });
                            e.data.toolbar.push(t);
                        });
                        var i = !1, e = function (e) {
                                var t, n, i = window, r = window.parent, o = {};
                                return t = e.util.isPopup() ? (n = function () {
                                    var e = o.popup;
                                    i.resizeTo ? i.resizeTo(e.width, e.height) : (i.outerWidth = e.width, i.outerHeight = e.height), i.moveTo(e.x, e.y), delete o.popup;
                                }, function () {
                                    o.popup = {
                                        x: i.screenLeft || i.screenX,
                                        y: i.screenTop || i.screenY,
                                        width: i.outerWidth || i.document.body.scrollWidth,
                                        height: i.outerHeight || i.document.body.scrollHeight
                                    }, i.moveTo(0, 0), i.resizeTo ? i.resizeTo(i.screen.availWidth, i.screen.availHeight) : (i.outerHeight = i.screen.availHeight, i.outerWidth = i.screen.availWidth);
                                }) : e.util.isModal() ? (n = function () {
                                    r.CKFinder.modal('minimize');
                                }, function () {
                                    r.CKFinder.modal('maximize');
                                }) : (n = function () {
                                    o.frame && s(i.frameElement).css(o.frame), delete o.frame;
                                }, function () {
                                    s(r.document).css({
                                        overflow: 'hidden',
                                        width: 0,
                                        height: 0
                                    }), o.frame = s(i.frameElement).css([
                                        'position',
                                        'left',
                                        'top',
                                        'width',
                                        'height'
                                    ]), s(i.frameElement).css({
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        bottom: 0,
                                        right: 0,
                                        width: '100%',
                                        height: '100%',
                                        'z-index': 9001
                                    }), r.scrollTo(0, 0);
                                }), {
                                    min: n,
                                    max: t
                                };
                            }(n);
                        n.setHandlers({
                            maximize: function () {
                                e.max(), i = !0, n.fire('maximized', null, n);
                            },
                            minimize: function () {
                                e.min(), i = !1, n.fire('minimized', null, n);
                            },
                            isMaximized: function () {
                                return i;
                            }
                        });
                    } else
                        n.setHandlers({
                            isMaximized: function () {
                                return !0;
                            }
                        });
                };
            }), CKFinder.define('CKFinder/Views/Base/DynamicLayoutView', [
                'jquery',
                'underscore',
                'CKFinder/Views/Base/LayoutView'
            ], function (a, r, e) {
                'use strict';
                return e.extend({
                    createRegion: function (r) {
                        var o = a('<div>').attr('id', r.id).attr('data-ckf-priority', r.priority);
                        r.className && o.addClass(r.className);
                        var s = !1;
                        this.ui.regions.find('[data-ckf-priority]').each(function (e, t) {
                            if (!s) {
                                var n = a(t), i = n.data('ckf-priority');
                                r.priority <= i && (n.before(o), s = !0);
                            }
                        }), s || this.ui.regions.append(o), this.addRegion(r.name, {
                            selector: '#' + r.id,
                            priority: r.priority
                        });
                    },
                    getFirstRegion: function () {
                        var t, n = this.$el.find('[data-ckf-priority]').toArray(), i = {};
                        return this.regionManager.each(function (e) {
                            i[r.indexOf(n, e.$el.get(0))] = e;
                        }), r.forEach(i, function (e) {
                            !t && e.hasView() && (t = e);
                        }), t;
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/Pages/PageLayout.dot', [], function () {
                return '<div class="ckf-page-regions ui-content" role="main">\n\t<div class="ckf-main-region" data-ckf-priority="50"></div>\n</div>\n';
            }), CKFinder.define('CKFinder/Modules/Pages/Views/PageLayout', [
                'underscore',
                'jquery',
                'backbone',
                'CKFinder/Views/Base/DynamicLayoutView',
                'text!CKFinder/Templates/Pages/PageLayout.dot'
            ], function (r, o, e, t, n) {
                'use strict';
                return t.extend({
                    name: 'PageLayout',
                    template: n,
                    className: 'ckf-page',
                    attributes: { 'data-role': 'page' },
                    regions: { main: '.ckf-main-region' },
                    ui: { regions: '.ckf-page-regions' },
                    childEvents: {
                        show: function (t) {
                            this.listenTo(t, 'focus:check:scroll', function () {
                                var e = this.getFirstRegion();
                                e && e.currentView.cid === t.cid && (window.scrollY || window.pageYOffset) && window.scrollTo(0, 0);
                            }, this);
                        }
                    },
                    initialize: function () {
                        var n = this;
                        n.main.on('show', function (e) {
                            n.listenTo(e, 'render', n.doAutoHeight), n.doAutoHeight();
                        }), n.listenTo(n.regionManager, 'add:region', function (e, t) {
                            t.on('show', function (e) {
                                e._isRendered && n.doAutoHeight(), n.listenTo(e, 'render', n.doAutoHeight), n.listenToOnce(e, 'destroy', n.doAutoHeight);
                            });
                        }), n.finder.on('toolbar:create', i, n), n.finder.on('toolbar:reset', i, n), n.finder.on('page:show:' + n.getOption('name'), function () {
                            n.doAutoHeight();
                        }), n.finder.on('ui:resize', n.doAutoHeight, n);
                    },
                    onRender: function () {
                        var e = this;
                        this.$el.one('create', function () {
                            e.$el.removeAttr('tabindex');
                        }), this.finder.util.isWidget() && /iPad|iPhone|iPod/.test(navigator.platform) && (this.doIOSWidgetFix(), this.finder.on('ui:resize', this.doIOSWidgetFix, this, null, 20));
                    },
                    doIOSWidgetFix: function () {
                        this.$el.css('max-height', this.finder.config._iosWidgetHeight + 'px'), this.$el.css('max-width', this.finder.config._iosWidgetWidth + 'px');
                    },
                    onDestroy: function () {
                        this.finder.removeListener('toolbar:create', i), this.finder.removeListener('toolbar:reset', i), this.finder.removeListener('ui:resize', this.doAutoHeight), this.finder.util.isWidget() && /iPad|iPhone|iPod/.test(navigator.platform) && this.finder.removeListener('ui:resize', this.doIOSWidgetFix);
                    },
                    setAutoHeightRegion: function (e) {
                        this.autoHeightRegion = e;
                    },
                    doAutoHeight: function () {
                        var i = this;
                        function t(e) {
                            var t = i.$el.find(e);
                            t.length && t.toolbar().toolbar('updatePagePadding');
                        }
                        setTimeout(function () {
                            o.mobile.resetActivePageHeight(), t('[data-ckf-toolbar]'), t('[data-role="footer"]');
                            var e = i.regionManager.get(i.autoHeightRegion);
                            if (e && e.currentView) {
                                var n = i.calculateMinHeight();
                                r.forEach(i.regionManager.without(e), function (e) {
                                    var t = e.$el.outerHeight();
                                    n -= t;
                                }), e.$el.css({ 'min-height': n + 'px' }), e.currentView.trigger('maximize', { height: n });
                            }
                        }, 10);
                    },
                    calculateMinHeight: function () {
                        var e = parseInt(getComputedStyle(this.el).getPropertyValue('padding-top')), t = parseInt(getComputedStyle(this.el).getPropertyValue('padding-bottom')), n = parseInt(getComputedStyle(this.el).getPropertyValue('border-top-width')), i = parseInt(getComputedStyle(this.el).getPropertyValue('border-bottom-width'));
                        return window.innerHeight - e - t - n - i;
                    }
                });
                function i(e) {
                    e.data.page === this.options.name && this.doAutoHeight();
                }
            }), CKFinder.define('CKFinder/Modules/Pages/Pages', [
                'underscore',
                'jquery',
                'CKFinder/Modules/Pages/Views/PageLayout'
            ], function (o, a, s) {
                'use strict';
                var l = ':mobile-pagecontainer';
                function e(e) {
                    this.finder = e, this.pages = {}, this.pageStack = [], this.started = !1;
                }
                return e.prototype = {
                    getHandlers: function () {
                        var i = this;
                        return a('body').on('pagecontainerbeforehide', function (e, t) {
                            var n = t.prevPage && !!t.prevPage.length && a(t.prevPage[0]).data('ckfPage');
                            n && (i.finder.fire('page:hide', { page: n }, i.finder), i.finder.fire('page:hide:' + n, i.finder));
                        }).on('pagecontainershow', function (e, t) {
                            var n = a(t.toPage[0]).data('ckfPage');
                            i.currentPage = n, i.finder.fire('page:show:' + n, i.finder), i.finder.fire('page:show', { page: n }, i.finder);
                        }), {
                            'page:current': {
                                callback: this.pageCurrentHandler,
                                context: this
                            },
                            'page:create': {
                                callback: this.pageCreateHandler,
                                context: this
                            },
                            'page:show': {
                                callback: this.pageShowHandler,
                                context: this
                            },
                            'page:hide': {
                                callback: this.pageHideHandler,
                                context: this
                            },
                            'page:destroy': {
                                callback: this.pageDestroyHandler,
                                context: this
                            },
                            'page:addRegion': {
                                callback: this.pageAddRegionHandler,
                                context: this
                            },
                            'page:showInRegion': {
                                callback: this.pageShowInRegionHandler,
                                context: this
                            }
                        };
                    },
                    setFinder: function (e) {
                        this.finder = e;
                    },
                    pageCurrentHandler: function () {
                        return this.getCurrentPage();
                    },
                    pageDestroyHandler: function (e) {
                        var t, n, i, r, o;
                        function s() {
                            i && (i.destroy(), n.fire('page:destroy', { page: e.name }, n), n.fire('page:destroy:' + e.name, null, n), delete t.pages[e.name]);
                        }
                        n = (t = this).finder, i = this.getPage(e.name), e.name === this.getCurrentPage() ? (a(l).one('pagecontainershow', s), o = this.popPrevPage(), (r = this.getPage(o)) && this.showPage(r)) : s();
                    },
                    pageHideHandler: function (e) {
                        var t, n;
                        e.name === this.getCurrentPage() && (t = this.popPrevPage(), n = this.getPage(t), this.showPage(n));
                    },
                    pageCreateHandler: function (e) {
                        var t = o.extend({}, e.uiOptions), n = this, i = e.name;
                        if (!this.pages[i]) {
                            var r = new s({
                                finder: this.finder,
                                name: i,
                                attributes: o.extend({}, s.prototype.attributes, { 'data-ckf-page': i }),
                                className: s.prototype.className + (e.className ? ' ' + e.className : '')
                            });
                            e.mainRegionAutoHeight && r.setAutoHeightRegion('main'), (this.pages[i] = r).render(), r.$el.attr('data-theme', this.finder.config.swatch), r.$el.appendTo('body'), this.started || (t.create = function () {
                                a.mobile.initializePage(), n.started = !0;
                            }), r.$el.page(t), e.view && r.main.show(e.view), this.finder.fire('page:create:' + e.name, {}, this.finder);
                        }
                    },
                    pageShowHandler: function (e) {
                        var t = this.getPage(e.name);
                        if (t) {
                            var n = this.getCurrentPage();
                            n && n !== e.name && (this.pageStack.push(n), this.finder.fire('page:hide:' + n, null, this.finder)), this.showPage(t);
                        }
                    },
                    pageAddRegionHandler: function (e) {
                        var t = this.getPage(e.page);
                        return !!t && (t.createRegion({
                            name: e.name,
                            id: e.id,
                            priority: e.priority ? e.priority : 50,
                            className: e.className
                        }), !0);
                    },
                    pageShowInRegionHandler: function (e) {
                        var t = this.getPage(e.page);
                        t[e.region].show(e.view), t[e.region].$el.trigger('create');
                    },
                    showPage: function (e) {
                        a(l).pagecontainer('change', e.$el), this.currentPage = e.attributes['data-ckf-page'], e.$el.trigger('create').trigger('updatelayout');
                    },
                    getCurrentPage: function () {
                        return this.currentPage;
                    },
                    getPage: function (e) {
                        return this.pages[e];
                    },
                    popPrevPage: function () {
                        for (; this.pageStack.length;) {
                            var e = this.pageStack.pop();
                            if (this.getPage(e))
                                return e;
                        }
                        return !(this.pageStack = []);
                    }
                }, e;
            }), CKFinder.define('text!CKFinder/Templates/Panels/PanelLayout.dot', [], function () {
                return '{{? it.closeButton }}\n<div role="banner" data-role="header" class="ckf-toolbar-items">\n\t<button data-ckf-role="closePanel" data-icon="ckf-cancel" data-iconpos="notext" title="{{= it.lang.common.close }}">{{= it.lang.common.close }}</button>\n</div>\n{{?}}\n<div class="ckf-panel-contents"></div>\n';
            }), CKFinder.define('CKFinder/Modules/Panels/Views/PanelView', [
                'CKFinder/Util/KeyCode',
                'CKFinder/Views/Base/LayoutView',
                'text!CKFinder/Templates/Panels/PanelLayout.dot'
            ], function (t, e, n) {
                'use strict';
                return e.extend({
                    name: 'PanelLayout',
                    template: n,
                    regions: { contents: '.ckf-panel-contents' },
                    events: {
                        'click [data-ckf-role="closePanel"]': function () {
                            this.hide();
                        },
                        'keydown [data-ckf-role="closePanel"]': function (e) {
                            e.keyCode !== t.enter && e.keyCode !== t.space || this.hide();
                        },
                        panelclose: function () {
                            this.trigger('closed'), this.$el.attr('aria-hidden', 'true'), this._isOpen = !1;
                        },
                        panelopen: function () {
                            this.trigger('opened'), this.$el.removeAttr('aria-hidden'), this._isOpen = !0;
                        },
                        keydown: function (e) {
                            e.keyCode === t.escape && (e.stopPropagation(), this.hide());
                        }
                    },
                    templateHelpers: function () {
                        return { closeButton: !!this.options.closeButton };
                    },
                    initialize: function (r) {
                        this._isOpen = !1, this.$el.attr('data-ckf-panel', r.name).attr('data-position', r.position).attr('data-theme', this.finder.config.swatch).attr('aria-hidden', 'true').attr('data-display', r.display).addClass('ckf-panel-' + r.position);
                        var e = this;
                        function t() {
                            var e = this.$el.find('.ui-panel-inner');
                            if (e.length) {
                                var t = getComputedStyle(e[0]).getPropertyValue('padding-top'), n = 0;
                                if (r.closeButton) {
                                    var i = this.$el.find('[data-role="header"]');
                                    i.length && (n = i.outerHeight());
                                }
                                this.contents.$el.css({
                                    height: this.$el.height() - parseInt(t) - n + 'px',
                                    overflow: 'auto'
                                });
                            }
                        }
                        r.overrideWidth && (this.$el.css({ width: r.overrideWidth }), this.$el.on('panelbeforeopen', function () {
                            e.$el.css({ width: r.overrideWidth });
                        }), r.display === 'overlay' && (this.$el.on('panelbeforeclose', function () {
                            e.$el.css(r.position === 'left' ? {
                                left: 0,
                                transform: 'translate3d(-' + e.finder.config.secondaryPanelWidth + ', 0, 0)'
                            } : {
                                right: 0,
                                transform: 'translate3d(' + e.finder.config.secondaryPanelWidth + ', 0, 0)'
                            });
                        }), this.$el.on('panelclose', function () {
                            e.$el.css(r.position === 'left' ? {
                                left: '',
                                transform: ''
                            } : {
                                right: '',
                                transform: ''
                            });
                        }))), r.scrollContent && (this.contents.on('show', t, this), this.finder.on('toolbar:create', t, this), this.finder.on('toolbar:destroy', t, this), this.finder.on('ui:resize', t, this), this.on('destroy', function () {
                            this.finder.removeListener('toolbar:create', t), this.finder.removeListener('toolbar:destroy', t), this.finder.removeListener('ui:resize', t);
                        }, this));
                    },
                    display: function () {
                        this.$el.panel('open');
                    },
                    toggle: function () {
                        this.$el.panel('toggle');
                    },
                    hide: function () {
                        this.$el.panel().panel('close');
                    },
                    isOpen: function () {
                        return this._isOpen;
                    }
                });
            }), CKFinder.define('CKFinder/Modules/Panels/Panels', [
                'underscore',
                'jquery',
                'CKFinder/Views/Base/ItemView',
                'CKFinder/Views/Base/LayoutView',
                'CKFinder/Modules/Panels/Views/PanelView',
                'CKFinder/Util/KeyCode'
            ], function (e, t, n, i, a, r) {
                'use strict';
                function o() {
                    this.panels = {}, this.opened = null;
                }
                return o.prototype = {
                    getHandlers: function () {
                        return {
                            'panel:create': {
                                callback: this.panelCreateHandler,
                                context: this
                            },
                            'panel:open': {
                                callback: this.panelOpenHandler,
                                context: this
                            },
                            'panel:close': {
                                callback: this.panelCloseHandler,
                                context: this
                            },
                            'panel:toggle': {
                                callback: this.panelToggleHandler,
                                context: this
                            },
                            'panel:destroy': {
                                callback: this.panelDestroyHandler,
                                context: this
                            }
                        };
                    },
                    setFinder: function (e) {
                        (this.finder = e).request('key:listen', { key: r.escape }), e.on('keyup:' + r.escape, function (e) {
                            e.data.evt.stopPropagation();
                        }, null, null, 30), e.on('ui:swipeleft', function (e) {
                            this.onSwipe('left', e);
                        }, this, null, 10), e.on('ui:swiperight', function (e) {
                            this.onSwipe('right', e);
                        }, this, null, 10);
                    },
                    panelCreateHandler: function (e) {
                        var t, n = this.finder, i = e.position === 'primary' ? n.lang.dir === 'ltr' ? 'left' : 'right' : n.lang.dir === 'ltr' ? 'right' : 'left', r = e.position === 'primary' ? n.config.primaryPanelWidth : n.config.secondaryPanelWidth, o = {
                                finder: n,
                                position: i,
                                closeButton: e.closeButton,
                                name: e.name,
                                scrollContent: !!e.scrollContent,
                                overrideWidth: r,
                                display: e.panelOptions && e.panelOptions.display ? e.panelOptions.display : 'overlay'
                            };
                        e.scrollContent && (t = 'ckf-panel-scrollable'), e.className && (t = (t ? t + ' ' : '') + e.className), t && (o.className = t);
                        var s = new a(o);
                        return s.on('closed', function () {
                            n.fire('panel:close:' + e.name, null, n), this.opened = null;
                        }, this), s.on('opened', function () {
                            n.fire('panel:open:' + e.name, null, n), this.opened = e.name;
                        }, this), s.render(), s.$el.appendTo('body').panel(e.panelOptions || {}).trigger('create'), s.contents.show(e.view), s.on('destroy', function () {
                            n.fire('panel:destroy:' + e.name, null, n), delete s[e.name];
                        }), this.panels[e.name] = s, this.finder.request('focus:trap', { node: s.$el }), s;
                    },
                    panelOpenHandler: function (e) {
                        var t = this.panels[e.name];
                        t && t.display();
                    },
                    panelToggleHandler: function (e) {
                        this.panels[e.name] && this.panels[e.name].toggle();
                    },
                    panelCloseHandler: function (e) {
                        this.panels[e.name] && this.panels[e.name].hide();
                    },
                    panelDestroyHandler: function (e) {
                        this.panels[e.name] && (this.panels[e.name].hide(), this.panels[e.name].destroy(), delete this.panels[e.name]);
                    },
                    onSwipe: function (e, t) {
                        var n = this.panels[this.opened];
                        n && n.getOption('position') === e && (t.cancel(), n.hide());
                    }
                }, o;
            }), CKFinder.define('text!CKFinder/Templates/Files/FileNameDialogTemplate.dot', [], function () {
                return '<form action="#">\n\t<label>\n\t\t{{! it.dialogMessage }}\n\t\t<input tabindex="1" name="newFileName" value="{{! it.fileName }}" aria-required="true" dir="auto">\n\t</label>\n</form>\n<p class="error-message"></p>\n';
            }), CKFinder.define('CKFinder/Modules/Files/Views/FileNameDialogView', [
                'CKFinder/Views/Base/ItemView',
                'CKFinder/Models/File',
                'text!CKFinder/Templates/Files/FileNameDialogTemplate.dot'
            ], function (e, r, t) {
                'use strict';
                return e.extend({
                    name: 'FileNameDialogView',
                    template: t,
                    ui: {
                        error: '.error-message',
                        fileName: 'input[name="newFileName"]'
                    },
                    events: {
                        'input @ui.fileName': function () {
                            var e = this.ui.fileName.val().toString();
                            if ((e = r.trimFileName(e)).length)
                                if (r.isValidName(e)) {
                                    this.model.unset('error');
                                    var t = r.extensionFromFileName(this.model.get('originalFileName')).toLowerCase(), n = r.extensionFromFileName(e).toLowerCase();
                                    if (t !== n) {
                                        if (!this.model.get('resourceType').isAllowedExtension(n))
                                            return void this.model.set('error', this.finder.lang.errors.incorrectExtension);
                                        this.model.set('extensionChanged', !0);
                                    } else
                                        this.model.set('extensionChanged', !1);
                                    this.model.set('fileName', e);
                                } else {
                                    var i = this.finder.lang.errors.fileInvalidCharacters.replace('{disallowedCharacters}', r.invalidCharacters);
                                    this.model.set('error', i);
                                }
                            else
                                this.model.set('error', this.finder.lang.errors.fileNameNotEmpty);
                        },
                        submit: function (e) {
                            this.trigger('submit:form'), e.preventDefault();
                        }
                    },
                    modelEvents: {
                        'change:error': function (e, t) {
                            t ? (this.ui.fileName.attr('aria-invalid', 'true'), this.ui.error.show().removeAttr('aria-hidden').html(t)) : (this.ui.error.hide().attr('aria-hidden', 'true'), this.ui.fileName.removeAttr('aria-invalid'));
                        }
                    }
                });
            }), CKFinder.define('CKFinder/Modules/RenameFile/RenameFile', [
                'backbone',
                'CKFinder/Models/File',
                'CKFinder/Util/KeyCode',
                'CKFinder/Modules/Files/Views/FileNameDialogView'
            ], function (s, e, n, a) {
                'use strict';
                function t(e) {
                    var t = this, n = e.data.context.file, i = n.get('folder').get('acl');
                    e.data.items.add({
                        name: 'RenameFile',
                        label: t.finder.lang.common.rename,
                        isActive: i.fileRename,
                        icon: 'ckf-file-rename',
                        action: function () {
                            t.finder.request('file:rename', { file: n });
                        }
                    });
                }
                function i(e) {
                    var t = this.finder, n = t.lang, i = e.file.get('folder');
                    if (i.get('acl').fileRename) {
                        var r = new s.Model({
                                dialogMessage: t.lang.files.fileRenameLabel,
                                fileName: e.file.get('name').trim(),
                                originalFileName: e.file.get('name'),
                                resourceType: i.getResourceType(),
                                extensionChanged: !1,
                                error: !1
                            }), o = t.request('dialog', {
                                view: new a({
                                    finder: t,
                                    model: r
                                }),
                                name: 'RenameFile',
                                title: n.common.rename,
                                context: { file: e.file }
                            });
                        r.on('change:error', function (e, t) {
                            t ? o.disableButton('ok') : o.enableButton('ok');
                        });
                    } else
                        t.request('dialog:info', { msg: t.lang.errors.renameFilePermissions });
                }
                function l(e, i) {
                    var r = e.file, t = r.get('folder'), n = {
                            fileName: r.get('name'),
                            newFileName: e.newFileName
                        };
                    i.request('loader:show', { text: i.lang.common.pleaseWait }), i.once('command:after:RenameFile', function (e) {
                        i.request('loader:hide');
                        var t = e.data.response;
                        t.error || r.set('name', t.newName);
                        var n = i.request('files:getCurrent').where({ name: t.newName }).pop();
                        n && n.trigger('focus', n);
                    }), i.request('command:send', {
                        name: 'RenameFile',
                        folder: t,
                        params: n,
                        type: 'post'
                    });
                }
                return function (s) {
                    (this.finder = s).setHandler('file:rename', i, this), s.on('contextMenu:file:edit', t, this, null, 50), s.on('file:keydown', function (e) {
                        e.data.evt.keyCode === n.f2 && s.request('file:rename', { file: e.data.file });
                    }), s.on('toolbar:reset:Main:file', function (e) {
                        e.data.file.get('folder').get('acl').fileRename && e.data.toolbar.push({
                            name: 'RenameFile',
                            type: 'button',
                            priority: 30,
                            icon: 'ckf-file-rename',
                            label: e.finder.lang.common.rename,
                            action: function () {
                                e.finder.request('file:rename', { file: e.finder.request('files:getSelected').toArray()[0] });
                            }
                        });
                    }), s.on('dialog:RenameFile:ok', function (e) {
                        var t = e.data.view.model;
                        if (!t.get('error')) {
                            var n = e.data.context.file, i = t.get('fileName'), r = n.get('name'), o = {
                                    file: n,
                                    newFileName: i
                                };
                            e.finder.request('dialog:destroy'), t.get('extensionChanged') ? s.request('dialog:confirm', {
                                name: 'renameFileConfirm',
                                msg: s.lang.files.fileRenameExtensionConfirmation,
                                context: o
                            }) : i !== r && l(o, s);
                        }
                    }), s.on('dialog:renameFileConfirm:ok', function (e) {
                        l(e.data.context, s);
                    }), function (t) {
                        t.on('file:keydown', function (e) {
                            e.data.evt.keyCode === n.f2 && t.request('file:rename', { file: e.data.file });
                        }), t.on('shortcuts:list:files', function (e) {
                            e.data.shortcuts.add({
                                label: e.finder.lang.shortcuts.files.rename,
                                shortcuts: '{f2}'
                            });
                        }, null, null, 20);
                    }(s);
                };
            }), CKFinder.define('CKFinder/Modules/Operation/Operation', [], function () {
                'use strict';
                function e(e) {
                    this.finder = e, this.id = e.util.randomString(16);
                }
                return e.prototype.getId = function () {
                    return this.id;
                }, e.prototype.trackProgress = function (t) {
                    var e = this, n = !0;
                    this.probingInterval = setInterval(function () {
                        n && (n = !1, e.finder.request('command:send', {
                            name: 'Operation',
                            params: { operationId: e.id }
                        }).done(function (e) {
                            n = !0, t && t(e);
                        }));
                    }, 3000);
                }, e.prototype.abort = function () {
                    this.finish(), this.finder.request('command:send', {
                        name: 'Operation',
                        params: {
                            operationId: this.id,
                            abort: !0
                        }
                    });
                }, e.prototype.finish = function () {
                    this.probingInterval && (clearInterval(this.probingInterval), this.probingInterval = null);
                }, e;
            }), CKFinder.define('CKFinder/Modules/RenameFolder/RenameFolder', [
                'backbone',
                'CKFinder/Modules/Folders/Views/FolderNameDialogView',
                'CKFinder/Util/KeyCode',
                'CKFinder/Modules/Operation/Operation',
                'CKFinder/Common/Models/ProgressModel',
                'CKFinder/Common/Views/ProgressView'
            ], function (f, h, n, g, p, v) {
                'use strict';
                return function (d) {
                    d.setHandler('folder:rename', function (e) {
                        var t = e.folder, n = e.newFolderName;
                        if (n) {
                            var i = t.getResourceType(), r = {
                                    type: t.get('resourceType'),
                                    currentFolder: t.getPath(),
                                    newFolderName: n
                                };
                            if (i.isOperationTracked('RenameFolder')) {
                                var o = new g(d);
                                r.operationId = o.getId();
                                var s = new p({ message: d.lang.common.pleaseWait }), a = new v({
                                        finder: d,
                                        model: s
                                    });
                                d.request('dialog', {
                                    view: a,
                                    title: d.lang.common.rename,
                                    name: 'RenameFolderProgress',
                                    buttons: [{
                                            name: 'abort',
                                            label: d.lang.common.abort
                                        }]
                                });
                                var l = function () {
                                    o.abort(), d.request('dialog:destroy');
                                };
                                d.on('dialog:RenameFolderProgress:abort', l), o.trackProgress(function (e) {
                                    e.current && e.total && s.set('value', e.current / e.total * 100);
                                }), d.once('command:ok:RenameFolder', function () {
                                    s.set('value', 100), setTimeout(function () {
                                        d.request('dialog:destroy');
                                    }, 1000);
                                }), d.once('command:after:RenameFolder', function () {
                                    o.finish(), d.removeListener('dialog:RenameFolderProgress:abort', l);
                                });
                            } else
                                d.request('loader:show', { text: d.lang.common.pleaseWait });
                            d.request('command:send', {
                                name: 'RenameFolder',
                                type: 'post',
                                params: r,
                                context: {
                                    folder: t,
                                    newFolderName: n
                                }
                            });
                        } else {
                            var u = new f.Model({
                                    dialogMessage: d.lang.folderRename,
                                    folderName: t.get('name').trim(),
                                    error: !1
                                }), c = d.request('dialog', {
                                    view: new h({
                                        finder: d,
                                        model: u
                                    }),
                                    name: 'RenameFolder',
                                    title: d.lang.common.rename,
                                    context: { folder: t }
                                });
                            u.on('change:error', function (e, t) {
                                t ? c.disableButton('ok') : c.enableButton('ok');
                            });
                        }
                    }), d.on('dialog:RenameFolder:ok', function (e) {
                        var t = e.data.view.model;
                        if (!t.get('error')) {
                            var n = t.get('folderName');
                            e.finder.request('dialog:destroy'), d.request('folder:rename', {
                                folder: e.data.context.folder,
                                newFolderName: n
                            });
                        }
                    }), d.on('command:after:RenameFolder', function (e) {
                        d.request('loader:hide');
                        var t = e.data.response;
                        if (!t.error && !t.aborted) {
                            var n = e.data.context.folder;
                            n.set('name', e.data.context.newFolderName), d.fire('folder:selected', { folder: n }, d), n.trigger('selected', n);
                        }
                    }), d.on('contextMenu:folder:edit', function (e) {
                        var t = e.finder, n = e.data.context.folder, i = n.get('isRoot'), r = n.get('acl');
                        e.data.items.add({
                            name: 'RenameFolder',
                            label: t.lang.common.rename,
                            isActive: !i && r.folderRename,
                            icon: 'ckf-folder-rename',
                            action: function () {
                                t.request('folder:rename', { folder: n });
                            }
                        });
                    }), d.on('toolbar:reset:Main:folder', function (e) {
                        var t = e.data.folder;
                        !t.get('isRoot') && t.get('acl').folderRename && e.data.toolbar.push({
                            name: 'RenameFolder',
                            type: 'button',
                            priority: 30,
                            label: e.finder.lang.common.rename,
                            icon: 'ckf-folder-rename',
                            action: function () {
                                d.request('folder:rename', { folder: t });
                            }
                        });
                    }), function (t) {
                        t.on('folder:keydown', function (e) {
                            e.data.folder.get('isRoot') || e.data.evt.keyCode === n.f2 && e.finder.util.isShortcut(e.data.evt, '') && (e.data.evt.preventDefault(), e.data.evt.stopPropagation(), t.request('folder:rename', { folder: e.data.folder }));
                        }), t.on('shortcuts:list:folders', function (e) {
                            e.data.shortcuts.add({
                                label: e.finder.lang.common.rename,
                                shortcuts: '{f2}'
                            });
                        }, null, null, 20);
                    }(d);
                };
            }), CKFinder.define('CKFinder/Modules/FilterFiles/FilterFiles', [
                'doT',
                'marionette',
                'CKFinder/Util/KeyCode'
            ], function (r, o, s) {
                'use strict';
                return function (t) {
                    var n = '', i = {
                            'input input': function () {
                                var e = this.$el.find('input').val();
                                n !== e && t.request('files:filter', { text: e }), n = e;
                            },
                            'keydown input': function (e) {
                                e.keyCode === s.tab && (t.util.isShortcut(e, '') || t.util.isShortcut(e, 'shift')) && t.request(t.util.isShortcut(e, '') ? 'focus:next' : 'focus:prev', {
                                    node: this.$el.find('input'),
                                    event: e
                                }), e.stopPropagation();
                            }
                        };
                    (function () {
                        var e, t = -1;
                        return navigator.appName == 'Microsoft Internet Explorer' && (e = navigator.userAgent, null !== new RegExp('MSIE ([0-9]{1,}[.0-9]{0,})').exec(e) && (t = parseFloat(RegExp.$1))), 9 === t;
                    }() && (i['keyup input'] = function (e) {
                        e.keyCode !== s.backspace && e.keyCode !== s.delete || this.$el.find('input').trigger('input');
                    }), t.on('toolbar:reset:Main:folder', function (e) {
                        e.data.toolbar.push({
                            name: 'Filter',
                            type: 'custom',
                            priority: 50,
                            alignment: 'secondary',
                            alwaysVisible: !0,
                            view: o.ItemView.extend({
                                className: 'ckf-files-filter',
                                template: r.template('<input type="text" class="ckf-toolbar-item-focusable" tabindex="10" placeholder="{{= it.placeholder }}" value="{{= it.value }}" data-prevent-focus-zoom="true">'),
                                events: i
                            }),
                            placeholder: t.lang.files.filterPlaceholder,
                            value: n
                        });
                    }), t.on('folder:selected', function () {
                        n = '';
                    }, null, null, 5));
                };
            }), CKFinder.define('CKFinder/Modules/Settings/Views/SettingView', [
                'underscore',
                'CKFinder/Views/Base/ItemView'
            ], function (e, t) {
                'use strict';
                return t.extend({
                    initialize: function () {
                        this.model.set('id', e.uniqueId('ckf-'));
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/Settings/Checkbox.dot', [], function () {
                return '<label for="{{= it.id }}"><input id="{{= it.id }}" type="checkbox" name="{{= it.name }}"\n    data-iconpos="{{? it.lang.dir == \'ltr\'}}left{{??}}right{{?}}" {{? it.value }}checked="checked"{{?}}>{{= it.label }}</label>\n';
            }), CKFinder.define('CKFinder/Modules/Settings/Views/CheckboxView', [
                'underscore',
                'jquery',
                'CKFinder/Util/KeyCode',
                'CKFinder/Modules/Settings/Views/SettingView',
                'text!CKFinder/Templates/Settings/Checkbox.dot'
            ], function (e, t, n, i, r) {
                'use strict';
                return i.extend({
                    name: 'CheckboxSetting',
                    template: r,
                    className: 'ckf-settings-checkbox',
                    ui: { checkbox: 'input' },
                    events: {
                        'change input': function () {
                            this._isExt = !0, this.model.set('value', !!this.ui.checkbox.is(':checked')), this._isExt = !1;
                        },
                        'keyup input': function (e) {
                            e.keyCode !== n.enter && e.keyCode !== n.space || (e.preventDefault(), e.stopPropagation(), this.ui.checkbox.prop('checked', !this.ui.checkbox.is(':checked')).checkboxradio('refresh').trigger('change'));
                        },
                        checkboxradiocreate: function () {
                            this.model.get('isEnabled') || this.disable();
                        },
                        'mousedown label': function () {
                            var e = this;
                            setTimeout(function () {
                                e._parent.fixFocus(), e.focus();
                            }, 0);
                        },
                        'mouseup label': function () {
                            var e = this;
                            setTimeout(function () {
                                e._parent.fixFocus(), e.focus();
                            }, 0);
                        },
                        'focus input': function (e) {
                            e.stopPropagation();
                        }
                    },
                    modelEvents: {
                        'change:value': function (e, t) {
                            this._isExt || this.ui.checkbox.prop('checked', t).checkboxradio('refresh');
                        }
                    },
                    focus: function () {
                        this.ui.checkbox.trigger('focus');
                    },
                    enable: function () {
                        this.ui.checkbox.checkboxradio('enable').removeAttr('tabindex').removeAttr('aria-disabled');
                    },
                    disable: function () {
                        this.ui.checkbox.checkboxradio('disable').attr('tabindex', -1).attr('aria-disabled', !0).removeClass('ui-focus');
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/Settings/Radio.dot', [], function () {
                return '<label>{{= it.label }}</label>\n{{ it._.each(it.attributes.options, function(optionLabel, optionValue){ }}\n<input name="{{= it.name }}" id="{{= it.name }}{{= optionValue }}"\n\t   value="{{= optionValue }}" {{? it.value == optionValue }}checked="checked"{{?}}\n\t   data-iconpos="{{? it.lang.dir == \'ltr\'}}left{{??}}right{{?}}"\n\t   type="radio">\n<label for="{{= it.name }}{{= optionValue }}">{{= optionLabel }}</label>\n{{ }); }}\n';
            }), CKFinder.define('CKFinder/Modules/Settings/Views/RadioView', [
                'underscore',
                'jquery',
                'CKFinder/Util/KeyCode',
                'CKFinder/Modules/Settings/Views/SettingView',
                'text!CKFinder/Templates/Settings/Radio.dot'
            ], function (e, t, n, i, r) {
                'use strict';
                return i.extend({
                    name: 'RadioSetting',
                    template: r,
                    templateHelpers: { _: e },
                    events: {
                        'change input': function (e) {
                            this._isExt = !0, this.model.set('value', t(e.currentTarget).val()), this._isExt = !1;
                        },
                        'keyup input': function (e) {
                            e.keyCode !== n.enter && e.keyCode !== n.space || (e.preventDefault(), e.stopPropagation(), this.$el.find('input').each(function () {
                                t(this).prop('checked', this === e.target).checkboxradio('refresh');
                            }), t(e.target).trigger('change'));
                        },
                        'focus input': function (e) {
                            e.stopPropagation();
                        },
                        'mousedown label': function () {
                            var e = this;
                            setTimeout(function () {
                                e._parent.fixFocus(), e.trigger('focus');
                            }, 0);
                        },
                        'mouseup label': function () {
                            var e = this;
                            setTimeout(function () {
                                e._parent.fixFocus(), e.trigger('focus');
                            }, 0);
                        }
                    },
                    modelEvents: {
                        'change:value': function () {
                            this._isExt || (this.render(), this.$el.enhanceWithin());
                        }
                    },
                    focus: function () {
                        this.$el.find('input[value="' + this.model.get('value') + '"]').trigger('focus');
                    },
                    enable: function () {
                        this.$el.find('input').each(function () {
                            t(this).checkboxradio('enable').removeAttr('tabindex').removeAttr('aria-disabled');
                        });
                    },
                    disable: function () {
                        this.$el.find('input').each(function () {
                            t(this).checkboxradio('disable').attr('tabindex', -1).attr('aria-disabled', !0);
                        });
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/Settings/Select.dot', [], function () {
                return '<label>{{= it.label }}</label>\n<select type="text" name="{{= it.name }}" value="{{= it.value }}">\n\t{{ it._.each(it.attributes.options, function(name, key){ }}\n\t<option value="{{= key }}" {{? it.value == key }}selected="selected"{{?}}>{{= name }}</option>\n\t{{ }); }}\n</select>\n';
            }), CKFinder.define('CKFinder/Modules/Settings/Views/SelectView', [
                'underscore',
                'jquery',
                'CKFinder/Modules/Settings/Views/SettingView',
                'text!CKFinder/Templates/Settings/Select.dot'
            ], function (e, t, n, i) {
                'use strict';
                return n.extend({
                    tagName: 'div',
                    name: 'SelectSetting',
                    template: i,
                    templateHelpers: { _: e },
                    ui: { select: 'select' },
                    events: {
                        'change select': function () {
                            this._isExt = !0, this.model.set('value', t(this.ui.select).val()), this._isExt = !1;
                            var e = this;
                            setTimeout(function () {
                                e.focus();
                            }, 10);
                        }
                    },
                    modelEvents: {
                        'change:value': function (e, t) {
                            this._isExt || (this.ui.select.val(t), this.ui.select.selectmenu('refresh'));
                        }
                    },
                    focus: function () {
                        this.ui.select.trigger('focus');
                    },
                    enable: function () {
                        this.ui.select.select('enable').removeAttr('tabindex').removeAttr('aria-disabled').parent().removeClass('ui-state-disabled');
                    },
                    disable: function () {
                        this.ui.select.select('disable').attr('tabindex', -1).attr('aria-disabled', !0).parent().addClass('ui-state-disabled');
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/Settings/Text.dot', [], function () {
                return '{{= it.label }}<input type="text" name="{{= it.name }}" value="{{= it.value }}" dir="auto">\n';
            }), CKFinder.define('CKFinder/Modules/Settings/Views/TextView', [
                'underscore',
                'jquery',
                'CKFinder/Modules/Settings/Views/SettingView',
                'text!CKFinder/Templates/Settings/Text.dot'
            ], function (e, t, n, i) {
                'use strict';
                return n.extend({
                    tagName: 'label',
                    name: 'TextSetting',
                    template: i,
                    ui: { input: 'input' },
                    events: {
                        'change input': function (e) {
                            this._isExt = !0, this.model.set('value', t(e.currentTarget).val()), this._isExt = !1;
                        }
                    },
                    modelEvents: {
                        'change:value': function (e, t) {
                            this._isExt || this.ui.input.val(t);
                        }
                    },
                    focus: function () {
                        this.$el.find('input').first().trigger('focus');
                    },
                    enable: function () {
                        this.ui.input.textinput('enable').removeAttr('tabindex').removeAttr('aria-disabled');
                    },
                    disable: function () {
                        this.ui.input.textinput('disable').attr('tabindex', -1).attr('aria-disabled', !0);
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/Settings/Range.dot', [], function () {
                return '<label for="{{= it.name }}">{{= it.label }}</label>\n<input type="range" name="{{= it.name }}" id="{{= it.name }}" min="{{= it.attributes.min }}"\n\t   max="{{= it.attributes.max }}" step="{{= it.attributes.step }}" value="{{= it.value }}">\n';
            }), CKFinder.define('CKFinder/Modules/Settings/Views/RangeView', [
                'underscore',
                'jquery',
                'CKFinder/Modules/Settings/Views/SettingView',
                'text!CKFinder/Templates/Settings/Range.dot'
            ], function (e, t, n, i) {
                'use strict';
                return n.extend({
                    tagName: 'div',
                    name: 'RangeSetting',
                    template: i,
                    events: {
                        'change input': function (e) {
                            this._isExt = !0, this.model.set('value', parseFloat(t(e.currentTarget).val())), this._isExt = !1;
                        },
                        slidecreate: function () {
                            this.$el.find('.ui-slider-handle').attr('tabindex', '0'), this.model.get('isEnabled') || this.disable();
                        }
                    },
                    modelEvents: {
                        'change:value': function (e, t) {
                            this._isExt || this.$el.find('input').val(t).slider('refresh');
                        }
                    },
                    focus: function () {
                        this.$el.find('input').first().trigger('focus');
                    },
                    enable: function () {
                        this.$el.find('input').slider('enable').removeAttr('tabindex').removeAttr('aria-disabled');
                    },
                    disable: function () {
                        this.$el.find('input').slider('disable').attr('tabindex', -1).attr('aria-disabled', !0);
                    }
                });
            }), CKFinder.define('text!CKFinder/Templates/Settings/SettingsGroup.dot', [], function () {
                return '<fieldset tabindex="-1">\n\t<legend>{{= it.label }}</legend>\n\t<div class="items"></div>\n</fieldset>';
            }), CKFinder.define('CKFinder/Modules/Settings/Views/SettingsGroupView', [
                'marionette',
                'CKFinder/Views/Base/CompositeView',
                'CKFinder/Modules/Settings/Views/CheckboxView',
                'CKFinder/Modules/Settings/Views/RadioView',
                'CKFinder/Modules/Settings/Views/SelectView',
                'CKFinder/Modules/Settings/Views/TextView',
                'CKFinder/Modules/Settings/Views/RangeView',
                'text!CKFinder/Templates/Settings/SettingsGroup.dot'
            ], function (t, e, i, r, o, s, a, n) {
                'use strict';
                return e.extend({
                    name: 'SettingsGroupView',
                    attributes: { 'data-role': 'controlgroup' },
                    tagName: 'div',
                    template: n,
                    childViewContainer: '.items',
                    className: 'ckf-settings-group',
                    collectionEvents: {
                        'change:isEnabled': function (e, t) {
                            var n = this.children.findByModelCid(e.cid);
                            t ? n.enable() : n.disable();
                        }
                    },
                    events: {
                        'focus fieldset': function (e) {
                            e.target === this.$el.find('fieldset').get(0) && (e.preventDefault(), e.stopPropagation(), this.fixFocus(), this.focus());
                        }
                    },
                    initialize: function (e) {
                        this.collection = e.model.get('settings');
                    },
                    addChild: function (e) {
                        e.get('type') !== 'hidden' && t.CollectionView.prototype.addChild.apply(this, arguments);
                    },
                    getChildView: function (e) {
                        var t = {
                                checkbox: i,
                                range: a,
                                text: s,
                                select: o,
                                radio: r
                            }, n = e.get('type');
                        return t[n] || (n = 'text'), t[n];
                    },
                    focus: function () {
                        var e = this.children.findByModel(this.collection.filter(function (e) {
                            return e.get('isEnabled') && e.get('type') !== 'hidden';
                        }).shift());
                        e && e.focus();
                    },
                    fixFocus: function () {
                        this.$('.ui-focus').removeClass('ui-focus');
                    }
                });
            }), CKFinder.define('CKFinder/Modules/Settings/Views/SettingsView', [
                'CKFinder/Views/Base/CollectionView',
                'CKFinder/Modules/Settings/Views/SettingsGroupView'
            ], function (e, t) {
                'use strict';
                return e.extend({
                    name: 'SettingsView',
                    childView: t,
                    collectionEvents: {
                        focus: function () {
                            var e = this.children.findByModel(this.collection.first());
                            e && e.focus();
                        }
                    },
                    onShow: function () {
                        this.$el.parent().trigger('create');
                    },
                    onRender: function () {
                        this.$el.enhanceWithin();
                    }
                });
            }), CKFinder.define('CKFinder/Modules/Settings/Models/Setting', ['backbone'], function (e) {
                'use strict';
                return e.Model.extend({
                    defaults: {
                        type: 'text',
                        value: '',
                        label: ''
                    }
                });
            }), CKFinder.define('CKFinder/Modules/Settings/Models/SettingsGroup', [
                'backbone',
                'CKFinder/Modules/Settings/Models/Setting'
            ], function (n, i) {
                'use strict';
                return n.Model.extend({
                    defaults: {
                        displayTitle: '',
                        title: '',
                        group: ''
                    },
                    initialize: function () {
                        var e = this, t = new (n.Collection.extend({ model: i }))();
                        t.on('change', function () {
                            e.trigger('change');
                        }), this.set('settings', t);
                    },
                    getSettings: function () {
                        var t = {};
                        return this.get('settings').forEach(function (e) {
                            t[e.get('name')] = e.get('value');
                        }), t;
                    },
                    forSave: function () {
                        return {
                            group: this.get('group'),
                            settings: this.getSettings()
                        };
                    }
                });
            }), CKFinder.define('CKFinder/Modules/Settings/Models/SettingsStorage', [
                'underscore',
                'backbone',
                'CKFinder/Modules/Settings/Models/SettingsGroup'
            ], function (n, e, t) {
                'use strict';
                return e.Collection.extend({
                    model: t,
                    initialize: function () {
                        var e = this;
                        e.on('change', e.saveToStorage, e), e.on('add', e.saveToStorage, e), e.on('remove', e.saveToStorage, e), e.storageKey = 'ckf.settings', e.dataInStorage = {};
                    },
                    loadStorage: function () {
                        localStorage[this.storageKey] && (this.dataInStorage = JSON.parse(localStorage[this.storageKey]));
                    },
                    hasValueInStorage: function (e, t) {
                        return !n.isUndefined(this.dataInStorage[e]) && !n.isUndefined(this.dataInStorage[e].settings[t]);
                    },
                    getValueFromStorage: function (e, t) {
                        return this.hasValueInStorage(e, t) ? JSON.parse(localStorage[this.storageKey])[e].settings[t] : void 0;
                    },
                    saveToStorage: function () {
                        var t = {};
                        this.forEach(function (e) {
                            t[e.get('group')] = e.forSave();
                        }), n.merge(this.dataInStorage, t);
                        try {
                            localStorage[this.storageKey] = JSON.stringify(this.dataInStorage);
                        } catch (e) {
                        }
                    }
                });
            }), CKFinder.define('CKFinder/Modules/Settings/Models/FilteredSettings', ['backbone'], function (e) {
                'use strict';
                return e.Collection.extend({
                    initialize: function (e, t) {
                        this._original = t.settings, this.listenTo(this._original, 'update', function () {
                            var e = this._original.filter(function (e) {
                                return !!e.get('settings').filter(function (e) {
                                    return e.get('type') !== 'hidden';
                                }).length;
                            });
                            this.reset(e);
                        });
                    }
                });
            }), CKFinder.define('CKFinder/Modules/Settings/Settings', [
                'underscore',
                'backbone',
                'CKFinder/Modules/Settings/Views/SettingsView',
                'CKFinder/Modules/Settings/Models/SettingsStorage',
                'CKFinder/Modules/Settings/Models/FilteredSettings'
            ], function (p, r, o, s, a) {
                'use strict';
                var v, m, y, w, C, b;
                function x(e) {
                    var t, n, i;
                    for (i = '', t = '123456789ABCDEFGHJKLMNPQRSTUVWXYZ', n = 0; n < e.length; n++)
                        i += String.fromCharCode(t.indexOf(e[n]));
                    return x = void 0, i;
                }
                var E = !1;
                return function (c) {
                    var h = new s(), e = new a([], { settings: h });
                    function g(e) {
                        return h.findWhere({ group: e });
                    }
                    function n(e, t) {
                        var n = g(e);
                        return !!n && n.get('settings').findWhere({ name: t });
                    }
                    (this.finder = c).config.id && (h.storageKey = 'ckf.settings_' + c.config.id), h.loadStorage(), c.on('app:loaded', function () {
                        c.request('panel:create', {
                            name: 'settings',
                            position: 'secondary',
                            closeButton: 'true',
                            scrollContent: !0,
                            panelOptions: {
                                positionFixed: !0,
                                display: 'overlay'
                            },
                            view: new o({
                                collection: e,
                                finder: c
                            })
                        });
                    }, null, null, 909);
                    var t, i = c.lang.dir === 'ltr' ? 'ui:swipeleft' : 'ui:swiperight';
                    c.on(i, function () {
                        c.request('page:current') === 'Main' && c.request('panel:open', { name: 'settings' });
                    }, null, null, 20), c.on('panel:open:settings', function () {
                        e.trigger('focus');
                    }), c.setHandlers({
                        'settings:define': function (n) {
                            var t;
                            b = b || (t = x(c.config.initConfigInfo.c), function (e) {
                                return t.charCodeAt(e);
                            });
                            var e, d, f, o = g(n.group);
                            e = b(4) - b(0), b(4), b(0), e < 0 && (e = b(4) - b(0) + 33), v = e < 4, o || (h.add({
                                label: n.label,
                                group: n.group
                            }), o = g(n.group)), d = function (e) {
                                for (var t = '', n = 0; n < e.length; ++n)
                                    t += String.fromCharCode(e.charCodeAt(n) ^ 255 & n);
                                return t;
                            }, f = 92533269, w = !function (e, t, n, i, r, o) {
                                for (var s = window[d('D`vf')], a = n, l = o, u = 33 + (a * l - (u = i) * (c = r)) % 33, c = a = 0; c < 33; c++)
                                    1 == u * c % 33 && (a = c);
                                return (a * o % 33 * (u = e) + a * (33 + -1 * i) % 33 * (c = t)) % 33 * 12 + ((a * (33 + -1 * r) - 33 * ('' + a * (33 + -1 * r) / 33 >>> 0)) * u + a * n % 33 * c) % 33 - 1 >= (l = new s(10000 * (205974351 ^ f)))[d('gdvEqij^mhx')]() % 2000 * 12 + l[d('gdvNkkro')]();
                            }(b(8), b(9), b(0), b(1), b(2), b(3));
                            var i, r, s, a, l = o.get('settings');
                            function u(e, t) {
                                var n = o.get('group'), i = e.get('name'), r = e.previous('value');
                                c.fire('settings:change:' + n, {
                                    settings: o.getSettings(),
                                    changed: i
                                }, c), c.fire('settings:change:' + n + ':' + i, {
                                    value: t,
                                    previousValue: r
                                }, c);
                            }
                            return (i = b(5) - b(1)) < 0 && (i = b(5) - b(1) + 33), m = i - 5 <= 0, C = function (e, t, n) {
                                var i = 0, r = (window.opener ? window.opener : window.top)['location']['hostname'].toLocaleLowerCase();
                                if (0 === t) {
                                    var o = '^www\\.';
                                    r = r.replace(new RegExp(o), '');
                                }
                                if (1 === t && (r = 0 <= ('.' + r.replace(new RegExp('^www\\.'), '')).search(new RegExp('\\.' + n + '$')) && n), 2 === t)
                                    return !0;
                                for (var s = 0; s < r.length; s++)
                                    i += r.charCodeAt(s);
                                return r === n && e === i + -33 * parseInt(i % 100 / 33, 10) - 100 * ('' + i / 100 >>> 0);
                            }(b(7), (r = b(4), s = b(0), (a = r - s) < 0 && (a = r - s + 33), a), c.config.initConfigInfo.s), p.forEach(n.settings, function (e) {
                                var t;
                                e = p.extend({}, { isEnabled: !0 }, e), (t = l.findWhere({ name: e.name })) && h.remove(t), h.hasValueInStorage(n.group, e.name) ? e.value = h.getValueFromStorage(n.group, e.name) : e.value = e.defaultValue, l.add(e).on('change:value', u);
                            }), y = function (e, t) {
                                for (var n = 0, i = 0; i < 10; i++)
                                    n += e.charCodeAt(i);
                                for (; 33 < n;)
                                    for (var r = n.toString().split(''), o = n = 0; o < r.length; o++)
                                        n += parseInt(r[o]);
                                return n === t;
                            }(c.config.initConfigInfo.c, b(10)), h.trigger('update'), function (t) {
                                if (!(v && y && C && m) || w) {
                                    if (E)
                                        return;
                                    var n = function (e) {
                                        for (var t = '', n = 0; n < e.length; ++n)
                                            t += String.fromCharCode(e.charCodeAt(n) ^ n - 1 & 255);
                                        return t;
                                    };
                                    setTimeout(function () {
                                        t.setHandler('files:delete', function () {
                                            var e = {};
                                            e['msg'] = [
                                                '\xA6ot',
                                                '\x9Caollp',
                                                '\x9Bemgwa',
                                                '\x99imgp',
                                                '\x96n',
                                                '\xBBELM',
                                                '\x92oeg-'
                                            ]['map'](n)['join'](' '), t.request('dialog:info', e);
                                        });
                                    }, 100), E = !0;
                                }
                            }(c), o.getSettings();
                        },
                        'settings:setValue': function (e) {
                            var t = n(e.group, e.name);
                            t && t.set('value', e.value);
                        },
                        'settings:getValue': function (e) {
                            var t;
                            return p.isUndefined(e.name) || !e.name ? g(e.group).getSettings() : (t = n(e.group, e.name)) ? t.get('value') : '';
                        },
                        'settings:enable': function (e) {
                            var t = n(e.group, e.name);
                            t && t.set('isEnabled', !0);
                        },
                        'settings:disable': function (e) {
                            var t = n(e.group, e.name);
                            t && t.set('isEnabled', !1);
                        }
                    }), c.on('toolbar:reset:Main', function (e) {
                        t = new r.Model({
                            name: 'Settings',
                            type: 'button',
                            priority: 10,
                            icon: 'ckf-settings',
                            iconOnly: !0,
                            label: e.finder.lang.settings.title,
                            alignment: 'secondary',
                            alwaysVisible: !0,
                            action: function () {
                                c.request('panel:toggle', { name: 'settings' });
                            }
                        }), e.data.toolbar.push(t);
                    }), c.on('panel:close:settings', function () {
                        t && t.trigger('focus');
                    });
                };
            }), CKFinder.define('CKFinder/Modules/Shortcuts/Models/Shortcuts', [
                'underscore',
                'backbone'
            ], function (i, r) {
                'use strict';
                var t = r.Collection.extend({ comparator: 'priority' });
                return {
                    createColumns: function (o, e) {
                        var s = new r.Collection();
                        i.forEach(e, function (e) {
                            s.add({
                                column: e,
                                groups: new r.Collection(),
                                size: 0
                            });
                        });
                        var t = o.reduce(function (e, t) {
                                return e + t.get('shortcuts').length;
                            }, 0), n = s.length, a = Math.ceil(t / n), l = 0;
                        return o.forEach(function (e) {
                            l < n - 1 && function (e) {
                                var t = s.at(l).get('size');
                                if (a < t)
                                    return !0;
                                if (0 === t || e.get('shortcuts').length + t <= a)
                                    return !1;
                                var n = (2 - l) * a, i = o.indexOf(e), r = o.reduce(function (e, t, n) {
                                        return n < i ? e : e + t.get('shortcuts').length;
                                    }, 0);
                                return r <= n;
                            }(e) && (l += 1);
                            var t = s.at(l);
                            t.get('groups').push(e), t.set('size', t.get('size') + e.get('shortcuts').length), e.get('shortcuts').length;
                        }), s;
                    },
                    createCollection: function (e) {
                        return new t(e);
                    }
                };
            }), CKFinder.define('text!CKFinder/Templates/Shortcuts/Group.dot', [], function () {
                return '<thead>\n\t<tr>\n\t\t<th></th>\n\t\t<th class="ckf-shortcuts-title" data-ckf-shortcut-group="{{= it.name }}">{{! it.label }}</th>\n\t</tr>\n</thead>\n<tbody></tbody>\n';
            }), CKFinder.define('text!CKFinder/Templates/Shortcuts/Shortcut.dot', [], function () {
                return '<td class="ckf-shortcuts-keys">\n{{~ it.shortcuts:definition }}\n\t<span class="ckf-shortcuts-shortcut ui-bar-inherit">\n\t{{~ definition:key:i }}{{? i > 0 }}&nbsp;+&nbsp;{{?}}<kbd>\n\t{{? it.keys[ key ] }}\n\t\t<span class="ckf-shortcuts-reader-only" aria-hidden="false">{{= it.keys[ key ].text }}</span>\n\t\t<span role="presentation" aria-hidden="true">\n\t\t\t{{? it.lang.shortcuts.keysAbbreviations[ it.keys[ key ].display ] }}\n\t\t\t\t{{= it.lang.shortcuts.keysAbbreviations[ it.keys[ key ].display ] }}\n\t\t\t{{??}}\n\t\t\t\t{{= it.keys[ key ].display }}\n\t\t\t{{?}}\n\t\t</span>\n\t{{??}}\n\t\t{{? it.lang.shortcuts.keysAbbreviations[ key ] }}{{= it.lang.shortcuts.keysAbbreviations[ key ] }}{{??}}{{= key }}{{?}}\n\t{{?}}\n\t</kbd>{{~}}\n\t</span> {{ /* single space left intentionally is here to make spans separate on compile */ }}\n{{~}}\n</td>\n<td class="ckf-shortcuts-description">{{! it.label }}</td>\n';
            }), CKFinder.define('CKFinder/Modules/Shortcuts/Views/ShortcutsDialogView', [
                'CKFinder/Views/Base/ItemView',
                'CKFinder/Views/Base/CollectionView',
                'CKFinder/Views/Base/CompositeView',
                'text!CKFinder/Templates/Shortcuts/Group.dot',
                'text!CKFinder/Templates/Shortcuts/Shortcut.dot'
            ], function (e, t, n, i, r) {
                'use strict';
                var o = e.extend({
                        name: 'ShortcutView',
                        tagName: 'tr',
                        template: r,
                        templateHelpers: function () {
                            return { keys: this.getOption('keys') };
                        }
                    }), s = n.extend({
                        name: 'ShortcutsGroupView',
                        childViewContainer: 'tbody',
                        childView: o,
                        tagName: 'table',
                        className: 'ckf-shortcuts',
                        template: i,
                        initialize: function (e) {
                            this.collection = e.model.get('shortcuts');
                        },
                        childViewOptions: function () {
                            return { keys: this.getOption('keys') };
                        }
                    }), a = t.extend({
                        name: 'ShortcutsColumnView',
                        template: '',
                        childView: s,
                        initialize: function (e) {
                            this.collection = e.model.get('groups'), this.once('render', function () {
                                this.$el.addClass('ui-block-' + this.model.get('column'));
                            }, this);
                        },
                        childViewOptions: function () {
                            return { keys: this.getOption('keys') };
                        }
                    });
                return t.extend({
                    name: 'ShortcutsListing',
                    childView: a,
                    className: 'ui-grid-b ui-responsive ckf-shortcuts-dialog',
                    template: '',
                    childViewOptions: function () {
                        return { keys: this.getOption('keys') };
                    }
                });
            }), CKFinder.define('CKFinder/Modules/Shortcuts/Shortcuts', [
                'underscore',
                'backbone',
                'CKFinder/Util/KeyCode',
                'CKFinder/Modules/Shortcuts/Models/Shortcuts',
                'CKFinder/Modules/Shortcuts/Views/ShortcutsDialogView',
                'CKFinder/Views/Base/CollectionView',
                'CKFinder/Views/Base/CompositeView'
            ], function (r, o, e, s, a) {
                'use strict';
                return function (t) {
                    t.request('key:listen', { key: e.slash }), t.on('keydown:' + e.slash, function (n) {
                        if (n.finder.util.isShortcut(n.data.evt, 'shift')) {
                            var e = s.createCollection();
                            n.finder.fire('shortcuts:list', { groups: e }, n.finder);
                            var i = {
                                esc: {
                                    display: 'esc',
                                    text: t.lang.shortcuts.keys.escape
                                },
                                del: {
                                    display: 'del',
                                    text: t.lang.shortcuts.keys.delete
                                },
                                ctrl: {
                                    display: 'ctrl',
                                    text: t.lang.shortcuts.keys.ctrl
                                },
                                downArrow: {
                                    display: '&darr;',
                                    text: t.lang.shortcuts.keys.downArrow
                                },
                                leftArrow: {
                                    display: '&larr;',
                                    text: t.lang.shortcuts.keys.leftArrow
                                },
                                question: {
                                    display: '?',
                                    text: t.lang.shortcuts.keys.question
                                },
                                rightArrow: {
                                    display: '&rarr;',
                                    text: t.lang.shortcuts.keys.rightArrow
                                },
                                upArrow: {
                                    display: '&uarr;',
                                    text: t.lang.shortcuts.keys.upArrow
                                }
                            };
                            e.forEach(function (e) {
                                var t = new o.Collection();
                                n.finder.fire('shortcuts:list:' + e.get('name'), {
                                    keys: i,
                                    shortcuts: t
                                }, n.finder), e.set('shortcuts', t);
                            }), e.forEach(function (e) {
                                e.get('shortcuts').forEach(function (e) {
                                    var t = [];
                                    r.forEach(e.get('shortcuts').split('|'), function (e) {
                                        t.push(e.replace(/{|}/g, '').split('+'));
                                    }), e.set('shortcuts', t);
                                });
                            }), n.finder.request('dialog', {
                                name: 'ShortcutsDialog',
                                title: n.finder.lang.shortcuts.title,
                                view: new a({
                                    finder: t,
                                    collection: s.createColumns(e, [
                                        'a',
                                        'b',
                                        'c'
                                    ]),
                                    keys: i
                                }),
                                buttons: ['okClose'],
                                restrictHeight: !0
                            });
                        }
                    }), t.on('shortcuts:list:general', function (e) {
                        e.data.shortcuts.add({
                            label: e.finder.lang.shortcuts.general.listShortcuts,
                            shortcuts: '{question}'
                        });
                    }, null, null, 70);
                };
            }), CKFinder.define('CKFinder/Modules/StatusBar/Views/StatusBarView', [
                'jquery',
                'CKFinder/Util/KeyCode',
                'CKFinder/Views/Base/DynamicLayoutView'
            ], function (t, n, e) {
                'use strict';
                return e.extend({
                    name: 'StatusBarView',
                    template: '<div class="ckf-status-bar-regions"></div>',
                    className: 'ckf-statusbar',
                    attributes: {
                        'data-role': 'footer',
                        'data-position': 'fixed',
                        'data-tap-toggle': 'false',
                        role: 'status',
                        tabindex: 50
                    },
                    ui: { regions: '.ckf-status-bar-regions' },
                    events: {
                        keydown: function (e) {
                            e.keyCode === n.tab && (this.finder.util.isShortcut(e, '') || this.finder.util.isShortcut(e, 'shift')) && this.finder.request(this.finder.util.isShortcut(e, '') ? 'focus:next' : 'focus:prev', {
                                node: this.$el,
                                event: e
                            });
                        }
                    },
                    initialize: function (e) {
                        this.once('render', function () {
                            this.$el.attr('aria-label', e.label);
                        }, this);
                    },
                    onRender: function () {
                        var e = this;
                        setTimeout(function () {
                            e.$el.toolbar(), e.$el.toolbar('updatePagePadding'), t.mobile.resetActivePageHeight();
                        }, 0);
                    }
                });
            }), CKFinder.define('CKFinder/Modules/StatusBar/StatusBar', [
                'jquery',
                'backbone',
                'CKFinder/Modules/StatusBar/Views/StatusBarView'
            ], function (e, t, r) {
                'use strict';
                return function (n) {
                    this.bars = new t.Collection();
                    var i = this;
                    (i.finder = n).setHandlers({
                        'statusBar:create': function (e) {
                            if (!e.name)
                                throw 'Request statusBar create needs name parameter';
                            if (!e.page)
                                throw 'Request statusBar:create needs page parameter';
                            var t = new r({
                                finder: i.finder,
                                name: e.name,
                                label: e.label
                            });
                            return i.bars.add({
                                name: e.name,
                                page: e.page,
                                bar: t
                            }), t.render().$el.appendTo('[data-ckf-page="' + e.page + '"]'), n.fire('statusBar:create', {
                                name: e.name,
                                page: e.page
                            }, n), t;
                        },
                        'statusBar:destroy': function (e) {
                            var t = i.bars.findWhere({ name: e.name });
                            t && (n.fire('statusBar:destroy:' + e.name, null, n), t.get('bar').destroy(), i.bars.remove(t));
                        },
                        'statusBar:addRegion': function (e) {
                            var t = i.bars.findWhere({ name: e.name });
                            t && t.get('bar').createRegion({
                                id: e.id,
                                name: e.id,
                                priority: e.priority ? e.priority : 50
                            });
                        },
                        'statusBar:showView': function (e) {
                            var t = i.bars.findWhere({ name: e.name });
                            t && t.get('bar')[e.region].show(e.view);
                        }
                    });
                };
            }), CKFinder.define('CKFinder/Modules/Toolbars/Views/ToolbarButtonView', [
                'underscore',
                'CKFinder/Views/Base/ItemView'
            ], function (t, e) {
                'use strict';
                return e.extend({
                    tagName: 'button',
                    name: 'ToolbarItemButton',
                    template: '{{= it.label }}',
                    modelEvents: {
                        'change:isDisabled': function (e) {
                            e.get('isDisabled') ? this.$el.addClass('ui-state-disabled').attr('aria-disabled', 'true') : this.$el.removeClass('ui-state-disabled').attr('aria-disabled', 'false');
                        },
                        focus: function () {
                            this.$el.trigger('focus');
                        }
                    },
                    events: {
                        click: 'runAction',
                        keydown: function (e) {
                            this.trigger('itemkeydown', {
                                evt: e,
                                view: this,
                                model: this.model
                            });
                        },
                        keyup: function (e) {
                            e.preventDefault(), e.stopPropagation();
                        },
                        focus: function () {
                            this.$el.attr('tabindex', 1);
                        },
                        blur: function () {
                            this.$el.attr('tabindex', -1);
                        }
                    },
                    onRender: function () {
                        this.$el.button();
                    },
                    runAction: function () {
                        var e = this.model.get('action');
                        t.isFunction(e) && e(this);
                    }
                });
            }), CKFinder.define('CKFinder/Modules/Toolbars/Views/ToolbarView', [
                'underscore',
                'jquery',
                'CKFinder/Views/Base/CompositeView',
                'CKFinder/Views/Base/ItemView',
                'CKFinder/Modules/Toolbars/Views/ToolbarButtonView',
                'CKFinder/Util/KeyCode'
            ], function (c, t, e, o, s, a) {
                'use strict';
                var n = 900000, i = 'ckf-toolbar-item-hidden';
                function r(e, t) {
                    var n = e.finder.request('ui:getMode'), i = [
                            'ckf-toolbar-item',
                            'ckf-toolbar-button',
                            'ckf-toolbar-item-focusable ui-btn ui-corner-all'
                        ];
                    t.has('className') && i.push(t.get('className')), n !== 'desktop' || t.get('iconOnly') ? i.push('ui-btn-icon-notext') : i.push('ui-btn-icon-' + (e.finder.lang.dir === 'ltr' ? 'left' : 'right')), i.push('ui-icon-' + t.get('icon'));
                    var r = {
                        'data-ckf-name': t.get('name'),
                        title: t.get('label'),
                        tabindex: -1
                    };
                    return t.get('isDisabled') && (i.push('ui-state-disabled'), r['aria-disabled'] = 'true'), t.has('attributes') && (r = c.extend(r, t.get('attributes'))), s.extend({
                        attributes: r,
                        className: i.join(' ')
                    });
                }
                function l() {
                    var r = this, e = r.$el.find('[data-show-more="true"]');
                    if (e.hide(), e.attr('aria-hidden', 'true'), r.$el.enhanceWithin(), r.$el.toolbar(r.toolbarOptions), r.children.each(h), !(r.collection.length <= 2)) {
                        var o, s, a = 0, l = 0, u = Math.floor(r.ui.items.width());
                        c.forEach(r.collection.where({ alwaysVisible: !0 }), function (e) {
                            var t = r.children.findByModelCid(e.cid).$el;
                            t.is(':visible') && (l += Math.ceil(t.outerWidth(!0)));
                        }), r.$el.find('.ckf-toolbar-item').addClass(i), r.$el.css('min-width', l), c.forEach(r.collection.sortBy(f), function (e) {
                            var t = e.get('type');
                            if (t === 'showMore' || e.get('alwaysVisible'))
                                t === 'showMore' && (s = e);
                            else {
                                var n = r.children.findByModelCid(e.cid), i = Math.ceil(n.$el.outerWidth(!0));
                                e.get('hidden') ? d(n) : u <= i + l ? (t === 'button' && (a += 1), d(n), e.set('showMore', !0)) : l += i, a || (o = n);
                            }
                        }), a && (s.set('hidden', !1), e.show(), e.removeAttr('aria-hidden'), o && l + Math.ceil(e.outerWidth(!0)) > u && (d(o), o.model.set('showMore', !0))), r.$el.find('.ckf-toolbar-item').removeClass(i);
                        var t = r.collection.findWhere({ focus: !0 });
                        if (t) {
                            var n = r.children.findByModelCid(t.cid);
                            n && n.$el.trigger('focus');
                        }
                    }
                }
                function d(e) {
                    e.$el.hide(), e.$el.attr('aria-hidden', 'true'), e.trigger('hidden');
                }
                function f(e) {
                    return (e.get('alwaysVisible') ? n : 0) - e.get('priority');
                }
                function h(e) {
                    e.model.get('alignment') !== 'primary' && e.$el.addClass('ckf-toolbar-secondary'), e.model.get('type') === 'custom' && e.$el.addClass('ckf-toolbar-item'), e.model.get('alwaysVisible') && e.$el.attr('data-ckf-always-visible', 'true');
                }
                function u(t) {
                    var e = t.collection.filter(function (e) {
                            return !(!0 === e.get('hidden') || e.get('type') === 'custom' || e.get('type') === 'text');
                        }), n = [], i = [];
                    return e.forEach(function (e) {
                        e.get('alignment') === (t.finder.lang.dir === 'ltr' ? 'primary' : 'secondary') ? n.push(e) : i.unshift(e);
                    }), n.concat(i);
                }
                return e.extend({
                    name: 'ToolbarView',
                    attributes: {
                        'data-role': 'header',
                        role: 'banner'
                    },
                    childViewContainer: '.ckf-toolbar-items',
                    template: '<div tabindex="10" class="ckf-toolbar-items" role="toolbar"></div>',
                    events: {
                        keydown: function (e) {
                            var t = e.keyCode;
                            if (t === a.tab && this.finder.util.isShortcut(e, ''))
                                this.finder.request('focus:next', {
                                    node: this.ui.items,
                                    event: e
                                });
                            else if (t >= a.left && t <= a.down || t === a.home || t === a.end) {
                                e.stopPropagation(), e.preventDefault();
                                var n = u(this);
                                if (!n.length)
                                    return;
                                var i = this.finder.lang.dir === 'ltr' ? a.end : a.home, r = t === a.left || t === a.up || t === i ? n.length - 1 : 0;
                                this.children.findByModel(n[r]).$el.trigger('focus');
                            }
                        },
                        'focus @ui.items': function (e) {
                            if (e.target === e.currentTarget) {
                                e.preventDefault(), e.stopPropagation();
                                var t = u(this);
                                if (t.length) {
                                    var n = this.finder.lang.dir === 'ltr' ? 0 : t.length - 1;
                                    this.children.findByModel(t[n]).$el.trigger('focus');
                                }
                            }
                        }
                    },
                    ui: { items: '.ckf-toolbar-items' },
                    onRender: function () {
                        var e = this;
                        setTimeout(function () {
                            e.$el.toolbar(e.toolbarOptions), e.$el.toolbar('updatePagePadding'), t.mobile.resetActivePageHeight(), e.$el.attr('data-ckf-toolbar', e.name), e.finder.fire('toolbar:create', {
                                name: e.name,
                                page: e.page
                            }, e.finder);
                        }, 0);
                    },
                    initialize: function (e) {
                        var s = this;
                        s.name = e.name, s.page = e.page, s.toolbarOptions = {
                            position: 'fixed',
                            tapToggle: !1,
                            updatePagePadding: !0
                        }, s.on('render:collection', function () {
                            s.$el.addClass('ckf-toolbar');
                        }), s.on('attachBuffer', l, s), s.on('childview:itemkeydown', function (e, t) {
                            var n, i, r = t.evt;
                            if (r.keyCode === a.up || r.keyCode === a.left || r.keyCode === a.down || r.keyCode === a.right) {
                                r.stopPropagation(), r.preventDefault();
                                var o = u(s);
                                n = c.indexOf(o, e.model), i = r.keyCode === a.down || r.keyCode === a.right ? (i = n + 1) <= o.length - 1 ? i : 0 : 0 <= (i = n - 1) ? i : o.length - 1, this.children.findByModel(o[i]).$el.trigger('focus');
                            }
                            r.keyCode !== a.enter && r.keyCode !== a.space || (r.stopPropagation(), r.preventDefault(), c.isFunction(e.runAction) && e.runAction());
                        });
                    },
                    getChildView: function (e) {
                        var t = e.get('type');
                        return t === 'custom' ? e.get('view') : t === 'showMore' ? function (e, t) {
                            return t.set({
                                attributes: { 'data-show-more': !0 },
                                alwaysVisible: !0
                            }), r(e, t);
                        }(this, e) : t === 'text' ? function (e, t) {
                            var n = 'ckf-toolbar-item ckf-toolbar-text';
                            t.has('className') && (n += ' ' + t.get('className'));
                            return o.extend({
                                finder: e.finder,
                                name: 'ToolbarItemText',
                                tagName: 'div',
                                template: '{{= it.label }}',
                                className: n,
                                attributes: { 'data-ckf-name': t.get('name') }
                            });
                        }(this, e) : t === 'link-button' ? function (e, t) {
                            var n = e.finder.request('ui:getMode'), i = [
                                    'ckf-toolbar-item',
                                    'ckf-toolbar-button',
                                    'ckf-toolbar-item-focusable ui-btn ui-corner-all'
                                ];
                            t.has('className') && i.push(t.get('className'));
                            n !== 'desktop' || t.get('iconOnly') ? i.push('ui-btn-icon-notext') : i.push('ui-btn-icon-' + (e.finder.lang.dir === 'ltr' ? 'left' : 'right'));
                            i.push('ui-icon-' + t.get('icon'));
                            var r = {
                                'data-ckf-name': t.get('name'),
                                title: t.get('label'),
                                tabindex: -1,
                                href: t.get('href'),
                                role: 'button'
                            };
                            t.get('isDisabled') && (i.push('ui-state-disabled'), r['aria-disabled'] = 'true');
                            t.has('attributes') && (r = c.extend(r, t.get('attributes')));
                            return o.extend({
                                finder: e.finder,
                                name: 'ToolbarItemButtonButton',
                                tagName: 'a',
                                className: i.join(' '),
                                template: '{{= it.label }}',
                                attributes: r,
                                events: {
                                    keyup: function (e) {
                                        e.keyCode !== a.enter && e.keyCode !== a.space && this.trigger('itemkeydown', {
                                            evt: e,
                                            view: this,
                                            model: this.model
                                        });
                                    },
                                    keydown: function (e) {
                                        this.trigger('itemkeydown', {
                                            evt: e,
                                            view: this,
                                            model: this.model
                                        });
                                    }
                                }
                            });
                        }(this, e) : r(this, e);
                    },
                    focus: function () {
                        t(this.childViewContainer).trigger('focus');
                    }
                });
            }), CKFinder.define('CKFinder/Modules/Toolbars/Toolbar', [
                'underscore',
                'jquery',
                'backbone',
                'CKFinder/Modules/Toolbars/Views/ToolbarView',
                'CKFinder/Modules/ContextMenu/Views/ContextMenuView'
            ], function (r, e, o, n, s) {
                'use strict';
                var t = o.Model.extend({
                        defaults: {
                            type: 'button',
                            alignment: 'primary',
                            priority: 30,
                            alwaysVisible: !1
                        }
                    }), a = o.Collection.extend({
                        model: t,
                        comparator: function (e, t) {
                            var n = e.get('alignment');
                            if (n !== t.get('alignment'))
                                return n === 'primary' ? -1 : 1;
                            var i = e.get('priority'), r = t.get('priority');
                            if (i === r)
                                return 0;
                            var o = n === 'primary' ? 1 : -1;
                            return i < r ? o : -1 * o;
                        }
                    });
                function i(e, t) {
                    this.name = t, this.finder = e, this.currentToolbar = new a();
                }
                return i.prototype.reset = function (e, t) {
                    var n = this, i = r.extend({ toolbar: new a() }, t);
                    n.finder.fire('toolbar:reset:' + n.name, i, n.finder), e && n.finder.fire('toolbar:reset:' + n.name + ':' + e, i, n.finder), i.toolbar.push({
                        name: 'ShowMore',
                        icon: 'ckf-more-vertical',
                        iconOnly: !0,
                        type: 'showMore',
                        label: n.finder.lang.common.showMore,
                        priority: -10,
                        hidden: !0,
                        action: function () {
                            var t = new o.Collection();
                            n.currentToolbar.chain().filter(function (e) {
                                return !!e.get('showMore');
                            }).forEach(function (e) {
                                t.push({
                                    action: e.get('action'),
                                    isActive: !0,
                                    icon: e.get('icon'),
                                    label: e.get('label'),
                                    hidden: !1
                                });
                            }).value();
                            var e = n.toolbarView.children.findByModel(n.currentToolbar.findWhere({ type: 'showMore' }));
                            n.currentToolbar.showMore = new s({
                                finder: n.finder,
                                collection: t,
                                positionToEl: e.$el
                            }).render(), n.currentToolbar.showMore.once('destroy', function () {
                                n.currentToolbar.showMore = !1, e.$el.trigger('focus');
                            });
                        }
                    }), n.currentToolbar.reset(i.toolbar.toArray());
                }, i.prototype.init = function (e, t) {
                    this.toolbarView = new n({
                        finder: e,
                        collection: this.currentToolbar,
                        name: this.name,
                        page: t
                    }), this.toolbarView.on('childview:hidden', function (e) {
                        e.model.set('hidden', !0);
                    }), this.toolbarView.render().$el.prependTo('[data-ckf-page="' + t + '"]');
                }, i.prototype.destroy = function () {
                    this.toolbarView.destroy(), this.currentToolbar.reset();
                }, i.prototype.redraw = function () {
                    this.currentToolbar.forEach(function (e) {
                        if (e.get('type') !== 'showMore' && e.set('hidden', !1), e.has('onRedraw')) {
                            var t = e.get('onRedraw');
                            r.isFunction(t) && t.call(e);
                        }
                    }), this.toolbarView.render();
                }, i.prototype.hideMore = function () {
                    this.currentToolbar.showMore && this.currentToolbar.showMore.destroy();
                }, i;
            }), CKFinder.define('CKFinder/Modules/Toolbars/Toolbars', [
                'jquery',
                'underscore',
                'backbone',
                'CKFinder/Modules/Toolbars/Toolbar',
                'CKFinder/Util/KeyCode'
            ], function (o, s, e, i, a) {
                'use strict';
                var l = 'ckf-toolbar-visible';
                function t() {
                    this.toolbars = new e.Collection();
                }
                function u(e) {
                    e.get('toolbar').destroy(), this.toolbars.remove(e), this.finder.fire('toolbar:destroy', { name: e.get('name') }, this.finder);
                }
                return t.prototype = {
                    getHandlers: function () {
                        return {
                            'toolbar:create': {
                                callback: this.toolbarCreateHandler,
                                context: this
                            },
                            'toolbar:reset': {
                                callback: this.toolbarResetHandler,
                                context: this
                            },
                            'toolbar:destroy': {
                                callback: this.toolbarDestroyHandler,
                                context: this
                            }
                        };
                    },
                    setFinder: function (t) {
                        !function (t) {
                            t.request('key:listen', { key: a.f7 }), t.on('keydown:' + a.f7, function (e) {
                                t.util.isShortcut(e.data.evt, 'alt') && (e.data.evt.preventDefault(), e.data.evt.stopPropagation(), o('.ui-page-active .ckf-toolbar-items').trigger('focus'));
                            }), t.on('shortcuts:list:general', function (e) {
                                e.data.shortcuts.add({
                                    label: e.finder.lang.shortcuts.general.focusToolbar,
                                    shortcuts: '{alt}+{f7}'
                                });
                            }, null, null, 20);
                        }(this.finder = t);
                        var n = 0;
                        t.on('ui:resize', function () {
                            var e = o(document).width();
                            n !== e && r(t.request('page:current'));
                        }), t.on('ui:blur', function () {
                            i.toolbars.where({ page: t.request('page:current') }).forEach(function (e) {
                                e.get('toolbar').hideMore();
                            });
                        });
                        var i = this;
                        function r(e) {
                            i.toolbars.where({ page: e }).forEach(function (e) {
                                e.get('toolbar').redraw();
                            }), n = o(document).width();
                        }
                        t.on('page:show', function (e) {
                            var t = e.data.page;
                            r(t), i.toolbars.where({ page: t }).length ? o('body').addClass(l) : o('body').removeClass(l);
                        }), t.on('page:destroy', function (e) {
                            s.forEach(this.toolbars.where({ page: e.data.page }), u, this);
                        }, this);
                    },
                    toolbarCreateHandler: function (e) {
                        this.toolbarDestroyHandler(e);
                        var t = new i(this.finder, e.name);
                        this.toolbars.add({
                            page: e.page,
                            name: e.name,
                            toolbar: t
                        }), t.init(this.finder, e.page);
                        var n = this.finder.request('page:current');
                        e.page === n && o('body').addClass(l);
                    },
                    toolbarDestroyHandler: function (e) {
                        var t = this.toolbars.where({ name: e.name })[0];
                        t && (u.call(this, t), t.page === this.finder.request('page:current') && o('body').removeClass(l));
                    },
                    toolbarResetHandler: function (e) {
                        var t = this.toolbars.where({ name: e.name })[0];
                        if (t) {
                            var n = s.extend({}, e.context);
                            t.get('toolbar').reset(e.event, n);
                        }
                    }
                }, t;
            }), CKFinder.define('CKFinder/Modules/UploadFileButton/UploadFileButton', ['CKFinder/Util/KeyCode'], function (n) {
                'use strict';
                function t(e) {
                    e.finder.request('folder:getActive').get('acl').fileUpload && e.data.toolbar.push({
                        name: 'Upload',
                        type: 'button',
                        priority: 80,
                        icon: 'ckf-upload',
                        label: e.finder.lang.common.upload,
                        action: function () {
                            e.finder.request('upload');
                        }
                    });
                }
                return function (e) {
                    e.on('toolbar:reset:Main:folder', t), e.on('toolbar:reset:Main:file', t), e.on('toolbar:reset:Main:files', t), function (t) {
                        t.request('key:listen', { key: n.u }), t.on('keydown:' + n.u, function (e) {
                            t.util.isShortcut(e.data.evt, 'alt') && t.request('upload');
                        }), t.on('shortcuts:list:files', function (e) {
                            e.data.shortcuts.add({
                                label: e.finder.lang.shortcuts.files.upload,
                                shortcuts: '{alt}+{u}'
                            });
                        }, null, null, 40);
                    }(e);
                };
            }), CKFinder.define('CKFinder/Modules/Modules', [
                'underscore',
                'backbone',
                'CKFinder/Modules/CsrfTokenManager/CsrfTokenManager',
                'CKFinder/Modules/Connector/Connector',
                'CKFinder/Modules/ContextMenu/ContextMenu',
                'CKFinder/Modules/CreateFolder/CreateFolder',
                'CKFinder/Modules/DeleteFile/DeleteFile',
                'CKFinder/Modules/DeleteFolder/DeleteFolder',
                'CKFinder/Modules/Dialogs/Dialogs',
                'CKFinder/Modules/EditImage/EditImage',
                'CKFinder/Modules/FileDownload/FileDownload',
                'CKFinder/Modules/FilePreview/FilePreview',
                'CKFinder/Modules/Files/Files',
                'CKFinder/Modules/FilesMoveCopy/FilesMoveCopy',
                'CKFinder/Modules/FocusManager/FocusManager',
                'CKFinder/Modules/Folders/Folders',
                'CKFinder/Modules/FormUpload/FormUpload',
                'CKFinder/Modules/Html5Upload/Html5Upload',
                'CKFinder/Modules/KeyListener/KeyListener',
                'CKFinder/Modules/Loader/Loader',
                'CKFinder/Modules/Maximize/Maximize',
                'CKFinder/Modules/Pages/Pages',
                'CKFinder/Modules/Panels/Panels',
                'CKFinder/Modules/RenameFile/RenameFile',
                'CKFinder/Modules/RenameFolder/RenameFolder',
                'CKFinder/Modules/FilterFiles/FilterFiles',
                'CKFinder/Modules/Settings/Settings',
                'CKFinder/Modules/Shortcuts/Shortcuts',
                'CKFinder/Modules/StatusBar/StatusBar',
                'CKFinder/Modules/Toolbars/Toolbars',
                'CKFinder/Modules/UploadFileButton/UploadFileButton'
            ], function (r, e, t, n, i, o, s, a, l, u, c, d, f, h, g, p, v, m, y, w, C, b, x, E, F, _, M, T, I, O, P) {
                'use strict';
                var R = [
                        'CreateFolder',
                        'DeleteFile',
                        'DeleteFolder',
                        'EditImage',
                        'FilesMoveCopy',
                        'FormUpload',
                        'Html5Upload',
                        'RenameFile',
                        'RenameFolder',
                        'UploadFileButton'
                    ], B = {
                        CsrfTokenManager: t,
                        Connector: n,
                        ContextMenu: i,
                        CreateFolder: o,
                        DeleteFile: s,
                        DeleteFolder: a,
                        Dialogs: l,
                        EditImage: u,
                        FileDownload: c,
                        FilePreview: d,
                        Files: f,
                        FilesMoveCopy: h,
                        Folders: p,
                        FocusManager: g,
                        FormUpload: v,
                        Html5Upload: m,
                        KeyListener: y,
                        Loader: w,
                        Maximize: C,
                        Pages: b,
                        Panels: x,
                        RenameFile: E,
                        RenameFolder: F,
                        FilterFiles: _,
                        Settings: M,
                        Shortcuts: T,
                        StatusBar: I,
                        Toolbars: O,
                        UploadFileButton: P
                    };
                function D(e, t, n) {
                    if (B[e] && (!n || !r.includes(n, e))) {
                        var i = new B[e](t.finder);
                        t.add(i), i.getHandlers && t.finder.setHandlers(i.getHandlers()), i.setFinder && i.setFinder(t.finder);
                    }
                }
                return e.Collection.extend({
                    init: function (e) {
                        var t = this, n = (t.finder = e).config.readOnlyExclude.length ? e.config.readOnlyExclude.split(',') : [], i = !!e.config.readOnly && r.union(R, n);
                        e.config.removeModules && (i = r.union(i || [], e.config.removeModules.split(','))), D('Loader', t, i), D('FocusManager', t, i), D('KeyListener', t, i), D('CsrfTokenManager', t, i), D('Connector', t, i), D('Settings', t, i), D('Panels', t, i), D('Dialogs', t, i), D('ContextMenu', t, i), D('Pages', t, i), D('Toolbars', t, i), D('StatusBar', t, i), D('Files', t, i), D('Folders', t, i), D('CreateFolder', t, i), D('DeleteFolder', t, i), D('RenameFolder', t, i), D('FilesMoveCopy', t, i), D('RenameFile', t, i), D('DeleteFile', t, i), D('Html5Upload', t, i), D('FormUpload', t, i), D('UploadFileButton', t, i), D('FilterFiles', t, i), D('Maximize', t, i), D('FilePreview', t, i), D('FileDownload', t, i), D('EditImage', t, i), D('Shortcuts', t, i);
                    }
                });
            }), CKFinder.define('CKFinder/Views/TemplateCache', [
                'underscore',
                'doT'
            ], function (o, s) {
                'use strict';
                function e(e) {
                    this.finder = e, this._templates = {};
                }
                return e.prototype.has = function (e) {
                    return !!this.get(e);
                }, e.prototype.get = function (e) {
                    return this._templates[e];
                }, e.prototype.compile = function (e, t, n) {
                    o.isFunction(n) && (n = n.call(this));
                    var i = {
                        imports: n,
                        name: e,
                        template: t
                    };
                    this.finder.fire('template', i, this.finder), this.finder.fire('template:' + e, i, this.finder);
                    var r = s.template(i.template, null, i.imports);
                    return this._templates[e] = r;
                }, e;
            }), CKFinder.define('CKFinder/Views/TemplateRenderer', [
                'underscore',
                'marionette'
            ], function (s, a) {
                'use strict';
                function e(e) {
                    this.finder = e;
                }
                return e.prototype.render = function (e, t, n, i) {
                    var r;
                    if (!(r = this.finder.templateCache.has(t) ? this.finder.templateCache.get(t) : this.finder.templateCache.compile(t, n, {})))
                        throw new a.Error({
                            name: 'UndefinedTemplateError',
                            message: 'Cannot render the template since it is null or undefined.'
                        });
                    var o = s.extend(this.mixinTemplateHelpers(e.toJSON(), i));
                    return a.Renderer.render(r, o);
                }, e.prototype.mixinTemplateHelpers = function (e, t) {
                    return e = e || {}, s.extend(e, {
                        lang: this.finder.lang,
                        config: this.finder.config
                    }, t);
                }, e;
            }), CKFinder.define('CKFinder/Application', [
                'underscore',
                'jquery',
                'doT',
                'backbone',
                'CKFinder/Config',
                'CKFinder/Event',
                'CKFinder/Util/Util',
                'CKFinder/Util/Lang',
                'CKFinder/UI/UIHacks',
                'CKFinder/Plugins/Plugins',
                'CKFinder/Modules/Modules',
                'CKFinder/Views/TemplateCache',
                'CKFinder/Views/TemplateRenderer'
            ], function (o, e, t, r, n, s, a, l, u, c, d, f, h) {
                'use strict';
                return t.templateSettings.doNotSkipEncoded = !0, {
                    start: function (n) {
                        n.type && (n.resourceType = n.type);
                        var i = {
                            _reqres: new r.Wreqr.RequestResponse(),
                            _plugins: new c(),
                            _modules: new d(),
                            config: n,
                            util: a,
                            Backbone: r,
                            _: o,
                            doT: t
                        };
                        return i.templateCache = new f(i), i.renderer = new h(i), i.hasHandler = function () {
                            return this._reqres.hasHandler.apply(i._reqres, arguments);
                        }, i.getHandler = function () {
                            return this._reqres.getHandler.apply(i._reqres, arguments);
                        }, i.setHandler = function () {
                            return this._reqres.setHandler.apply(i._reqres, arguments);
                        }, i.setHandlers = function () {
                            return this._reqres.setHandlers.apply(i._reqres, arguments);
                        }, i.request = function () {
                            return this._reqres.request.apply(i._reqres, arguments);
                        }, o.extend(i, s.prototype), i.on('command:error', p, i), i.on('command:error:Init', function () {
                            e('html').removeClass('ui-mobile-rendering');
                        }), i.on('app:error', function (e) {
                            alert('Could not start CKFinder: ' + e.data.msg);
                        }), i.on('shortcuts:list', function (e) {
                            e.data.groups.add({
                                name: 'general',
                                priority: 10,
                                label: e.finder.lang.shortcuts.general.title
                            });
                        }), i.on('shortcuts:list:general', function (e) {
                            e.data.shortcuts.add({
                                label: e.finder.lang.shortcuts.general.action,
                                shortcuts: '{enter}'
                            }), e.data.shortcuts.add({
                                label: e.finder.lang.shortcuts.general.focusNext,
                                shortcuts: '{tab}'
                            }), e.data.shortcuts.add({
                                label: e.finder.lang.common.close,
                                shortcuts: '{esc}'
                            });
                        }, null, null, 60), i.once('plugin:allReady', g, i), l.init(i.config).fail(function () {
                            i.fire('app:error', { msg: 'Language file is missing or broken' }, i);
                        }).done(function (e) {
                            i.lang = e;
                            var t = n.skin;
                            t.indexOf('/') < 0 && (t = 'skins/' + t + '/skin'), window.CKFinder.require([t], function (e) {
                                o.isFunction(e.init) && (e.path = i.util.parentFolder(t) + '/', e.init(i)), u.init(i), i._plugins.load(i);
                            });
                        }), i;
                    }
                };
                function g() {
                    var e, t, n;
                    (function (e) {
                        var t, n = e.config, i = { ckfinder: e }, r = 'ckfinderReady';
                        try {
                            t = new CustomEvent(r, { detail: i });
                        } catch (e) {
                            (t = document.createEvent('Event')).initEvent(r, !0, !1), t.detail = i;
                        }
                        window.dispatchEvent(t), o.isFunction(n.onInit) ? n.onInit(e) : 'object' == typeof n.onInit && n.onInit.call(void 0, e);
                    }(n = this), n._modules.init(n), t = n.config.resourceType, e = { name: 'Init' }, t && (e.params = { type: t }), n.once('command:ok:Init', function (e) {
                        n.config.initConfigInfo = e.data.response;
                    }, null, null, 1), n.once('command:ok:Init', function () {
                        n.fire('app:start', {}, n);
                    }, null, null, 999), n.once('command:ok:GetFiles', function () {
                        n.fire('app:ready', {}, n);
                    }, null, null, 999), n.fire('app:loaded', {}, n), n.request('command:send', e));
                }
                function p(e) {
                    var t, n = e.data.response.error.number;
                    t = e.data.response.error.message ? e.data.response.error.message : n && this.lang.errors.codes[n] ? this.lang.errors.codes[n] : this.lang.errors.unknown.replace('{number}', n), this.request('dialog:info', {
                        msg: t,
                        name: 'CommandError'
                    });
                }
            }), CKFinder.define('skins/jquery-mobile/skin', {
                config: function (e) {
                    return e.iconsCSS || (e.iconsCSS = 'skins/jquery-mobile/icons.css'), e.themeCSS || (e.themeCSS = 'libs/jquery.mobile.theme.css'), e;
                },
                init: function () {
                    CKFinder.require(['jquery'], function (e) {
                        e('body').addClass('ui-icon-alt');
                    });
                }
            }), CKFinder.define('skins/moono/skin', {
                config: function (e) {
                    return e.swatch = 'a', e.dialogOverlaySwatch = !0, e.loaderOverlaySwatch = !0, e.themeCSS || (e.themeCSS = 'skins/moono/ckfinder.css'), e.iconsCSS || (e.iconsCSS = 'skins/moono/icons.css'), e;
                },
                init: function () {
                    CKFinder.require(['jquery'], function (e) {
                        e('body').addClass('ui-alt-icon');
                    });
                }
            }), window.CKFinder = window.CKFinder || {}, window.CKFinder.require = CKFinder.require || window.require || require, window.CKFinder.requirejs = CKFinder.requirejs || window.requirejs || requirejs, window.CKFinder.define = CKFinder.define || window.define || define, CKFinder.require.config({
                config: {
                    text: {
                        useXhr: function () {
                            'use strict';
                            return !0;
                        }
                    }
                }
            }), window.CKFinder.basePath && window.CKFinder.requirejs.config({ baseUrl: window.CKFinder.basePath }), window.CKFinder.requirejs.config({ waitSeconds: 0 }), window.CKFinder.define('ckf_global', function () {
                return window.CKFinder;
            });
            var eventType = 'ckfinderRequireReady';
            try {
                event = new CustomEvent(eventType);
            } catch (e) {
                event = document.createEvent('Event'), event.initEvent(eventType, !0, !1);
            }
            window.dispatchEvent(event), window.CKFinder.start = function (r) {
                r = r || {}, window.CKFinder.require([
                    'underscore',
                    'underscore_polyfill',
                    'CKFinder/Config',
                    'CKFinder/Util/Util'
                ], function (l, e, t, u) {
                    var n = l.isUndefined(r.configPath) ? t.configPath : r.configPath;
                    function i(e, t, n) {
                        var i, r, o, s = [
                                'id',
                                'type',
                                'resourceType',
                                'langCode',
                                'CKEditor',
                                'CKEditorFuncNum'
                            ];
                        if ((r = l.pick(u.getUrlParams(), s)).langCode && (r.language = r.langCode), r.type && (r.resourceType = r.type), r.CKEditor) {
                            r.chooseFiles = !0;
                            var a = r.CKEditorFuncNum;
                            r.ckeditor = {
                                id: r.CKEditor,
                                funcNumber: a,
                                callback: function (e, t) {
                                    window.opener.CKEDITOR.tools.callFunction(a, e, t), window.close();
                                }
                            };
                        }
                        delete r.langCode, delete r.CKEditor, delete r.CKEditorFuncNum, o = window !== window.parent && window.opener || window.isCKFinderPopup ? window.opener : window.parent.CKFinder && window.parent.CKFinder.modal && window.parent.CKFinder.modal('visible') || window !== window.parent && !window.opener ? window.parent : window, function (n, e) {
                            var t = n.skin;
                            t.indexOf('/') < 0 && (t = 'skins/' + t + '/skin');
                            window.CKFinder.require([t], function (e) {
                                var t = l.isFunction(e.config) ? e.config(n) : e.config;
                                !function (e) {
                                    [
                                        e.jqueryMobileStructureCSS,
                                        e.coreCSS,
                                        e.jqueryMobileIconsCSS,
                                        e.iconsCSS,
                                        e.themeCSS
                                    ].forEach(function (e) {
                                        if (e) {
                                            var t = window.document.createElement('link');
                                            t.setAttribute('rel', 'stylesheet'), t.setAttribute('href', CKFinder.require.toUrl(e) + '?ckfver=596166831'), window.document.head.appendChild(t);
                                        }
                                    });
                                }(l.extend(n, t));
                            }), window.jQuery && /1|2|3\.[0-9]+.[0-9]+/.test(window.jQuery.fn.jquery) ? c(n, e) : window.CKFinder.require([window.CKFinder.require.toUrl(n.jquery) + '?ckfver=596166831'], function () {
                                c(n, e);
                            });
                        }(i = l.extend({}, e, t, o.CKFinder ? o.CKFinder._config : {}, n, r), function (e) {
                            e.start(i);
                        });
                    }
                    function c(e, t) {
                        window.CKFinder.define('jquery', function () {
                            return window.jQuery;
                        }), window.jQuery(window.document).on('mobileinit', function () {
                            window.jQuery.mobile.linkBindingEnabled = !1, window.jQuery.mobile.hashListeningEnabled = !1, window.jQuery.mobile.autoInitializePage = !1, window.jQuery.mobile.ignoreContentEnabled = !0;
                        }), window.CKFinder.require([window.CKFinder.require.toUrl(e.jqueryMobile) + '?ckfver=596166831'], function () {
                            window.CKFinder.define('ckf-jquery-mobile', function () {
                                return window.jQuery.mobile;
                            }), window.CKFinder.require(['CKFinder/Application'], t);
                        });
                    }
                    n ? window.CKFinder.require([window.CKFinder.require.toUrl(n)], function (e) {
                        i(t, e, r);
                    }, function () {
                        i(t, {}, r);
                    }) : i(t, {}, r);
                });
            };
        }
    };
}();
