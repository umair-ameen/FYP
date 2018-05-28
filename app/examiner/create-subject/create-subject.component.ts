import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase';

import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-create-subject',
  templateUrl: './create-subject.component.html',
  styleUrls: ['./create-subject.component.css'],
})

export class CreateSubjectComponent implements OnInit, OnDestroy {
  batches: string[] = []; //batches fetched from backend will be itterated on select options
  selectedBatch: string = 'Select a batch'; //selected batch from select menu option variable
  selectedBatchData = []; //data of selected batch fetched from backend
  subjectFieldText: string = ''; //variable to be used for subject input field
  subjectsArray: any[]; //array of subjects extracted from selectedBatchData
  selectedSubject: { index: number, name: string, facilitator: string, key: string } = { index: undefined, name: undefined, facilitator: undefined, key: undefined };
  subjectKeys; //firebase keys of all subjects
  subjectsSubscription: Subscription;
  user: any;
  uid: string = '';
  teacher: boolean = false;
  error: string = '';
  success: string = '';
  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    // this.sharedService.userStatus();
    this.fetchBatches();
    this.getUserData();
  }

  getUserData(){
    let url: string = '';
    this.user =  JSON.parse(localStorage.getItem('user'));
    this.uid = this.user.uid;
    url = 'users/' + this.uid;
    this.sharedService.getOnce(url).then(
      (response) => {
        let userData = response.val();
        console.log('User Data: ', userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
      });
      this.sharedService.getData('examiners/'+this.uid+'/examinerCap').subscribe(
        (response) => {
          this.teacher = response;
          console.log('Examiner response', response);
        }, (error) => console.log(error)
      );
  }

  fetchBatches() {
    this.sharedService.userStatus();
    this.sharedService.getOnce('batches/names').then(
      (batches) => {
        this.batches = batches.val();
      }, (error) => console.log('Error while fetching this.batches: ', error)
    )
  }

  onBatchSelected(event) {
    this.sharedService.userStatus();
    this.selectedBatch = event.target.value;
    if (this.selectedBatch != 'Select a batch') {
      // firebase.database().ref('batches/' + this.selectedBatch).on('value', (snapshot) => {
      //   let data = snapshot.val();
      //   if (data != undefined || data != null) {
      //     this.selectedBatchData = data.subjects;
      //     this.subjectsArray = (Object).values(this.selectedBatchData);
      //     this.subjectKeys = Object.keys(this.selectedBatchData);
      //   } else if (data === undefined || data === null) {
      //     this.saubjectsArray = [];
      //   }
      // })
      this.subjectsSubscription = this.sharedService.getData('batches/' + this.selectedBatch).subscribe(
        (data) => {
          if (data != undefined || data != null) {
            console.log('Data Received from Firebase:', data);
            this.selectedBatchData = data.subjects;
            this.subjectsArray = (Object).values(this.selectedBatchData);
            this.subjectKeys = Object.keys(this.selectedBatchData);
          } else if (data === undefined || data === null) {
            this.subjectsArray = [];
            console.log('Issue with connection');
          }
        }
      )
    }
  }

  addSubject() {
    this.error = '';
    this.success = '';
    if (this.selectedBatch !== 'Select a batch' && this.subjectFieldText != ''){
      let url: string = 'batches/' + this.selectedBatch + '/subjects/';
      let newSubject: { name: string, facilitator: string, teacherUid: string };
      newSubject = { name: this.subjectFieldText, facilitator: this.user.userName, teacherUid: this.uid };
      this.sharedService.store(url, newSubject);
      this.success = 'New subject added'
    }
  }

  subjectRowSelected(event, index) {
    this.selectedSubject.index = index;
    this.selectedSubject.name = event.path[1].children[1].innerText;
    this.selectedSubject.facilitator = event.path[1].children[2].innerText;
    this.selectedSubject.key = this.subjectKeys[index];
    this.subjectFieldText = this.selectedSubject.name;
  }

  editSubject() {
    if (this.selectedSubject.index != -1) {
      let url = 'batches/' + this.selectedBatch + '/subjects/' + this.selectedSubject.key;
      let subject = { name: this.subjectFieldText }
      this.sharedService.update(url, subject);
      this.refresh();
    }
  }

  deleteSubject() {
    this.error = '';
    this.success = '';
    if (this.selectedSubject.index != -1) {
      const url: string = 'batches/' + this.selectedBatch + '/subjects/' + this.selectedSubject.key;
      this.sharedService.getOnce(url).then(
        (response) => {
          let subject = response.val();
          console.log('subject response', response)
          if(subject.teacherUid == this.uid){
            this.sharedService.remove(url).then(
              (response) => this.success = this.selectedSubject.name +' deleted'
            );
            this.refresh();
          }else{
            console.log('subject response', response.val())
            this.error = this.selectedSubject.name + ' is not your subject.'
          }
        }
      )
    }

  }

  refresh() {
    this.selectedSubject.index = -1;
    this.subjectFieldText = '';
  }

  ngOnDestroy() {
    if (this.selectedBatch != 'Select a batch') {
      this.subjectsSubscription.unsubscribe();
    }
  }

  onSubmit(form: NgForm){
    console.log(form)
  }

}
