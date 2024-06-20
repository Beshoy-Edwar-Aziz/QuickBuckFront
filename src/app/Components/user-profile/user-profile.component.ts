import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../Services/users.service';
import { AuthServiceService } from '../../Services/auth-service.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PaymentService } from '../../Services/payment.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,CurrencyPipe],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  UserData:any;
  Id:any;
  reader:any;
  constructor(private _userService:UsersService, private _authService:AuthServiceService,private _activatedRoute:ActivatedRoute, private _paymentService:PaymentService, private _router:Router){

  }
  EditProfile:FormGroup=new FormGroup({
    id:new FormControl('',Validators.required),
    university:new FormControl('',Validators.required),
    college:new FormControl('',Validators.required),
    photo:new FormControl('',Validators.required),
    currentYear:new FormControl('',Validators.required),
    status:new FormControl('',Validators.required),
    skills:new FormControl(''),
    skills2:new FormControl(''),
    skills3:new FormControl(''),
    skills4:new FormControl(''),
    skills5:new FormControl('')
  })
  ngOnInit(): void {
      let id :any=this._activatedRoute.snapshot.params;
      this.Id=id.id
      this._userService.GetJobSeekerById(this.Id).subscribe({
        next:(data)=>{
          console.log(data);
          this.UserData=data;
        },
        error:(err)=>{
          console.log(err);
        }
      })
    }
    handlePhotos(event:any):any{
      let file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend= ()=>{
        const base64String = reader.result;
        console.log(base64String);
        this.reader=base64String;
      }
   }
   handleEdit():void{
    console.log(this.UserData);
    
      console.log(this.EditProfile.value);
      let body:object={
        "id": this.EditProfile.value.id==''||0?this.UserData.id:this.EditProfile.value.id,
        "university": this.EditProfile.value.university==''?this.UserData.university:this.EditProfile.value.university,
        "college": this.EditProfile.value.college==''?this.UserData.college:this.EditProfile.value.college,
        "photo": this.reader!=''?this.reader:this.UserData.photo,
        "currentYear": this.EditProfile.value.currentYear==''?this.UserData.currentYear:this.EditProfile.value.currentYear,
        "status": this.EditProfile.value.status==''?this.UserData.status:this.EditProfile.value.status,
        "skills": [
          {
            "name": this.EditProfile.value.skills==''?this.UserData.skills[0]?.name:this.EditProfile.value.skills
          },
          {
            "name":this.EditProfile.value.skills2==''?this.UserData.skills[1]?.name:this.EditProfile.value.skills2
          },
          {
            "name":this.EditProfile.value.skills3==''?this.UserData.skills[2]?.name:this.EditProfile.value.skills3
          },
          {
            "name":this.EditProfile.value.skills4==''?this.UserData.skills[3]?.name:this.EditProfile.value.skills4
          },
          {
            "name":this.EditProfile.value.skills5==''?this.UserData.skills[4]?.name:this.EditProfile.value.skills5
          }
        ]
      }
      this._userService.updateJobSeeker(body).subscribe({
        next:(data)=>{
          console.log(data);
          Swal.fire({
            title:"Success",
            text:"Successfully updated user's info",
            icon:'success'
          })
        },
        error:(err)=>{
          console.log(err);
          Swal.fire({
            title:"Failure",
            text:`${err.error.message}`,
            icon:'error'
          })
        }
      })
   }
   PayForCharge(){
    let input:any = document.getElementById('balance');
    let Balance = input.value;
    localStorage.setItem('PaymentType','Charge');
    let PaymentType = localStorage.getItem('PaymentType');
    console.log(PaymentType);
    this._paymentService.createOrUpdatePaymentIntent(this.UserData.wallet.id,Balance).subscribe({
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
