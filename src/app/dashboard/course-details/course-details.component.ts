import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../auth/services/service.service';
import { ToastserviceService } from '../../auth/services/toastservice.service';

interface courseApprove{
  _id:String
  title:String,
  description:String,
  category:String,
  pricing:String,
  status:String,
  mentorname :String
}

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.scss'
})
export class CourseDetailsComponent {
  addcourse:FormGroup;
  message : String = '';
  courseapprovals:courseApprove[] = []
  filteredCourses: courseApprove[] = [];
  paginatedCourses: courseApprove[] = [];
  searchTitle = '';
  selectedCategory = '';
  selectedPrice = '';

  uniqueCategories: any[] = [];

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  constructor(private fb:FormBuilder,private service : ServiceService,private toast : ToastserviceService){
    this.addcourse = this.fb.group({
      _id : new FormControl(),
      title : new FormControl('',Validators.required),
      description : new FormControl('',Validators.required),
      category : new FormControl('',Validators.required),
      mentorname : new FormControl({ value: localStorage.getItem('username'), disabled: true },Validators.required),
      pricing :  new FormControl('',Validators.required),
    })
  }
  ngOnInit(): void {
    this.getCourseApproveDetails()
  }
  getCourseApproveDetails(){
    this.service.courseApprovals().subscribe({
      next : (val:any) => {
        this.courseapprovals = val
        this.filteredCourses = [...val];
        this.uniqueCategories = [...new Set(val.map((c: any) => c.category))];
        this.updatePagination();
      },
      error : (err) => {
        const errMsg = err.error?.error
        alert(errMsg)
      }
    })
  }
  onSubmit(){
    this.service.addCourse(this.addcourse.getRawValue()).subscribe({
      next : (val:any) => {
        this.toast.success(val.message)
        this.getCourseApproveDetails()
      },
      error : (err) => {
        const errMsg = err.error?.error
        this.toast.error(errMsg)
      }
    })
    this.addcourse.reset({
      mentorname: { value: localStorage.getItem('username'), disabled: true },
      category:''
    })
  }
  openEditModal(course:courseApprove){
    this.addcourse.patchValue(course)
  }
  deleteCourse(id:String){
    this.service.deleteCourse(id).subscribe({
      next:(val:any) => {
        this.toast.success(val.message)
        this.getCourseApproveDetails()
      },
      error:(err) => {
        const errMsg = err.error?.error
        this.toast.error(errMsg)
      }
    })
  }
  updateCourse(){
    this.service.editCourse(this.addcourse.getRawValue()).subscribe({
      next:(val:any) => {
        this.toast.success(val.message)
        this.getCourseApproveDetails()
      },
      error:(err) => {
        const errMsg = err.error?.error
        this.toast.error(errMsg)
      }
    })
  }
  addformreset(){
    this.addcourse.reset({
      mentorname: { value: localStorage.getItem('username'), disabled: true },
      category:''
    })
  }
   applyFilters(): void {
    this.filteredCourses = this.courseapprovals.filter((course) => {
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
    this.filteredCourses = [...this.courseapprovals];
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
}
