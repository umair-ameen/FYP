import { Observable } from 'rxjs/observable'
import * as firebase from 'firebase';

export class SharedService {
    userName: string = 'User';

    store(url, data) {
        var newKey: string = firebase.database().ref(url).push().key;
        url = url + newKey;
        return firebase.database().ref(url).update(data);
        
    }

    fstore(url, data) {
        var newKey: string = firebase.database().ref(url).push().key;
        url = url + newKey;
        firebase.database().ref(url).update(data);        
    
    
    }

    save(url, data) {
        console.log('Url from store: ', url)
        return firebase.database().ref(url).update(data);
    }

    update(url, newData) {
        console.log('URL:', firebase.database().ref() + url);
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

    remove(url: string) {
        return firebase.database().ref(url).remove();
    }

}