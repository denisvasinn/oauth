"use strict";var __decorate=this&&this.__decorate||function(t,e,r,o){var n,a=arguments.length,i=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(t,e,r,o);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(i=(a<3?n(i):a>3?n(e,r,i):n(e,r))||i);return a>3&&i&&Object.defineProperty(e,r,i),i},__param=this&&this.__param||function(t,e){return function(r,o){e(r,o,t)}};exports.__esModule=!0;var core_1=require("@angular/core"),http_1=require("@angular/http");require("rxjs/add/operator/map");var AuthService=function(){function t(t){this.headers=new http_1.Headers({"Content-Type":"application/json"}),this.http=t}return t.prototype.login=function(t,e){return void 0===t&&(t=""),void 0===e&&(e=""),this.http.post("/auth/login",JSON.stringify({username:t,password:e}),{headers:this.headers}).map(function(t){return t.json()})},t.prototype.logout=function(){return this.http.post("/auth/logout",{},{headers:this.headers}).map(function(t){return t.json()})},t.prototype.register=function(t){return this.http.post("/auth/register",JSON.stringify(t),{headers:this.headers}).map(function(t){return t.json()})},t.prototype.check=function(t){return this.http.post("/auth/check",{username:t},{headers:this.headers}).map(function(t){return t.json()})},t.prototype.storeUserData=function(t){localStorage.setItem("user",JSON.stringify(t))},t.prototype.clearUserData=function(){localStorage.clear()},t.prototype.isLogedIn=function(){return!!localStorage.getItem("user")},t.prototype.getCookie=function(t){var e=document.cookie.match(new RegExp("(?:^|; )"+t.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,"\\$1")+"=([^;]*)"));return e?decodeURIComponent(e[1]):void 0},t}();AuthService=__decorate([core_1.Injectable(),__param(0,core_1.Inject(http_1.Http))],AuthService),exports.AuthService=AuthService;