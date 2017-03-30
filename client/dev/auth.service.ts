import { Inject, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { User } from './user';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
    http: Http;
    headers: Headers = new Headers({'Content-Type': 'application/json'});

    constructor(@Inject(Http) http: Http){
        this.http = http;
    }
    login(username: string = '', password: string = ''){
        return this.http
            .post('/auth/login', JSON.stringify({ username, password }), { headers: this.headers })
            .map(res => res.json());
    }
    logout(){
        return this.http
            .post('/auth/logout', {}, { headers: this.headers })
            .map(res => res.json());
    }
    register(user: User){
        return this.http
            .post('/auth/register', JSON.stringify(user), { headers: this.headers })
            .map(res => res.json());
    }
    check(username: string){
        return this.http
            .post('/auth/check', { username }, { headers: this.headers })
            .map(res => res.json());
    }
    storeUserData(user: Object){
        localStorage.setItem('user', JSON.stringify(user));
    }
    clearUserData(){
        localStorage.clear();
    }
    isLogedIn(): boolean{
        return !!localStorage.getItem('user');
    }
}