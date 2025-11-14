import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportFeedbackComponent } from './report-feedback.component';

const routes: Routes = [{ path: '', component: ReportFeedbackComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportFeedbackRoutingModule { }
