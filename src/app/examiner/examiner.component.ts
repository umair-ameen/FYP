import { Component, OnInit } from '@angular/core';
import { ExaminerService } from './examiner.service';

@Component({
  selector: 'app-examiner',
  templateUrl: './examiner.component.html',
  styleUrls: ['./examiner.component.css'],
  providers: [ExaminerService]
})
export class ExaminerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
