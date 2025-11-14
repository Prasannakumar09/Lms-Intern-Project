import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleguardService {

  constructor(private router : Router) { }
  canActivate(route: ActivatedRouteSnapshot):boolean{
    const token = localStorage.getItem('token')
    if(!token) return false;
    const role = localStorage.getItem('user')
    const allowedrole = route.data['roles'] as Array<String>
    if(allowedrole.includes(role!)){
      return true
    }
     this.router.navigate(['/dashboard']); 
    return false;
  }
}
