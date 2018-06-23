import { Observable } from 'rxjs/observable';
import { DrugProvider } from "./../../providers/drug/drug";
import { DrugDetails } from "./../drug-details/drug-details";
import { Component, ViewChild, OnChanges } from "@angular/core";

import {
  NavController,
  AlertController,
  Content,
  LoadingController,
  Loading,
  FabContainer,
  NavParams,
  VirtualScroll
} from "ionic-angular";
import { Keyboard } from "@ionic-native/keyboard";

import { GoogleAnalytics } from "@ionic-native/google-analytics";

import * as Fuse from "fuse.js";
import { Drug } from "../../interfaces";
import { Storage } from "@ionic/storage";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/map";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/do";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/switchMap";

const wait = ms => new Promise(r => setTimeout(r, ms));
@Component({
  selector: 'page-online',
  templateUrl: 'online.html',
})
export class OnlinePage {
  drugs: Drug[];
  loading: Boolean = false;
  searchTerm$ = new Subject<string>();
  searchTerm: String;
  searchBy: String;
  noResults: Boolean = true;
  searchResult: Drug[];
  constructor(
    public keyboard: Keyboard,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private drugProvider: DrugProvider,
    private ga: GoogleAnalytics,
    private loadingCtrl: LoadingController,
    private storage: Storage
  ) {}
  ionViewDidLoad() {
        console.log('ionViewDidLoad');
    this.searchTerm$
      .debounceTime(200)
      .subscribe((term) => {
        console.log(this.searchTerm$);
        if(term.length>1){
          this.drugProvider.doSearch(term).subscribe((result) => {
            this.drugs = JSON.parse(result);
          })
        } else {
          this.drugs = [];
          }
        })
  }
  
  openDrug(drug): void {
    this.navCtrl.push(DrugDetails, {
      id: drug.id,
      drug: drug
    });
  }


  onEnterKey() {
    this.drugProvider.doSearch(this.searchTerm).subscribe((result) => {
      this.drugs = JSON.parse(result);
    })
  }
}
