import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterOutlet,RouterModule, Router } from '@angular/router';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { UsersService } from './Services/users.service';
import { jwtDecode } from 'jwt-decode';
import { AuthServiceService } from './Services/auth-service.service';
import { NgOptimizedImage, NgStyle } from '@angular/common';
import { FooterComponent } from './Components/footer/footer.component';
import { ChatService } from './Services/chat.service';
import { JobPostingService } from './Services/job-posting.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HttpClientModule,RouterModule,NgStyle,NgOptimizedImage,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit{
  title = 'QuickBuck';
  constructor(private _userService:UsersService, private _authService:AuthServiceService, private _chatService:ChatService, private _jobPostingService:JobPostingService, private _router:Router){
    
  }
  ngAfterViewInit(): void {
    if(localStorage.getItem('Token')!=null){
      this.Token==this._authService.Token;
    }else if(localStorage.getItem('Token')==null||localStorage.getItem('Token')==''){
      this.Token =null;
    }
console.log(this.Token);

  }
  User:any;
  Token:any;
  UserInfo:any;
  TokenService:any;
  Id:number=0;
  Messages:any;
  Count:number=0;
  BookMarks:any;
  ngOnInit(): void {    
   
   console.log(this.UserInfo);
    console.log(this.TokenService);
    console.log(this.Token);
    
    this._userService.GetAllJobSeekers().subscribe({
      next:(data)=>{
        console.log(data);
        this.User = data;
      },
      error:(err)=>{
        console.log(err);
      }
    })
    this._authService.CurrentUserInfo.subscribe({
      next:(data)=>{
        console.log(data);
        
        this.UserInfo=data
      }
    })
    this._authService.currentToken.subscribe({
      next:(data)=>{
      console.log(jwtDecode(data));
      this.TokenService=jwtDecode(data);
      }
    })
    this._authService.CurrentId.subscribe({
      next:(data)=>{
        console.log(data);
        this.Id=data;
      }
    })
    if(localStorage.getItem('Token')!=null){
    this.Token = (localStorage.getItem('Token'));
    console.log(jwtDecode(this.Token));
    this.TokenService=this._authService.Token;
    console.log(this.TokenService.sub);
    
    if(this.TokenService.sub=="JobSeeker"){
      this._userService.GetJobSeekerByUserName(this.TokenService.name).subscribe({
        next:(data)=>{
          console.log(data);
          this.UserInfo=data;
          console.log(this.UserInfo);
          this.Id=data.id;
          this._authService.updateId(data.id);
          console.log(this.Id);
          
          this._chatService.getMessagesByJobSeekerId(this.Id,0).subscribe({
            next:(data)=>{
              console.log(data);
              this.Messages=data;
            },
            error:(err)=>{
              console.log(err);
              
            }
          })
        }
      })
    }
    
    else{
      this._userService.GetJobProviderByIdOrByUserName('',this.TokenService.name).subscribe({
        next:(data)=>{
          console.log(data);
          
          this.UserInfo=data;
         
          this.Id=data.id;
          this._authService.updateId(data.id);
          this._chatService.getMessagesByJobSeekerId(0,this.Id).subscribe({
            next:(data)=>{
              console.log(data);
              this.Messages=data;
            },
            error:(err)=>{
              console.log(err);
              
            }
          })

        }
      })
    }
    }
    this._authService.TokenBehavior.subscribe({
      next:(data)=>{
        this.Token=data;
      }
    })
    // this._userService.GetJobSeekerByUserName(token.name).subscribe({
    //   next:(data)=>{
    //     console.log(data);
    //   },
    //   error:(err)=>{
    //     console.log(err)
    //   }
    // });
    console.log(this.Token); 
   
  }
  signOut():void{
    if(localStorage.getItem('Token')!=null){
      localStorage.removeItem('Token');
      this._authService.updateToken(null);
    }
  }
  openBookmarks(JobSeekerId:number):void{
    this._jobPostingService.getBookmarksByJobSeekerId(JobSeekerId).subscribe({
      next:(data)=>{
        console.log(data);
        this.Count=data.length;
        this.BookMarks=data;
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
  openBookmarkPage(JobPostId:number):void{
    this._router.navigate([`/Bookmark/${JobPostId}`])
  }
  OpenLatestMessages():void{
    console.log(this.Id);
    
    if(this.TokenService.sub=="JobSeeker"){
      this._chatService.getMessagesByJobSeekerId(this.Id,0).subscribe({
        next:(data)=>{
          console.log(data);
          this.Messages=data;
        },
        error:(err)=>{
          console.log(err);
          
        }
      })
    }else if(this.TokenService.sub=="JobProvider"){
      this._chatService.getMessagesByJobSeekerId(this.Id,0).subscribe({
        next:(data)=>{
          console.log(data);
          this.Messages=data;
        },
        error:(err)=>{
          console.log(err);
          
        }
      })
    }
  }
}
