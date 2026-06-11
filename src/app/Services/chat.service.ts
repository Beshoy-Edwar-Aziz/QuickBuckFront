import { Injectable } from '@angular/core';
import * as signalr from '@microsoft/signalr'
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { AuthServiceService } from './auth-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsersService } from './users.service';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private hubConnection:signalr.HubConnection;
  jobSeekerId:number=0;
  jobProviderId:number=0;
  BaseURL:string= "https://quickbuckproject-production.up.railway.app";
  user:string='';
  message:string='';
  email:string='';
  messages:BehaviorSubject<any>=new BehaviorSubject('');
  currentmessages=this.messages.asObservable();
  updateMessages(messages:any){
    this.messages.next(messages);
  }
  constructor(private _authService:AuthServiceService,private _httpClient:HttpClient) {
    let x:any
    if(localStorage.getItem('Token')!=null){
    let local:any = localStorage.getItem('Token');
    x=jwtDecode(JSON.parse(local));
    }
    this.hubConnection= new signalr.HubConnectionBuilder().withUrl(`${this.BaseURL}/chat?username=${x?.email?.split('@')[0]}`,{
      skipNegotiation:true,
      transport:signalr.HttpTransportType.WebSockets
    }).withAutomaticReconnect().withStatefulReconnect().build();

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
  recieveMessage():Observable<any>{
    return new Observable<any>((obs)=>{
      this.hubConnection.on("RecieveMessage",(Name:string,message:string,image:string,date:any)=>{
        console.log(message);

          obs.next({name:Name,Message:message,Image:image,Date:date});

      })
    })
  }
  // getConnectionId():void{
  //   this.hubConnection.invoke('getconnectionid').then((data)=>{
  //     console.log(data);

  //   })
  // }
  sendGroupName(groupName:string){
    this.hubConnection.invoke("createGroup",groupName);
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
