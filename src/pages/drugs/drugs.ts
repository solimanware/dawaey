import { Drug } from "./../../interfaces";
import { DrugProvider } from "./../../providers/drug/drug";
import { DrugDetails } from "./../drug-details/drug-details";
import { Component, ViewChild } from "@angular/core";

import {
  NavController,
  AlertController,
  Content,
  NavParams,
  VirtualScroll
} from "ionic-angular";
import { Keyboard } from "@ionic-native/keyboard";

import { GoogleAnalytics } from "@ionic-native/google-analytics";

import { Storage } from "@ionic/storage";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/map";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/do";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/switchMap";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

const wait = ms => new Promise(r => setTimeout(r, ms));

@Component({ selector: "page-drugs", templateUrl: "drugs.html" })
export class DrugsPage {
  shouldShowDidYouMean: boolean = false;
  searchResults$ = new BehaviorSubject(<Drug[]>[]);
  remmemberedState: Drug[];
  doYouMean: string;
  schema: any = {};
  history: Drug[] = [];
  searchTerm: string = "";
  searchTerm$ = new Subject<string>();
  sampleDrug: Drug;
  chooseToSearchBy = [];
  searchBy: string = "tradename";
  segment: string = "all";
  @ViewChild(Content)
  content: Content;
  loading: boolean = true;
  @ViewChild("virtualScroll", { read: VirtualScroll })
  virtualScroll: VirtualScroll;
  searchWorker: any;

  constructor(
    public keyboard: Keyboard,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private drugProvider: DrugProvider,
    private ga: GoogleAnalytics,
    private storage: Storage,
    public translate: TranslateService
  ) {
    //setting up schema for visual searchby options
    this.schema = {
      id: "Code",
      tradename: "Trade Name",
      activeingredient: "Active Ingredients",
      price: "Price",
      company: "Company",
      group: "Drug Group",
      pamphlet: "Drug Pamphlet",
      dosage: "Drug Dose",
      composition: "Drug Composition"
    };

    //setting up service worker to be sperate search in new thread
    this.searchWorker = new Worker('./assets/workers/search.js');
  }

  //is view did enter? just loaded?
  ionViewDidEnter() {
    //Initialize Search term observing
    this.initSearch();
  }

  //is view all elemnts did loaded?
  ionViewDidLoad() {
    this.loading = true;

    //report analytics
    this.ga.trackView("Main Screen");

    this.drugProvider.displayDrugs().subscribe(data => {
      //setting up sample drug of dataset
      this.sampleDrug = data[0]
      //posting data to worker thread
      this.searchWorker.postMessage({
        drugs: data
      })
      //initializing search options visuals
      this.initSearchByOptions();
      this.loading = false;
      //are you coming from another page?
      this.handleComingFromOtherPage()
        .then(() => {
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    });
    //careful doing something outside this observation
  }

  initSearchByOptions() {
    const optionArr = [];
    //generate options dynamically from schema and sample input
    for (let prop in this.sampleDrug) {
      if (prop && this.schema[prop]) {
        const myObj = {
          type: "radio",
          label: this.schema[prop],
          value: prop,
          checked: false
        };
        optionArr.push(myObj);
      }
    }
    this.chooseToSearchBy = optionArr;
  }

  initSearch() {
    //observing search term behaviour subject
    this.searchTerm$
      .do(term => (this.loading = true))
      //deboucing to left load from search thread
      .debounceTime(100)
      //wait until user end typing
      .distinctUntilChanged()
      //filter out non terms
      .filter(event => {
        if (typeof event === "undefined") {
          this.handleBadSearchTerm();
          //false means filter it out and stop here
          return false;
        } else {
          //true mean pass it to next operator
          return true;
        }
      })
      //trimming white spaces of string prefrals
      .map(term => term.trim())
      //make sure term 3 letters or more?
      .filter(str => {
        //sample drug means data loaded (safe check)
        if (this.sampleDrug &&

          //make sure at least term is 2 chars
          ((str.length > 2)) ||
          //or search by any price term length
          (this.searchBy === "price" && str.length > 0)
        ) {
          //true mean pass it to next operator
          return true;
        } else {
          this.handleBadSearchTerm();
          //false means filter it out and stop here
          return false;
        }
      })
      //set term string to that term
      .do(term => (this.searchTerm = term))
      //do the search > todo: move to search provider
      .switchMap((searchTerm: string) => this.doSearch(searchTerm))
      //get results
      .subscribe(
        (res: Drug[]) => {
          //found in our data
          if (res.length >= 1) {
            this.searchResults$.next(res)
            this.smoothHideLoading();
          } else {
            //not found reset
            this.searchResults$.next(res)
            this.loading = true;
            this.doApproximate().then((res: Drug[]) => {
              this.shouldShowDidYouMean = true;
              //or string is a fallback to not found using fuzz search
              this.doYouMean = res[0].tradename || "";
              this.loading = false;
            });
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  handleBadSearchTerm(): void {
    this.searchResults$.next([])
    //false as it's just bad search term
    this.shouldShowDidYouMean = false;
    this.smoothHideLoading();
  }

  async smoothHideLoading() {
    await wait(10);
    this.loading = false;
  }

  showApproximate(): Promise<string> {
    this.loading = true;
    return new Promise((res, rej) => {
      this.doApproximate().then(async (drugs: Drug[]) => {
        this.searchResults$.next(drugs)
        this.smoothHideLoading();
        res("done");
      })
        .catch((err) => console.log(err));
    });
  }

  handleComingFromOtherPage(): Promise<string> {
    //did you find parameters coming from other page?
    let foundParams =
      this.navParams.get("searchBy") && this.navParams.get("inputToSearch");
    return new Promise((resolve, rej) => {
      if (foundParams) {
        this.searchBy = this.navParams.get("searchBy");
        this.searchTerm$.next(this.navParams.data.inputToSearch);
        this.doSearch(this.navParams.get("inputToSearch"))
          .then((res: Drug[]) => {
            this.searchResults$.next(res)
            this.smoothHideLoading();
            resolve("handled");
          })
          .catch(err => console.log(err));
      }
    });
  }

  //opens drug page with specific drug
  //TODO: needs optimization
  openDrug(drug): void {
    this.navCtrl.push(DrugDetails, {
      id: drug.id,
      drug: drug
    });
    this.addToHistory(drug);
  }

  addToHistory(drug: Drug): void {
    //TODO: needs refactoring
    console.log("adding to history");
    this.storage
      .get("history")
      .then(history => {
        const arr = history || [];
        arr.push(drug);
        this.storage.set("history", arr);
      })
      .catch(err => console.log(err));
  }

  toggleSegments(): void {
    if (this.segment === "history") {
      this.remmemberedState = this.searchResults$.getValue();
      this.storage
        .get("history")
        .then(history => {
          this.searchResults$.next(history || [])
        })
        .catch(err => console.log(err));
    } else if (this.segment === "all") {
      this.searchResults$.next(this.remmemberedState)
    }
  }

  doApproximate(): Promise<Drug[]> {
    console.time('Approximate Search Took')
    this.searchWorker.postMessage({
      key: this.searchBy,
      term: this.searchTerm,
      type: "approximate"
    })
    return new Promise((resolve, reject) => {
      this.searchWorker.onmessage = function (event) {
        console.timeEnd('Approximate Search Took')
        //render resolved data
        resolve(event.data)
      }
    })
  }

  doSearch(searchTerm$): Promise<Drug[]> {
    console.time('Exact Search Took')
    this.searchWorker.postMessage({
      key: this.searchBy,
      term: searchTerm$,
      type: "exact"
    })
    return new Promise((resolve, reject) => {
      this.searchWorker.onmessage = function (event) {
        console.timeEnd('Exact Search Took')
        //render resolved data
        resolve(event.data)
      }
    })
  }

  //helper ranking function
  //TODO: need to implement our ranking algorithm
  sortInputFirst(input, data, key) {
    var first = [];
    var others = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i][key].toLowerCase().startsWith(input.toLowerCase())) {
        first.push(data[i]);
      } else {
        others.push(data[i]);
      }
    }
    first.sort();
    others.sort();
    return Promise.resolve(first.concat(others));
  }

  showRadio() {
    let alert = this.alertCtrl.create();
    alert.setTitle(this.translate.instant('Choose to search by ...'));

    let choices = this.chooseToSearchBy;

    for (let i = 0; i < choices.length; i++) {
      choices[i].checked = choices[i].value === this.searchBy ? true : false;
      choices[i].label = this.translate.instant(choices[i].label)
      alert.addInput(choices[i]);
    }

    alert.addButton("Cancel");
    alert.addButton({
      text: "OK",
      handler: value => {
        this.searchBy = value;
      }
    });
    alert.present();
  }

  //not loaded yet
  noDrugsYet(): boolean {
    return !this.sampleDrug
  }

  //loaded and sample found
  searchReady(): boolean {
    return !!this.sampleDrug
  }


  shouldShowSearchTextGuide(): boolean {
    return !this.searchResults$.getValue().length && !this.loading && !this.shouldShowDidYouMean
  }

  showAI(): boolean {
    return !this.searchResults$.getValue().length && !this.loading && this.shouldShowDidYouMean
  }

  noSearchFound(): boolean {
    return !this.searchResults$.getValue().length
  }

  //handle UX
  onEnterKey() {
    if (this.noSearchFound()) {
      this.showApproximate().then(() => {
        this.closeKeyboard();
      });
    } else {
      this.closeKeyboard();
    }
  }

  clear() {
    this.searchResults$.next([]);
  }

  closeKeyboard() {
    this.keyboard.close();
  }


  isEmptyHistory() {
    return (
      this.history.length &&
      this.loading !== true &&
      this.segment == "history"
    );
  }
}
