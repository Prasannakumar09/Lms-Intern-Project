import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MentorAnnouncementRoutingModule } from './mentor-announcement-routing.module';
import { MentorAnnouncementComponent } from './mentor-announcement.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceService } from '../../auth/services/service.service';


@NgModule({
  declarations: [
    MentorAnnouncementComponent
  ],
  imports: [
    CommonModule,
    MentorAnnouncementRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers : [ServiceService]
})
export class MentorAnnouncementModule { }
