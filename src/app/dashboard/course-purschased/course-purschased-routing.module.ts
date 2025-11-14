import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursePurschasedComponent } from './course-purschased.component';

const routes: Routes = [{ path: '', component: CoursePurschasedComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursePurschasedRoutingModule { }
