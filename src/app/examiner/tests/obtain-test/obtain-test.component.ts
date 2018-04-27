import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase';

import { TestsService } from '../tests.service';
import { Test } from '../test.model';
import { ExaminerService } from '../../examiner.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-obtain-test',
  templateUrl: './obtain-test.component.html',
  styleUrls: ['./obtain-test.component.css'],
  providers: [TestsService]
})
export class ObtainTestComponent implements OnInit {
  test: Test;
  session = firebase.auth().currentUser;
  userData: any = '';
  dateTimeCurrent: Date = new Date();
  dateTimeTest: Date;
  pauseBox: any[] = [];
  currentQ;
  i: number = 0;
  condition: Boolean = false;
  isPauseBox: Boolean = true;
  userScore: number = 0;
  testStatus: any = 'Currently there is no tests available. Click on fetch test to refresh.';

  constructor(private testsService: TestsService, private examinerService: ExaminerService) { }

  ngOnInit() {
    this.fetchUserData();
    this.session = firebase.auth().currentUser;
    if (localStorage.length > 0) {
      this.startTest();
    }else{
      this.condition = false;
    }
  }

  fetchUserData() {
    if (this.session != null || this.session != undefined) {
      let url: string = 'users/' + this.session.uid;
      this.examinerService.getOnce(url).then(
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
    this.currentQ = this.test.mcqs[this.i];
    this.condition = true;
    this.testStatus = 'Obtain the test below';
    console.log('Test', this.test);
    // localStorage.removeItem('test');
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
    } else if (this.i <= -1 && this.pauseBox[0] != undefined) {
      this.startPauseBox()
    } else {
      let url: string = 'batches/' + this.userData.batch + '/results/' + this.test.subjectKey + '/' + this.session.uid;
      let result = { rollNo: this.userData.rollNo, name: this.session.displayName, score: this.userScore }
      this.condition = false;
      this.testStatus = this.userScore + ' mark(s)';
      this.examinerService.update(url, result);
    }
    form.reset();
  }

  addScore() {
    this.userScore++;
    console.log('UserScore: ', this.userScore);
  }

  addToPauseBox(question) {
    let lastPBQ = this.pauseBox.length - 1;
    if (this.pauseBox[lastPBQ] != question) {
      this.pauseBox.push(question);
      if (this.i > 0) {
        this.i = this.i - 1;
        this.currentQ = this.test.mcqs[this.i];
      } else {
        this.isPauseBox = false;
        this.startPauseBox();
      }
      console.log('Added to pausebox');
    }
  }
  startPauseBox() {
    this.test.mcqs = this.pauseBox;
    console.log('Pausebox Started: ', this.test.mcqs);
    this.i = this.test.mcqs.length - 1;
    console.log('This.i: ', this.i)
    this.currentQ = this.test.mcqs[this.i];
    console.log('This.i: ', this.i);
    this.pauseBox = [];
  }


}
