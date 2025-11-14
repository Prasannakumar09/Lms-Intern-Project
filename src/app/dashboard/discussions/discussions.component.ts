import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../auth/services/service.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastserviceService } from '../../auth/services/toastservice.service';


@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.component.html',
  styleUrl: './discussions.component.scss',
})
export class DiscussionsComponent implements OnInit {
  User: any = localStorage.getItem('user');
  discussions: any[] = [];
  filteredDiscussions: any[] = [];
  mentorname = localStorage.getItem('username')
  questionForm: FormGroup;
  selectedDate: string = '';
  questionid:String = '';
  answerForm: FormGroup;
  constructor(
    private service: ServiceService,
    private fb: FormBuilder,
    private toast: ToastserviceService
  ) {
    this.questionForm = this.fb.group({
      question: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      category: new FormControl('', Validators.required),
      details: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
    });
    this.answerForm = this.fb.group({
      mentorname : new FormControl(this.mentorname),
      answer: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
    });
  }
  ngOnInit(): void {
    this.getQuestionsandAns();
  }
  submitQuestion() {
    this.service.questionDiscussion(this.questionForm.value).subscribe({
      next: (val: any) => {
        this.toast.success('Question Posted Successfully');
        this.questionForm.reset()
      },
      error: (err) => {
        const errMsg = err.error?.error;
        this.toast.error(errMsg);
      },
    });
  }
  getQuestionsandAns() {
    this.service.getDiscussions().subscribe({
      next: (val: any) => {
        this.discussions = val;
        this.filteredDiscussions = val;
      },
      error: (err) => {
        const errMsg = err.error?.error;
        this.toast.error(errMsg);
      },
    });
  }
  reply(id:String){
    this.questionid = id;
  }
  replyToQuestion() {
    this.service.answerPost(this.questionid,this.answerForm.value).subscribe({
      next:(val:any) => {
        this.toast.success(val.message)
        this.getQuestionsandAns();
      },
      error:(err) => {
        const errMsg = err.error?.error
        this.toast.error(errMsg)
      }
    })
  }
  filterByDate() {
    if (!this.selectedDate) {
      this.filteredDiscussions = this.discussions;
      return;
    }

    const selected = new Date(this.selectedDate).toDateString();
    this.filteredDiscussions = this.discussions.filter(
      (d) => new Date(d.createdAt).toDateString() === selected
    );
  }
}
