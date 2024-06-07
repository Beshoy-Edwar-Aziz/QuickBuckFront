import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../Services/users.service';
import { AuthServiceService } from '../../Services/auth-service.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  UserData:any;
  constructor(private _userService:UsersService, private _authService:AuthServiceService){

  }
  ngOnInit(): void {
    this._userService.GetJobSeekerByUserName(this._authService.Token.name).subscribe({
      next:(data)=>{
        console.log(data);
        this.UserData=data;
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }
  
}
