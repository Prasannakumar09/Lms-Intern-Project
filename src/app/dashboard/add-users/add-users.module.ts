import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddUsersRoutingModule } from './add-users-routing.module';
import { AddUsersComponent } from './add-users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceService } from '../../auth/services/service.service';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AddUsersComponent
  ],
  imports: [
    CommonModule,
    AddUsersRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  providers : [ServiceService]
})
export class AddUsersModule { }
