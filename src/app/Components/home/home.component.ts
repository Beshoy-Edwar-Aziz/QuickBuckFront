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
let {required,pattern,maxLength,minLength} = Validators;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule,CurrencyPipe,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  constructor(private _jobPostingService:JobPostingService, private _authService:AuthServiceService,private _userService:UsersService){

  }
  JobPosts:any=[];
  decodedToken:any;
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
  role:any = `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`;
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
      this._userService.GetJobProviderByIdOrByUserName(0,this.decodedToken.name).subscribe({
        next:(data)=>{
          console.log(data[0].id);
           this._jobPostingService.PostJob(body,data[0].id).subscribe({
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
  

}
