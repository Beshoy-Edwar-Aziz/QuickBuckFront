import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ChatService } from '../../Services/chat.service';
import { UsersService } from '../../Services/users.service';
import { AuthServiceService } from '../../Services/auth-service.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css'
})
export class ChatRoomComponent implements OnInit, AfterViewInit {
  constructor(private chatService:ChatService, private _userService:UsersService,private _authService:AuthServiceService){

  }
  ngAfterViewInit(): void {
    let  x:any=localStorage.getItem('JobSeekerId');
    
    console.log(JSON.parse(x));
    
  }
  RecievedMsg:string='';
  json:any=localStorage.getItem('JobProviderId');
  json2:any=localStorage.getItem('JobSeekerId');
 jobProviderId:number=JSON.parse(this.json);
 jobSeekerId:number=JSON.parse(this.json2);
 CurrentToken:any = localStorage.getItem('Token');
 Token:any=jwtDecode(this.CurrentToken);
 TokenRole:string=this.Token.sub;
 Messages:any; 
 JobProviderInfo:any;
 TalkedToPreviously:any;
 user:any;
 ngOnInit(): void {
  this._authService.CurrentJobSeeker.subscribe(
    (data)=>{if(data!=''){
      console.log("behavior",data);
      
      this.jobSeekerId=data;
    }}
    
  )
  this._authService.CurrentJobProvider.subscribe((data)=>{
    if(data!=''&&data!=undefined){
      this.jobProviderId=data;
      console.log(data);
      
    }
  })
  let x:any =localStorage.getItem('JobSeekerId')
  let result=JSON.parse(x);
  console.log(this.Token);
  console.log(this.TokenRole);
  console.log(this.jobSeekerId);
  console.log("jobproviderid",this.jobProviderId);
  
  
  this.chatService.getMessages(this.jobProviderId,this.jobSeekerId).subscribe({
    next:(data)=>{
      console.log(data);
      console.log(this.jobProviderId);
      
      this.Messages=data;
      this.Messages.reverse();
    },
    error:(err)=>{
      console.log(err);
    }
  })
    this.chatService.startConnection().subscribe({
      next:()=>{
        this.chatService.recieveMessage().subscribe({
          next:(Message)=>{
            console.log(Message);
            
            this.RecievedMsg=Message;
            console.log(this.chatService.user);
            this.user= this.chatService.user;
            let list = document.createElement('li');
            
            list?.classList?.add('list-unstyled');
            this.Messages.forEach((x:any) => {
              if(this.user==x.jobSeeker.userName){
                list.style.backgroundColor=" #ECFDFC";
                list.style.textAlign="left";
                list.classList.add('rounded');
                list.classList.add('my-2');
                list.classList.add('p-3');
              }
              else{
                list.style.backgroundColor="#F2F2F2";
                list.style.textAlign="right";
                list.classList.add('rounded')
                list.classList.add('my-2');
                list.classList.add('p-3');
              }
              list.innerHTML = `${this.RecievedMsg}`
              let unorderedList = document.getElementById('MessageWindow');
              unorderedList?.appendChild(list);
            });
            
          
          },
          error:(err)=>{
            console.log(err);
            
          }
        })
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
    
    if(this.TokenRole=="JobSeeker"){
    this._userService.GetJobSeekerByUserName(this.Token.name).subscribe({
      next:(data)=>{
        console.log(data);
        
         this._userService.GetJobSeekerById(this.jobSeekerId).subscribe({
          next:(dataa)=>{
            this.jobSeekerId=dataa.id;
            console.log(this.chatService.jobSeekerId);
          }
         })
      }
    });
    this._userService.GetJobProviderByIdOrByUserName(this.jobProviderId,'').subscribe({
      next:(data)=>{
        this.JobProviderInfo=data;
        console.log(data);
        
      }
    })
    this.chatService.getMessagesByJobSeekerId(this.jobSeekerId,0).subscribe({
      next:(data)=>{
        console.log(data);
        this.TalkedToPreviously=data;
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }else if(this.TokenRole=="JobProvider"){
    this._userService.GetJobProviderByIdOrByUserName('',this._authService.Token.name).subscribe({
      next:(data)=>{
        console.log(data);
        this.jobProviderId=data.id;
      }
    })
    let x:any = localStorage.getItem("JobSeekerId");
    this.jobSeekerId=JSON.parse(x);
    this._userService.GetJobSeekerById(this.jobSeekerId).subscribe({
      next:(data)=>{
        this.JobSeekerInfo=data;
      }
    })
    this.chatService.getMessagesByJobSeekerId(0,this.jobProviderId).subscribe({
      next:(data)=>{
        console.log(data);
        this.TalkedToPreviously = data;
        
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }
  }
  
  JobSeekerInfo:any;
  sendMessage(jobSeekerId:number,jobProviderId:number):void{
    let msgInpu:any = document.getElementById('msg');
    console.log(msgInpu.value);
    console.log(this.TokenRole);
    
    this.chatService.sendMessage(msgInpu.value,jobProviderId,jobSeekerId,this.TokenRole,this.Token.name);
  }
  getMessageById(MessageId:number){
    this.chatService.getMessageById(MessageId).subscribe({
      next:(data)=>{
        console.log(data);
        
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }
  openNewChat(jobSeekerId:number,jobProviderId:number):void{
    if(this.TokenRole=="JobSeeker"){
      this.chatService.getMessages(jobProviderId,this.jobSeekerId).subscribe({
        next:(data)=>{
          console.log(data);
          data.reverse();
          this.Messages=data;
          
        }
      })
    }
    else{
      this.chatService.getMessages(this.jobProviderId,jobSeekerId).subscribe({
        next:(data)=>{
          console.log(data);
          data.reverse();
          this.Messages=data;
        }
      })
    }
  }
}
