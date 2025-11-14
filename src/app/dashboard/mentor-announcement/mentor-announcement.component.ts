import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../auth/services/service.service';
import { ToastserviceService } from '../../auth/services/toastservice.service';

interface AnnouncementGet {
  _id: string;
  title: string;
  content: string;
  createdAt: any;
}

@Component({
  selector: 'app-mentor-announcement',
  templateUrl: './mentor-announcement.component.html',
  styleUrls: ['./mentor-announcement.component.scss'] 
})
export class MentorAnnouncementComponent implements OnInit {
  announcementform: FormGroup;
  user: string = '';
  announcement: AnnouncementGet[] = [];

  constructor(
    private fb: FormBuilder,
    private service: ServiceService,
    private toast: ToastserviceService
  ) {
    this.announcementform = this.fb.group({
      title: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.user = localStorage.getItem('user') || '';
    this.getannouncement();
  }

  onPost() {
    if (this.announcementform.invalid) {
      this.toast.error('Please fill out all fields before posting!');
      return;
    }

    this.service.announcementPost(this.announcementform.value).subscribe({
      next: (val: any) => {
        this.toast.success(val.message);
        this.announcementform.reset();
        this.getannouncement(); 
      },
      error: (err) => {
        const errMsg = err.error?.error || 'Failed to post announcement!';
        this.toast.error(errMsg);
      }
    });
  }

 
  getannouncement() {
    this.service.announcementfetching().subscribe({
      next: (val: any) => {
        this.announcement = val;
      },
      error: (err) => {
        const errMsg = err.error?.error || 'Failed to fetch announcements!';
        this.toast.error(errMsg);
      }
    });
  }


  refreshAnnouncements() {
    this.getannouncement();
    this.toast.success('Announcements refreshed!');
  }

 
  // deleteannouncement(id: string) {
  //   this.service.(id).subscribe({
  //     next: (res) => {
  //       this.toast.success('Announcement deleted!');
  //       this.getannouncement();
  //     },
  //     error: (err) => {
  //       const errMsg = err.error?.error || 'Failed to delete announcement!';
  //       this.toast.error(errMsg);
  //     }
  //   });
  // }
}
