import { Inject, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { User } from './user';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
    http: Http;

    constructor(@Inject(Http) http: Http){
        this.http = http;
    }
    login(username: string = '', password: string = ''){
        let headers = new Headers({'Content-Type': 'application/json'});
        return this.http
            .post('/auth/login', JSON.stringify({ username, password }), { headers })
            .map(res => res.json());
    }
    register(user: User){
        let headers = new Headers({'Content-Type': 'application/json'});
        return this.http
            .post('/auth/register', JSON.stringify(user), { headers })
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