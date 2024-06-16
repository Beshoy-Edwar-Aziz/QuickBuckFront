import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private _httpClient:HttpClient) 
  { 
      
  }
  GetAllJobSeekers():Observable<any>{
    return this._httpClient.get("https://localhost:7156/api/JobSeeker");
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
}
