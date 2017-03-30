import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

import { User } from './user';

function passwordMatcher(c: AbstractControl){
    return (c.get('password').value === c.get('confirm').value) ? null: { nomatch: true };
}

@Component({
  selector: 'sign-up-component',
  template: `
    <div class="form-container clearfix">
      <div>
        <form class="form" [formGroup]="form" (ngSubmit)="onSubmit($event)">
          <div formGroupName="name">
            <label>Name</label>
            <div class="form-group">
              <input class="form-control" formControlName="first" [(ngModel)]="user.first" placeholder="First">
            </div>
            <div class="form-group">
              <label></label>
              <input class="form-control" formControlName="last" [(ngModel)]="user.last" placeholder="Last">
            </div>
          </div>
          <div formGroupName="account">
            <label>Account</label>
            <div class="form-group">
              <input class="form-control" formControlName="username" [(ngModel)]="user.username" placeholder="Username">
            </div>
            <div class="form-group">
              <label></label>
              <input type="password" class="form-control" formControlName="password" [(ngModel)]="user.password" placeholder="Password">
            </div>
            <div class="form-group">
              <label></label>
              <input type="password" class="form-control" formControlName="confirm" [(ngModel)]="user.confirm" placeholder="Confirm password">
            </div>
            <div class="form-group">
              <label></label>
              <input class="form-control" formControlName="email" [(ngModel)]="user.email" placeholder="Email">
            </div>
          </div>
          <button class="btn btn-secondary">SUBMIT</button>
        </form>
      </div>
      <p>VALID: {{ form.valid | json }}</p>
      <p>Username: {{ form.get("account.username").status | json }}</p>
      <div class="popup" [class.active]="form.dirty && form.invalid">
        <p>Error</p>
        <p>All fields are required.</p>
        <p *ngIf="form.get('name.first').invalid">First name must be at least 2 characters long.</p>
        <p *ngIf="form.get('name.last').invalid">Last name must be at least 2 characters long.</p>
        <p *ngIf="form.get('account.username').invalid">Username must be at least 3 characters long.</p>
        <p *ngIf="form.get('account.password').invalid">Password must be at least 5 characters long.</p>
        <p *ngIf="form.get('account.confirm').invalid">Confirm password must be at least 5 characters long.</p>
        <p *ngIf="form.get('account.email').invalid">Wrong email.</p>
      </div>
    </div>
  `
})
export class SignUpComponent {
  form: FormGroup;
  user: User;
  authService: AuthService;
  router: Router;

  constructor(@Inject(FormBuilder) fb: FormBuilder,
              @Inject(AuthService) authService: AuthService,
              @Inject(Router) router: Router) {
    this.user = new User();
    this.authService = authService;
    this.router = router;
    this.form = fb.group({
      name: fb.group({
        first: [this.user.first, Validators.compose([Validators.required, Validators.minLength(2)])],
        last: [this.user.last, Validators.compose([Validators.required, Validators.minLength(2)])]
      }),
      account: fb.group({
        username: [this.user.username, Validators.compose([Validators.required, Validators.minLength(3)])],
        password: [this.user.password, Validators.compose([Validators.required, Validators.minLength(5)])],
        confirm: [this.user.confirm, Validators.compose([Validators.required, Validators.minLength(5)])],
        email: [this.user.email, Validators.compose([Validators.required, Validators.pattern(/[A-Za-z0-9-_\.]+@[\w]+\.([\w]+(\.?)){1,}/) ])]
      }, { validator: passwordMatcher })
    });

    this.form.get('account.username').valueChanges.subscribe(
      (username: string) => { },
      (error: any) => { console.error(error); }
    );
  }

  onSubmit(event: any){
    event.preventDefault();
    if(this.form.valid){
      this.authService.register(this.user)
        .subscribe(res => {
          res = JSON.parse(res);
          if(res.success){
            console.log('successfully registered');
            this.router.navigate(['/login']);
          }
        },
        err => console.error(err));
    }
    else console.error('Form is not valid');
  }
}