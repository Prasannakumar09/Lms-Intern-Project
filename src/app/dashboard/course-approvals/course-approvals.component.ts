import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ServiceService } from '../../auth/services/service.service';
import { ToastserviceService } from '../../auth/services/toastservice.service';

interface CourseApprove {
  readonly _id: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly pricing: string;
  readonly status: 'pending' | 'approved' | 'reject';
}

@Component({
  selector: 'app-course-approvals',
  templateUrl: './course-approvals.component.html',
  styleUrls: ['./course-approvals.component.scss'],
})
export class CourseApprovalsComponent implements OnInit, OnDestroy {
  private allCourses: CourseApprove[] = [];
  filteredCourses: readonly CourseApprove[] = [];
  paginatedCourses: readonly CourseApprove[] = [];

  searchCtrl = new FormControl('', { nonNullable: true });
  categoryCtrl = new FormControl<string>('', { nonNullable: true });
  statusCtrl = new FormControl<string>('', { nonNullable: true });

  user = '';
  loading = true;
  uniqueCategories: readonly string[] = [];
  uniqueStatuses: readonly ('pending' | 'approved' | 'reject')[] = [];

  currentPage = 1;
  pageSize = 5;
  private destroy$ = new Subject<void>();

  constructor(
    private service: ServiceService,
    private toast: ToastserviceService
  ) {}

  ngOnInit(): void {
    this.user = localStorage.getItem('user') ?? '';
    this.loadCourses();

    this.searchCtrl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.applyFilters());

    this.categoryCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.applyFilters());
    this.statusCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.applyFilters());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCourses(): void {
    this.service.courseApprovals().subscribe({
  next: (data: any) => {
    const ordered = this.sortByStatus(data);
    this.allCourses = ordered; 
    this.uniqueCategories = Object.freeze([...new Set(ordered.map(c => c.category))]);
    this.uniqueStatuses = Object.freeze(['pending', 'approved', 'reject']);
    this.applyFilters();
    this.loading = false;
  },
  error: (err) => {
    this.toast.error(err.error?.error ?? 'Failed to load courses');
    this.loading = false;
  },
});
  }

  private sortByStatus(courses: CourseApprove[]): CourseApprove[] {
    const order = { pending: 1, approved: 2, reject: 3 } as const;
    return [...courses].sort((a, b) => order[a.status] - order[b.status]);
  }

  private applyFilters(): void {
    const term = this.searchCtrl.value.trim().toLowerCase();
    const cat = this.categoryCtrl.value;
    const stat = this.statusCtrl.value;

    let result = this.allCourses;

    if (term) result = result.filter(c => c.title.toLowerCase().includes(term));
    if (cat) result = result.filter(c => c.category === cat);
    if (stat) result = result.filter(c => c.status === stat);

    this.filteredCourses = Object.freeze(result);
    this.currentPage = 1;
    this.updatePagination();
  }

  private updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedCourses = this.filteredCourses.slice(start, end);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.updatePagination();
  }

  resetFilters(): void {
    this.searchCtrl.setValue('');
    this.categoryCtrl.setValue('');
    this.statusCtrl.setValue('');
  }

  updateStatus(id: string, status: CourseApprove['status']): void {
    this.service.adminapproval(id, { status }).subscribe({
      next: (res: any) => {
        this.toast.success(res.message ?? 'Status updated');
        this.loadCourses();
      },
      error: (err) => {
        this.toast.error(err.error?.error ?? 'Update failed');
      },
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredCourses.length / this.pageSize));
  }

  get totalCourses(): number {
    return this.filteredCourses.length;
  }

  get pageNumbers(): number[] {
    const max = 5;
    const half = Math.floor(max / 2);
    let start = this.currentPage - half;
    let end = this.currentPage + half;

    if (start < 1) {
      start = 1;
      end = Math.min(this.totalPages, max);
    }
    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(1, end - max + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  get showPagination(): boolean {
    return this.totalPages > 1;
  }

  get showEmptyState(): boolean {
    return !this.loading && this.filteredCourses.length === 0;
  }
}
