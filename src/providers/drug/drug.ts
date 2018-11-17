
import {map} from 'rxjs/operators';
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { KEYS } from "./../../app/keys";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { Observable } from "rxjs";
import { API } from "../../app/global";

import { Drug } from "../../interfaces";
import { AngularFirestore } from "@angular/fire/firestore";
import { User } from "../../pages/tutorial/tutorial";
import { AngularFireList } from "@angular/fire/database";
import { AngularFireDatabase } from '@angular/fire/database';


@Injectable()
export class DrugProvider {
  history$: AngularFireList<any[]>;
  constructor(
    public http: HttpClient,
    public storage: Storage,
    public afs: AngularFirestore,
    public afd: AngularFireDatabase) { }
  getDrugs(country): Observable<Drug[]> {
    return this.http.get(API.drugs(country)).pipe(map((json) => {
      return json["drugs"];
    }));
  }

  saveDrugSearch(drug: Drug) {
    let info = {
      id: drug.id,
      tradename: drug.tradename,
      when: new Date()
    }
    this.storage.get('user').then(({ uid }) => {

      this.afs.collection<User>('users')
      .doc(uid)
      .collection('history')
      .add({...info})
      .then(res=>{
        console.log(res);
        
      })
      .catch(err=>{
        alert(err);
        
      })
    
    });

    }

  getDrugsByDefaultCountry(): Observable < any > {
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



  checkForUpdates(): Observable < string > {
        return new Observable(observer => {
          //check if there's update
          this.http.get(API.updates).subscribe(res => {
            //found update as version is newer
            if (res["data"]["version"] !== API.current) {
              //installing update
              this.installNewUpdate().subscribe(() => {
                console.log('installing new update');
                observer.next('installing new update');
                localStorage.dataVersion = res["data"]["version"];
              })
            } else {
              console.log('you are up to date');
              observer.next('data is up to date');
            }
          })
        })

      }

  installNewUpdate() {
        return this.updateDrugs();
      }

  // getAndStoreDrugsByCountry(country): Observable<any> {   const drugs = new
  // Observable(observer => {     this.storage.get('country')       .then(c => {
  //       this.getDrugs(c).subscribe(drugs => {
  // this.storage.set('drugs', drugs)           observer.next(drugs)         })
  //    })   })   return drugs }

  getAndStoreDrugsByDefaultCountry(): Observable < any > {
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

  displayDrugs(): Observable < Drug[] > {
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
