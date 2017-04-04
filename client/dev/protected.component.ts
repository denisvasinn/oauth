import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from './user';

@Component({
  selector: 'protected',
  template: 
  `<div class="jumbotron">
    <h1>Welcome, {{user.first}} {{user.last}}!</h1>
    <p class="lead">Now you can use any supported services without registration</p>
    <a *ngIf="sender" href="https://{{sender}}">Continue working with {{sender}}</a>
  </div>`
})
export class ProtectedComponent implements OnInit {
  user: User;
  sender: string;
  authService: AuthService;

  constructor(@Inject(AuthService) authService: AuthService){
    this.authService = authService;
  }

  ngOnInit(){
    this.user = JSON.parse(localStorage.getItem('user'));
    this.sender = this.authService.getCookie('sender');
  }
}