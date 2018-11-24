import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OneSignal, OSNotification } from '@ionic-native/onesignal';

/*
  Generated class for the PushProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PushProvider {

  constructor(public http: HttpClient, private oneSignal: OneSignal) {
    console.log('Hello PushProvider Provider');
  }

  init() {
    this.oneSignal.startInit('daaa8674-68e2-49a3-aa58-3844d767a9aa', '1061030166084')
  }

  handleNotificationReceived(){
    return this.oneSignal.handleNotificationReceived();
  }

  handleNotificationOpened(){
    return this.oneSignal.handleNotificationOpened();
  }

  endInit(){
    this.oneSignal.endInit()
  }

}
