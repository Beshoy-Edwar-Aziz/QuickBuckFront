import { Component, OnInit } from '@angular/core';
import { RouterOutlet,RouterModule } from '@angular/router';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { UsersService } from './Services/users.service';
import { jwtDecode } from 'jwt-decode';
import { AuthServiceService } from './Services/auth-service.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HttpClientModule,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'QuickBuck';
  constructor(private _userService:UsersService, private _authService:AuthServiceService){
    
  }
  User:any;
  Token:any;
  ngOnInit(): void {
    this._userService.GetAllJobSeekers().subscribe({
      next:(data)=>{
        console.log(data);
        this.User = data;
      },
      error:(err)=>{
        console.log(err);
      }
    })
    if(localStorage.getItem('Token')!=null){
    this.Token = (localStorage.getItem('Token'));
    console.log(jwtDecode(this.Token));
   
    }
    this._authService.TokenBehavior.subscribe({
      next:(data)=>{
        this.Token=data;
      }
    })
    // this._userService.GetJobSeekerByUserName(token.name).subscribe({
    //   next:(data)=>{
    //     console.log(data);
    //   },
    //   error:(err)=>{
    //     console.log(err)
    //   }
    // });
    console.log(this.Token); 
   
  }
  signOut():void{
    if(localStorage.getItem('Token')!=null){
      localStorage.removeItem('Token');
      this._authService.updateToken(null);
    }
  }
}
