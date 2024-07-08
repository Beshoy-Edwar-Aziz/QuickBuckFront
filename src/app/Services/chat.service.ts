import { Injectable } from '@angular/core';
import * as signalr from '@microsoft/signalr'
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { AuthServiceService } from './auth-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  headers:HttpHeaders = new HttpHeaders({
    'Access-Control-Allow-Origin':'http://localhost:4200'
  });
  options={
    'headers':this.headers
  }
  private hubConnection:signalr.HubConnection;
  jobSeekerId:number=0;
  jobProviderId:number=0;
  BaseURL:string= "https://mlv0108p-7156.uks1.devtunnels.ms";
  user:string='';
  message:string='';
  messages:BehaviorSubject<any>=new BehaviorSubject('');
  currentmessages=this.messages.asObservable();
  updateMessages(messages:any){
    this.messages.next(messages);
  }
  constructor(private _authService:AuthServiceService,private _httpClient:HttpClient) { 
    this.hubConnection= new signalr.HubConnectionBuilder().withUrl(`${this.BaseURL}/chat`,{
      skipNegotiation:true,
      transport:signalr.HttpTransportType.WebSockets
    }).build();
  
  }
  startConnection():Observable<void>{
    return new Observable<void>((obs)=>{
      this.hubConnection.start().then(()=>{
        console.log("Connection Establised");
        obs.next();
        obs.complete();
      })
      .catch((err)=>{
        console.log(err);
        obs.error(err);
      })
    })
  }
  recieveMessage():Observable<string>{
    return new Observable<string>((obs)=>{
      this.hubConnection.on("RecieveMessage",(user:string,message:string)=>{
        obs.next(this.user=user);
        obs.next(this.message=message);
        console.log(user);
        
      })
    })
   
    
  }
  sendMessage(message:string,JobProviderId:Number,JobSeekerId:Number,Role:string,name:string):void{
    this.hubConnection.invoke("Send",JobSeekerId,JobProviderId,message,Role,name);
  }
  getMessages(JobProviderId:any,JobSeekerId:any):Observable<any>{
    return this._httpClient.get(`${this.BaseURL}/api/Message?JobProviderId=${JobProviderId}&JobSeekerId=${JobSeekerId}`);
  }
  getAllMessagesByJobSeeker(JobSeekerId:number):Observable<any>{
    return this._httpClient.get(`${this.BaseURL}/api/Message?JobSeekerId=${JobSeekerId}`);
  }
  getAllMessagesByJobProvider(JobProviderId:number):Observable<any>{
    return this._httpClient.get(`${this.BaseURL}/api/Message?JobProviderId=${JobProviderId}`);
  }
  getMessagesByJobSeekerId(JobSeekerId:any,JobProviderId:any):Observable<any>{
    return this._httpClient.get(`${this.BaseURL}/api/Message/GetPrevious?JobSeekerId=${JobSeekerId}&JobProviderId=${JobProviderId}`);
  }
  getMessageById(MessageId:number):Observable<any>{
    return this._httpClient.get(`${this.BaseURL}/api/Message/GetMsg?id=${MessageId}`);
  }
  getMessagesByJobSeekerId2(JobSeekerId:any):Observable<any>{
    return this._httpClient.get(`${this.BaseURL}/api/Message/GetPrevious?JobSeekerId=${JobSeekerId}`);
  }
}
