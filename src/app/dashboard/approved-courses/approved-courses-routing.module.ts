import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovedCoursesComponent } from './approved-courses.component';

const routes: Routes = [{ path: '', component: ApprovedCoursesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovedCoursesRoutingModule { }
