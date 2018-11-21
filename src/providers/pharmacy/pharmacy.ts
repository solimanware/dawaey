import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../../app/global';

/*
  Generated class for the PharmacyProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PharmacyProvider {

  constructor(public http: HttpClient) {
    console.log('Hello PharmacyProvider Provider');
  }

  getAll() {
    return this.http.get(API.pharmacies('eg'))
  }

}
