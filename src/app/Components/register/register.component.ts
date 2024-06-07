import { Component,OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AuthServiceService } from '../../Services/auth-service.service';
import { ReactiveFormsModule} from '@angular/forms';
import { FormControl, FormGroup, MinLengthValidator, RequiredValidator, Validators } from '@angular/forms';

let {pattern,minLength,maxLength,email,required} = Validators;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [HttpClientModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  constructor(private _authService:AuthServiceService){

  }
  ngOnInit(): void {
   
  }
  check(){
     this.Register.controls['role'].valueChanges.subscribe(val=>{
      if(val=="JobProvider"){
        this.Register.controls['companyName'].setValidators(required);
        this.Register.controls['location'].setValidators(required);
        this.Register.controls['noOfEmployees'].setValidators(required);
        this.Register.controls['category'].setValidators(required);
        this.Register.controls['university'].clearValidators();
        this.Register.controls['college'].clearValidators();
        this.Register.controls['birthDate'].clearValidators();
        this.Register.controls['currentYear'].clearValidators();
        this.Register.controls['status'].clearValidators();
      }
      else if(val="JobSeeker"){
        this.Register.controls['university'].setValidators(required);
        this.Register.controls['college'].setValidators(required);
        this.Register.controls['birthDate'].setValidators(required);
        this.Register.controls['currentYear'].setValidators(required);
        this.Register.controls['status'].setValidators(required);
        this.Register.controls['companyName'].clearValidators();
        this.Register.controls['location'].clearValidators();
        this.Register.controls['noOfEmployees'].clearValidators();
        this.Register.controls['category'].clearValidators();
      }
    })
  }
  Register:FormGroup=new FormGroup({
    FirstName : new FormControl('',[required,minLength(3),maxLength(50)]),
    LastName : new FormControl('',[required,minLength(3),maxLength(50)]),
    email: new FormControl('',[required,email]),
    password: new FormControl('',[required,Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]),
    repassword:new FormControl('',[required,Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]),
    role:new FormControl('',[required]),
    Phone:new FormControl('',[required]),
    country:new FormControl('',[required,minLength(3),maxLength(50)]),
    city:new FormControl('',[required,minLength(3),maxLength(50)]),
    streetName:new FormControl('',[required]),
    streetNumber:new FormControl('',[required]),
    companyName:new FormControl(''),
    location:new FormControl(''),
    companySize:new FormControl(''),
    noOfEmployees:new FormControl(''),
    category:new FormControl(''),
    webSite:new FormControl(''),
    logo:new FormControl(''),
    description:new FormControl(''),
    university:new FormControl(''),
    college:new FormControl(''),
    birthDate:new FormControl(''),
    photo:new FormControl(''),
    currentYear:new FormControl(''),
    status:new FormControl(''),
    skillName:new FormControl('')

  })
  body:any
  checkcontrols(){
    let invalid =[];
    let controls=this.Register.controls;
   for(let x in controls){
    if(controls[x].invalid){
      invalid.push(x);
    }
   }
   console.log(invalid);
  }
  reader:any;
 handlePhotos(event:any):any{
    let file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend= ()=>{
      const base64String = reader.result;
      console.log(base64String);
      this.reader=base64String
    }
 }
  handleRegister():any{
    console.log(this.Register.value.password);
    console.log(this.Register);
    this.checkcontrols();
   
    console.log(this.reader);
    
    if(this.Register.value.role=="JobSeeker"){
        this.body ={
      "FirstName": this.Register.value.FirstName,
      "LastName": this.Register.value.LastName,
      "email": this.Register.value.email,
      "password": this.Register.value.password,
      "role": this.Register.value.role,
      "Phone": this.Register.value.Phone,
      "address": 
        {
          "country": this.Register.value.country,
          "city": this.Register.value.city,
          "streetName": this.Register.value.streetName,
          "streetNumber": this.Register.value.streetNumber
        }
      ,
      "jobSeeker": {
        "university": this.Register.value.university,
        "college": this.Register.value.college,
        "birthDate": this.Register.value.birthDate,
        "photo": this.reader,
        "currentYear": this.Register.value.currentYear,
        "status": this.Register.value.status,
        "skills": [
          {
            "name": this.Register.value.skillName
          }
        ]
      }
     }
       
    }else if(this.Register.value.role=="JobProvider"){
      this.body={
        "FirstName": this.Register.value.FirstName,
      "LastName": this.Register.value.LastName,
      "email": this.Register.value.email,
      "password": this.Register.value.password,
      "role": this.Register.value.role,
      "Phone": this.Register.value.Phone,
      "address": 
        {
          "country": this.Register.value.country,
          "city": this.Register.value.city,
          "streetName": this.Register.value.streetName,
          "streetNumber": this.Register.value.streetNumber
        }
      ,
      "jobProvider": {
        "companyName": this.Register.value.companyName,
        "location": this.Register.value.location,
        "companySize": this.Register.value.companySize,
        "noOfEmployees": this.Register.value.noOfEmployees==""?0:this.Register.value.noOfEmployees,
        "category": this.Register.value.category,
        "webSite": this.Register.value.webSite,
        "logo": this.Register.value.logo==null?this.Register.value.photo:this.Register.value.logo,
        "description": this.Register.value.description
      }
      }
    }
    // this.body={
    //   "FirstName": this.Register.value.FirstName,
    //   "LastName": this.Register.value.LastName,
    //   "email": this.Register.value.email,
    //   "password": this.Register.value.password,
    //   "role": this.Register.value.role,
    //   "Phone": this.Register.value.Phone,
    //   "address": 
    //     {
    //       "country": this.Register.value.country,
    //       "city": this.Register.value.city,
    //       "streetName": this.Register.value.streetName,
    //       "streetNumber": this.Register.value.streetNumber
    //     }
    //   ,
    //   "jobProvider": {
    //     "companyName": this.Register.value.companyName,
    //     "location": this.Register.value.location,
    //     "companySize": this.Register.value.companySize,
    //     "noOfEmployees": this.Register.value.noOfEmployees==""?0:this.Register.value.noOfEmployees,
    //     "category": this.Register.value.category,
    //     "webSite": this.Register.value.webSite,
    //     "logo": this.Register.value.logo==null?this.Register.value.photo:this.Register.value.logo,
    //     "description": this.Register.value.description
    //   },
    //   "jobSeeker": {
    //     "university": this.Register.value.university,
    //     "college": this.Register.value.college,
    //     "birthDate": this.Register.value.birthDate,
    //     "photo": this.Register.value.photo,
    //     "currentYear": this.Register.value.currentYear,
    //     "status": this.Register.value.status,
    //     "skills": [
    //       {
    //         "name": this.Register.value.skillName
    //       }
    //     ]
    //   }
    // }
    this._authService.Register(this.body).subscribe({
      next:(data)=>{
        console.log(data);
      },
      error:(err)=>{
        console.log(err);
      }
    });
    console.log(this.body);
  }
}
