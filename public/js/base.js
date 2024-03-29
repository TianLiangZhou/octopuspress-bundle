"use strict";(()=>{var u=typeof globalThis<"u"&&globalThis||typeof self<"u"&&self||typeof global<"u"&&global||{},h={searchParams:"URLSearchParams"in u,iterable:"Symbol"in u&&"iterator"in Symbol,blob:"FileReader"in u&&"Blob"in u&&function(){try{return new Blob,!0}catch(e){return!1}}(),formData:"FormData"in u,arrayBuffer:"ArrayBuffer"in u};function R(e){return e&&DataView.prototype.isPrototypeOf(e)}h.arrayBuffer&&(v=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],x=ArrayBuffer.isView||function(e){return e&&v.indexOf(Object.prototype.toString.call(e))>-1});var v,x;function b(e){if(typeof e!="string"&&(e=String(e)),/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(e)||e==="")throw new TypeError('Invalid character in header field name: "'+e+'"');return e.toLowerCase()}function g(e){return typeof e!="string"&&(e=String(e)),e}function T(e){var t={next:function(){var r=e.shift();return{done:r===void 0,value:r}}};return h.iterable&&(t[Symbol.iterator]=function(){return t}),t}function a(e){this.map={},e instanceof a?e.forEach(function(t,r){this.append(r,t)},this):Array.isArray(e)?e.forEach(function(t){if(t.length!=2)throw new TypeError("Headers constructor: expected name/value pair to be length 2, found"+t.length);this.append(t[0],t[1])},this):e&&Object.getOwnPropertyNames(e).forEach(function(t){this.append(t,e[t])},this)}a.prototype.append=function(e,t){e=b(e),t=g(t);var r=this.map[e];this.map[e]=r?r+", "+t:t};a.prototype.delete=function(e){delete this.map[b(e)]};a.prototype.get=function(e){return e=b(e),this.has(e)?this.map[e]:null};a.prototype.has=function(e){return this.map.hasOwnProperty(b(e))};a.prototype.set=function(e,t){this.map[b(e)]=g(t)};a.prototype.forEach=function(e,t){for(var r in this.map)this.map.hasOwnProperty(r)&&e.call(t,this.map[r],r,this)};a.prototype.keys=function(){var e=[];return this.forEach(function(t,r){e.push(r)}),T(e)};a.prototype.values=function(){var e=[];return this.forEach(function(t){e.push(t)}),T(e)};a.prototype.entries=function(){var e=[];return this.forEach(function(t,r){e.push([r,t])}),T(e)};h.iterable&&(a.prototype[Symbol.iterator]=a.prototype.entries);function w(e){if(!e._noBody){if(e.bodyUsed)return Promise.reject(new TypeError("Already read"));e.bodyUsed=!0}}function E(e){return new Promise(function(t,r){e.onload=function(){t(e.result)},e.onerror=function(){r(e.error)}})}function U(e){var t=new FileReader,r=E(t);return t.readAsArrayBuffer(e),r}function I(e){var t=new FileReader,r=E(t),o=/charset=([A-Za-z0-9_-]+)/.exec(e.type),s=o?o[1]:"utf-8";return t.readAsText(e,s),r}function D(e){for(var t=new Uint8Array(e),r=new Array(t.length),o=0;o<t.length;o++)r[o]=String.fromCharCode(t[o]);return r.join("")}function A(e){if(e.slice)return e.slice(0);var t=new Uint8Array(e.byteLength);return t.set(new Uint8Array(e)),t.buffer}function B(){return this.bodyUsed=!1,this._initBody=function(e){this.bodyUsed=this.bodyUsed,this._bodyInit=e,e?typeof e=="string"?this._bodyText=e:h.blob&&Blob.prototype.isPrototypeOf(e)?this._bodyBlob=e:h.formData&&FormData.prototype.isPrototypeOf(e)?this._bodyFormData=e:h.searchParams&&URLSearchParams.prototype.isPrototypeOf(e)?this._bodyText=e.toString():h.arrayBuffer&&h.blob&&R(e)?(this._bodyArrayBuffer=A(e.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):h.arrayBuffer&&(ArrayBuffer.prototype.isPrototypeOf(e)||x(e))?this._bodyArrayBuffer=A(e):this._bodyText=e=Object.prototype.toString.call(e):(this._noBody=!0,this._bodyText=""),this.headers.get("content-type")||(typeof e=="string"?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):h.searchParams&&URLSearchParams.prototype.isPrototypeOf(e)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},h.blob&&(this.blob=function(){var e=w(this);if(e)return e;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))}),this.arrayBuffer=function(){if(this._bodyArrayBuffer){var e=w(this);return e||(ArrayBuffer.isView(this._bodyArrayBuffer)?Promise.resolve(this._bodyArrayBuffer.buffer.slice(this._bodyArrayBuffer.byteOffset,this._bodyArrayBuffer.byteOffset+this._bodyArrayBuffer.byteLength)):Promise.resolve(this._bodyArrayBuffer))}else{if(h.blob)return this.blob().then(U);throw new Error("could not read as ArrayBuffer")}},this.text=function(){var e=w(this);if(e)return e;if(this._bodyBlob)return I(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(D(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},h.formData&&(this.formData=function(){return this.text().then(S)}),this.json=function(){return this.text().then(JSON.parse)},this}var O=["CONNECT","DELETE","GET","HEAD","OPTIONS","PATCH","POST","PUT","TRACE"];function P(e){var t=e.toUpperCase();return O.indexOf(t)>-1?t:e}function m(e,t){if(!(this instanceof m))throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');t=t||{};var r=t.body;if(e instanceof m){if(e.bodyUsed)throw new TypeError("Already read");this.url=e.url,this.credentials=e.credentials,t.headers||(this.headers=new a(e.headers)),this.method=e.method,this.mode=e.mode,this.signal=e.signal,!r&&e._bodyInit!=null&&(r=e._bodyInit,e.bodyUsed=!0)}else this.url=String(e);if(this.credentials=t.credentials||this.credentials||"same-origin",(t.headers||!this.headers)&&(this.headers=new a(t.headers)),this.method=P(t.method||this.method||"GET"),this.mode=t.mode||this.mode||null,this.signal=t.signal||this.signal||function(){if("AbortController"in u){var n=new AbortController;return n.signal}}(),this.referrer=null,(this.method==="GET"||this.method==="HEAD")&&r)throw new TypeError("Body not allowed for GET or HEAD requests");if(this._initBody(r),(this.method==="GET"||this.method==="HEAD")&&(t.cache==="no-store"||t.cache==="no-cache")){var o=/([?&])_=[^&]*/;if(o.test(this.url))this.url=this.url.replace(o,"$1_="+new Date().getTime());else{var s=/\?/;this.url+=(s.test(this.url)?"&":"?")+"_="+new Date().getTime()}}}m.prototype.clone=function(){return new m(this,{body:this._bodyInit})};function S(e){var t=new FormData;return e.trim().split("&").forEach(function(r){if(r){var o=r.split("="),s=o.shift().replace(/\+/g," "),n=o.join("=").replace(/\+/g," ");t.append(decodeURIComponent(s),decodeURIComponent(n))}}),t}function j(e){var t=new a,r=e.replace(/\r?\n[\t ]+/g," ");return r.split("\r").map(function(o){return o.indexOf("\n")===0?o.substr(1,o.length):o}).forEach(function(o){var s=o.split(":"),n=s.shift().trim();if(n){var c=s.join(":").trim();try{t.append(n,c)}catch(f){console.warn("Response "+f.message)}}}),t}B.call(m.prototype);function d(e,t){if(!(this instanceof d))throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');if(t||(t={}),this.type="default",this.status=t.status===void 0?200:t.status,this.status<200||this.status>599)throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");this.ok=this.status>=200&&this.status<300,this.statusText=t.statusText===void 0?"":""+t.statusText,this.headers=new a(t.headers),this.url=t.url||"",this._initBody(e)}B.call(d.prototype);d.prototype.clone=function(){return new d(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new a(this.headers),url:this.url})};d.error=function(){var e=new d(null,{status:200,statusText:""});return e.status=0,e.type="error",e};var C=[301,302,303,307,308];d.redirect=function(e,t){if(C.indexOf(t)===-1)throw new RangeError("Invalid status code");return new d(null,{status:t,headers:{location:e}})};var y=u.DOMException;try{new y}catch(e){y=function(t,r){this.message=t,this.name=r;var o=Error(t);this.stack=o.stack},y.prototype=Object.create(Error.prototype),y.prototype.constructor=y}function _(e,t){return new Promise(function(r,o){var s=new m(e,t);if(s.signal&&s.signal.aborted)return o(new y("Aborted","AbortError"));var n=new XMLHttpRequest;function c(){n.abort()}n.onload=function(){var i={statusText:n.statusText,headers:j(n.getAllResponseHeaders()||"")};s.url.startsWith("file://")&&(n.status<200||n.status>599)?i.status=200:i.status=n.status,i.url="responseURL"in n?n.responseURL:i.headers.get("X-Request-URL");var p="response"in n?n.response:n.responseText;setTimeout(function(){r(new d(p,i))},0)},n.onerror=function(){setTimeout(function(){o(new TypeError("Network request failed"))},0)},n.ontimeout=function(){setTimeout(function(){o(new TypeError("Network request timed out"))},0)},n.onabort=function(){setTimeout(function(){o(new y("Aborted","AbortError"))},0)};function f(i){try{return i===""&&u.location.href?u.location.href:i}catch(p){return i}}if(n.open(s.method,f(s.url),!0),s.credentials==="include"?n.withCredentials=!0:s.credentials==="omit"&&(n.withCredentials=!1),"responseType"in n&&(h.blob?n.responseType="blob":h.arrayBuffer&&(n.responseType="arraybuffer")),t&&typeof t.headers=="object"&&!(t.headers instanceof a||u.Headers&&t.headers instanceof u.Headers)){var l=[];Object.getOwnPropertyNames(t.headers).forEach(function(i){l.push(b(i)),n.setRequestHeader(i,g(t.headers[i]))}),s.headers.forEach(function(i,p){l.indexOf(p)===-1&&n.setRequestHeader(p,i)})}else s.headers.forEach(function(i,p){n.setRequestHeader(p,i)});s.signal&&(s.signal.addEventListener("abort",c),n.onreadystatechange=function(){n.readyState===4&&s.signal.removeEventListener("abort",c)}),n.send(typeof s._bodyInit>"u"?null:s._bodyInit)})}_.polyfill=!0;u.fetch||(u.fetch=_,u.Headers=a,u.Request=m,u.Response=d);(function(e){e.getTheme=()=>{let t=e.cookie.getItem("_theme")||"System";return t==="System"&&(t=e.matchMedia("(prefers-color-scheme: dark)").matches?"Dark":"Light"),t},e.switchTheme=t=>{let r=document.getElementsByTagName("html")[0];r.classList.add(t.toLowerCase()),r.setAttribute("theme",t.toLowerCase())},e.cookie={getItem:function(t){return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*"+encodeURIComponent(t).replace(/[-.+*]/g,"\\$&")+"\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1"))||null},setItem:function(t,r,o,s,n,c){if(!t||/^(?:expires|max\-age|path|domain|secure)$/i.test(t))return!1;let f="";if(o)switch(o.constructor){case Number:f=o===1/0?"; expires=Fri, 31 Dec 9999 23:59:59 GMT":"; max-age="+o;break;case String:f="; expires="+o;break;case Date:f="; expires="+o.toUTCString();break}return document.cookie=encodeURIComponent(t)+"="+encodeURIComponent(r)+f+(n?"; domain="+n:"")+(s?"; path="+s:"")+(c?"; secure":""),!0},removeItem:function(t,r,o){return!t||!this.hasItem(t)?!1:(document.cookie=encodeURIComponent(t)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT"+(o?"; domain="+o:"")+(r?"; path="+r:""),!0)},hasItem:function(t){return new RegExp("(?:^|;\\s*)"+encodeURIComponent(t).replace(/[-.+*]/g,"\\$&")+"\\s*\\=").test(document.cookie)},keys:function(){let t=document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g,"").split(/\s*(?:\=[^;]*)?;\s*/);for(let r=0;r<t.length;r++)t[r]=decodeURIComponent(t[r]);return t}},e.commentSubmitListener=(t,r)=>{t.addEventListener("submit",o=>(o.preventDefault&&o.preventDefault(),e.fetch("/comment",{method:"post",body:new FormData(t)}).then(s=>{s.json().then(n=>{r&&(typeof r=="string"?e[r](n):r(n))},n=>{r&&(typeof r=="string"?e[r](n):r(n))}).catch(n=>{r&&(typeof r=="string"?e[r](n):r(n))})}),!1),!1)},e.formToFetchTransFormer=(t,r,o="")=>{t.addEventListener("submit",s=>{s.preventDefault&&s.preventDefault();let n=new FormData(t),c={},f={};if(o==="application/json"){c["content-type"]="application/json";for(let l of n)f[l[0]]=l[1]}window.fetch(t.action,{method:t.method,body:o==="application/json"?JSON.stringify(f):n,headers:c}).then(l=>{l.json().then(i=>{r&&r(i)}).catch(i=>{r&&r(i)})}).catch(l=>{r&&r(l)})})},(()=>{let t=document.location.pathname;if(t==="/login"||t==="/signup"||t==="/forgot-pass"||t==="/reset-pass"||t==="/install"){let o=document.querySelector("form"),s=o.querySelector("button"),n=document.getElementById("errorContainer"),c=function(f){n&&(n.innerText="",n.classList.add("hidden")),s.disabled=!o.checkValidity()};o.addEventListener("change",c),t!=="/install"&&e.formToFetchTransFormer(o,f=>{f.message&&n&&(n.innerText=f.message,n.classList.remove("hidden")),f.token&&(window.localStorage.setItem("auth_app_token",JSON.stringify({createdAt:new Date().getTime(),name:"nb:auth:jwt:token",ownerStrategyName:"email",value:f.token})),document.location.href=f.redirect||"/")},"application/json")}let r=document.getElementById("commentForm");r&&e.commentSubmitListener(r,"commentCallback")})()})(window);})();
