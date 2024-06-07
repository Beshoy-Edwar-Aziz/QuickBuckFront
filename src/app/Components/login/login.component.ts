import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup,FormControl,ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '../../Services/auth-service.service';
import { Router } from '@angular/router';
let {pattern,minLength,maxLength,required}= Validators

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private _authService:AuthServiceService, private _Router:Router){

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
        this._Router.navigate(['/Home']);
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }
}
