import { Injectable, Inject } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class LoginGuard implements CanActivate{
    constructor(@Inject(AuthService) private authService: AuthService){}

    canActivate(): boolean{
        return this.authService.isLogedIn();
    }
}