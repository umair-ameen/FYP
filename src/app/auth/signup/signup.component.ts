import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase';

import { AuthService } from '../auth.service';
import { ExaminerService } from '../../examiner/examiner.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [ExaminerService]
})
export class SignupComponent implements OnInit {
  roles: string[] = ['student', 'teacher'];
  departments: string[] = ['BSIT', 'BBA'];
  role: string = this.roles[0];
  batches: string[] = [];
  rollNos: string[] = [];

  constructor(private authService: AuthService, private examinerService: ExaminerService) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    let url = 'batches/names';
    this.examinerService.getData(url)
      .subscribe(
      (response) => {
        this.batches = response;
        console.log('Batches are fetched...', this.batches);
      },
      (error) => {
        console.log(error)
      }
      );
      this.examinerService.getData('users/rollNo').subscribe(
        (response) => {this.rollNos = Object.values(response); console.log('Roll Nos:', this.rollNos)},
        (error) => console.log(error)
      )

  }

  onSignup(form: NgForm){
    let userInfo = form.value;
    let length = this.rollNos.length-1;
    userInfo.rollNo = userInfo.batch + '-' +userInfo.department+ '-' + userInfo.number;
    for(let i = 0; i <= length; i++){
      if(this.rollNos[i] == userInfo.rollNo){
        console.log('Roll No already exists');
      }else if(this.rollNos[length] != userInfo.rollNo){
        console.log('Signing up');
        this.authService.signupUser(userInfo);
      }
    }
  }

}
