import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from './auth.service';

import { User } from './user';

@Component({
  selector: 'log-in-component',
  template: `
    <div class="form-container">
      <div>
        <form class="form clearfix" [formGroup]="form" (ngSubmit)="onSubmit($event)" action="/auth/login" method="POST">
          <label>Log In</label>
          <input class="form-control" formControlName="username" placeholder="Username">
          <input type="password" class="form-control" formControlName="password" placeholder="Password">
          <button class='btn'>SUBMIT</button>
        </form>
      </div>
      <div class="popup" [class.active]="form.dirty && form.invalid">
        <p>Error</p>
        <p>Both fields are required.</p>
        <p *ngIf="form.get('username').invalid">Name must be at least 3 characters long.</p>
        <p *ngIf="form.get('password').invalid">Password must be at least 5 characters long.</p>
      </div>
    <div>
  `
})
export class LogInComponent {
  form: FormGroup;
  user: User;
  authService: AuthService;

  constructor(@Inject(FormBuilder) fb: FormBuilder,
              @Inject(AuthService) authService: AuthService) {
    this.authService = authService;
    this.user = new User();
    this.form = fb.group({
      username: [this.user.username, Validators.compose([Validators.required, Validators.minLength(3)])],
      password: [this.user.password, Validators.compose([Validators.required, Validators.minLength(5)])]
    });
  }

  onSubmit(event: any){
    let { username, password } = this.user;
    if (this.form.valid) {
      this.authService.login(username, password)
        .subscribe(res => {
          if(res.succes){
            this.authService.storeUserData(res.token, res.user);
            console.log('logged in succesfully');
          } else{
            console.log('error');
          }
        }, err => console.log(err));
    } else{
      console.log('error');
    }
    return false;
  }
}