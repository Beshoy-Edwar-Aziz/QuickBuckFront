import {  Routes } from '@angular/router';
import { authGuard } from './Guards/auth.guard';

export const routes: Routes = [
    {path:'',redirectTo:"LandingPage",pathMatch:"full"},
    {path:"Home",title:"Job List",canActivate:[authGuard],loadComponent:()=>import('./Components/home/home.component').then(mod=>mod.HomeComponent)},
    {path:"Register",title:'Register',pathMatch:"full",loadComponent:()=>import('./Components/register/register.component').then(mod=>mod.RegisterComponent)},
    {path:"Login",title:'Login',pathMatch:"full",loadComponent:()=>import('./Components/login/login.component').then(mod=>mod.LoginComponent)},
    {path:"UserProfile/:id",title:"User Profile",pathMatch:"full",canActivate:[authGuard],loadComponent:()=>import('./Components/user-profile/user-profile.component').then(mod=>mod.UserProfileComponent)},
    {path:"chat",title:"Chat Room",pathMatch:'full',canActivate:[authGuard],loadComponent:()=>import('./Components/chat-room/chat-room.component').then(mod=>mod.ChatRoomComponent)},
    {path:"CompanyProfile/:id",title:"Company Profile",pathMatch:'full',canActivate:[authGuard],loadComponent:()=>import('./Components/company-profile/company-profile.component').then(mod=>mod.CompanyProfileComponent)},
    {path:"Bookmark/:id",title:'Bookmarks',pathMatch:'full',canActivate:[authGuard],loadComponent:()=>import('./Components/bookmark/bookmark.component').then(mod=>mod.BookmarkComponent)},
    {path:"LandingPage",title:'Home',pathMatch:'full',loadComponent:()=>import('./Components/landing-page/landing-page.component').then(mod=>mod.LandingPageComponent)},
    {path:"Checkout",title:"CheckOut",pathMatch:'full',loadComponent:()=>import('./Components/checkout/checkout.component').then(mod=>mod.CheckoutComponent)}
];
