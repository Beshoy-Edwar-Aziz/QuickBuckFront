import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../Services/users.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../Services/auth-service.service';
import { ChatService } from '../../Services/chat.service';
import { JobPostingService } from '../../Services/job-posting.service';

@Component({
  selector: 'app-bookmark',
  standalone: true,
  imports: [CurrencyPipe,RouterModule],
  templateUrl: './bookmark.component.html',
  styleUrl: './bookmark.component.css'
})
export class BookmarkComponent implements OnInit {
  constructor(private _activatedRoute:ActivatedRoute,private _jobPostingService:JobPostingService,private _userService:UsersService, private _router:Router, private _authService:AuthServiceService, private _chatService:ChatService){}
  Id:any;
  jobPostDetails:any;

  ngOnInit(): void {
   let id:any= this._activatedRoute.snapshot.params;
  this.Id=id.id;
  this._jobPostingService.GetJobPostById(this.Id).subscribe({
    next:(data)=>{
      console.log(data);
      this.jobPostDetails=data;
    },
    error:(err)=>{
      console.log(err);
    }
  })
  }
  openMessage(id:number):void{
    console.log(id);
    
    this._userService.GetJobProviderByIdOrByUserName(id,'').subscribe({
      next:(data)=>{
        console.log(data);
        localStorage.setItem('JobProviderId',JSON.stringify(id))
      }
    });
    console.log(this._authService.Token.name);
    this._userService.GetJobSeekerByUserName(this._authService.Token.name).subscribe({
      next:(data)=>{
        console.log(data);
        
         this._userService.GetJobSeekerById(data.id).subscribe({
          next:()=>{
            this._chatService.jobSeekerId=data.id;
            console.log(this._chatService.jobSeekerId);
            localStorage.setItem('JobSeekerId',JSON.stringify(data.id));
            let x:any =localStorage.getItem('JobSeekerId');
            let result=JSON.parse(x);
            console.log(result);
            this._authService.updateJobSeekerId(result);
          }
         })
      }
    });
    this._router.navigate(['/chat'])
  }
}
