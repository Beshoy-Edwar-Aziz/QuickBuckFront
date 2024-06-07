import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  Token:any;
  TokenBehavior:BehaviorSubject<any>=new BehaviorSubject('');
  currentToken=this.TokenBehavior.asObservable();
 updateToken(newToken:any){
    this.TokenBehavior.next(newToken);
 }
  constructor(private _httpClient:HttpClient) { 
    // let token:any =localStorage.getItem('Token');
    // this.Token = jwtDecode(token);
    if(localStorage.getItem('Token')!=null){
      let token:any = localStorage.getItem('Token');
      this.Token = jwtDecode(token);      
    }
  }
  Register(userData:any):Observable<any>{
    return this._httpClient.post("https://localhost:7156/api/Account/Register",userData);
  }
  Login(userData:any):Observable<any>{
    return this._httpClient.post("https://localhost:7156/api/Account/Login",userData);
  }
}
