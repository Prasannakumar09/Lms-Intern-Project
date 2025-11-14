import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../auth/services/service.service';
import { ToastserviceService } from '../../auth/services/toastservice.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

interface courseApprove {
  _id: String;
  title: String;
  description: string;
  category: String;
  pricing: String;
  status: String;
}

@Component({
  selector: 'app-approved-courses',
  templateUrl: './approved-courses.component.html',
  styleUrls: ['./approved-courses.component.scss']
})
export class ApprovedCoursesComponent implements OnInit {
  approvedcourse: courseApprove[] = [];
  lessonsForm: FormGroup;
  filteredCourses: courseApprove[] = [];
  paginatedCourses: courseApprove[] = [];
  lessons: any[] = []; 
  searchTitle = '';
  baseURL = 'http://localhost:3000'; 
  metname: any = '';
  role:any = '';
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  constructor(
    private service: ServiceService,
    private toast: ToastserviceService,
    private fb: FormBuilder
  ) {
    this.lessonsForm = this.fb.group({
      courseId: new FormControl(''),
      mentorname: new FormControl(''),
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      pdf: new FormControl('', [Validators.required, this.pdfValidation])
    });
  }

  ngOnInit(): void {
    this.getApproveDetails();
    this.metname = localStorage.getItem('username');
    this.role = localStorage.getItem('user')
  }

  getApproveDetails() {
    this.service.getApprovedCourses().subscribe({
      next: (val: any) => {
        this.approvedcourse = val;
        this.filteredCourses = [...val];
        this.updatePagination();
      },
      error: (err) => {
        this.toast.error('Failed to load approved courses');
      }
    });
  }

  pdfModal(id: String) {
    this.lessonsForm.patchValue({ courseId: id, mentorname: this.metname });
    this.lessonsForm.reset({
      courseId: id,
      mentorname: this.metname,
      title: '',
      pdf: ''
    });
  }

  onAdd() {
    if (this.lessonsForm.invalid) return;

    const formData = new FormData();
    formData.append('courseId', this.lessonsForm.get('courseId')?.value);
    formData.append('mentorname', this.lessonsForm.get('mentorname')?.value);
    formData.append('title', this.lessonsForm.get('title')?.value);
    formData.append('pdf', this.lessonsForm.get('pdf')?.value);

    this.service.addLessons(formData).subscribe({
      next: (val: any) => {
        this.toast.success(val.message || 'Lesson uploaded successfully');
        this.lessonsForm.reset();
        const modalElement = document.getElementById('addLessonModal');
        if (modalElement) (modalElement as any).classList.remove('show');
      },
      error: (err) => {
        const errMsg = err.error?.error || 'Error uploading lesson';
        this.toast.error(errMsg);
      }
    });
  }

  pdfValidation(control: AbstractControl): ValidationErrors | null {
    const file = control.value;
    if (!file) return null;

    const selectedFile = file instanceof File ? file : file?.[0];
    if (!selectedFile) return null;

    if (selectedFile.type !== 'application/pdf') {
      return { invalidType: true };
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      return { fileTooLarge: true };
    }

    return null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.lessonsForm.patchValue({ pdf: file });
      this.lessonsForm.get('pdf')?.updateValueAndValidity();
    }
  }

  
  getLessons(courseId: any) {
    this.service.getLessons(courseId).subscribe({
      next: (res: any) => {
        this.lessons = res;
      },
      error: (err) => {
        this.lessons = [];
        this.toast.error('Failed to fetch lessons');
      }
    });
  }
  applyFilters(): void {
    this.filteredCourses = this.approvedcourse.filter((course) => {
      const matchesTitle = course.title
        .toLowerCase()
        .includes(this.searchTitle.toLowerCase());
        return matchesTitle;
    });
    this.updatePagination();
  }
   updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredCourses.length / this.itemsPerPage);
    this.setPaginatedCourses();
  }

  setPaginatedCourses(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedCourses = this.filteredCourses.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.setPaginatedCourses();
    }
  }
}
