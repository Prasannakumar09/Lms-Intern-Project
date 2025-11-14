import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUsersComponent } from './add-users.component';
import { GuardService } from '../../auth/guards/guard.service';

const routes: Routes = [{ path: '', component: AddUsersComponent,canActivate : [GuardService],data : {role : 'Admin'}},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddUsersRoutingModule { }
