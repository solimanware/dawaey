import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Platform } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Push, PushObject } from '@ionic-native/push';

/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmProvider {
  pushObj:PushObject
  constructor(
    public http: HttpClient,
    public afs: AngularFirestore,
    private auth: AngularFireAuth,
    private push: Push) {
    console.log('Hello FcmProvider Provider');
  }

  async getToken() {

    this.pushObj = this.push.init({
      android: {
      },
      ios: {
        alert: "true",
        badge: true,
        sound: 'false'
      },
      windows: {}
    })


    let token;
    this.pushObj.on('registration').subscribe(res=>{
      token = res.registrationId
      
    })

    this.saveTokenToFirestore(token)
    return token
  }

  // Save the token to firestore
  private saveTokenToFirestore(token) {
    if (!token) return;

    const devicesRef = this.afs.collection('devices')

    const docData = {
      token,
      userId: this.auth.auth.currentUser.uid,
    }

    return devicesRef.doc(token).set(docData)
  }

  // Listen to incoming FCM messages
  listenToNotifications() {
    return this.pushObj.on('notification')
  }

}
