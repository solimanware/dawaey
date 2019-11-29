import { Injectable } from '@angular/core';

import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

/*
  Generated class for the AnalyticsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AnalyticsProvider {
  constructor() {
    console.log('Hello AnalyticsProvider Provider');
  }


  setup() {
    //starting
    (<any>window).FirebasePlugin.setAnalyticsCollectionEnabled(true);
  }

  trackScreen(screenName){
    (<any>window).FirebasePlugin.setScreenName(screenName);
  }

}
