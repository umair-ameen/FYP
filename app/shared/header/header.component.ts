import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

import { SharedService } from '../shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userName: string = 'User';
  role: string = '';
  show:boolean = false;
  constructor(private sharedService: SharedService, private router: Router) {}
  
  ngOnInit() {
    this.checkUser();
  }
  
  checkUser(){
    setInterval(
      () => {
        if(localStorage.getItem('user') != null){
          let user: any = JSON.parse(localStorage.getItem('user'));
          this.userName = user.userName;
          this.role = user.role;
        }
      }, 1000);
  }

  toggleCollapse() {
    this.show = !this.show
  }

  logout(){
    console.log('Logout called');
    firebase.auth().signOut().then(
      (response)=>{
        console.log('Logout successful', response);
        localStorage.clear();
        this.router.navigate(['/login'])
      },(error) => {
        console.log('Error in loging out', error)
      }
    );
  }

}
