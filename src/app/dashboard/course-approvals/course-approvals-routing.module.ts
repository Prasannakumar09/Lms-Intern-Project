import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseApprovalsComponent } from './course-approvals.component';

const routes: Routes = [{ path: '', component: CourseApprovalsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseApprovalsRoutingModule { }
