import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route, state) => {
  let _router = inject(Router);
  if(localStorage.getItem('Token')==null){
    Swal.fire({
      title:'You are not signed in',
      text:`You need to be signed in to access this part of the website`,
      toast:true,
    })
    _router.navigate(['/LandingPage']);
    return false;
  }
  return true;
};
