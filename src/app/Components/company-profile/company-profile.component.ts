import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../Services/users.service';
import { JobPostingService } from '../../Services/job-posting.service';
import { LoadingComponent } from '../loading/loading.component';
import { CurrencyPipe } from '@angular/common';
import { PaymentService } from '../../Services/payment.service';
import Swal from 'sweetalert2';
import { AuthServiceService } from '../../Services/auth-service.service';
import { Token } from '@angular/compiler';

import AOS from 'aos'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
let {required,pattern,maxLength,minLength} = Validators;
@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [LoadingComponent,CurrencyPipe,ReactiveFormsModule],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.css'
})
export class CompanyProfileComponent implements OnInit {
  constructor(private _activatedRoute:ActivatedRoute,private _authService:AuthServiceService,private _userService:UsersService,private _jobPostingService:JobPostingService, private _paymentService:PaymentService, private _router:Router){

  }
  jobProviderId:any;
  jobProviderDetails:any;
  latestJobPosts:any;
  AllJobPosts:any;
  Token = this._authService.Token;
  UpdateJob:FormGroup=new FormGroup({
    title: new FormControl('',[maxLength(20),minLength(2)]),
    requiredSkills:new FormControl('',[maxLength(50),minLength(2)]),
    requiredSkills2:new FormControl('',[maxLength(50),minLength(2)]),
    requiredSkills3:new FormControl('',[maxLength(50),minLength(2)]),
    requiredSkills4:new FormControl('',[maxLength(50),minLength(2)]),
    email:new FormControl('',[maxLength(25),minLength(2)]),
    description:new FormControl('',[minLength(10)]),
    reqName:new FormControl('',[]),
    reqPriority:new FormControl(''),
    reqName2:new FormControl('',[]),
    reqPriority2:new FormControl(''),
    reqName3:new FormControl('',[]),
    reqPriority3:new FormControl(''),
    reqName4:new FormControl('',[]),
    reqPriority4:new FormControl(''),
    type:new FormControl('',[]),
    location:new FormControl('',[minLength(10)]),
    salaryRangeFrom: new FormControl('',[]),
    salaryRangeTo: new FormControl('',[]),
    date:new FormControl('',[]),
    content:new FormControl('',[minLength(10)])
  })
  ngOnInit(): void {
    AOS.init();
      this.jobProviderId=this._activatedRoute.snapshot.params;
      this._userService.GetJobProviderByIdOrByUserName(this.jobProviderId.id,'').subscribe({
        next:(data)=>{
          console.log(data);
          this.jobProviderDetails=data;
          this._jobPostingService.getJobPostByJobProviderId(data.id).subscribe({
            next:(data)=>{
              console.log(data);
              this.latestJobPosts=data;
            }
          })
        }
      })
      
    }
    PayForCharge(){
      let input:any = document.getElementById('balance');
      let Balance:number = input.value;
      localStorage.setItem('PaymentType','Charge');
      let PaymentType = localStorage.getItem('PaymentType');
      console.log(PaymentType);
      console.log(Balance);
      
        this._paymentService.createOrUpdatePaymentIntent(this.jobProviderDetails.wallet.id,Balance).subscribe({
          next:(data)=>{
            console.log(data);
            localStorage.setItem('PaymentIntentId',data.paymentIntentId);
            localStorage.setItem('ClientSecret',data.clientSecret);
            localStorage.setItem("Balance",JSON.stringify(Balance));
            this._router.navigate(['/Checkout']);
          },
          error:(err)=>{
            console.log(err);
          }
        });      
    }
    ShowProvidersJobPosts(JobProviderId:number){
        this._jobPostingService.getAllJobPostsByJobProviderId(JobProviderId).subscribe({
          next:(data)=>{
            console.log(data);
            this.AllJobPosts=data;
          },
          error:(err)=>{
            console.log(err);
            Swal.fire({
              title:"Something Went Wrong Try Again Later",
              icon:"error"
            })
          }
        })
    }
    PostInfo:any;
    JobPost:any;
    OpenUpdate(JobPostId:number):void{
      this._jobPostingService.GetJobPostById(JobPostId).subscribe({
        next:(data)=>{
          console.log(data);
          this.JobPost=data;
          this.PostInfo=data;
        }
      })
    }
    UpdateJobPost():void{
      console.log(this.UpdateJob.value);
      let Body:object={
        "title": this.UpdateJob.value.title==''?this.JobPost?.title:this.UpdateJob.value.title,
        "requiredSkills": [
          {
            "name": this.UpdateJob.value.requiredSkills==''?this.JobPost?.requiredSkills[0]?.name:this.UpdateJob.value.requiredSkills
          },
          {
            "name": this.UpdateJob.value.requiredSkills2==''?this.JobPost?.requiredSkills[1]?.name:this.UpdateJob.value.requiredSkills2
          },
          {
            "name": this.UpdateJob.value.requiredSkills3==''?this.JobPost?.requiredSkills[2]?.name:this.UpdateJob.value.requiredSkills3
          },
          {
            "name": this.UpdateJob.value.requiredSkills4==''?this.JobPost?.requiredSkills[3]?.name:this.UpdateJob.value.requiredSkills4
          }
          
        ],
        "email": this.UpdateJob.value.email==''?this.JobPost?.email:this.UpdateJob.value.email,
        "description": this.UpdateJob.value.description==''?this.JobPost?.description:this.UpdateJob.value.description,
        "requirements": [
          {
            "reqName": this.UpdateJob.value.reqName==''?this.JobPost?.requirements[0]?.reqName:this.UpdateJob.value.reqName,
            "reqPriority": this.UpdateJob.value.reqPriority==''?this.JobPost?.requirements[0]?.reqPriority:this.UpdateJob.value.reqPriority
          },
          {
            "reqName": this.UpdateJob.value.reqName2==''?this.JobPost?.requirements[1]?.reqName:this.UpdateJob.value.reqName2,
            "reqPriority": this.UpdateJob.value.reqPriority2==''?this.JobPost?.requirements[1]?.reqPriority:this.UpdateJob.value.reqPriority2
          },
          {
            "reqName": this.UpdateJob.value.reqName3==''?this.JobPost?.requirements[2]?.reqName:this.UpdateJob.value.reqName3,
            "reqPriority": this.UpdateJob.value.reqPriority3==''?this.JobPost?.requirements[2]?.reqPriority:this.UpdateJob.value.reqPriority3
          },
          {
            "reqName": this.UpdateJob.value.reqName4==''?this.JobPost?.requirements[3]?.reqName:this.UpdateJob.value.reqName4,
            "reqPriority": this.UpdateJob.value.reqPriority4==''?this.JobPost?.requirements[3]?.reqPriority:this.UpdateJob.value.reqPriority4
          }
        ],
        "type": this.UpdateJob.value.type==''?this.JobPost?.type:this.UpdateJob.value.type,
        "location": this.UpdateJob.value.location==''?this.JobPost?.location:this.UpdateJob.value.location,
        "salaryRangeFrom": this.UpdateJob.value.salaryRangeFrom==''?this.JobPost?.salaryRangeFrom:this.UpdateJob.value.salaryRangeFrom,
        "salaryRangeTo": this.UpdateJob.value.salaryRangeTo==''?this.JobPost?.salaryRangeTo:this.UpdateJob.value.salaryRangeTo,
        "content": this.UpdateJob.value.content==''?this.JobPost?.content:this.UpdateJob.value.content
      }
      console.log(Body);
      this._jobPostingService.UpdateJobPost(Body,this.JobPost.id).subscribe({
        next:(data)=>{
          console.log(data);
          Swal.fire({
            title:"Post Successfully Updated",
            icon:'success'
          })
        },
        error:(err)=>{
          console.log(err);
          Swal.fire({
            title:"Update Failed",
            text:`${err.error.message}`,
            icon:'error'
          })
        }
      })
      }
      JobPostId:number=0;
      ConfirmDelete(JobPostId:number){
       this.JobPostId=JobPostId;
        
      }
     DeleteJobPost():void{
        this._jobPostingService.deleteJobPost(this.JobPostId).subscribe({
          next:(data)=>{
            console.log(data);
            Swal.fire({
              title:`Successfully Deleted`,
              icon:'success'
            })
          },
          error:(err)=>{
            console.log(err);
            Swal.fire({
              title:'Delete Failed',
              text:`${err.error.message}`,
              icon:'error'
            })
          }
        })
     } 
    }

