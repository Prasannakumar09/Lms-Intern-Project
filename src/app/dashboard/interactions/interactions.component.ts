import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../auth/services/service.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastserviceService } from '../../auth/services/toastservice.service';

@Component({
  selector: 'app-interactions',
  templateUrl: './interactions.component.html',
  styleUrl: './interactions.component.scss'
})
export class InteractionsComponent implements OnInit{
  messagein:FormGroup;
  name = localStorage.getItem('username')
  chattings:any[] = [];
  constructor(private service:ServiceService,private fb:FormBuilder,private toast : ToastserviceService){
    this.messagein = this.fb.group({
      message:new FormControl('',[Validators.required,Validators.minLength(1)])
    })
  }
  ngOnInit(): void {
    this.getInteractions()
  }

getInteractions(){
  this.service.getMessages().subscribe({
    next:(val:any) => {
      this.chattings = val
    },
    error : (err) => {
      const errMsg = err.error?.error
      this.toast.error(errMsg)
    }
  })
}

  send() {
    if (this.messagein.valid) {
      const msg = this.messagein.value;
      this.service.messageInteraction(msg).subscribe({
        next:(val:any) => {
          this.toast.success(val.message)
          this.getInteractions()
        },
        error : (err) =>{
          const errMsg = err.error?.error
          this.toast.error(err)
        }
      })
      this.messagein.reset();
    }
  }
}
