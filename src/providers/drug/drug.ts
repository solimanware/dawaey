import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { KEYS } from "./../../app/keys";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { API } from "../../app/global";

import { Drug } from "../../interfaces";

@Injectable()
export class DrugProvider {
  constructor(public http: HttpClient, public storage: Storage) {}
  getDrugs(country): Observable<Drug[]> {
    return this.http.get(API.drugs(country)).map((json: Drug[]) => {
      return json["drugs"];
    });
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

  displayDrugs(): Observable<Drug[]> {
    let data: Observable<Drug[]> = new Observable(observer => {
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
}
