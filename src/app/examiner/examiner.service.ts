import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/observable'
import * as firebase from 'firebase';

import { AuthService } from '../auth/auth.service';

@Injectable()

export class ExaminerService {
    url: string = 'https://myfyp-40291.firebaseio.com/';
    // token: string = '?auth='+this.authService.getToken();
    constructor(private http: Http, private authService: AuthService) {}
    store(url, data) {
        var newKey: string = firebase.database().ref(url).push().key;
        url = url + newKey;
        firebase.database().ref(url).update(data);
    }

    update(url, newData) {
        console.log('URL:', firebase.database().ref() + url)
        firebase.database().ref(url).update(newData);
    }
    getData(child) {
        return Observable.create(subscriber => {
            const ref = firebase.database().ref(child);

            const callbackFn = ref.on('value',
                // emit a value from the Observable when firebase data changes
                (snapshot) => subscriber.next(snapshot.val()),

                // error out the Observable if there is an error
                // such as permission denied
                error => subscriber.error(error)
            );


            // Unsubscribe from further changes once the Observable
            // has been Unsubscribed from
            return () => ref.off('value', callbackFn);
        });
    }

    getOnce(url: string) {
        return firebase.database().ref(url).once('value');
    }

    userStatus() {
        var connectedRef = firebase.database().ref('.info/connected');
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {
                console.log("connected");
            } else {
                console.log("not connected");
            }
        });
    }

    getBatchSubjects(batch) {
        let batchLink = 'https://myfyp-40291.firebaseio.com/batches/' + batch + '.json';
        return this.http.get(batchLink);
    }

    storeSubject(batch, subject) {
        let subjectDestionation = 'https://myfyp-40291.firebaseio.com/batches/' + batch + '/subjects.json';
        return this.http.post(subjectDestionation, subject)
    }

    remove(url: string) {
        firebase.database().ref(url).remove();
    }

    getSubject(subjectKey) {
        return this.http.get('https://myfyp-40291.firebaseio.com/batches/2014-2015/subjects/' + subjectKey + '.json')
    }

    storeTest(test, batch, subject) {
        return this.http.put('https://myfyp-40291.firebaseio.com/batches/' + batch + '/subjects/' + subject + '/test.json', test, test);
    }

    storeKeys(keys) {
        return this.http.post('https://myfyp-40291.firebaseio.com/keys.json', keys)
    }

    getTest() {
        console.log('Obtain Test Service is working...');
        return this.http.get('https://myfyp-40291.firebaseio.com/tests/-L0f5r_-tHLMk45AU5zg.json')
    }

    getKeys() {
        console.log('Obtain keys is working...');
        return this.http.get('https://myfyp-40291.firebaseio.com/keys/-L0k_SQivBudFGcNjD-k.json')
    }
}