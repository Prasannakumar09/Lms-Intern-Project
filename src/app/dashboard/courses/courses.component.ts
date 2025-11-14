import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../auth/services/service.service';
import { ToastserviceService } from '../../auth/services/toastservice.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

interface Course {
  _id: String;
  title: String;
  description: string;
  category: String;
  pricing: String;
  mentorname: String;
}

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  paginatedCourses: Course[] = [];

  addCart: FormGroup;
  selectedCourse: Course | null = null;

  searchTitle = '';
  selectedCategory = '';
  selectedPrice = '';

  uniqueCategories: any[] = [];

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  constructor(
    private service: ServiceService,
    private toast: ToastserviceService,
    private fb: FormBuilder
  ) {
    this.addCart = this.fb.group({
      _id: new FormControl(''),
      title: new FormControl(''),
      description: new FormControl(''),
      category: new FormControl(''),
      pricing: new FormControl(''),
      mentorname: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.service.getCourses().subscribe({
      next: (val: any) => {
        this.courses = val;
        this.filteredCourses = [...val];
        this.uniqueCategories = [...new Set(val.map((c: any) => c.category))];
        this.updatePagination();
      },
      error: (err) => {
        const errMsg = err.error?.error;
        this.toast.error(errMsg);
      },
    });
  }

  applyFilters(): void {
    this.filteredCourses = this.courses.filter((course) => {
      const matchesTitle = course.title
        .toLowerCase()
        .includes(this.searchTitle.toLowerCase());

      const matchesCategory = this.selectedCategory
        ? course.category.toLowerCase() === this.selectedCategory.toLowerCase()
        : true;

      const price = parseFloat(course.pricing as any);
      let matchesPrice = true;
      if (this.selectedPrice === 'low') matchesPrice = price === 0;
      if (this.selectedPrice === 'mid')
        matchesPrice = price >= 100 && price <= 1000;
      if (this.selectedPrice === 'high') matchesPrice = price > 1000;

      return matchesTitle && matchesCategory && matchesPrice;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  resetFilters(): void {
    this.searchTitle = '';
    this.selectedCategory = '';
    this.selectedPrice = '';
    this.filteredCourses = [...this.courses];
    this.currentPage = 1;
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

  addCourse(course: Course): void {
    this.addCart.patchValue(course);
  }

  viewCourse(course: Course): void {
    this.selectedCourse = course;
  }

  onAddCourse(): void {
    this.service.addToCart(this.addCart.value).subscribe({
      next: (val: any) => {
        this.toast.success(val);
      },
      error: (err) => {
        const errMsg = err.error?.error;
        this.toast.error(errMsg);
      },
    });
  }
}
