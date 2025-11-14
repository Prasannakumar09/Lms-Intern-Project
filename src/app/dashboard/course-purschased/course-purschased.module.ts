import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursePurschasedRoutingModule } from './course-purschased-routing.module';
import { CoursePurschasedComponent } from './course-purschased.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ServiceService } from '../../auth/services/service.service';


@NgModule({
  declarations: [
    CoursePurschasedComponent
  ],
  imports: [
    CommonModule,
    CoursePurschasedRoutingModule,
    FormsModule,
    ReactiveFormsModule
],
providers : [ServiceService]
})
export class CoursePurschasedModule { }
