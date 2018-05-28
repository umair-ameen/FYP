import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  ngOnInit(){
    firebase.initializeApp({
      apiKey: "AIzaSyCJilBsxArA1jfiVbAKRrmLPrVv6QwH6g8",
      authDomain: "myfyp-40291.firebaseapp.com",
      databaseURL: "https://myfyp-40291.firebaseio.com",
    });
  }
}
