import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ServiceService } from '../../auth/services/service.service';
import { ToastserviceService } from '../../auth/services/toastservice.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  role = localStorage.getItem('user');
  currentUserId = localStorage.getItem('userId');
  pollForm: FormGroup;
  polls: any[] = [];
  selected: { [pollId: string]: string[] | undefined } = {};

  constructor(
    private fb: FormBuilder,
    private service: ServiceService,
    private toast: ToastserviceService
  ) {
    this.pollForm = this.fb.group({
      question: new FormControl('', Validators.required),
      multipleChoice: new FormControl(false),
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
      ]),
    });
  }

  ngOnInit(): void {
    this.loadPolls();
  }

  get options(): FormArray {
    return this.pollForm.get('options') as FormArray;
  }

  addOption() {
    this.options.push(this.fb.control('', Validators.required));
  }

  removeOption(index: number) {
    if (this.options.length > 2) this.options.removeAt(index);
  }

  createPoll() {
    console.log(this.pollForm.value);
    if (this.pollForm.invalid) {
      this.toast.error('Please fill all fields');
      return;
    }

    const formValue = this.pollForm.value;
    const formattedOptions = formValue.options
      .filter((text: string) => text.trim() !== '')
      .map((text: string, i: number) => ({ optionId: `${i + 1}`, text }));

    const pollData = {
      question: formValue.question,
      options: formattedOptions,
      multipleChoice: formValue.multipleChoice,
    };

    this.service.createPoll(pollData).subscribe({
      next: () => {
        this.toast.success('Poll created successfully');
        this.pollForm.reset();
        this.pollForm.setControl(
          'options',
          this.fb.array([
            this.fb.control('', Validators.required),
            this.fb.control('', Validators.required),
          ])
        );
        this.loadPolls();
      },
      error: () => this.toast.error('Failed to create poll'),
    });
  }

  loadPolls() {
    this.service.getPolls().subscribe({
      next: (res: any) => {
        this.polls = res;
        console.log(res);
      },
      error: () => this.toast.error('Failed to load polls'),
    });
  }

  toggleSelection(poll: any, optionId: string) {
    if (poll.multipleChoice) {
      const selected = this.selected[poll._id] || [];
      if (selected.includes(optionId)) {
        this.selected[poll._id] = selected.filter(
          (id: string) => id !== optionId
        );
      } else {
        this.selected[poll._id] = [...selected, optionId];
      }
    } else {
      this.selected[poll._id] = [optionId];
    }
  }

  submitVote(pollId: string) {
    const selectedOptions = this.selected[pollId];
    if (!selectedOptions || selectedOptions.length === 0) {
      this.toast.error('Please select at least one option');
      return;
    }

    this.service.votePoll(pollId, selectedOptions).subscribe({
      next: (res:any) => {
        this.toast.success(res.message);
        this.loadPolls();
      },
      error: (err) => {
        const errMsg = err.error?.error
        this.toast.error(errMsg)
      },
    });
  }
  getPercentage(votes: number, options: any[]): number {
    const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);
    return totalVotes ? Math.round((votes / totalVotes) * 100) : 0;
  }

  isUserVotedOption(poll: any, option: any): boolean {
    const userVote = poll.votedUserData?.find(
      (u: any) => u.userId === this.currentUserId
    );
    return userVote?.selectedOptionIds.includes(option.optionId);
  }
  deletePoll(id:any){
    this.service.deletePoll(id).subscribe({
      next:(res:any) => {
        this.toast.success(res)
        this.loadPolls()
      },
      error:(err) => {
        const errMsg = err.error?.error
        this.toast.error(errMsg)
      }
    })
  }
}
