import { Injectable } from '@angular/core';

import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';
import { Platform } from 'ionic-angular';

/*
  Generated class for the AnalyticsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AnalyticsProvider {
  constructor(private platform: Platform) {
    console.log('Hello AnalyticsProvider Provider');
  }


  setup() {
    //starting
    if (this.platform.is("cordova")) {
      (<any>window).FirebasePlugin.setAnalyticsCollectionEnabled(true);
    } else {
      //try to do pwa firebase analytics here
    }

  }

  trackScreen(screenName) {
    if (this.platform.is("cordova")) {
      (<any>window).FirebasePlugin.setScreenName(screenName);
    } else {
      //try to do pwa firebase analytics here
    }

  }

}
