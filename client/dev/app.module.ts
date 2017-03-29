import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LocationStrategy, HashLocationStrategy, APP_BASE_HREF } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LogInComponent } from './login.component';
import { SignUpComponent } from './signup.component';
import { ProtectedComponent } from './protected.component';

import { AuthService } from './auth.service';
import { LoginGuard } from './login.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LogInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'protected', component: ProtectedComponent, canActivate: [LoginGuard] }
];

@NgModule({
  imports: [ 
    BrowserModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  declarations: [ 
    AppComponent,
    LogInComponent,
    SignUpComponent,
    ProtectedComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: APP_BASE_HREF, useValue: '/' },
    AuthService,
    LoginGuard
  ]
})
export class AppModule { }