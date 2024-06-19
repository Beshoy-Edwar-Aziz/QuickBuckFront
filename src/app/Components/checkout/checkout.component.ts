import { Component, ViewChild,inject,signal } from '@angular/core';
import { _MatInternalFormField } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxStripeModule } from 'ngx-stripe';
import { MatInputModule, } from '@angular/material/input';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';

import {
  injectStripe,
  StripePaymentElementComponent
} from 'ngx-stripe';
import {
  StripeElementsOptions, 
  StripePaymentElementOptions
} from '@stripe/stripe-js';
import Swal from 'sweetalert2';
import { PaymentService } from '../../Services/payment.service';
import { UsersService } from '../../Services/users.service';
import { AuthServiceService } from '../../Services/auth-service.service';
import { Router } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
_MatInternalFormField

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [MatInputModule,MatFormFieldModule,ReactiveFormsModule,NgxStripeModule,StripePaymentElementComponent,MatButtonModule,LoadingComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',

})
export class CheckoutComponent {
  constructor(private _paymentService:PaymentService, private _userService:UsersService, private _authService:AuthServiceService, private _router:Router){

  }
  @ViewChild(StripePaymentElementComponent)
  // -------------------------------------------------------------
  paymentElement!: StripePaymentElementComponent;
  BalanceSet:any=localStorage.getItem('Balance');
  ResultingBalance:any=JSON.parse(this.BalanceSet);
  ClientSecret:any = localStorage.getItem('ClientSecret');
  JobProviderId:any=localStorage.getItem('JobProviderId');
  JobProviderIdSet:any=JSON.parse(this.JobProviderId);
  Flag:boolean=false;
  // --------------------------------------------------------
  private readonly fb = inject(UntypedFormBuilder);
  paymentElementForm = this.fb.group({
    name: ['John Doe', [Validators.required]],
    email: ['support@ngx-stripe.dev', [Validators.required]],
    address: [''],
    zipcode: [''],
    city: [''],
    amount: [this.ResultingBalance+100, [Validators.required, Validators.pattern(/\d+/)]]
  });

  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    clientSecret:`${this.ClientSecret}`,
    appearance: {
      theme: 'flat'
    },
    
  };

  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: false
    }
  };
  stripe = injectStripe('pk_test_51PTQ9NP6POtDoiSmCEqxQpcn8KNvPLTYN1s10I8JO722kzeg0abK4cX1DqH6Mk62hzZLh7yItc3YcjA7L4mFWnUg00ejQcXONx');
  paying = signal(false);

  pay() {
    this.Flag=true;
    if (this.paying() || this.paymentElementForm.invalid) return;
    this.paying.set(true);

    const {
      name,
      email,
      address,
      zipcode,
      city
    } = this.paymentElementForm.getRawValue();

    this.stripe
      .confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: name as string,
              email: email as string,
              address: {
                line1: address as string,
                postal_code: zipcode as string,
                city: city as string
              }
            }
          },
        },
        redirect: 'if_required'
      })
      .subscribe(result => {
        this.paying.set(false);
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          this.Flag=false;
          Swal.fire({
            title:"Payment Failed",
            icon:'error'
          })
          alert({ success: false, error: result.error.message });
        } else {
          this.Flag=false;
          // The payment has been processed!
          Swal.fire({
            title:"Payment Successful",
            icon:'success'
          })
          if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to your customer
            let token = this._authService.Token;
            if(token.sub=="JobProvider"){
            this._userService.GetJobProviderByIdOrByUserName(this.JobProviderIdSet,'').subscribe({
              next:(data)=>{
                console.log(data);
                this._paymentService.updateBalance(data.wallet.id,this.ResultingBalance).subscribe({
                  next:(data)=>{
                    console.log(data);
                    Swal.fire({
                      title:"Your Wallet Balance Updated",
                      text:`${this.ResultingBalance} is Added To Your Wallet`,
                      icon:'success'
                    })
                    this._router.navigate([`/CompanyProfile/${this.JobProviderIdSet}`])
                  }
                })
              }
            })
          }else if(token.sub=="JobSeeker"){
            let id:any = localStorage.getItem('JobSeekerId');
            let res= JSON.parse(id);
            this._userService.GetJobSeekerById(res).subscribe({
              next:(data)=>{
                this._paymentService.updateBalance(data.wallet.id,this.ResultingBalance).subscribe({
                  next:(data)=>{
                    console.log(data);
                    Swal.fire({
                      title:"Your Wallet Balance Updated",
                      text:`${this.ResultingBalance} is Added To Your Wallet`,
                      icon:'success'
                    })
                   this._router.navigate([`/UserProfile/${res}`]) 
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
          }
            
          }
        }
      });
  }
}
