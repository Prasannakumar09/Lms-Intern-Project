import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoQuizRoutingModule } from './demo-quiz-routing.module';
import { DemoQuizComponent } from './demo-quiz.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DemoQuizComponent
  ],
  imports: [
    CommonModule,
    DemoQuizRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class DemoQuizModule { }
