import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Chart } from 'chart.js';
import { ToastserviceService } from '../../auth/services/toastservice.service';
import { ServiceService } from '../../auth/services/service.service';

@Component({
  selector: 'app-demo-quiz',
  templateUrl: './demo-quiz.component.html',
  styleUrls: ['./demo-quiz.component.scss'],
})
export class DemoQuizComponent implements OnInit {
  score = 0;
  accuracy = 0;
  quizStarted = false;
  quizSubmitted = false;
  demoQuizform: FormGroup;
  currentIndex = 0;
  selectedAnswers: { [key: number]: string } = {};
  minutes = 4;
  seconds = 59;
  timeInterval: any;
  role: any = '';
  questions: any[] = [];
  viewAnswerMode = false;
  answerData: any = null;
  answerquestoview = false;

  constructor(
    private fb: FormBuilder,
    private toast: ToastserviceService,
    private service: ServiceService
  ) {
    this.demoQuizform = this.fb.group({
      question: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      explanation: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      correctans: new FormControl('', Validators.required),
      option: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
      ]),
    });
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('user');
    this.getQuestion();
  }

  get option(): FormArray {
    return this.demoQuizform.get('option') as FormArray;
  }

  getQuestion() {
    this.service.getQuizQuestion().subscribe({
      next: (val: any) => {
        this.questions = val;
      },
      error: (err) => {
        this.toast.error(err.error?.error);
      },
    });
  }

  startTest() {
    this.quizStarted = true;
    this.startTimer();
  }
  exitQuiz() {
    if (
      confirm(
        'Are you sure you want to exit the quiz? Your progress will be lost.'
      )
    ) {
      this.quizStarted = false;
      this.quizSubmitted = false;
    }
  }
  selectOption(questionIndex: number, option: string) {
    this.selectedAnswers[questionIndex] = option;
    this.answerquestoview = true
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) this.currentIndex++;
    this.answerquestoview = false
  }
  prevQuestion() {
    if (this.currentIndex > 0) this.currentIndex--;
    this.answerquestoview = false
  }
  goToQuestion(i: number) {
    this.currentIndex = i;
    this.answerquestoview = false
  }

  submitQuiz() {
    clearInterval(this.timeInterval);
    this.score = 0;
    this.questions.forEach((q, i) => {
      if (this.selectedAnswers[i] === q.correctans) this.score++;
    });
    this.accuracy = Math.round((this.score / this.questions.length) * 100);
    this.quizSubmitted = true;
    setTimeout(() => this.renderChart(), 0);
    const data = {
      totalQuestion: this.questions.length,
      score: this.score,
      accuracy: this.accuracy,
    };
    this.service.quizAnsSubmit(data).subscribe({
      next: (val: any) => this.toast.success(val.message),
      error: (err) => this.toast.error(err.error?.error),
    });
  }

  startTimer() {
    this.minutes = 4;
    this.seconds = 59;
    this.timeInterval = setInterval(() => {
      if (this.seconds > 0) this.seconds--;
      else if (this.minutes > 0) {
        this.minutes--;
        this.seconds = 59;
      } else this.submitQuiz();
    }, 1000);
  }

  onSubmit() {
    this.service.quizQuestion(this.demoQuizform.value).subscribe({
      next: (val: any) => this.toast.success(val.message),
      error: (err) => this.toast.error(err.error?.error),
    });
    this.demoQuizform.reset();
  }

  addOption() {
    this.option.push(this.fb.control('', Validators.required));
  }
  removeOption(i: number) {
    this.option.removeAt(i);
  }

  restartQuiz() {
    this.selectedAnswers = {};
    this.score = 0;
    this.accuracy = 0;
    this.quizSubmitted = false;
    this.currentIndex = 0;
    this.minutes = 4;
    this.seconds = 59;
    this.answerquestoview=false;
  }

  renderChart() {
    const ctx = document.getElementById(
      'performanceChart'
    ) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Correct', 'Incorrect'],
        datasets: [
          {
            data: [this.score, this.questions.length - this.score],
            backgroundColor: ['#4caf50', '#f44336'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        cutout: '70%',
        plugins: { legend: { display: true, position: 'bottom' } },
      },
    });
  }

  viewAns() {
    const currentQ = this.questions[this.currentIndex];

    this.answerData = {
      question: currentQ.question,
      options: currentQ.option,
      correct: currentQ.correctans,
      selected: this.selectedAnswers[this.currentIndex],
      explanation: currentQ.explanation,
    };
    this.viewAnswerMode = true;
  }
  closeView() {
    this.viewAnswerMode = false;
  }
}
