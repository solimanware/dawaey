import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Storage } from "@ionic/storage";


/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  isFullDetails: boolean;

  constructor(
    public http: HttpClient,
    private afs: AngularFirestore,
    public storage: Storage, ) {
    console.log('Hello UserProvider Provider');
  }

  getUserDetails(uid) {
    return new Promise((resolve, reject) => {
      this.afs.collection('users')
        .doc(uid)
        .collection('userDetails')
        .doc("details")
        .valueChanges()
        .subscribe(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  }

  async getCurrentUserDetails() {
    let currentUser = await this.storage.get('user');
    console.log(currentUser);

    return this.getUserDetails(currentUser['uid'])
  }

  async hasCompletedSurveyOne() {
    let didComplete = await this.storage.get("Survey1");
    if (didComplete) {
      //has completed survey 1
      return true
    } else {
      //check has completed or not
      let details: any = await this.getCurrentUserDetails();
      if(details && details.areYou && details.fieldOfStudy){
        return true;
      }else{
        return false;
      }

    }
  }



  async doUserHaveFullDetails() {
    let res = await this.getCurrentUserDetails()
    console.log(res);
    if (res[0] && res[0].mobileNumber && res[0].occupation) {
      return true
    } else {
      return false
    }
  }

  async saveUserDetails(infoToAdd) {
    let user = await this.storage.get('user')
    let userDetails = this.afs.collection('users').doc(user.uid).collection("userDetails").doc("details")
    userDetails.set(infoToAdd, { merge: true }).then(res => {
      console.log(res);
    }).catch(err => {
      alert(err);
    })
  }
}
