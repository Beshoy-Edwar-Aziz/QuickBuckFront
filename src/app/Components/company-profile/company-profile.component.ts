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
@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [LoadingComponent,CurrencyPipe],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.css'
})
export class CompanyProfileComponent implements OnInit {
  constructor(private _activatedRoute:ActivatedRoute,private _authService:AuthServiceService,private _userService:UsersService,private _jobPostingService:JobPostingService, private _paymentService:PaymentService, private _router:Router){

  }
  jobProviderId:any;
  jobProviderDetails:any;
  latestJobPosts:any;
  Token = this._authService.Token;
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
}
