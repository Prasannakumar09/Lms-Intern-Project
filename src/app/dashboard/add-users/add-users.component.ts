import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../auth/services/service.service';
import { Router } from '@angular/router';
import { ToastserviceService } from '../../auth/services/toastservice.service';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrl: './add-users.component.scss'
})
export class AddUsersComponent {
  adduserform : FormGroup;
    constructor(private fb : FormBuilder,private service: ServiceService,private router : Router,private toast : ToastserviceService){
      this.adduserform = this.fb.group({
        username : new FormControl('',Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        role : new FormControl('',Validators.required),
        password : new FormControl('',Validators.required)
      })
    }
    OnCreate(){
      this.service.adminAddUsers(this.adduserform.value).subscribe({
        next:(val:any) =>{
          this.toast.success(val.message)
          console.log(val)
        },
        error : (err) =>{
          const errMsg = err.error?.error
          this.toast.error(errMsg)
        }
      })
      this.adduserform.reset()
    }
}
