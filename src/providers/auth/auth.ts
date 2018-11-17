import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

export interface User{
  displayName?:string,
  email?:string,
  emailVerified?:boolean,
  phoneNumber?:any,
  photoURL?:string
}
@Injectable()
export class AuthProvider {
  //user:firebase.user ;

  constructor(public http: HttpClient,public afAuth:AngularFireAuth) {
    console.log('Hello AuthProvider Provider');
    //this.user= this.afAuth.auth.currentUser
  }

}
