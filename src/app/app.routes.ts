import { Routes } from '@angular/router';

export const routes: Routes = [
    {path:'',redirectTo:"Home",pathMatch:"full"},
    {path:"Home",title:"Home",loadComponent:()=>import('./Components/home/home.component').then(mod=>mod.HomeComponent)},
    {path:"Register",pathMatch:"full",loadComponent:()=>import('./Components/register/register.component').then(mod=>mod.RegisterComponent)},
    {path:"Login",pathMatch:"full",loadComponent:()=>import('./Components/login/login.component').then(mod=>mod.LoginComponent)},
    {path:"UserProfile",pathMatch:"full",loadComponent:()=>import('./Components/user-profile/user-profile.component').then(mod=>mod.UserProfileComponent)}
];
