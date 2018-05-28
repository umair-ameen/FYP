import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginError: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onLogin(form: NgForm){
    const email: string = form.value.email, password: string = form.value.password;
    this.authService.loginUser(email, password).then(
      () => {
        if(this.authService.loginError != ''){
          this.loginError = true;
        }else{
          this.loginError = false;
        }
      }
    );
    // firebase.auth().onAuthStateChanged(
    //   (user) => {
    //     if (!user){
    //       this.authService.loginUser(email, password);
    //     }else if(user){
    //       // this.auth.getToken();
    //     }
    //   }
    // )
  }

}
