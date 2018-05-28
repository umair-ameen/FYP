import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import { SharedService } from '../shared.service';

@Injectable()
export class AuthService {
    uid: string = '';
    emailError: any;
    loginError: string = '';

    constructor(public router: Router, public sharedService: SharedService) { }

    signupUser(userInfo) {
        console.log(userInfo);
        const email = userInfo.email, password = userInfo.password;
        delete userInfo.password;
        return firebase.auth().createUserWithEmailAndPassword(email, password).then(
            (success) => {
                this.uid = success.uid;
                this.storeUserInfo(this.uid, userInfo);
            },
            (error) => {
                if (error != undefined && error != null) {
                    let err = error.code;
                    this.emailError = err;
                    console.log(error);
                }
            }
        )
    }

    storeUserInfo(uid, userInfo) {
        console.log('UserInfo before storing: ', userInfo);
        if (userInfo.role == 'student') {
            let rn: any = {};
            rn[this.uid] = userInfo.rollNo;
            firebase.database().ref('users/' + uid).set({
                userName: userInfo.name,
                rollNo: userInfo.rollNo,
                role: userInfo.role,
                department: userInfo.department,
                batch: userInfo.batch,
                uid: this.uid
            });
            console.log(rn);
            firebase.database().ref('rollNos/').push(rn).then(
                () => this.router.navigate(['/login'])
            );

        } else if (userInfo.role == 'teacher') {
            console.log('Your are a teacher, your role is: ', userInfo.role);
            firebase.database().ref('users/' + uid).set({
                userName: userInfo.name,
                role: userInfo.role,
                uid: this.uid
            });
            firebase.database().ref('examiners/' + uid).set({
                examinerCap: false
            }).then( () => {
                    this.router.navigate(['/login'])
                }
            );
        }
    }

    loginUser(email: string, password: string) {
        console.log('Login service called...');
        return firebase.auth().signInWithEmailAndPassword(email, password).then(
            (response) => {
                this.uid = firebase.auth().currentUser.uid;
                console.log('Token', this.uid)
                let url: string = 'users/' + this.uid;
                this.sharedService.getOnce(url).then(
                    (response) => {
                        // if (response.val() !== null && response.val() !== undefined) {
                        let userData = response.val();
                        console.log('User Data: ', userData);
                        localStorage.setItem('user', JSON.stringify(userData));
                        this.router.navigate(['/']);
                    }
                )
            }, (error) => {
                this.loginError = error.code;
                console.log(error)
            }

        )
    }
}