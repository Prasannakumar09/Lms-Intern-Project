import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovedCoursesRoutingModule } from './approved-courses-routing.module';
import { ApprovedCoursesComponent } from './approved-courses.component';
import { HttpClientModule } from '@angular/common/http';
import { ServiceService } from '../../auth/services/service.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ApprovedCoursesComponent
  ],
  imports: [
    CommonModule,
    ApprovedCoursesRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers : [ServiceService]
})
export class ApprovedCoursesModule { }
