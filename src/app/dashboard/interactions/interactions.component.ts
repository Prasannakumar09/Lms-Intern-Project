import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ServiceService } from '../../auth/services/service.service';
import { ToastserviceService } from '../../auth/services/toastservice.service';

@Component({
  selector: 'app-interactions',
  templateUrl: './interactions.component.html',
  styleUrls: ['./interactions.component.scss']
})
export class InteractionsComponent implements OnInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('pollPopup') pollPopup!: ElementRef;

  messagein: FormGroup;
  name = localStorage.getItem('username') || '';
  chattings: any[] = [];

  pollForm!: FormGroup;
  tempSelected: any = {};
  polls: any[] = [];
  role: any = localStorage.getItem('user') || '';
  currentUserId: any = localStorage.getItem('userId') || '';

  creatingPoll = false;
  submittingVote: { [pollId: string]: boolean } = {};
  deletingPoll: { [pollId: string]: boolean } = {};
  isPollOpen = false;

  constructor(
    private service: ServiceService,
    private fb: FormBuilder,
    private toast: ToastserviceService,
    private hostRef: ElementRef
  ) {
    this.messagein = this.fb.group({
      message: new FormControl('', [Validators.required, Validators.minLength(1)])
    });
  }

  ngOnInit(): void {
    this.getInteractions();
    this.initPollForm();
    this.loadPolls();
  }

  getInteractions() {
    this.service.getMessages().subscribe({
      next: (val: any) => {
        this.chattings = val || [];
        setTimeout(() => this.scrollToBottom(), 120);
      },
      error: (err) => {
        const errMsg = err.error?.error || 'Failed to load messages';
        this.toast.error(errMsg);
      }
    });
  }

  send() {
    if (!this.messagein.valid) return;
    const msg = this.messagein.value;
    this.service.messageInteraction(msg).subscribe({
      next: (res: any) => {
        this.toast.success(res?.message || 'Message sent');
        this.messagein.reset();
        this.getInteractions();
      },
      error: (err) => {
        const errMsg = err.error?.error || 'Failed to send message';
        this.toast.error(errMsg);
      }
    });
  }

  private scrollToBottom() {
    try {
      if (this.chatContainer && this.chatContainer.nativeElement) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    } catch (e) {}
  }

  initPollForm() {
    this.pollForm = this.fb.group({
      question: ['', Validators.required],
      multipleChoice: [false],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ])
    });
  }

  get options(): FormArray {
    return this.pollForm.get('options') as FormArray;
  }

  addOption() {
    this.options.push(this.fb.control('', Validators.required));
  }

  removeOption(i: number) {
    if (this.options.length > 2) this.options.removeAt(i);
  }

  createPoll() {
    if (this.pollForm.invalid) {
      this.toast.error('Please fill all poll fields');
      return;
    }
    this.creatingPoll = true;
    const formValue = this.pollForm.value;
    const formattedOptions = formValue.options
      .filter((t: string) => t && t.trim() !== '')
      .map((text: string, i: number) => ({ optionId: `${i + 1}`, text }));

    const payload = {
      question: formValue.question,
      options: formattedOptions,
      multipleChoice: formValue.multipleChoice
    };

    this.service.createPoll(payload).subscribe({
      next: (res: any) => {
        this.toast.success(res?.message || 'Poll created');
        this.pollForm.reset();
        this.initPollForm();
        this.loadPolls();
      },
      error: (err) => {
        const errMsg = err.error?.error || 'Failed to create poll';
        this.toast.error(errMsg);
      },
      complete: () => (this.creatingPoll = false)
    });
  }

  loadPolls() {
    this.service.getPolls().subscribe({
      next: (res: any) => {
        this.polls = Array.isArray(res) ? res : res?.data || res || [];
      },
      error: (err) => {
        const errMsg = err.error?.error || 'Failed to load polls';
        this.toast.error(errMsg);
      }
    });
  }

  toggleSelection(poll: any, optionId: any) {
    if (poll.multipleChoice) {
      if (!this.tempSelected[poll._id]) this.tempSelected[poll._id] = [];
      const list = this.tempSelected[poll._id];
      if (list.includes(optionId)) {
        this.tempSelected[poll._id] = list.filter((o: any) => o !== optionId);
      } else {
        list.push(optionId);
      }
    } else {
      this.tempSelected[poll._id] = [optionId];
    }
  }

  isOptionSelected(poll: any, optionId: any) {
    return (this.tempSelected[poll._id] || []).includes(optionId);
  }

  submitVote(pollId: any) {
    const selected = this.tempSelected[pollId] || [];
    if (selected.length === 0) {
      this.toast.error('Please select at least one option');
      return;
    }
    this.submittingVote[pollId] = true;
    this.service.votePoll(pollId, selected).subscribe({
      next: (res: any) => {
        this.toast.success(res?.message || 'Voted');
        this.loadPolls();
      },
      error: (err) => {
        const errMsg = err.error?.error || 'Failed to submit vote';
        this.toast.error(errMsg);
      },
      complete: () => (this.submittingVote[pollId] = false)
    });
  }

  deletePoll(id: any) {
    if (!confirm('Delete this poll?')) return;
    this.deletingPoll[id] = true;
    this.service.deletePoll(id).subscribe({
      next: (res: any) => {
        this.toast.success(res?.message || 'Deleted');
        this.loadPolls();
      },
      error: (err) => {
        const errMsg = err.error?.error || 'Failed to delete poll';
        this.toast.error(errMsg);
      },
      complete: () => (this.deletingPoll[id] = false)
    });
  }

  getPercentage(votes: number, options: any[]) {
    const total = options?.reduce((s: number, o: any) => s + (o.votes || 0), 0) || 0;
    return total === 0 ? 0 : Math.round((votes / total) * 100);
  }

  isUserVotedOption(poll: any, opt: any) {
    const userVote = poll.votedUserData?.find((u: any) => u.userId === this.currentUserId);
    if (userVote) return userVote.selectedOptionIds?.includes(opt.optionId);
    return poll.votedUser?.includes(this.currentUserId) && opt.voters?.includes(this.currentUserId);
  }

  togglePoll(event?: Event) {
    if (event) event.stopPropagation();
    this.isPollOpen = !this.isPollOpen;
    if (this.isPollOpen) {
      this.loadPolls();
    }
  }

  closePollPopup() {
    this.isPollOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.pollPopup?.nativeElement) return;
    const clickedInside = this.pollPopup.nativeElement.contains(event.target);
    if (!clickedInside) this.isPollOpen = false;
  }
}
