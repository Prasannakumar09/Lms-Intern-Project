import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface loguser {
  username: String;
  password: String;
}
interface adduser {
  username: String;
  email: String;
  role: String;
  password: String;
}
interface edituser {
  _id: String;
  username: String;
  email: String;
  role: String;
}
interface course {
  title: String;
  description: String;
  category: String;
  pricing: String;
}
interface courseApprove {
  title: String;
  description: String;
  category: String;
  pricing: String;
  status: String;
  mentor: String;
}
interface editCourse {
  _id: String;
  title: String;
  description: String;
  category: String;
  pricing: String;
  status: String;
}
interface announcementpost {
  title: String;
  content: String;
}
interface announcementget {
  _id: String;
  title: String;
  content: String;
  date: String;
}
interface courses {
  _id: String;
  title: String;
  description: String;
  category: String;
  price: String;
  mentorname: String;
}
interface cartcourse {
  title: String;
  description: String;
  category: String;
  price: String;
  mentorname: String;
}
interface feedback {
  userId: String;
  courseId: String;
  feedbackInfo: String;
}
interface questiondiscussion {
  question: String;
  category: String;
  details: String;
}
interface quizQuestion{
  question:String,
  explanation:String,
  correctans:String,
  option:any
}
interface quizAnswer{
  totalQuestion:Number
  score:Number
  accuracy:Number
}
const baseurl = 'http://localhost:3000/api';
@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  constructor(private http: HttpClient) {}

  loginUser(obj: loguser): Observable<any> {
    return this.http.post<any>(`${baseurl}/login`, obj);
  }
  lastCourse(): Observable<any> {
    return this.http.get<any>(`${baseurl}/latestcourse`);
  }
  adminAddUsers(object: adduser): Observable<adduser> {
    return this.http.post<adduser>(`${baseurl}/addAdminUsers`, object);
  }
  getUsers(): Observable<any> {
    return this.http.get(`${baseurl}/getUsers`);
  }
  deleteUsers(_id: String): Observable<any> {
    return this.http.delete<any>(`${baseurl}/deleteUsers/${_id}`);
  }
  getUserscount(): Observable<any> {
    return this.http.get<any>(`${baseurl}/getusercount`);
  }
  editFormPatch(obj: edituser): Observable<edituser> {
    return this.http.patch<edituser>(`${baseurl}/editform`, obj);
  }
  addCourse(obj: course): Observable<course> {
    return this.http.post<course>(`${baseurl}/addcourse`, obj);
  }
  editCourse(obj: editCourse): Observable<editCourse> {
    return this.http.patch<any>(`${baseurl}/editcourse`, obj);
  }
  deleteCourse(id: String): Observable<any> {
    return this.http.delete<any>(`${baseurl}/deletecourse/${id}`);
  }
  courseApprovals(): Observable<courseApprove> {
    return this.http.get<courseApprove>(`${baseurl}/courseapprove`);
  }
  adminapproval(id: String, obj: any): Observable<any> {
    return this.http.post<any>(`${baseurl}/adminapproval/${id}`, obj);
  }
  getCourseDetails(): Observable<courseApprove> {
    return this.http.get<courseApprove>(`${baseurl}/getCourseDetails`);
  }
  getApprovedCourses(): Observable<editCourse> {
    return this.http.get<editCourse>(`${baseurl}/approvedcourses`);
  }
  announcementPost(obj: announcementpost): Observable<announcementpost> {
    return this.http.post<announcementpost>(`${baseurl}/announcepost`, obj);
  }
  announcementfetching(): Observable<announcementget> {
    return this.http.get<announcementget>(`${baseurl}/announceget`);
  }
  getCourses(): Observable<courses> {
    return this.http.get<courses>(`${baseurl}/getcourses`);
  }
  addToCart(obj: cartcourse): Observable<cartcourse> {
    return this.http.post<cartcourse>(`${baseurl}/courseaddtocart`, obj);
  }
  userCart(): Observable<cartcourse> {
    return this.http.get<cartcourse>(`${baseurl}/usercoursecart`);
  }
  feedbackpost(obj: feedback): Observable<feedback> {
    return this.http.post<feedback>(`${baseurl}/feedbackpost`, obj);
  }
  getFeedback(): Observable<any> {
    return this.http.get<any>(`${baseurl}/getfeedback`);
  }
  questionDiscussion(obj: questiondiscussion): Observable<any> {
    return this.http.post<questiondiscussion>(`${baseurl}/postquestion`, obj);
  }
  getDiscussions(): Observable<any> {
    return this.http.get<any>(`${baseurl}/getdiscussion`);
  }
  answerPost(id: String, obj: any): Observable<any> {
    return this.http.post<any>(`${baseurl}/answerpost/${id}`, obj);
  }
  addLessons(obj: FormData): Observable<any> {
    return this.http.post<any>(`${baseurl}/lessonpost`, obj);
  }
  uploadPDF(data: FormData) {
    return this.http.post(`${baseurl}/uploadpdf`, data);
  }

  getLessons(courseId: string) {
    return this.http.get(`${baseurl}/getpdfs/${courseId}`);
  }
  getDisCount():Observable<any>{
    return this.http.get<any>(`${baseurl}/getdiscount`)
  }
  quizQuestion(obj:quizQuestion):Observable<quizQuestion>{
    return this.http.post<quizQuestion>(`${baseurl}/quizquestionpost`,obj)
  }
  getQuizQuestion():Observable<any>{
    return this.http.get<any>(`${baseurl}/getquizquestions`)
  }
  quizAnsSubmit(obj:quizAnswer):Observable<quizAnswer>{
    return this.http.post<quizAnswer>(`${baseurl}/quizresult`,obj)
  }
  getResultAnalysis():Observable<any>{
    return this.http.get<any>(`${baseurl}/quizanalyticresult`)
  }
   createPoll(data: any): Observable<any> {
    return this.http.post<any>(`${baseurl}/createpoll`, data);
  }

  getPolls(): Observable<any> {
    return this.http.get<any>(`${baseurl}/getpoll`);
  }
  deletePoll(id:string):Observable<any>{
    return this.http.delete<any>(`${baseurl}/deletepoll/${id}`)
  }
  votePoll(pollId: string, selected: any): Observable<any> {
    return this.http.post<any>(`${baseurl}/${pollId}/vote`, { selected });
  }
  messageInteraction(obj:any):Observable<any>{
    return this.http.post<any>(`${baseurl}/messagepost`,obj)
  }
  getMessages():Observable<any>{
    return this.http.get<any>(`${baseurl}/getmessages`)
  }
}
