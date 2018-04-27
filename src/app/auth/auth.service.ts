import * as firebase from 'firebase';
import { Http } from '@angular/http';
import { Response } from '@angular/http';

export class AuthService{
    token: string = '';
    
    signupUser(userInfo){
        console.log(userInfo);
        const email = userInfo.email , password = userInfo.password;
        let userId: string = '';
        delete userInfo.password;
        firebase.auth().createUserWithEmailAndPassword(email, password).then(
            (success) => {
                userId = success.uid;
                success.updateProfile({
                    displayName: userInfo.name
                }).catch( (error) => console.log(error));
                this.storeUserInfo(userId, userInfo);
            },
            (error) => {
                console.log(error)
            }
        )
    }

    storeUserInfo(uid, userInfo){
        if (userInfo.role == 'student'){
            firebase.database().ref('users/' + uid).set({
                rollNo: userInfo.rollNo,
                role: userInfo.role,
                department: userInfo.department,
                batch: userInfo.batch
            })
        }else if(userInfo.role == 'teacher'){
            firebase.database().ref('users/' + uid).set({
                role: userInfo.role
            });
            firebase.database().ref('examiners/' + uid).set({
                examiner: false
            })
        }
    }

    loginUser(email:string, password:string){
        console.log('Login service called...');
        firebase.auth().signInWithEmailAndPassword(email, password).then(
            (response) => {
                firebase.auth().currentUser.getIdToken().then(
                    (response) => this.token = response
                )
            }, (error) => {
                console.log(error)
            }

        )
    }

    getToken(){
        firebase.auth().currentUser.getIdToken().then(
            (token) => this.token = token
        );
        return this.token;
    }
}