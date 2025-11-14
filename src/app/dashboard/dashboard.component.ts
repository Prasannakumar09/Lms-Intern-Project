import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../auth/services/service.service';
import { Chart, registerables } from 'chart.js';
import { last } from 'rxjs';
import { ToastserviceService } from '../auth/services/toastservice.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit,AfterViewInit {
  User = localStorage.getItem('user');
  username = localStorage.getItem('username') || '';
  email = localStorage.getItem('email') || '';
  accuracy: number = 0;
  totalQuestion: number = 0;
  score: number = 0;
  date:any;
  attempt:number = 0;
  total_user = '';
  mentor_count = '';
  student_count = '';
  course_count = '';

  storagePercentage = 26;
  usedStorage = 4.8;
  totalStorage = 20;
  newMessages = '';

  searchQuery = '';
  showNotifications = false;
  showCalendar = false;

  notifications = [
    'Course approved',
    'New user registered',
    'Feedback received',
  ];
  items = [
    'Angular Basics',
    'React Course',
    'Python Fundamentals',
    'Data Science',
  ];
  filteredItems: string[] = [];

  currentTitle = 'Dashboard Overview';

  announcements: any[] = [];
  recentOrders: any[] = [];
  highestSelling: any | null = null;
  latestCourse: any[] = [];

  private currentUserId: string | null = null;
  dashboardStats: any;

  constructor(
    protected router: Router,
    private service: ServiceService,
    private toast: ToastserviceService
  ) {}

  ngOnInit(): void {
    this.service.getUserscount().subscribe({
      next: (val: any) => {
        this.total_user = val.totalcount;
        this.mentor_count = val.mentorcount;
        this.student_count = val.studentcount;
        this.course_count = val.approvedCourses;
      },
      error: (err) => {
        const errMsg = err.error?.error;
        this.toast.error(errMsg || 'Failed to load counts');
      },
    });

    this.loadCurrentUserAndData();
    this.loadCoursesAndFeedback();
    this.getLastestCouses();
    this.getDiscussionCount();
    this.getStudentResult();
  }
   ngAfterViewInit() {
    if (this.score && this.totalQuestion) {
      setTimeout(() => this.renderChart(), 100);
    }
  }
 getStudentResult() {
  this.service.getResultAnalysis().subscribe({
    next: (val: any) => {
      this.score = val.score;
      this.accuracy = val.accuracy;
      this.totalQuestion = val.totalQuestion;
      this.date = val.createdAt
      this.attempt = val.count
      setTimeout(() => {
        this.renderChart();
      }, 100);
    },
    error: (err) => {
      const errMsg = err.error?.error;
      this.toast.error(errMsg);
    },
  });
}


  get isMainDashboard(): boolean {
    return this.router.url === '/dashboard';
  }

  logout() {
    this.router.navigate(['']);
  }

  isSidebarOpen: boolean = false;

  toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar?.classList.toggle('show-sidebar');
}

  getLastestCouses() {
    this.service.lastCourse().subscribe({
      next: (val: any) => {
        this.latestCourse = val;
      },
      error: (err) => {
        const errMsg = err.error?.error;
        this.toast.error(errMsg);
      },
    });
  }

  private loadCurrentUserAndData() {
    this.service.getUsers().subscribe({
      next: (users: any[]) => {
        const found = users.find(
          (u: any) =>
            (u.username &&
              u.username.toLowerCase() ===
                (this.username || '').toLowerCase()) ||
            (u.email &&
              u.email.toLowerCase() === (this.email || '').toLowerCase())
        );
        this.currentUserId = found?._id ?? null;

        this.loadAnnouncements();
        this.loadCoursesAndFeedback();
        this.loadRecentOrders();
      },
      error: (err) => {
        console.error('Failed to fetch users', err);
        this.loadAnnouncements();
        this.loadCoursesAndFeedback();
        this.loadRecentOrders();
      },
    });
  }

  private loadAnnouncements() {
    this.service.announcementfetching().subscribe({
      next: (res: any) => {
        this.announcements = (Array.isArray(res) ? res : [res]).map(
          (a: any) => ({
            title: a.title ?? a[1] ?? 'Announcement',
            content: a.content ?? a[2] ?? a.message ?? a.description ?? '',
            date: a.createdAt ?? a.date ?? new Date(),
          })
        );
      },
      error: (err) => {
        console.error('Announcements fetch error', err);
        this.announcements = [];
      },
    });
  }

  private loadCoursesAndFeedback() {
    Promise.all([
      this.service
        .getCourses()
        .toPromise()
        .catch(() => []),
      this.service
        .getFeedback()
        .toPromise()
        .catch(() => []),
    ])
      .then(([coursesRes, feedbackRes]: any) => {
        const courses = Array.isArray(coursesRes)
          ? coursesRes
          : coursesRes || [];
        const feedbacks = Array.isArray(feedbackRes)
          ? feedbackRes
          : feedbackRes || [];

        if (this.User === 'mentor') {
          const myCourses = courses.filter(
            (c: any) =>
              (c.mentorname || '').toLowerCase() ===
              (this.username || '').toLowerCase()
          );

          const revenue = myCourses.reduce(
            (sum: number, c: any) => sum + (Number(c.pricing) || 0),
            0
          );

          const courseIds = new Set(myCourses.map((c: any) => c._id));
          const myFeedbacks = feedbacks.filter((f: any) =>
            courseIds.has(f.courseId)
          );

          this.total_user = String(revenue);
          this.course_count = String(myCourses.length);
          this.mentor_count = String(myFeedbacks.length);

          this.renderSalesChart(myFeedbacks);
          this.highestSelling = this.computeTopCourse(myCourses, feedbacks);
        } else if (this.User === 'student') {
          this.service.userCart().subscribe({
            next: (cartRes: any) => {
              const cart = Array.isArray(cartRes) ? cartRes : cartRes || [];
              const totalSpent = cart.reduce(
                (s: number, it: any) =>
                  s + (Number(it.price) || Number(it.pricing) || 0),
                0
              );
              this.total_user = String(totalSpent);
              this.course_count = String(cart.length);
            },
            error: () => {
              this.total_user = '0';
            },
          });

          const myId = this.currentUserId;
          const myFeedbacks = myId
            ? feedbacks.filter((f: any) => f.userId === myId)
            : [];
          this.mentor_count = String(myFeedbacks.length);
          this.renderSalesChart(myFeedbacks);
          this.highestSelling = this.computeTopCourse(courses, feedbacks);
        } else {
          const totalRevenue = courses.reduce(
            (sum: number, c: any) => sum + (Number(c.pricing) || 0),
            0
          );
          this.total_user = String(totalRevenue);
          this.course_count = String(courses.length);
          this.mentor_count = String(feedbacks.length);
          this.student_count = String(courses.length);
          this.renderSalesChart(feedbacks);
          this.highestSelling = this.computeTopCourse(courses, feedbacks);
        }
      })
      .catch((e) => {
        console.error('Error while combining course/feedback data', e);
      });
  }

  private loadRecentOrders() {
    Promise.all([
      this.service
        .getFeedback()
        .toPromise()
        .catch(() => []),
      this.service
        .getCourses()
        .toPromise()
        .catch(() => []),
      this.service
        .getUsers()
        .toPromise()
        .catch(() => []),
    ])
      .then(([feedbacks, courses, users]: any) => {
        feedbacks = Array.isArray(feedbacks) ? feedbacks : [];
        courses = Array.isArray(courses) ? courses : [];
        users = Array.isArray(users) ? users : [];

        let filteredFeedbacks = feedbacks;

        if (this.User === 'mentor') {
          const myCourseIds = new Set(
            courses
              .filter(
                (c: any) =>
                  (c.mentorname || '').toLowerCase() ===
                  (this.username || '').toLowerCase()
              )
              .map((c: any) => c._id)
          );
          filteredFeedbacks = feedbacks.filter((f: any) =>
            myCourseIds.has(f.courseId)
          );
        } else if (this.User === 'student' && this.currentUserId) {
          filteredFeedbacks = feedbacks.filter(
            (f: any) => f.userId === this.currentUserId
          );
        }

        filteredFeedbacks.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const recent = filteredFeedbacks.slice(0, 6);
        this.recentOrders = recent.map((f: any) => {
          const course = courses.find((c: any) => c._id === f.courseId) || {};
          const user = users.find((u: any) => u._id === f.userId) || {};
          return {
            title: course.title || 'Unknown Course',
            image: course.image || '',
            meta: course.category || course.mentorname || '',
            date: f.createdAt || f.updatedAt || new Date(),
            amount: course.pricing || 0,
            status: f.status || 'Delivered',
            customer: user.username || user.email || 'N/A',
          };
        });

        const totalOrders = filteredFeedbacks.length;
        const totalSales = filteredFeedbacks.reduce(
          (sum: number, f: any) => sum + 1,
          0
        );
        const totalProduct = new Set(
          filteredFeedbacks.map((f: { courseId: any }) => f.courseId)
        ).size;
        const totalRevenue = filteredFeedbacks.reduce(
          (sum: number, f: { courseId: any }) => {
            const course = courses.find((c: any) => c._id === f.courseId);
            return sum + (course ? Number(course.pricing || 0) : 0);
          },
          0
        );

        this.dashboardStats = {
          totalOrders,
          totalSales,
          totalProduct,
          totalRevenue,
        };
      })
      .catch((e) => {
        console.error('Error loading recent orders', e);
        this.recentOrders = [];
        this.dashboardStats = {
          totalOrders: 0,
          totalSales: 0,
          totalProduct: 0,
          totalRevenue: 0,
        };
      });
  }

  private renderSalesChart(feedbacks: any[]) {
    const grouped: Record<string, number> = {};
    feedbacks.forEach((f: any) => {
      const d = new Date(f.createdAt || f.updatedAt || Date.now());
      const key = d.toLocaleDateString();
      grouped[key] = (grouped[key] || 0) + 1;
    });

    const labels = Object.keys(grouped).slice(-10);
    const values = labels.map((k) => grouped[k]);

    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    if (!ctx) return;

    const existing = Chart.getChart('salesChart');
    if (existing) existing.destroy();

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Sales',
            data: values,
            backgroundColor: $localOrHex('#f97316'),
            borderRadius: 8,
            barThickness: 18,
          } as any,
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#6b7280' },
          },
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: { color: '#6b7280' },
          },
        },
      },
    });
  }

  private computeTopCourse(courses: any[], feedbacks: any[]) {
    if (!courses || courses.length === 0) return null;

    const count: Record<string, number> = {};
    feedbacks.forEach((f: any) => {
      count[f.courseId] = (count[f.courseId] || 0) + 1;
    });

    let topCourseId: string | null = null;
    let topCount = -1;
    Object.keys(count).forEach((cid) => {
      if (count[cid] > topCount) {
        topCount = count[cid];
        topCourseId = cid;
      }
    });

    const topCourse =
      courses.find((c: any) => c._id === topCourseId) || courses[0];
    return {
      title: topCourse?.title ?? '—',
      price: topCourse?.pricing ?? topCourse?.price ?? null,
      mentorname: topCourse?.mentorname ?? '',
      image: topCourse?.image ?? null,
      feedbackCount: topCount > -1 ? topCount : 0,
    };
  }
  filterItems() {
    this.filteredItems = this.items.filter((item) =>
      item.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showCalendar = false;
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
    this.showNotifications = false;
  }

  onDateSelected(event: any) {
    const selectedDate = event.target.value;
    alert(`Selected Date: ${selectedDate}`);
  }
  onSearch() {
    if (this.searchQuery.trim()) {
      alert(`Searching for: ${this.searchQuery}`);
      this.searchQuery = '';
    }
  }
  getDiscussionCount() {
    this.service.getDisCount().subscribe({
      next: (res) => {
        this.newMessages = res;
      },
      error: (err) => {
        const errMsg = err.error?.error;
        this.toast.error(errMsg);
      },
    });
  }
  renderChart() {
  const ctx = document.getElementById('performanceChart') as HTMLCanvasElement;
  if (!ctx) return;

  const existingChart = Chart.getChart('performanceChart');
  if (existingChart) existingChart.destroy();

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Correct', 'Incorrect'],
      datasets: [
        {
          data: [this.score, this.totalQuestion - this.score],
          backgroundColor: ['#4caf50', '#f44336'],
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: '70%',
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
        },
      },
    },
  });
}

}

function $localOrHex(fallback: string) {
  return '#f97316';
}
