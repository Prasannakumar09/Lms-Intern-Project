import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { GuardService } from '../auth/guards/guard.service';
import { UsersComponent } from './users/users.component';
import { AddUsersComponent } from './add-users/add-users.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { RoleguardService } from '../auth/guards/roleguard.service';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'Users',
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
        canActivate: [RoleguardService],
        data: { roles: ['Admin', 'mentor'] },
      },
      {
        path: 'addUsers',
        loadChildren: () =>
          import('./add-users/add-users.module').then((m) => m.AddUsersModule),
        canActivate: [RoleguardService],
        data: { roles: ['Admin'] },
      },
      {
        path: 'course_Details',
        loadChildren: () =>
          import('./course-details/course-details.module').then(
            (m) => m.CourseDetailsModule
          ),
        canActivate: [RoleguardService],
        data: { roles: ['mentor'] },
      },
      {
        path: 'courseApprovals',
        loadChildren: () =>
          import('./course-approvals/course-approvals.module').then(
            (m) => m.CourseApprovalsModule
          ),
        canActivate: [RoleguardService],
        data: { roles: ['Admin'] },
      },
      {
        path: 'approvedCourses',
        loadChildren: () =>
          import('./approved-courses/approved-courses.module').then(
            (m) => m.ApprovedCoursesModule
          ),
        canActivate: [RoleguardService],
        data: { roles: ['mentor'] },
      },
      {
        path: 'mentorAnnouncement',
        loadChildren: () =>
          import('./mentor-announcement/mentor-announcement.module').then(
            (m) => m.MentorAnnouncementModule
          ),
        canActivate: [RoleguardService],
        data: { roles: ['mentor', 'student'] },
      },
      {
        path: 'Courses',
        loadChildren: () =>
          import('./courses/courses.module').then((m) => m.CoursesModule),

        canActivate: [RoleguardService],
        data: { roles: ['student'] },
      },
      {
        path: 'coursePurschased',
        loadChildren: () =>
          import('./course-purschased/course-purschased.module').then(
            (m) => m.CoursePurschasedModule
          ),
        canActivate: [RoleguardService],
        data: { roles: ['student'] },
      },
      {
        path: 'ReportFeedback',
        loadChildren: () =>
          import('./report-feedback/report-feedback.module').then(
            (m) => m.ReportFeedbackModule
          ),
        canActivate: [RoleguardService],
        data: { roles: ['Admin'] },
      },
      {
        path: 'discussion',
        loadChildren: () =>
          import('./discussions/discussions.module').then(
            (m) => m.DiscussionsModule
          ),
        canActivate: [RoleguardService],
        data: { roles: ['mentor', 'student'] },
      },
      {
        path: 'demoQuiz',
        loadChildren: () =>
          import('./demo-quiz/demo-quiz.module').then((m) => m.DemoQuizModule),
        canActivate: [RoleguardService],
        data: { roles: ['mentor', 'student'] },
      },
      {
        path: 'chat',
        loadChildren: () =>
          import('./chat/chat.module').then((m) => m.ChatModule),
        canActivate: [RoleguardService],
        data: { roles: ['Admin', 'mentor', 'student'] },
      },
      {
        path: 'Interactions',
        loadChildren: () =>
          import('./interactions/interactions.module').then(
            (m) => m.InteractionsModule
          ),
        canActivate: [RoleguardService],
        data: { roles: ['Admin', 'mentor', 'student'] },
      },
    ],
    canActivate: [GuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
