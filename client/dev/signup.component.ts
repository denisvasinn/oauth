import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

import { User } from './user';

function passwordMatcher(c: AbstractControl){
    return (c.get('password').value === c.get('confirm').value) ? null: { nomatch: true };
}

//[class.error]="form.get('first').touched && !form.get('first').valid"

@Component({
  selector: 'sign-up-component',
  template: `
    <div class="form-container clearfix">
      <div>
        <form class="form" [formGroup]="form" (ngSubmit)="onSubmit($event)">
          <div formGroupName="name">
            <label>Name</label>
            <input class="form-control" formControlName="first" placeholder="First">
            <input class="form-control" formControlName="last" placeholder="Last">
          </div>
          <div formGroupName="account">
            <label>Account</label>
            <input class="form-control" formControlName="username" placeholder="Username">
            <input type="password" class="form-control" formControlName="password" placeholder="Password">
            <input type="password" class="form-control" formControlName="confirm" placeholder="Confirm password">
            <input class="form-control" formControlName="email" placeholder="Email">
          </div>
          <button class="btn">SUBMIT</button>
        </form>
      </div>
      <div>
        <p>Value: {{ form.get('account').value | json }}</p>
        <p>Validation status: {{ form.get('account').status | json }}</p>
        <p>Validation errors: {{ form.get('account').errors | json }}</p>
      </div>
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

  constructor(@Inject(FormBuilder) fb: FormBuilder,
              private authService: AuthService,
              private router: Router) {
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
      (username: any) => { console.log(username); },
      (error: any) => { console.error(error); }
    );
  }

  onSubmit(event: any){
    if(this.form.valid){
      this.authService.register(this.user)
        .subscribe(res => {
          if(res.success){
            console.log('successfully registered');
            this.router.navigate(['/login']);
          }
        },
        err => console.log(err));
    }
    else{
      console.log('form isnt valid');
    }
    return false;
  }
}