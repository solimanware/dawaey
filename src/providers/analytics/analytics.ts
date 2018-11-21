import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

/*
  Generated class for the AnalyticsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AnalyticsProvider {

  constructor(public http: HttpClient, private googleAnalytics: GoogleAnalytics) {
    console.log('Hello AnalyticsProvider Provider');
  }


  setup() {
    //start getting analytics
    this.googleAnalytics
      .startTrackerWithId("UA-88642709-1")
      .then(() => {
        console.log("Google analytics is ready now");
      })
      .catch(e => console.log("Error starting GoogleAnalytics", e));
  }

}
