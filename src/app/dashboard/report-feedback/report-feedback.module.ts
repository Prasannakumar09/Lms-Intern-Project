import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportFeedbackRoutingModule } from './report-feedback-routing.module';
import { ReportFeedbackComponent } from './report-feedback.component';
import { HttpClientModule } from '@angular/common/http';
import { ServiceService } from '../../auth/services/service.service';


@NgModule({
  declarations: [
    ReportFeedbackComponent
  ],
  imports: [
    CommonModule,
    ReportFeedbackRoutingModule,
    HttpClientModule
  ],
  providers:[ServiceService]
})
export class ReportFeedbackModule { }
