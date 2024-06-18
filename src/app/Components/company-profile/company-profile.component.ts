import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../Services/users.service';
import { JobPostingService } from '../../Services/job-posting.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [LoadingComponent],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.css'
})
export class CompanyProfileComponent implements OnInit {
  constructor(private _activatedRoute:ActivatedRoute,private _userService:UsersService,private _jobPostingService:JobPostingService){

  }
  jobProviderId:any;
  jobProviderDetails:any;
  latestJobPosts:any;
  ngOnInit(): void {
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

}
