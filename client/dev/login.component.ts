import { Component, Inject } from '@angular/core';
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
          <label>Log In</label>
          <input class="form-control" formControlName="username" [(ngModel)]="user.username" placeholder="Username">
          <input type="password" class="form-control" formControlName="password" [(ngModel)]="user.password" placeholder="Password">
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
      (username: any) => { console.log(this.user.username) },
      (error: any) => { console.error(error); }
    );
  }

  onSubmit(event: any){
    event.preventDefault();
    let { username, password } = this.user;
    if (this.form.valid) {
      this.authService.login(username, password)
        .subscribe(res => {
          res = JSON.parse(res);
          if(res.success){
            console.log('logged in succesfully');
            this.authService.storeUserData(res.user);
            this.router.navigate(['/login']);
          }
          else console.log(JSON.stringify(res.err));
        }, 
        err => console.log(JSON.stringify(err)));
    } 
    else console.error('Form is not valid');
  }
}