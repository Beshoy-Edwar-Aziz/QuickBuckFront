import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup,FormControl,ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '../../Services/auth-service.service';
import { Router } from '@angular/router';
import { UsersService } from '../../Services/users.service';
import { jwtDecode } from 'jwt-decode';
let {pattern,minLength,maxLength,required}= Validators

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private _authService:AuthServiceService, private _userService:UsersService,private _Router:Router){

  }
  Login:FormGroup = new FormGroup({
    email:new FormControl('',[required,pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
    password:new FormControl('',[required,pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)])
  });
  handleLogin(){
    console.log(this.Login.value);
    let body:any={  
        "Email":this.Login.value.email,
        "Password":this.Login.value.password
    }
    this._authService.Login(body).subscribe({
      next:(data)=>{
        console.log(data);
       let JSONString:any= JSON.stringify(data.token);
       localStorage.setItem('Token',JSONString);
       this._authService.updateToken(data.token);
       let tok:any=jwtDecode(data.token);
       if(tok.sub=="JobSeeker"){
       this._userService.GetJobSeekerByUserName(tok.name).subscribe({
        next:(data)=>{
          this._authService.updateJobSeekerId(data.id);
        }
       })
      }else{
        this._userService.GetJobProviderByIdOrByUserName('',tok.name).subscribe({
          next:(data)=>{
            console.log(data);
            
            this._authService.updateJobProviderId(data.id);
            
          }
        })
      }
        this._Router.navigate(['/Home']);
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }
}