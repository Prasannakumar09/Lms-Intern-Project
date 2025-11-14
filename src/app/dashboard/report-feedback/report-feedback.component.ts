import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../auth/services/service.service';
import { ToastserviceService } from '../../auth/services/toastservice.service';

@Component({
  selector: 'app-report-feedback',
  templateUrl: './report-feedback.component.html',
  styleUrls: ['./report-feedback.component.scss'] // ✅ corrected
})
export class ReportFeedbackComponent implements OnInit {
  feedbackDetails: any[] = [];

  constructor(
    private service: ServiceService,
    private toast: ToastserviceService
  ) {}

  ngOnInit(): void {
    this.service.getFeedback().subscribe({
      next: (val: any) => {
        this.feedbackDetails = val;
      },
      error: (err) => {
        const errMsg = err.error?.error || 'Error fetching feedbacks';
        this.toast.error(errMsg);
      },
    });
  }
}
