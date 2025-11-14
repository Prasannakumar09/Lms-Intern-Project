import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../auth/services/service.service';
import { ToastserviceService } from '../../auth/services/toastservice.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

interface Course {
  _id: String;
  userId: String;
  courseId: String;
  title: String;
  description: string;
  category: String;
  pricing: String;
  mentorname: String;
}
interface feedback {
  userId: String;
  courseId: String;
  feedbackInfo: String;
}

@Component({
  selector: 'app-course-purschased',
  templateUrl: './course-purschased.component.html',
  styleUrl: './course-purschased.component.scss',
})
export class CoursePurschasedComponent implements OnInit {
  Courses: Course[] = [];
  lessons: any[] = [];
  baseURL = 'http://localhost:3000';
  feedbackForm: FormGroup;
  constructor(
    private service: ServiceService,
    private toast: ToastserviceService,
    private fb: FormBuilder
  ) {
    this.feedbackForm = this.fb.group({
      userId: new FormControl(''),
      courseId: new FormControl(''),
      feedback: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
    });
  }

  ngOnInit(): void {
    this.service.userCart().subscribe({
      next: (val: any) => {
        this.Courses = val;
      },
      error: (err: any) => {
        const errMsg = err.error?.error;
        this.toast.error(errMsg);
      },
    });
  }
  feedbackdata(courseid: any, userid: any) {
    this.feedbackForm.patchValue({
      userId: userid,
      courseId: courseid,
    });
  }
  onFeedback() {
    console.log(this.feedbackForm.value);
    this.service.feedbackpost(this.feedbackForm.value).subscribe({
      next: (val: any) => {
        this.toast.success(val);
      },
      error: (err) => {
        const errMsg = err.error?.error;
        this.toast.error(errMsg);
      },
    });
  }
  getLessons(courseId: any) {
    this.service.getLessons(courseId).subscribe({
      next: (res: any) => {
        this.lessons = res;
      },
      error: (err) => {
        this.lessons = [];
        this.toast.error('Failed to fetch lessons');
      },
    });
  }
}
