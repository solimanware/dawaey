import { Storage } from "@ionic/storage";
import { HttpClient, HttpParams } from "@angular/common/http";
import { KEYS } from "./../../app/keys";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { API } from "../../app/global";

import { Drug } from "../../interfaces";

@Injectable()
export class DrugProvider {
  key = KEYS.password;

  constructor(public http: HttpClient, public storage: Storage) {}
  getDrugs(country): Observable<any> {
    return this.http.get(API.drugs(country)).map((drugs: Drug[]) => {
      for (let i = 0; i < drugs.length; i++) {
        drugs[i].price = this.parsePrice(drugs[i].price);
      }
      return drugs;
    });
  }
  parsePrice(price: number): number {
    const d = (c, k) => (c ^ k) - k;
    return Math.abs(d(price, this.key) / 100);
  }

  getDrugsByDefaultCountry(): Observable<any> {
    const drugs = new Observable(observer => {
      this.storage.get("country").then(c => {
        console.log(
          "got country " + c + " from storage and getting drugs from server"
        );
        this.getDrugs(c).subscribe(drugs => {
          observer.next(drugs);
        });
      });
    });
    return drugs;
  }

  // getAndStoreDrugsByCountry(country): Observable<any> {   const drugs = new
  // Observable(observer => {     this.storage.get('country')       .then(c => {
  //       this.getDrugs(c).subscribe(drugs => {
  // this.storage.set('drugs', drugs)           observer.next(drugs)         })
  //    })   })   return drugs }

  getAndStoreDrugsByDefaultCountry(): Observable<any> {
    const drugs = new Observable(observer => {
      this.storage.get("country").then(c => {
        this.getDrugs(c).subscribe(drugs => {
          this.storage.set("drugs", drugs);
          observer.next(drugs);
        });
      });
    });
    return drugs;
  }

  displayDrugs(): Observable<any> {
    let data = new Observable(observer => {
      this.storage.get("drugs").then(d => {
        //is there data in the storage?
        if (d) {
          observer.next(d);
        } else {
          //No data in the storage?
          this.getAndStoreDrugsByDefaultCountry().subscribe(drugs => {
            observer.next(drugs);
          });
        }
      });
    });

    return data;
  }

  updateDrugs() {
    return this.getAndStoreDrugsByDefaultCountry();
  }

  doSearch(term): Observable<any> {
    console.log(term);
    let params = new HttpParams().set('q', term);
    console.log(params);
    return this.http.get("http://localhost:3000/search", { params: params,responseType: 'text' });
  }

}
