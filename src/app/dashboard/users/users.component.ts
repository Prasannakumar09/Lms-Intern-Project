import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../../auth/services/service.service';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastserviceService } from '../../auth/services/toastservice.service';

interface user {
  _id: String;
  username: String;
  email: String;
  role: String;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {
  User = localStorage.getItem('user');
  users: user[] = [];
  filteredUsers: user[] = [];
  paginatedUser: user[] = [];
  adduserform: FormGroup;
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  filterText = '';

  constructor(
    private service: ServiceService,
    private router: Router,
    private fb: FormBuilder,
    private toast: ToastserviceService
  ) {
    this.adduserform = this.fb.group({
      _id: new FormControl(),
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails() {
    this.service.getUsers().subscribe({
      next: (val: any) => {
        this.users = val;
        this.filteredUsers = [...this.users];
        this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
        this.setPaginatedUsers();
      },
      error: (err) => {
        const errMsg = err.error?.error;
        alert(errMsg);
      },
    });
  }

  ondelete(id: String) {
    this.service.deleteUsers(id).subscribe({
      next: (val: any) => {
        this.toast.success('User deleted successfully');
        this.getUserDetails();
      },
      error: (err) => {
        const errMsg = err.error?.error;
        this.toast.error(errMsg);
      },
    });
  }

  Editform(mentor: user) {
    this.adduserform.patchValue(mentor);
  }

  formPatch() {
    this.service.editFormPatch(this.adduserform.value).subscribe({
      next: (val) => {
        this.toast.success('Form updated successfully');
        this.getUserDetails();
      },
      error: (err) => {
        const errMsg = err.error?.error;
        this.toast.error(errMsg);
      },
    });
  }

  logout() {
    this.router.navigate(['']);
  }

  setPaginatedUsers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUser = this.filteredUsers.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.setPaginatedUsers();
    }
  }

  applyFilter(): void {
    const search = this.filterText.toLowerCase().trim();
    this.filteredUsers = this.users.filter((u) =>
      u.username.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.role.toLowerCase().includes(search)
    );
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.setPaginatedUsers();
  }
}
