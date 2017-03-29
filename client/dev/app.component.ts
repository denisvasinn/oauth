import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <header>
      <h1>{{name}}</h1>
      <nav>
        <ul>
          <li><a [routerLink]="['login']">Login</a></li>
          <li><a [routerLink]="['signup']">Sign up</a></li>
          <li><a [routerLink]="['protected']">Protected</a></li>
        </ul>
      </nav>
    </header>
    <article>
      <router-outlet></router-outlet>
    </article>
    <footer>
      <p>2017</p>
    </footer>
  `
})
export class AppComponent implements OnInit { 
  name = 'OpenID';

  ngOnInit(){}
}