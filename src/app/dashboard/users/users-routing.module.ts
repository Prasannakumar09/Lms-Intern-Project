import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { GuardService } from '../../auth/guards/guard.service';

const routes: Routes = [{ path: '', component: UsersComponent,canActivate : [GuardService] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
