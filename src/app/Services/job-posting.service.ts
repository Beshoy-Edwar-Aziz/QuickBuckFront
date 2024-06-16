import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobPostingService {

  constructor(private _httpClient:HttpClient) { }
  GetAllJobPosts():Observable<any>{
    return this._httpClient.get(`https://localhost:7156/api/JobPost?PageIndex=1&PageSize=10`);
  }
  PostJob(body:object,JobProviderId:any):Observable<any>{
    return this._httpClient.post(`https://localhost:7156/api/JobPost/${JobProviderId}`,body);
  }
  GetJobProviderByUserName(UserName:string):Observable<any>{
    return this._httpClient.get(`https://localhost:7156/api/JobProvider?UserName=${UserName}`);
  }
  GetJobPostById(JobPostId:number=3):Observable<any>{
    return this._httpClient.get(`https://localhost:7156/api/JobPost/${JobPostId}`);
  }
  PostJobApplication(Body:object,JobProviderId:number,JobSeekerId:number,JobPostId:number):Observable<any>{
    return this._httpClient.post(`https://localhost:7156/api/JobApplication?JobProviderId=${JobProviderId}&JobPostId=${JobPostId}&JobSeekerId=${JobSeekerId}`,Body);
  }
  UpdateJobPostWithJobApplications(JobPostId:number):Observable<any>{
    return this._httpClient.put(`https://localhost:7156/api/JobApplication?JobPostId=${JobPostId}`,null);
  }
}
