import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  constructor(private router : Router) { }
  canActivate() : boolean {
    const Token = localStorage.getItem('token')
    const Role = localStorage.getItem('user')
    if(Token) return true;
    this.router.navigate([''])
    return false
  }
}
