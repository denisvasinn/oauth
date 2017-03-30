import { Component, OnInit } from '@angular/core';
import { User } from './user';

@Component({
  selector: 'protected',
  template: 
  `<div class="jumbotron">
    <h1>Welcome, {{user.first}} {{user.last}}!</h1>
    <p class="lead">Now you can use any supported services without registration</p>
  </div>`
})
export class ProtectedComponent implements OnInit {
  user: User;

  ngOnInit(){
    this.user = JSON.parse(localStorage.getItem('user'));
  }
}