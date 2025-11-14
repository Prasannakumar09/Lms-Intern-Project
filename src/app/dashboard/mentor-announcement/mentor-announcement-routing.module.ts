import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MentorAnnouncementComponent } from './mentor-announcement.component';

const routes: Routes = [{ path: '', component: MentorAnnouncementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MentorAnnouncementRoutingModule { }
