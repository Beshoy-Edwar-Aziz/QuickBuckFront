import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
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
 JobSeekerId:BehaviorSubject<any>=new BehaviorSubject('');
  CurrentJobSeeker=this.JobSeekerId.asObservable();
  updateJobSeekerId(JobSeekerId:number){
    this.JobSeekerId.next(JobSeekerId);
  }
  UserInfo:BehaviorSubject<any>=new BehaviorSubject('');
  CurrentUserInfo = this.UserInfo.asObservable();
  updateUserInfo(newUserInfo:any){
    this.UserInfo.next(newUserInfo);
  }
  JobProviderId:BehaviorSubject<any>=new BehaviorSubject('');
  CurrentJobProvider= this.JobProviderId.asObservable();
  updateJobProviderId(jobProviderId:number){
    this.JobProviderId.next(jobProviderId);
  }
  Id:BehaviorSubject<number>=new BehaviorSubject(0);
  CurrentId=this.Id.asObservable();
  updateId(id:number):void{
    this.Id.next(id);
  }
  constructor(private _httpClient:HttpClient) { 
    // let token:any =localStorage.getItem('Token');
    // this.Token = jwtDecode(token);
    if(localStorage.getItem('Token')!=null){
      let token:any = localStorage.getItem('Token');
      this.Token = jwtDecode(token);      
    }
  }
  BaseURL:string= "https://svgcxfl1-7156.uks1.devtunnels.ms";
  
  Register(userData:any):Observable<any>{
    return this._httpClient.post(`${this.BaseURL}/api/Account/Register`,userData);
  }
  Login(userData:any):Observable<any>{
    return this._httpClient.post(`${this.BaseURL}/api/Account/Login`,userData);
  }
}
