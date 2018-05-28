import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import * as firebase from 'firebase';

import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-schedule-test',
  templateUrl: './schedule-test.component.html',
  styleUrls: ['./schedule-test.component.css']
})

export class ScheduleTestComponent implements OnInit {
  batchesNames: string[] = [];
  selectedBatchString: string = '';
  selectedBatchSubjects: any[] = [];
  subjectsArray: string[] = [];
  subjectKeys: string[] = [];
  selectedSubjectKey: string;
  dateTimeISO: string = '';
  dateTimeUTC: string = '';
  testForm: FormGroup;
  mcqs: any = [];
  exp: string = '';
  error: string = '';
  success: boolean = false;

  constructor(private sharedService: SharedService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.fetchBatches();
    this.dateTimeISO = moment().format('YYYY-MM-DDTHH:mm');
    this.testForm = this.formBuilder.group({
      'title': new FormControl(null, [
        Validators.required,
        Validators.minLength(4)
      ]),
      'batch': new FormControl(this.batchesNames, Validators.required),
      'subjectName': new FormControl(this.subjectsArray, Validators.required),
      'subjectKey': new FormControl(null),
      'dateTime': new FormControl(this.dateTimeISO, Validators.required),
      'duration': new FormControl(null, Validators.required),
      'marks': new FormControl(null, Validators.required),
      'mcqs': this.formBuilder.array([this.createMcq()])
    });
    this.getDateTime();

  }

  getDateTime(): Promise<string> {
    return new Promise(
      (resolve, reject) => {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.open("HEAD", "http://www.googleapis.com", true);
        xmlhttp.onreadystatechange = () => {
          if (xmlhttp.readyState == 4) {
            this.dateTimeUTC = xmlhttp.getResponseHeader("Date");
            // let newDate = new Date(this.dateTimeUTC).toISOString();
            this.dateTimeISO = moment(this.dateTimeUTC).format('YYYY-MM-DDTHH:mm');
            console.log('Received: ', this.dateTimeISO, 'UTC', this.dateTimeUTC);
            this.testForm.controls['dateTime'].setValue(this.dateTimeISO);
          } else if (xmlhttp.status === 0) {
            xmlhttp.send(null);
            console.log('Retried')
          }
        }
        xmlhttp.send(null);
      }
    )
  }

  dateTimeChange(event) {
    console.log('Event Target: ', event.target.value);
    let date: string = new Date(event.target.value).toUTCString();
    this.dateTimeUTC = date;
    console.log('ISO to UTC', this.dateTimeUTC);
  }

  createMcq(): FormGroup {
    return this.formBuilder.group({
      question: '',
      a: '',
      b: '',
      c: '',
      d: '',
      key: ''
    });
  }

  addMcq(): void {
    this.mcqs = this.testForm.get('mcqs') as FormArray;
    this.mcqs.push(this.createMcq());
    console.log(this.mcqs);
  }

  fetchBatches() {
    this.sharedService.getData('batches/names')
      .subscribe(
        (response) => {
          this.batchesNames = response;
        },
        (error) => {
          console.log(error)
        }
      )
  }

  onBatchSelected(event) {
    this.selectedBatchString = event.target.value;
    if (this.selectedBatchString != 'Select a batch') {
      let url = 'batches/' + this.selectedBatchString + '/subjects';
      this.sharedService.getData(url).subscribe(
        (response) => {
          let data = response;
          if (data != undefined) {
            this.selectedBatchSubjects = data;
            this.subjectsArray = (Object).values(this.selectedBatchSubjects);
            this.subjectKeys = Object.keys(this.selectedBatchSubjects);
            console.log(this.selectedBatchSubjects, this.subjectKeys)
          }
        }
      )
    }
  }

  onSubjectSelected(event) {
    let selectedSubject = event.target.value;
    if (selectedSubject != 'Select your subject') {
      console.log('Value Index: ', event.target.value)
      console.log('Key of valueIndex: ', this.subjectKeys[selectedSubject]);
      this.selectedSubjectKey = this.subjectKeys[selectedSubject];
    }
  }

  onTestSchedule() {
    this.error = '';
    this.success = false;
    if (this.testForm.valid) {
      let test = this.testForm.value;
      test.dateTime = this.dateTimeUTC;
      test.subjectKey = this.selectedSubjectKey;
      test.subjectName = this.selectedBatchSubjects[test.subjectKey].name;
      console.log('Complete Test: ', test);
      let url: string = 'batches/' + this.selectedBatchString + '/tests/' + test.subjectKey;
      this.sharedService.update(url, test);
      this.success = true;
      this.testForm.reset();
    }else{
      this.error = 'Test information not filled properly.'
    }
  }
}

// this.http.get('http://www.googleapis.com').subscribe(
    //   (res) => console.log('res: ', res),
    //   (error) => {
    //     console.log('err: ', error)
    //     let dt = error.headers.getAll();
    //     console.log('DT:', dt)
    //   }
    // )

    // if (dateTime == '') {
    //   let xmlhttp = new XMLHttpRequest();
    //   xmlhttp.open("HEAD", "http://www.googleapis.com", true);
    //   xmlhttp.onreadystatechange = ()=>{
    //     if (xmlhttp.readyState == 4) {
    //       dateTime = xmlhttp.getResponseHeader("Date");
    //       console.log('Time date from Google:', dateTime);
    //     }
    //   }
    //   xmlhttp.send(null).;
    // }else if (dateTime != ''){
    //   this.dateTime = dateTime;
    //   console.log('This.dateTime: ', this.dateTime)
    // }