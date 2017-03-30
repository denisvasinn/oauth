import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'my-app',
  template: `
    <header>
      <nav>
        <div id='bar' [ngStyle]='{"background-position": scroll}' (window:scroll)='onScroll($event)'></div>
        <ul class="nav justify-content-center">
          <li class="nav-item"><a href="#" class="nav-link">{{name}}</a></li>
          <li *ngIf="!authService.isLogedIn()" class="nav-item"><a [routerLink]="['login']" class="nav-link">Login</a></li>
          <li *ngIf="!authService.isLogedIn()" class="nav-item"><a [routerLink]="['signup']" class="nav-link">Sign up</a></li>
          <li *ngIf="authService.isLogedIn()" class="nav-item"><a href="/auth/logout" (click)="logout($event)" class="nav-link">Logout</a></li>
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
  name: string = 'OAuth';
  authService: AuthService;
  router: Router;
  scroll: string;

  constructor(@Inject(AuthService) authService: AuthService, @Inject(Router) router: Router){
    this.authService = authService;
    this.router = router;
  }

  ngOnInit(){}

  onScroll(event: any){
     let step = 100/event.view.scrollMaxY;
     this.scroll = `left ${event.pageY * step}%`;
   }

  logout(event: any){
    event.preventDefault();
    this.authService.logout().subscribe(res => {
      console.log(res);
      localStorage.removeItem('user');
      this.router.navigate(['/']);
    });
  }
}