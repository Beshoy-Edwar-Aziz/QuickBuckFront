import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, OnInit, output } from '@angular/core';
import { JobPostingService } from '../../Services/job-posting.service';
import { CurrencyPipe } from '@angular/common';
import { FormGroup,FormControl,ReactiveFormsModule, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { AuthServiceService } from '../../Services/auth-service.service';
import { max, min } from 'rxjs';
import { UsersService } from '../../Services/users.service';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../loading/loading.component';
import { Router } from '@angular/router';
import { ChatService } from '../../Services/chat.service';
import { Token } from '@angular/compiler';
let {required,pattern,maxLength,minLength} = Validators;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule,CurrencyPipe,ReactiveFormsModule,LoadingComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  constructor(private _chatService:ChatService,private _jobPostingService:JobPostingService, private _authService:AuthServiceService,private _userService:UsersService, private _router:Router){

  }
  JobPosts:any=[];
  decodedToken:any;
  currentDate:any
  reader:any;
  reader2:any;
  PostJob:FormGroup=new FormGroup({
    title: new FormControl('',[required,maxLength(20),minLength(2)]),
    requiredSkills:new FormControl('',[required,maxLength(50),minLength(2)]),
    requiredSkills2:new FormControl('',[required,maxLength(50),minLength(2)]),
    requiredSkills3:new FormControl('',[required,maxLength(50),minLength(2)]),
    requiredSkills4:new FormControl('',[required,maxLength(50),minLength(2)]),
    email:new FormControl('',[required,maxLength(25),minLength(2)]),
    description:new FormControl('',[required,minLength(10)]),
    reqName:new FormControl('',[required]),
    reqPriority:new FormControl(''),
    reqName2:new FormControl('',[required]),
    reqPriority2:new FormControl(''),
    reqName3:new FormControl('',[required]),
    reqPriority3:new FormControl(''),
    reqName4:new FormControl('',[required]),
    reqPriority4:new FormControl(''),
    type:new FormControl('',[required]),
    location:new FormControl('',[required,minLength(10)]),
    salaryRangeFrom: new FormControl('',[required]),
    salaryRangeTo: new FormControl('',[required]),
    date:new FormControl('',[required]),
    content:new FormControl('',[required,minLength(10)])
  })
  PostApplication:FormGroup= new FormGroup({
    CV: new FormControl('',[required]),
    Status:new FormControl('',[required]),
    CoverLetter: new FormControl('',[required])
  })
  role:any = `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`;
  jobPostDetails:any=[];
  JobProviderCheck:any;
  ngOnInit(): void {
   
    this._jobPostingService.GetAllJobPosts().subscribe({
      next:(JobPosts)=>{
        console.log(JobPosts);
        this.JobPosts=JobPosts.data;
      },
      error:(err)=>{
          console.log(err);
      }
     
    });
    if(localStorage.getItem('Token')!=null){
      let token:any=localStorage.getItem('Token');
      this.decodedToken=jwtDecode(token);
      this._authService.Token=this.decodedToken;
      this._userService.GetJobProviderByIdOrByUserName('',this.decodedToken.name).subscribe({
        next:(data)=>{
          this.JobProviderCheck=data;
          console.log(data);
          
        }
      })
    }
   
  }
 JobProviderId:any;

  CreatePost():void{
      console.log(this.PostJob.value);
      let body:object={
        "title": this.PostJob.value.title,
        "requiredSkills": [
          {
            "name": this.PostJob.value.requiredSkills
          },
          {
            "name": this.PostJob.value.requiredSkills2
          },
          {
            "name": this.PostJob.value.requiredSkills3
          },
          {
            "name": this.PostJob.value.requiredSkills4
          }
          
        ],
        "email": this.PostJob.value.email,
        "description": this.PostJob.value.description,
        "requirements": [
          {
            "reqName": this.PostJob.value.reqName,
            "reqPriority": this.PostJob.value.reqPriority
          },
          {
            "reqName": this.PostJob.value.reqName2,
            "reqPriority": this.PostJob.value.reqPriority2
          },
          {
            "reqName": this.PostJob.value.reqName3,
            "reqPriority": this.PostJob.value.reqPriority3
          },
          {
            "reqName": this.PostJob.value.reqName4,
            "reqPriority": this.PostJob.value.reqPriority4
          }
        ],
        "type": this.PostJob.value.type,
        "location": this.PostJob.value.location,
        "salaryRangeFrom": this.PostJob.value.salaryRangeFrom,
        "salaryRangeTo": this.PostJob.value.salaryRangeTo,
        "applicants": 0,
        "viewed": 0,
        "inConsideration": 0,
        "content": this.PostJob.value.content
      }
      this._userService.GetJobProviderByIdOrByUserName('',this.decodedToken.name).subscribe({
        next:(data)=>{
          console.log(data.id);
           this._jobPostingService.PostJob(body,data.id).subscribe({
        next:(data)=>{
          console.log(data);
          Swal.fire({
            title:"Job Has Been Successully Posted",
            icon:'success'
          })
        },
        error:(err)=>{
          console.log(err);
          Swal.fire({
            title:"Something Has Gone Wrong Try Again",
            icon:'error'
          })
        }
      })
        },
        error:(err)=>{
          console.log(err);
        }
      })  
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
jobpost:any;
jobSeeker:any;
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
 
  show:any
  ShowPost(PostId:number):void{
    console.log(PostId);
    
    this._jobPostingService.GetJobPostById(PostId).subscribe({
      next:(data)=>{
        this.jobPostDetails = data;
        console.log(data);
        let x = new Date();
        let year = data.date.split('-')[0];
        let month = data.date.split('-')[1]
        let day = data.date.split('-')[2].split('T')[0]
        let y = new Date(`${year}/${month}/${day}`);
        console.log(Math.abs(y.getDate()-x.getDate()));
        console.log(Math.abs(y.getHours()-x.getHours()));
        
        this.currentDate = Math.abs(y.getDate()-x.getDate())+'d';
        if(this.currentDate>30){
          this.currentDate = Math.abs(y.getMonth()-x.getMonth())+'M';
          if(this.currentDate>12){
            this.currentDate = Math.abs(y.getFullYear()-x.getFullYear())+'Y';
          }
        }
        this._authService.updateJobProviderId(data.jobProvider.id);
        this._authService.CurrentJobProvider.subscribe({
          next:(data)=>{
            console.log(data);
            localStorage.setItem('JobProviderId',data);
          }
        })

      },
      error:(err)=>{
        console.log(err);
        Swal.fire({
          title:"Something Went Wrong",
          icon:"error"
        })
      }
    })
  }
  openMessage(id:number):void{
    console.log(id);
    if(this.decodedToken.sub=="JobSeeker"){
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
    });}else if(this.decodedToken.sub=="JobProvider"){
      this._userService.GetJobSeekerById(this.ApplicantsInfo.id).subscribe({
        next:(data)=>{
          console.log(data);
          this._chatService.jobSeekerId=data.id;
        }
      });
      localStorage.setItem("JobSeekerId",JSON.stringify(this.ApplicantsInfo.id));
     
    }
    this._router.navigate(['/chat'])
  }
  openMessageTO():void{

    if(this.decodedToken.sub=="JobProvider"){
      this._userService.GetJobSeekerById(this.ApplicantsInfo.id).subscribe({
        next:(data)=>{
          console.log(data);
          this._chatService.jobSeekerId=data.id;
        }
      });
      localStorage.setItem("JobSeekerId",JSON.stringify(this.ApplicantsInfo.id));
      this._userService.GetJobProviderByIdOrByUserName('',this.decodedToken.name).subscribe(
        {
          next:(data)=>{
            console.log(data);
            this._authService.updateJobProviderId(data.id);
            this._authService.CurrentJobProvider.subscribe({
              next:(data)=>{
                localStorage.setItem('JobProviderId',JSON.stringify(data))
                console.log(data);
                
              }
            })
          }
        }
      )
     
    }
    this._router.navigate(['/chat'])
  }
  ApplicantsInfo:any;
  showUser(JobSeekerId:number):void{
    this._userService.GetJobSeekerById(JobSeekerId).subscribe({
      next:(data)=>{
        console.log(data);
          this.ApplicantsInfo=data;
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }

}
