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

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  onLogin(form: NgForm){
    const email: string = form.value.email, password: string = form.value.password;
    this.auth.loginUser(email, password);
    firebase.auth().onAuthStateChanged(
      (user) => {
        if (!user){
          this.auth.loginUser(email, password)
        }else if(user){
          // this.auth.getToken();
        }
      }
    )
  }

}
