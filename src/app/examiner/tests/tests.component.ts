import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';;
import * as firebase from 'firebase';

import { ExaminerService } from '../examiner.service';
import { AuthService } from '../../auth/auth.service';
import { TestsService } from './tests.service';


@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css'],
  providers: [ExaminerService, TestsService]
})

export class TestsComponent implements OnInit {
  session = firebase.auth().currentUser;
  dateTimeCurrent: Date = new Date();
  dateTimeTest: Date;
  userData: any = '';
  testData: any;
  tests: any[] = [];
  pauseBox: any[] = [];
  currentQ;
  i: number = 0;
  condition: Boolean = false;
  isPauseBox: Boolean = true;
  userScore: number = 0;

  testStatus: any = 'Currently there is no tests available. Click on fetch test to refresh.';


  constructor(private examinerService: ExaminerService, private authService: AuthService, private testsService: TestsService, private router: Router) { }

  ngOnInit() {
    console.log('System Date', this.dateTimeCurrent);
    this.getDateTime();
    this.session = firebase.auth().currentUser;
    this.fetchUserData();
    console.log('Session: ', this.session);
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

  fetchTest() {
    this.testStatus = 'Loading...';
    this.tests = [];
    let url: string = 'batches/' + this.userData.batch + '/tests';
    this.examinerService.getData(url).subscribe(
      (response) => {
        this.testData = response;
        console.log('Test Data Received: ', this.testData)
        if (this.testData != undefined && this.testData != null) {
          let keys = Object.keys(this.testData);
          keys.forEach((testKey) => {
            this.tests.push(this.testData[testKey]);
            console.log('Tests: ', this.tests)
          });
          this.dateTimeTest = new Date(this.tests[0].dateTime);
          this.i = this.tests[0].mcqs.length - 1;
          this.currentQ = this.tests[0].mcqs[this.i];
          if (this.dateTimeTest.getTime() < this.dateTimeCurrent.getTime()) {
            this.testStatus = 'Attempt the test(s) given below.';
            console.log(this.dateTimeCurrent, '   ', this.dateTimeTest, '    ', this.dateTimeTest.getTime() < this.dateTimeCurrent.getTime());
            this.condition = true;
          } else {
            this.testStatus = 'Come back at ' + this.dateTimeTest + ' to attempt test';
          }
        } else {
          this.testStatus = 'No test found...'
        }
      }, (error) => console.log(error)
    )
  }

  submitQ(form: NgForm) {
    let submittedQ = form.value;
    let length = this.tests[0].mcqs.length - 1;
    this.i = this.i - 1;
    if (submittedQ.ans == this.currentQ.key) {
      this.addScore();
    }
    if (this.i <= length && this.i > -1) {
      this.currentQ = this.tests[0].mcqs[this.i];
      console.log('Current Question: ', this.currentQ);
    } else if (this.i <= -1 && this.pauseBox[0] != undefined) {
      this.startPauseBox()
    } else {
      let url: string = 'batches/' + this.userData.batch + '/results/' + this.tests[0].subjectKey + '/' + this.session.uid;
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
        this.currentQ = this.tests[0].mcqs[this.i];
      } else {
        this.isPauseBox = false;
        this.startPauseBox();
      }
      console.log('Added to pausebox');
    }
  }
  startPauseBox() {
    this.tests[0].mcqs = this.pauseBox;
    console.log('Pausebox Started: ', this.tests[0].mcqs);
    this.i = this.tests[0].mcqs.length - 1;
    console.log('This.i: ', this.i )
    this.currentQ = this.tests[0].mcqs[this.i];
    console.log('This.i: ', this.i );
    this.pauseBox = [];
  }

  onSelectTest(index: number){
    console.log(index, 'received');
    const testToShare = this.tests[index];
    localStorage.setItem('test', JSON.stringify(testToShare));
    this.router.navigate(['/examiner/obtain-test']);
    
  }
}


// import { Component, OnInit } from '@angular/core';
// import { Response } from '@angular/http';
// import { NgForm } from '@angular/forms';
// import { Router } from '@angular/router';
// import * as moment from 'moment';;
// import * as firebase from 'firebase';

// import { ExaminerService } from '../examiner.service';
// import { AuthService } from '../../auth/auth.service';


// @Component({
//   selector: 'app-obtain-test',
//   templateUrl: './obtain-test.component.html',
//   styleUrls: ['./obtain-test.component.css'],
//   providers: [ExaminerService]
// })

// export class ObtainTestComponent implements OnInit {
//   session = firebase.auth().currentUser;
//   dateTimeCurrent: Date = new Date();
//   dateTimeTest: Date;
//   userData: any = '';
//   testData: any;
//   tests: any[] = [];
//   pauseBox: any[] = [];
//   currentQ;
//   i: number = 0;
//   condition: Boolean = false;
//   isPauseBox: Boolean = true;
//   userScore: number = 0;

//   testStatus: any = 'Currently there is no tests available. Click on fetch test to refresh.';


//   constructor(private examinerService: ExaminerService, authService: AuthService) { }

//   ngOnInit() {
//     console.log('System Date', this.dateTimeCurrent);
//     this.getDateTime();
//     this.session = firebase.auth().currentUser;
//     this.fetchUserData();
//     console.log('Session: ', this.session);
//   }

//   fetchUserData() {
//     if (this.session != null || this.session != undefined) {
//       let url: string = 'users/' + this.session.uid;
//       this.examinerService.getOnce(url).then(
//         (response) => {
//           if (response.val() !== null && response.val() !== undefined) {
//             this.userData = response.val();
//             console.log('User Data: ', this.userData)
//           } else {
//             this.testStatus = 'Something went wrong, Please refresh...';
//           }
//         }
//       )
//     } else {
//       this.session = firebase.auth().currentUser;
//       setTimeout(() => {
//         this.fetchUserData();
//       }, 1000);
//     }
//   }

//   getDateTime(): Promise<string> {
//     return new Promise(
//       (resolve, reject) => {
//         let xmlhttp = new XMLHttpRequest();
//         xmlhttp.open("HEAD", "http://www.googleapis.com", true);
//         xmlhttp.onreadystatechange = () => {
//           if (xmlhttp.readyState == 4) {
//             let dateTimeGoogle: string = xmlhttp.getResponseHeader("Date");
//             this.dateTimeCurrent = new Date(xmlhttp.getResponseHeader("Date"));
//             console.log('DateTime received from Google: ', dateTimeGoogle, 'After convert to local: ', this.dateTimeCurrent);
//           } else if (xmlhttp.status === 0) {
//             xmlhttp.send(null);
//             console.log('Retried')
//           }
//         }
//         xmlhttp.send(null);
//       }
//     )
//   }

//   fetchTest() {
//     this.testStatus = 'Loading...';
//     this.tests = [];
//     let url: string = 'batches/' + this.userData.batch + '/tests';
//     this.examinerService.getData(url).subscribe(
//       (response) => {
//         this.testData = response;
//         console.log('Test Data Received: ', this.testData)
//         if (this.testData != undefined && this.testData != null) {
//           let keys = Object.keys(this.testData);
//           keys.forEach((testKey) => {
//             this.tests.push(this.testData[testKey]);
//             console.log('Tests: ', this.tests)
//           });
//           this.dateTimeTest = new Date(this.tests[0].dateTime);
//           this.i = this.tests[0].mcqs.length - 1;
//           this.currentQ = this.tests[0].mcqs[this.i];
//           if (this.dateTimeTest.getTime() < this.dateTimeCurrent.getTime()) {
//             this.testStatus = 'Attempt the test(s) given below.';
//             console.log(this.dateTimeCurrent, '   ', this.dateTimeTest, '    ', this.dateTimeTest.getTime() < this.dateTimeCurrent.getTime());
//             this.condition = true;
//           } else {
//             this.testStatus = 'Come back at ' + this.dateTimeTest + ' to attempt test';
//           }
//         } else {
//           this.testStatus = 'No test found...'
//         }
//       }, (error) => console.log(error)
//     )
//   }

//   submitQ(form: NgForm) {
//     let submittedQ = form.value;
//     let length = this.tests[0].mcqs.length - 1;
//     this.i = this.i - 1;
//     if (submittedQ.ans == this.currentQ.key) {
//       this.addScore();
//     }
//     if (this.i <= length && this.i > -1) {
//       this.currentQ = this.tests[0].mcqs[this.i];
//       console.log('Current Question: ', this.currentQ);
//     } else if (this.i <= -1 && this.pauseBox[0] != undefined) {
//       this.startPauseBox()
//     } else {
//       let url: string = 'batches/' + this.userData.batch + '/results/' + this.tests[0].subjectKey + '/' + this.session.uid;
//       let result = { rollNo: this.userData.rollNo, name: this.session.displayName, score: this.userScore }
//       this.condition = false;
//       this.testStatus = this.userScore + ' mark(s)';
//       this.examinerService.update(url, result);
//     }
//     form.reset();
//   }

//   addScore() {
//     this.userScore++;
//     console.log('UserScore: ', this.userScore);
//   }

//   addToPauseBox(question) {
//     let lastPBQ = this.pauseBox.length - 1;
//     if (this.pauseBox[lastPBQ] != question) {
//       this.pauseBox.push(question);
//       if (this.i > 0) {
//         this.i = this.i - 1;
//         this.currentQ = this.tests[0].mcqs[this.i];
//       } else {
//         this.isPauseBox = false;
//         this.startPauseBox();
//       }
//       console.log('Added to pausebox');
//     }
//   }
//   startPauseBox() {
//     this.tests[0].mcqs = this.pauseBox;
//     console.log('Pausebox Started: ', this.tests[0].mcqs);
//     this.i = this.tests[0].mcqs.length - 1;
//     console.log('This.i: ', this.i )
//     this.currentQ = this.tests[0].mcqs[this.i];
//     console.log('This.i: ', this.i );
//     this.pauseBox = [];
//   }
// }


