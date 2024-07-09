import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  User:BehaviorSubject<any>=new BehaviorSubject('');
  CurrentUser=this.User.asObservable();
  BaseURL:string= "https://svgcxfl1-7156.uks1.devtunnels.ms";
  updateUser(User:any){
    this.User.next(User);
  }
  constructor(private _httpClient:HttpClient) 
  { 
      
  }
  
  SearchJobSeekersByUserName(UserName:string):Observable<any>{
    return this._httpClient.get(`${this.BaseURL}/api/JobSeeker/SearchCandidates?UserName=${UserName}`);
  }
  GetAllJobProviders():Observable<any>{
    return this._httpClient.get(`${this.BaseURL}/api/JobProvider`);
  }
  GetJobSeekerByUserName(UserName:string):Observable<any>{
    return this._httpClient.get(`${this.BaseURL}/api/JobSeeker/GetUser/${UserName}`);
  }
  GetJobProviderByIdOrByUserName(Id:any,UserName:string):Observable<any>{
    return this._httpClient.get(`${this.BaseURL}/api/JobProvider/GetUser?Id=${Id}&UserName=${UserName}`);
  }
  GetJobSeekerById(id:number):Observable<any>{
    return this._httpClient.get(`${this.BaseURL}/api/JobSeeker/${id}`);
  }
  updateJobSeeker(Body:object):Observable<any>{
    return this._httpClient.put(`${this.BaseURL}/api/JobSeeker`,Body)
  }
  updateJobSeekerPremiumStatus(JobSeekerId:number,Status:boolean){
    return this._httpClient.put(`${this.BaseURL}/api/JobSeeker/UpdatePremium?JobSeekerId=${JobSeekerId}&status=${Status}`,null);
  }
  updateJobProviderPremiumStatus(JobProviderId:number,Status:boolean){
    return this._httpClient.put(`${this.BaseURL}/api/JobProvider/UpdatePremium?JobProviderId=${JobProviderId}&status=${Status}`,null);
  }
}
