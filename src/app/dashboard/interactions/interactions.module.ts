import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InteractionsRoutingModule } from './interactions-routing.module';
import { InteractionsComponent } from './interactions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    InteractionsComponent
  ],
  imports: [
    CommonModule,
    InteractionsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class InteractionsModule { }
