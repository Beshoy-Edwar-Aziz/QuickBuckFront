import { Component, Input, OnInit } from '@angular/core';
import { UsersService } from '../../Services/users.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../Services/auth-service.service';
import { ChatService } from '../../Services/chat.service';

@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [],
  templateUrl: './candidates.component.html',
  styleUrl: './candidates.component.css'
})
export class CandidatesComponent implements OnInit {
  constructor(private _userService:UsersService, private _router:Router, private _authService:AuthServiceService, private _chatService:ChatService){}
  Candidates:any=[];
  ngOnInit(): void {
    
  }
  onEnter():void{
    let Input:any = document.getElementById('SearchInput');
    console.log(Input.value);
    this._userService.SearchJobSeekersByUserName(Input.value).subscribe({
      next:(data)=>{
        console.log(data);
        this.Candidates=data;
      },
      error:(err)=>{
        console.log(err);
        Swal.fire({
          title:'An Error Occured',
          icon:'error'
        })
      }
    })
  }
  openMessageTO(id:number):void{
    if(this._authService.Token.sub=="JobProvider"){
      this._userService.GetJobSeekerById(id).subscribe({
        next:(data)=>{
          console.log(data);
          this._chatService.jobSeekerId=data.id;
        }
      });
      localStorage.setItem("JobSeekerId",JSON.stringify(id));
      this._userService.GetJobProviderByIdOrByUserName('',this._authService.Token.name).subscribe(
        {
          next:(data)=>{
            console.log(data);
            this._authService.updateJobProviderId(data.id);
            this._authService.CurrentJobProvider.subscribe({
              next:(data)=>{
                localStorage.setItem('JobProviderId',JSON.stringify(data))
                console.log(data);
                
              }
            })
          }
        }
      )
     
    }
    this._router.navigate(['/chat'])
  }

}
