import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage'
import { Events } from 'ionic-angular';


/*
  Generated class for the SettingsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SettingsProvider {
  constructor(public http: HttpClient, public storage: Storage, public events: Events) {
    console.log('Hello SettingsProvider Provider');
  }

  setCountry(country) {
    this.storage.set('country', country)
      .then((country) => {
        console.log('set storage Country' + country);
        this.events.publish('country:changed', country)
      })
  }
  setColor(color) {
    this.storage.set('color', color)
      .then((color) => {
        console.log('set storage Color ' + color);
        this.events.publish('color:changed', color)
      })
  }

  getCountry() {

  }

  // getAllUserInfoFromStorage(): Observable<any> {
  //   return Observable.forkJoin(
  //     this.storage.get('country')
  //   ).filter(data => data[0] !== null).map((data) => {
  //     return {
  //       country: data[0]
  //     }
  //   });
  // }




}
