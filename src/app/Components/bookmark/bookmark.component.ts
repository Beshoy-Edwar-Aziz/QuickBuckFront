import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../Services/users.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../Services/auth-service.service';
import { ChatService } from '../../Services/chat.service';
import { JobPostingService } from '../../Services/job-posting.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

let {required,pattern,maxLength,minLength} = Validators;
@Component({
  selector: 'app-bookmark',
  standalone: true,
  imports: [CurrencyPipe,RouterModule,ReactiveFormsModule],
  templateUrl: './bookmark.component.html',
  styleUrl: './bookmark.component.css'
})
export class BookmarkComponent implements OnInit {
  constructor(private _activatedRoute:ActivatedRoute,private _jobPostingService:JobPostingService,private _userService:UsersService, private _router:Router, private _authService:AuthServiceService, private _chatService:ChatService){}
  Id:any;
  jobPostDetails:any;
  PostApplication:FormGroup= new FormGroup({
    CV: new FormControl('',[required]),
    Status:new FormControl('',[required]),
    CoverLetter: new FormControl('',[required])
  })
  reader:any;
  reader2:any;
  decodedToken:any=this._authService.Token;
  jobpost:any;
  jobSeeker:any;
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
  handleCV(event:any):any{
    let file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend= ()=>{
      const base64String = reader.result;
      console.log(base64String);
      this.reader=base64String
    }
 }
 handleCoverLetter(event:any):any{
  let file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend= ()=>{
    const base64String = reader.result;
    console.log(base64String);
    this.reader2=base64String
  }
}
CreateJobApplication(JobPostId:number):void{
  let body={
    "cv": this.reader,
    "status": this.PostApplication.value.Status,
    "coverLetter": this.reader2
  }
  console.log(JobPostId);
  
  this._jobPostingService.GetJobPostById(JobPostId).subscribe({
    next:(Jobpost)=>{
      this.jobpost=Jobpost;
      console.log(Jobpost);
      this._userService.GetJobSeekerByUserName(this.decodedToken.name).subscribe({
        next:(jobseeker)=>{
          this.jobSeeker=jobseeker;
          this._jobPostingService.PostJobApplication(body,Jobpost.jobProvider.id,jobseeker.id,JobPostId).subscribe({
            next:(confirmData)=>{
              console.log(confirmData);
              this._jobPostingService.UpdateJobPostWithJobApplications(JobPostId).subscribe({
                next:(ConfirmUpdate)=>{
                  console.log(JobPostId);
                  
                  console.log(ConfirmUpdate);
                  Swal.fire({
                    title:"Successfully Added Application",
                    text:"Your JobApplication was created successfully",
                    icon:"success"
                  })
                },
                error:(err)=>{
                  console.log(err);
                }
              })
            },
            error:(err)=>{
              console.log(err);
              Swal.fire({
                title:`${err.error.message}`,
                icon:'error'
              })
            }
          })
        }
      })
    },
    error:(err)=>{
      console.log(err);
    }
  })
  
  console.log(this.jobpost);
  
  
}
}
