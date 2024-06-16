import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../Services/users.service';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.css'
})
export class CompanyProfileComponent implements OnInit {
  constructor(private _activatedRoute:ActivatedRoute,private _userService:UsersService){

  }
  jobProviderId:any;
  jobProviderDetails:any;
  ngOnInit(): void {
      this.jobProviderId=this._activatedRoute.snapshot.params;
      this._userService.GetJobProviderByIdOrByUserName(this.jobProviderId.id,'').subscribe({
        next:(data)=>{
          console.log(data);
          this.jobProviderDetails=data;
        }
      })
    }

}
