import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  session = firebase.auth().currentUser;
  userData: any;
  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.session = firebase.auth().currentUser;
    this.fetchUserData();
  }

  fetchUserData() {
    if (this.session != null || this.session != undefined) {
      let url: string = 'users/' + this.session.uid;
      this.sharedService.getOnce(url).then(
        (response) => {
          // if (response.val() !== null && response.val() !== undefined) {
          this.userData = response.val();
          console.log('User Data: ', this.userData);
          localStorage.setItem('user', JSON.stringify(this.userData));
        }
      )
    } else {
      this.session = firebase.auth().currentUser;
      setTimeout(() => {
        this.fetchUserData();
      }, 1000);
    }
  }
}
