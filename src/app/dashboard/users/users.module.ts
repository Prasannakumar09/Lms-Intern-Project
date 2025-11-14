import { NgModule } from '@angular/core';


import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceService } from '../../auth/services/service.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    CommonModule,          
    FormsModule,           
    HttpClientModule,        
    UsersRoutingModule,
    ReactiveFormsModule
  ],
  providers : [ServiceService]
})
export class UsersModule { }
