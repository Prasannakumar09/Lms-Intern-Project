import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscussionsRoutingModule } from './discussions-routing.module';
import { DiscussionsComponent } from './discussions.component';
import { HttpClientModule } from '@angular/common/http';
import { ServiceService } from '../../auth/services/service.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DiscussionsComponent
  ],
  imports: [
    CommonModule,
    DiscussionsRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers:[ServiceService]
})
export class DiscussionsModule { }
