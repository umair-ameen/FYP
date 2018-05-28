import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase';

import { AuthService } from '../auth.service';
import { SharedService } from '../../../shared/shared.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  roles: string[] = ['student', 'teacher'];
  departments: string[] = ['BSIT', 'BBA'];
  role: string = this.roles[0];
  batches: string[] = [];
  rollNos: string[] = [];
  emailError: string = '';
  passwordError: string = '';

  constructor(private authService: AuthService, private sharedService: SharedService) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    let url = 'batches/names';
    this.sharedService.getData(url)
      .subscribe(
        (response) => {
          this.batches = response;
          console.log('Batches are fetched...', this.batches);
        },
        (error) => {
          console.log(error)
        }
      );
    this.sharedService.getData('rollNos').subscribe(
      (response) => { this.rollNos = Object.values(response); console.log('Roll Nos:', this.rollNos) },
      (error) => console.log(error)
    )

  }

  onSignup(form: NgForm) {
    let userInfo = form.value;
    delete userInfo.terms;
    let length = this.rollNos.length - 1;
    if (this.role == 'student') {
      userInfo.rollNo = userInfo.batch + userInfo.department + userInfo.number;
      userInfo.role = 'student';
      for (let i = 0; i <= length; i++) {
        if (this.rollNos[i] == userInfo.rollNo) {
          console.log('Roll No already exists');
        } else if (this.rollNos[i] != userInfo.rollNo) {
          console.log('Signing up student');
          this.authService.signupUser(userInfo).then(
            () => {
              if (this.authService.emailError == 'auth/email-already-in-use') {
                this.emailError = 'The email address is already in use by another account.';
              } else if (this.authService.emailError == 'auth/weak-password') {
                this.passwordError = 'Password should be at least 6 characters';
              } else {
                this.emailError = '';
              }
            }
          );
        }
      }
    } else if (this.role == 'teacher') {
      userInfo.role = 'teacher';
      this.authService.signupUser(userInfo).then(
        () => {
          console.log('Signing up teacher')
          if (this.authService.emailError == 'auth/email-already-in-use') {
            this.emailError = 'The email address is already in use by another account.';
          } else if (this.authService.emailError == 'auth/weak-password') {
            this.passwordError = 'Password should be at least 6 characters';
          } else {
            this.emailError = '';
          }
        }
      );
    }
  }
}
