import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../auth/services/service.service';
import { Router } from '@angular/router';
import { ToastserviceService } from '../auth/services/toastservice.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  registerform : FormGroup;
  constructor(private fb : FormBuilder,private service: ServiceService,private router : Router,private toast : ToastserviceService){
    this.registerform = this.fb.group({
      username : new FormControl('',Validators.required),
      password : new FormControl('',Validators.required)
    })
  }
  ngOnInit(): void {
    localStorage.clear()
  }
  onSignup(){
    this.service.loginUser(this.registerform.value).subscribe({
      next : (val:any) => {
        this.toast.success("logged in Successfully");
        localStorage.setItem('token',val.token)
        localStorage.setItem('user',val.user)
        localStorage.setItem('username',val.name)
        localStorage.setItem('email',val.email)
        this.router.navigate(['/dashboard'])
      },
      error : (err) => {
        const errMsg = err.error?.error
        this.toast.error(errMsg)
      }
    })
    this.registerform.reset()
  }
}
