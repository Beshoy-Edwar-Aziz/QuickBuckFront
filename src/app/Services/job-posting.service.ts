import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobPostingService {

  constructor(private _httpClient:HttpClient) { }
  GetAllJobPosts():Observable<any>{
    return this._httpClient.get(`https://localhost:7156/api/JobPost`);
  }
  PostJob(body:object,JobProviderId:any):Observable<any>{
    return this._httpClient.post(`https://localhost:7156/api/JobPost/${JobProviderId}`,body);
  }
  GetJobProviderByUserName(UserName:string):Observable<any>{
    return this._httpClient.get(`https://localhost:7156/api/JobProvider?UserName=${UserName}`);
  }
  GetJobPostById(JobPostId:number):Observable<any>{
    return this._httpClient.get(`https://localhost:7156/api/JobPost/`);
  }
}
