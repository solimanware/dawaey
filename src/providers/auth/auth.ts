import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Events, Platform } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { GooglePlus } from '@ionic-native/google-plus';

export interface User {
  uid?: string;
  displayName?: string,
  email?: string,
  emailVerified?: boolean,
  phoneNumber?: any,
  photoURL?: string
}
@Injectable()
export class AuthProvider {
  //user:firebase.user ;

  constructor(
    public http: HttpClient,
    private afAuth: AngularFireAuth,
    private events: Events,
    private afs: AngularFirestore,
    private facebook: Facebook,
    private storage: Storage,
    private google: GooglePlus,
    private plt: Platform) {
    console.log('Hello AuthProvider Provider');
    //this.user= this.afAuth.auth.currentUser
  }




  loginGoogle() {
    return new Promise((resolve, reject) => {
      if (this.plt.is('cordova')) {
        this.google.login({
          'webClientId': '1061030166084-6ga7bg3irrgh2sqekdkti3slb7jda6f6.apps.googleusercontent.com',
          'offline': true
        })
          .then(loginResponse => {
            let credential = firebase.auth.GoogleAuthProvider.credential(loginResponse.idToken)
            this.afAuth.auth.signInAndRetrieveDataWithCredential(credential)
              .then(info => {
                resolve(info)
              })
              .catch(err => {
                reject(err)
                alert(err)
                this.loginJobs();
              })
          })
          .catch(err => {
            reject(err)
            alert(err)
          })

      } else {
        this.afAuth.auth
          .signInWithPopup(new firebase.auth.GoogleAuthProvider())
          .then(result => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            let token = result.credential["accessToken"];
            resolve(result)
            this.loginJobs()
          })
          .catch(err => {
            reject(err)
            alert(err)
          })
      }

    })
  }
  loginFacebook(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.plt.is('cordova')) {
        this.facebook.login(["email"])
          .then(loginResponse => {
            let credential = firebase.auth.FacebookAuthProvider.credential(loginResponse.authResponse.accessToken)
            this.afAuth.auth.signInAndRetrieveDataWithCredential(credential)
              .then(info => {
                resolve(info)
                this.loginJobs();
              })
              .catch(err => {
                reject(err)
                alert(err)
              })
          })
          .catch(err => {
            reject(err)
            alert(err)
          })

      } else {
        this.afAuth.auth
          .signInWithPopup(new firebase.auth.FacebookAuthProvider())
          .then(info => {
            resolve(info)
            this.loginJobs();
          })
          .catch(err => {
            reject(err)
            alert(err)
          })
      }
    })
  }

  loginJobs() {
    const user = this.afAuth.auth.currentUser;
    const userInfo: User = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL
    }

    this.afs.
      collection<User>(`users`)
      .doc(user.uid)
      .set({ ...userInfo })
      .then(res => {
        console.log(res);
      }).catch(err => {
        alert(err)
      })
    this.storage.set('user', userInfo)
    this.events.publish('user:login', user)
  }

  guestLogin() {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInAnonymously().then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
        alert(err)
      })
    })
  }

  login(email, password) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then(result => {
          let token = result.credential["accessToken"];
          resolve(result)
          this.loginJobs()
        })
        .catch(function (error) {
          reject(error)
          alert(error.message)
        });

    })

  }
  trySilent() {
    return new Promise((resolve, reject) => {
      if (this.plt.is('cordova')) {
        this.google
          .trySilentLogin({})
          .then(result => {
            let token = result.credential["accessToken"];
            resolve(result)
            this.loginJobs()
          })
          .catch(function (error) {
            reject(error)
            alert(error.message)
          });
      } else {
        reject('not cordova')
      }
    })
  }
  signup(email, password) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(result => {
          let token = result.credential["accessToken"];
          resolve(result)
          this.loginJobs()
        })
        .catch(function (error) {
          reject(error)
          alert(error.message)
        });

    })

  }


  signOut() {
    this.storage.remove('user')
    return this.afAuth.auth.signOut()
  }
}
