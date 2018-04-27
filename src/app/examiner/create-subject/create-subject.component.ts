import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase';

import { ExaminerService } from '../examiner.service';

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
  constructor(private examinerService: ExaminerService) { }

  ngOnInit() {
    this.examinerService.userStatus();
    this.fetchBatches();
  }

  fetchBatches() {
    this.examinerService.userStatus();
    this.examinerService.getOnce('batches/names').then(
      (batches) => {
        this.batches = batches.val();
      }, (error) => console.log('Error while fetching this.batches: ', error)
    )
  }

  onBatchSelected(event) {
    this.examinerService.userStatus();
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
      this.subjectsSubscription = this.examinerService.getData('batches/' + this.selectedBatch).subscribe(
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
    if (this.selectedBatch !== 'Select a batch' && this.subjectFieldText != '') {
      let url: string = 'batches/' + this.selectedBatch + '/subjects/';
      let newSubject: { name: string, facilitator: string };
      newSubject = { name: this.subjectFieldText, facilitator: 'Anonimous' };
      this.examinerService.store(url, newSubject);
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
      this.examinerService.update(url, subject);
      this.refresh();
    }
  }

  deleteSubject() {
    if (this.selectedSubject.index != -1) {
      const url: string = 'batches/' + this.selectedBatch + '/subjects/' + this.selectedSubject.key;
      this.examinerService.remove(url);
      this.refresh();
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

}
