import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../Services/users.service';
import { AuthServiceService } from '../../Services/auth-service.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  UserData:any;
  Id:any;
  constructor(private _userService:UsersService, private _authService:AuthServiceService,private _activatedRoute:ActivatedRoute){

  }
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
  
}
