import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { API } from "../../app/global";
import { Observable } from "rxjs/Observable";
import { Storage } from "@ionic/storage";

@Injectable()
export class PartnerProvider {
  constructor(public http: HttpClient, public storage: Storage) {}
  getPartners(country): Observable<any> {
    return this.http.get(API.partners(country));
  }

  getPartnersByDefaultCountry(): Observable<any> {
    const partneres = new Observable(observer => {
      this.storage.get("country").then(c => {
        console.log(
          "got country " + c + " from storage and getting partners from server"
        );
        this.getPartners(c).subscribe(partneres => {
          observer.next(partneres);
        });
      });
    });
    return partneres;
  }
}
