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
  RecievedMsg:any='';
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
        console.log("working");
        
        this.chatService.recieveMessage().subscribe({
          next:(Message:any)=>{
            console.log("something");
            
            // let x:any =localStorage.getItem('Token');
            // let y= JSON.parse(x);
            // let currentToken:any=jwtDecode(y)
            // console.log(currentToken);
           
            this.RecievedMsg=Message.Message;
          
            let list = document.createElement('li');
            list?.classList?.add('list-unstyled');
            let img = document.createElement('img');
            img.style.width ="50px"
            img.style.height="50px"
            img.style.borderRadius="50%"
            this.Messages.forEach((x:any) => {
                list.style.backgroundColor=" #ECFDFC";
                list.style.textAlign="left";
                list.classList.add('rounded');
                list.classList.add('my-2');
                list.classList.add('p-3');
                list.classList.add('w-50');
                list.classList.add('Generated');
                img.classList.add('Generated');
                  img.src=Message.Image;
                  list.innerHTML = `${this.RecievedMsg}`
                  let unorderedList:any = document.getElementById('MessageWindow');
                  let div = document.createElement('div');
                  div.appendChild(img);
                  div.appendChild(list);
                  div!.style.display="flex"
                  div!.style.gap="2"
                  div!.style.alignItems="center"
                  unorderedList?.appendChild(div);
                  unorderedList!.style.display="flex"
                  unorderedList!.style.gap="2"
                  unorderedList!.style.flexDirection="column"
                  unorderedList.scrollTop= unorderedList?.scrollHeight
              
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
    this.chatService.getMessagesByJobSeekerId(this.jobSeekerId,'').subscribe({
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
    if(this.TokenRole=="JobSeeker"){
      this._userService.GetJobProviderByIdOrByUserName(jobProviderId,'').subscribe({
        next:(data)=>{
          console.log(data);
          try{
          this.chatService.sendMessage(msgInpu.value,jobProviderId,jobSeekerId,this.TokenRole,this.Token.name);
          }
          catch(ex){
            console.log(ex);
            
          }
        }

      })
    }
    else if(this.TokenRole=="JobProvider"){
      this._userService.GetJobSeekerById(jobSeekerId).subscribe({
        next:(data)=>{
          console.log(data);
          this.chatService.sendMessage(msgInpu.value,jobProviderId,jobSeekerId,this.TokenRole,this.Token.name);
        }
        
      })
    }

    let element = document.getElementById('MessageWindow');
    element?.scrollTo(100,400) 
     
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
      this.removesMessages();
      this.chatService.getMessages(jobProviderId,this.jobSeekerId).subscribe({
        next:(data)=>{
          console.log(data);
          data.reverse();
          this.Messages=data;
          this.jobProviderId=jobProviderId;
          this._userService.GetJobProviderByIdOrByUserName(jobProviderId,'').subscribe({
            next:(data)=>{
              this.JobProviderInfo=data;
            }
          })
          console.log(this.JobProviderInfo);
         
          this.chatService.getMessages(this.jobProviderId,this.jobSeekerId).subscribe({
            next:(data)=>{
              console.log(data);
              data.reverse();
              this.Messages=data;
            }
          })
        }
      })
    }
    else{
      this.removesMessages();
      this.chatService.getMessages(this.jobProviderId,jobSeekerId).subscribe({
        next:(data)=>{
          console.log(data);
          data.reverse();
          this.Messages=data;
          this.jobSeekerId=jobSeekerId;
          this._userService.GetJobSeekerById(jobSeekerId).subscribe({
            next:(data)=>{
              this.JobSeekerInfo=data;
            }
          })
          
          this.chatService.getMessages(this.jobProviderId,this.jobSeekerId).subscribe({
            next:(data)=>{
              console.log(data);
              data.reverse();
              this.Messages=data;
            }
          })
        }
      })
    }
  }
  removesMessages():void{
    let msg:any = document.querySelectorAll('#MessageWindow .Generated');
    let img:any = document.querySelectorAll('#MessageWindow img');
    msg.forEach((element:any) => {
      element.remove();
      
    });
    
    console.log(msg);
    
  }
}
