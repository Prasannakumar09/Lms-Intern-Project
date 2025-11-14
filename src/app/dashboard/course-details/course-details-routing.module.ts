import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseDetailsComponent } from './course-details.component';
import { GuardService } from '../../auth/guards/guard.service';

const routes: Routes = [{ path: '', component: CourseDetailsComponent,canActivate : [GuardService]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseDetailsRoutingModule { }
