import { Component, OnInit } from '@angular/core';
import { JobPostingService } from '../../Services/job-posting.service';
import { UsersService } from '../../Services/users.service';
import { Router } from '@angular/router';
import AOS from "aos";
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit {
  constructor(private _jobPostingService:JobPostingService, private _userService:UsersService, private _router:Router){

  }
  JobPosts:any;
  JobProviders:any;
  ngOnInit(): void {
    AOS.init();
    this._jobPostingService.GetAllJobPosts().subscribe({
      next:(JobPosts)=>{
        console.log(JobPosts);
        this.JobPosts=JobPosts.data;
      },
      error:(err)=>{
          console.log(err);
      }
     
    });
    this._userService.GetAllJobProviders().subscribe({
      next:(data)=>{
        console.log(data);
        this.JobProviders=data;
      },
      error:(err)=>{
        console.log(err);

      }
    })
  }
  navigateToJobPosts():void{
    this._router.navigate(['/Home']);
  }

}
