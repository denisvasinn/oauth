import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

import { User } from './user';

@Component({
  selector: 'log-in-component',
  template: `
    <div class="form-container">
      <div>
        <form class="form clearfix" [formGroup]="form" (ngSubmit)="onSubmit($event)" action="/auth/login" method="POST">
          <div class="form-group">
            <label>Username</label>
            <input class="form-control" formControlName="username" name="username" [(ngModel)]="user.username" placeholder="Username">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" formControlName="password" name="password" [(ngModel)]="user.password" placeholder="Password">
          </div>
          <input type="submit" value="SUBMIT" class='btn btn-secondary'>
        </form>
      </div>
      <div class="popup" [class.active]="form.dirty && form.invalid">
        <p>Both fields are required.</p>
        <p *ngIf="form.get('username').invalid">Name must be at least 3 characters long.</p>
        <p *ngIf="form.get('password').invalid">Password must be at least 5 characters long.</p>
      </div>
    <div>
  `
})
export class LogInComponent implements OnInit {
  form: FormGroup;
  user: User;
  authService: AuthService;
  router: Router;

  constructor(@Inject(FormBuilder) fb: FormBuilder,
              @Inject(AuthService) authService: AuthService,
              @Inject(Router) router: Router) {
    this.authService = authService;
    this.router = router;
    this.user = new User();
    this.form = fb.group({
      username: [this.user.username, Validators.compose([Validators.required, Validators.minLength(3)])],
      password: [this.user.password, Validators.compose([Validators.required, Validators.minLength(5)])]
    });

    this.form.get('username').valueChanges.subscribe(
      (username: any) => { },
      (error: any) => { console.error(error); }
    );
  }

  ngOnInit(){
    if (this.authService.isLogedIn()) this.router.navigate(['/protected']);
  }

  onSubmit(event: any){
    let { username, password } = this.user;
    event.preventDefault();
    if (this.form.valid) {
      this.authService.login(username, password)
        .subscribe(res => {
          console.log(res);
          console.log(typeof res);
          res = ((typeof res) == 'string')? JSON.parse(res): res;
          if(res.success){
            this.authService.storeUserData(res.user);
            let sender = this.authService.getCookie('sender');
            if(sender) document.location.href = `/auth/oauth`;
            else this.router.navigate(['/protected']);
          }
          else console.log('error');
        },
        err => console.log(JSON.stringify(err)));
    } 
    else console.error('Form is not valid');
  }
}