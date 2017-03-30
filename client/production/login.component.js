"use strict";var __decorate=this&&this.__decorate||function(e,r,o,t){var n,s=arguments.length,a=s<3?r:null===t?t=Object.getOwnPropertyDescriptor(r,o):t;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,r,o,t);else for(var i=e.length-1;i>=0;i--)(n=e[i])&&(a=(s<3?n(a):s>3?n(r,o,a):n(r,o))||a);return s>3&&a&&Object.defineProperty(r,o,a),a},__param=this&&this.__param||function(e,r){return function(o,t){r(o,t,e)}};exports.__esModule=!0;var core_1=require("@angular/core"),forms_1=require("@angular/forms"),router_1=require("@angular/router"),auth_service_1=require("./auth.service"),user_1=require("./user"),LogInComponent=function(){function e(e,r,o){var t=this;this.authService=r,this.router=o,this.user=new user_1.User,this.form=e.group({username:[this.user.username,forms_1.Validators.compose([forms_1.Validators.required,forms_1.Validators.minLength(3)])],password:[this.user.password,forms_1.Validators.compose([forms_1.Validators.required,forms_1.Validators.minLength(5)])]}),this.form.get("username").valueChanges.subscribe(function(e){console.log(t.user.username)},function(e){console.error(e)})}return e.prototype.ngOnInit=function(){this.authService.isLogedIn()&&this.router.navigate(["/protected"])},e.prototype.onSubmit=function(e){var r=this;e.preventDefault();var o=this.user,t=o.username,n=o.password;this.form.valid?this.authService.login(t,n).subscribe(function(e){e=JSON.parse(e),e.success?(console.log("logged in succesfully"),r.authService.storeUserData(e.user),r.router.navigate(["/protected"])):console.log(JSON.stringify(e.err))},function(e){return console.log(JSON.stringify(e))}):console.error("Form is not valid")},e}();LogInComponent=__decorate([core_1.Component({selector:"log-in-component",template:'\n    <div class="form-container">\n      <div>\n        <form class="form clearfix" [formGroup]="form" (ngSubmit)="onSubmit($event)" action="/auth/login" method="POST">\n          <div class="form-group">\n            <label>Username</label>\n            <input class="form-control" formControlName="username" [(ngModel)]="user.username" placeholder="Username">\n          </div>\n          <div class="form-group">\n            <label>Password</label>\n            <input type="password" class="form-control" formControlName="password" [(ngModel)]="user.password" placeholder="Password">\n          </div>\n          <button class=\'btn btn-secondary\'>SUBMIT</button>\n        </form>\n      </div>\n      <div class="popup" [class.active]="form.dirty && form.invalid">\n        <p>Error</p>\n        <p>Both fields are required.</p>\n        <p *ngIf="form.get(\'username\').invalid">Name must be at least 3 characters long.</p>\n        <p *ngIf="form.get(\'password\').invalid">Password must be at least 5 characters long.</p>\n      </div>\n    <div>\n  '}),__param(0,core_1.Inject(forms_1.FormBuilder)),__param(1,core_1.Inject(auth_service_1.AuthService)),__param(2,core_1.Inject(router_1.Router))],LogInComponent),exports.LogInComponent=LogInComponent;