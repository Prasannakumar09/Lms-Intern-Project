import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseApprovalsRoutingModule } from './course-approvals-routing.module';
import { CourseApprovalsComponent } from './course-approvals.component';
import { HttpClientModule } from '@angular/common/http';
import { ServiceService } from '../../auth/services/service.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CourseApprovalsComponent
  ],
  imports: [
    CommonModule,
    CourseApprovalsRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers : [ServiceService]
})
export class CourseApprovalsModule { }
