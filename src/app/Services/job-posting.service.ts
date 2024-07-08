import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobPostingService {
  JobPost:BehaviorSubject<any>=new BehaviorSubject('');
  CurrentJobPost = this.JobPost.asObservable();
  BaseURL:string= "https://mlv0108p-7156.uks1.devtunnels.ms";
  updateJobPost(JobPost:any){
    this.JobPost.next(JobPost);
  }
  constructor(private _httpClient:HttpClient) { }
  GetAllJobPosts():Observable<any>{
    return this._httpClient.get(`${this.BaseURL}/api/JobPost?PageIndex=1&PageSize=10`);
  }
  getAllJobPostsByJobProviderId(JobProviderId:number):Observable<any>{
    return this._httpClient.get(`${this.BaseURL}/api/JobPost?JobProviderId=${JobProviderId}`);
  }
  SearchJobPosts(JobName:string):Observable<any>{
    return this._httpClient.get(`${this.BaseURL}/api/JobPost?JobName=${JobName}`);
  }
  FilterJobPosts(Sort:string):Observable<any>{
    return this._httpClient.get(`${this.BaseURL}/api/JobPost?Sort=${Sort}`);
  }
  PostJob(body:object,JobProviderId:any):Observable<any>{
    return this._httpClient.post(`${this.BaseURL}/api/JobPost/${JobProviderId}`,body);
  }
  GetJobProviderByUserName(UserName:string):Observable<any>{
    return this._httpClient.get(`${this.BaseURL}/api/JobProvider?UserName=${UserName}`);
  }
  GetJobPostById(JobPostId:number=3):Observable<any>{
    return this._httpClient.get(`${this.BaseURL}/api/JobPost/${JobPostId}`);
  }
  getJobPostByJobProviderId(JobProviderId:number):Observable<any>{
    return this._httpClient.get(`${this.BaseURL}/api/JobPost/GetLatestJobPosts?JobProviderId=${JobProviderId}`);
  }
  PostJobApplication(Body:object,JobProviderId:number,JobSeekerId:number,JobPostId:number):Observable<any>{
    return this._httpClient.post(`${this.BaseURL}/api/JobApplication?JobProviderId=${JobProviderId}&JobPostId=${JobPostId}&JobSeekerId=${JobSeekerId}`,Body);
  }
  UpdateJobPostWithJobApplications(JobPostId:number):Observable<any>{
    return this._httpClient.put(`${this.BaseURL}/api/JobApplication?JobPostId=${JobPostId}`,null);
  }
  UpdateJobPost(Body:object,JobPostId:number){
    return this._httpClient.put(`${this.BaseURL}/api/JobPost?JobPostId=${JobPostId}`,Body);
  }
  bookMarkPost(Body:object,jobPostId:number,jobSeekerId:number):Observable<any>{
    return this._httpClient.post(`${this.BaseURL}/api/Bookmark?JobSeekerId=${jobSeekerId}&JobPostId=${jobPostId}`,Body);
  }
  getBookmarksByJobSeekerId(JobSeekerId:number):Observable<any>{
    return this._httpClient.get(`${this.BaseURL}/api/Bookmark?JobSeekerId=${JobSeekerId}`);
  }
  deleteJobPost(JobPostId:number):Observable<any>{
    return this._httpClient.delete(`${this.BaseURL}/api/JobPost?JobPostId=${JobPostId}`);
  }
}
