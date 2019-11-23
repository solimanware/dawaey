import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

/*
  Generated class for the AnalyticsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AnalyticsProvider {

  constructor(public http: HttpClient, private firebaseAnalytics:FirebaseAnalytics) {
    console.log('Hello AnalyticsProvider Provider');
  }


  setup() {
    //starting
    this.firebaseAnalytics.setEnabled(true);
  }

  trackScreen(screenName){
    this.firebaseAnalytics.setCurrentScreen(screenName);
  }

}
