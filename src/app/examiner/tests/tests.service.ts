import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';

export class TestsService{
    public testSubject = new Subject<any>();

    addTest(data){
        data.image = 'default-image';
        this.testSubject.next(data);
    }
}