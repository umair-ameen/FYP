import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service'
@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnInit {
  selectedBatchString: string = ''
  batchesArray: any[];
  subjectsArray: any[] = [];
  note: string[] = ['Select a batch', 'Select a subject'];
  results: any[];
  isResult: boolean = false;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.fetchBatches();
  }

  fetchBatches() {
    this.sharedService.getData('batches/names')
      .subscribe(
        (response) => {
          console.log(response)
          this.batchesArray = response;
        },
        (error) => {
          console.log(error)
        }
      )
  }

  onBatchSelected(event) {
    this.selectedBatchString = event.target.value;
    if (this.selectedBatchString != '' && this.selectedBatchString != 'Select a batch') {
      this.sharedService.getData('batches/' + this.selectedBatchString + '/subjects').subscribe(
        (response) => {
          this.processSubjects(response);
        },
        (error) => console.log(error)
      )
    }
  }

  processSubjects(response) {
    this.subjectsArray = [];
    if (response != undefined) {
      console.log(response);
      let data = response;
      let size: number = Object.keys(data).length;
      let keys = Object.keys(data);
      let subject: { key: string, name: string, facilitator: string };
      for (let i = 0; i < size; i++) {
        subject = {
          key: keys[i],
          facilitator: data[keys[i]].facilitator,
          name: data[keys[i]].name
        }
        this.subjectsArray.push(subject);
      }
      console.log('SubjectArray: ', this.subjectsArray);
    }
  }

  onSubjectSelected(event) {
    let selectedSubjectKey: string = event.target.value;
    this.results = [];
    this.sharedService.getData('batches/' + this.selectedBatchString + '/results/' + selectedSubjectKey).subscribe(
      (response) => {
        if (response != undefined) {
          this.isResult = true;
          console.log('Results: ', response)
          this.results = Object.values(response);
        }else{
          this.isResult = false;
        }
      },
      (error) => {
        this.isResult = true;
        console.log(error);
      }
    )
  }
}
