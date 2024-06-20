import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  User:BehaviorSubject<any>=new BehaviorSubject('');
  CurrentUser=this.User.asObservable();
  updateUser(User:any){
    this.User.next(User);
  }
  constructor(private _httpClient:HttpClient) 
  { 
      
  }
  GetAllJobSeekers():Observable<any>{
    return this._httpClient.get("https://localhost:7156/api/JobSeeker");
  }
  GetAllJobProviders():Observable<any>{
    return this._httpClient.get(`https://localhost:7156/api/JobProvider`);
  }
  GetJobSeekerByUserName(UserName:string):Observable<any>{
    return this._httpClient.get(`https://localhost:7156/api/JobSeeker/GetUser/${UserName}`);
  }
  GetJobProviderByIdOrByUserName(Id:any,UserName:string):Observable<any>{
    return this._httpClient.get(`https://localhost:7156/api/JobProvider/GetUser?Id=${Id}&UserName=${UserName}`);
  }
  GetJobSeekerById(id:number):Observable<any>{
    return this._httpClient.get(`https://localhost:7156/api/JobSeeker/${id}`);
  }
  updateJobSeeker(Body:object):Observable<any>{
    return this._httpClient.put('https://localhost:7156/api/JobSeeker',Body)
  }
  updateJobSeekerPremiumStatus(JobSeekerId:number,Status:boolean){
    return this._httpClient.put(`https://localhost:7156/api/JobSeeker/UpdatePremium?JobSeekerId=${JobSeekerId}&status=${Status}`,null);
  }
  updateJobProviderPremiumStatus(JobProviderId:number,Status:boolean){
    return this._httpClient.put(`https://localhost:7156/api/JobProvider/UpdatePremium?JobProviderId=${JobProviderId}&status=${Status}`,null);
  }
}
