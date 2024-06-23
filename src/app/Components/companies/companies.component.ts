import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../Services/users.service';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent implements OnInit {
  Companies:any;
  constructor(private _userService:UsersService){}
  ngOnInit(): void {
    this._userService.GetAllJobProviders().subscribe({
      next:(data)=>{
        console.log(data);
        this.Companies=data;
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
  
}
