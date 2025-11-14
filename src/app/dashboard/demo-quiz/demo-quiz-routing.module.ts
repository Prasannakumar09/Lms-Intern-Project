import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoQuizComponent } from './demo-quiz.component';

const routes: Routes = [{ path: '', component: DemoQuizComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoQuizRoutingModule { }
