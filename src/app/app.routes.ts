import {  Routes } from '@angular/router';

export const routes: Routes = [
    {path:'',redirectTo:"LandingPage",pathMatch:"full"},
    {path:"Home",title:"Home",loadComponent:()=>import('./Components/home/home.component').then(mod=>mod.HomeComponent)},
    {path:"Register",pathMatch:"full",loadComponent:()=>import('./Components/register/register.component').then(mod=>mod.RegisterComponent)},
    {path:"Login",pathMatch:"full",loadComponent:()=>import('./Components/login/login.component').then(mod=>mod.LoginComponent)},
    {path:"UserProfile/:id",pathMatch:"full",loadComponent:()=>import('./Components/user-profile/user-profile.component').then(mod=>mod.UserProfileComponent)},
    {path:"chat",pathMatch:'full',loadComponent:()=>import('./Components/chat-room/chat-room.component').then(mod=>mod.ChatRoomComponent)},
    {path:"CompanyProfile/:id",pathMatch:'full',loadComponent:()=>import('./Components/company-profile/company-profile.component').then(mod=>mod.CompanyProfileComponent)},
    {path:"Bookmark/:id",pathMatch:'full',loadComponent:()=>import('./Components/bookmark/bookmark.component').then(mod=>mod.BookmarkComponent)},
    {path:"LandingPage",pathMatch:'full',loadComponent:()=>import('./Components/landing-page/landing-page.component').then(mod=>mod.LandingPageComponent)}
];
