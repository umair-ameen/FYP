import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase';
import * as moment from 'moment';

import { Test } from '../test.model';
import { SharedService } from '../../../shared/shared.service';
import { AuthService } from '../../../shared/auth/auth.service';

@Component({
  selector: 'app-obtain-test',
  templateUrl: './obtain-test.component.html',
  styleUrls: ['./obtain-test.component.css'],
})
export class ObtainTestComponent implements OnInit {
  test: Test;
  session = firebase.auth().currentUser;
  userData: any = '';
  dateTimeCurrent: Date = new Date();
  dateTimeTest: Date;
  passBox: any[] = [];
  currentQ;
  i: number = 0;
  condition: string = 'false';
  isPassBox: Boolean = true;
  userScore: number = 0;
  testStatus: any = 'Something went wrong...';
  timer;
  totalQues: number = 0;
  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.fetchUserData();
    this.session = firebase.auth().currentUser;
    if (localStorage.getItem('test') !== null) {
      console.log('local storage is greater than 0');
      this.startTest();
    } else {
      this.condition = 'false';
    }
  }

  fetchUserData() {
    if (this.session != null || this.session != undefined) {
      let url: string = 'users/' + this.session.uid;
      this.sharedService.getOnce(url).then(
        (response) => {
          if (response.val() !== null && response.val() !== undefined) {
            this.userData = response.val();
            console.log('User Data: ', this.userData)
          } else {
            this.testStatus = 'Something went wrong, Please refresh...';
          }
        }
      )
    } else {
      this.session = firebase.auth().currentUser;
      setTimeout(() => {
        this.fetchUserData();
      }, 1000);
    }
  }

  startTest() {
    this.test = JSON.parse(localStorage.getItem('test'));
    this.i = this.test.mcqs.length - 1;
    this.totalQues = this.test.mcqs.length;
    this.currentQ = this.test.mcqs[this.i];
    this.condition = 'test';
    this.testStatus = 'Obtain the test below';
    console.log('Test', this.test);
    this.initializeTimer();
  }

  // getTimeRemaining() {
  //   let testDate = new Date(this.test.dateTime);

  //   let deadline = moment(testDate).add(this.test.duration, 'm');
  //   let t = deadline.diff(testDate);
  //   console.log('Diff: ', t);
  //   var minutes = Math.floor(t / 60000);
  //   var seconds = parseInt(((t % 60000) / 1000).toFixed(0));

  //   return {
  //     'total': t,
  //     'minutes': minutes,
  //     'seconds': seconds
  //   }
  // }

  // initializeTimer(){
  //   var timeInterval = setInterval( ()=>{
  //     var t = this.getTimeRemaining();
  //     this.timer = t.minutes+':' + t.seconds;
  //     if(t.total<=0){
  //       clearInterval(timeInterval);
  //     }
  //   }, 1000)
  // }



  initializeTimer() {
    var millis = this.test.duration * 60000;
    var minutes = Math.floor(millis / 60000);
    var seconds = parseInt(((millis % 60000) / 1000).toFixed(0));

    var timeInterval = setInterval(() => {

      if (seconds > 0) {
        seconds--;
      } else if (seconds == 0 && minutes > 0) {
        minutes--;
        seconds = 60;
      } else if (seconds <= 0 && minutes <= 0) {
        this.condition = 'result';
        this.testStatus = 'Time Over, test is being submitted'
        clearInterval(timeInterval);
        let url: string = 'batches/' + this.userData.batch + '/results/' + this.test.subjectKey + '/' + this.session.uid;
        let result = { rollNo: this.userData.rollNo, name: this.session.displayName, score: this.userScore }
        this.condition = 'result';
        this.sharedService.update(url, result);
      }
      this.timer = ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2)

    }, 1000)
  }

  getDateTime(): Promise<string> {
    return new Promise(
      (resolve, reject) => {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.open("HEAD", "http://www.googleapis.com", true);
        xmlhttp.onreadystatechange = () => {
          if (xmlhttp.readyState == 4) {
            let dateTimeGoogle: string = xmlhttp.getResponseHeader("Date");
            this.dateTimeCurrent = new Date(xmlhttp.getResponseHeader("Date"));
            console.log('DateTime received from Google: ', dateTimeGoogle, 'After convert to local: ', this.dateTimeCurrent);
          } else if (xmlhttp.status === 0) {
            xmlhttp.send(null);
            console.log('Retried')
          }
        }
        xmlhttp.send(null);
      }
    )
  }

  submitQ(form: NgForm) {
    let submittedQ = form.value;
    let length = this.test.mcqs.length - 1;
    this.i = this.i - 1;
    if (submittedQ.ans == this.currentQ.key) {
      this.addScore();
    }
    if (this.i <= length && this.i > -1) {
      this.currentQ = this.test.mcqs[this.i];
      console.log('Current Question: ', this.currentQ);
    } else if (this.i <= -1 && this.passBox[0] != undefined) {
      this.startpassBox()
    } else {
      let user: any = JSON.parse(localStorage.getItem('user'));
      let userName = user.userName;
      let url: string = 'batches/' + this.userData.batch + '/results/' + this.test.subjectKey + '/' + this.session.uid;
      console.log('URL before update', url)
      let result = { rollNo: this.userData.rollNo, name: userName, score: this.userScore }
      this.condition = 'result';
      this.testStatus = this.userScore + ' mark(s)';
      this.sharedService.update(url, result);
    }
    form.reset();
  }

  addScore() {
    let totalMarks = this.test.marks;
    let totalQues = this.totalQues;
    let marksPerQ = totalMarks / totalQues;
    this.userScore = this.userScore + marksPerQ;
  }

  addToPassBox(question) {
    let lastPBQ = this.passBox.length - 1;
    if (this.passBox[lastPBQ] != question) {
      this.passBox.push(question);
      if (this.i > 0) {
        this.i = this.i - 1;
        this.currentQ = this.test.mcqs[this.i];
      } else {
        this.isPassBox = false;
        this.startpassBox();
      }
      console.log('Added to passBox');
    }
  }
  startpassBox() {
    this.test.mcqs = this.passBox;
    console.log('passBox Started: ', this.test.mcqs);
    this.i = this.test.mcqs.length - 1;
    console.log('This.i: ', this.i)
    this.currentQ = this.test.mcqs[this.i];
    console.log('This.i: ', this.i);
    this.passBox = [];
  }


}
