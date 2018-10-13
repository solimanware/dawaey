import { Drug } from "./../../interfaces";
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
import { Storage } from "@ionic/storage";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/map";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/do";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/switchMap";

const wait = ms => new Promise(r => setTimeout(r, ms));

@Component({ selector: "page-drugs", templateUrl: "drugs.html" })
export class DrugsPage {
  noResults: boolean = false;
  searchResult: Drug[] = [];
  remmemberedState: Drug[];
  doYouMean: String;
  schema: any = {};
  history: Drug[] = [];
  searchTerm: string = "";
  searchTerm$ = new Subject<string>();
  drugsInitial: Drug[] = []; //initialize your drugsInitial array empty
  drugs: Drug[] = []; //initialize your drugs array empty
  chooseToSearchBy = [];
  searchBy: string = "tradename";
  segment: string = "all";
  @ViewChild(Content)
  content: Content;
  loading: boolean = true;
  @ViewChild("virtualScroll", { read: VirtualScroll })
  virtualScroll: VirtualScroll;

  constructor(
    public keyboard: Keyboard,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private drugProvider: DrugProvider,
    private ga: GoogleAnalytics,
    private loadingCtrl: LoadingController,
    private storage: Storage
  ) {
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
  }

  ionViewDidEnter() {
    this.loading = true;
    this.reLoadVirtualList().then(async () => {
      this.loading = false;
    });

    //Initialize Search term observing
    this.initSearch();
  }
  ionViewDidLoad() {
    this.loading = true;
    this.drugs = this.drugsInitial;
    //report analytics
    this.ga.trackView("Main Screen");

    this.drugProvider.displayDrugs().subscribe(data => {
      //TODO: optimization should happen here
      this.drugsInitial = data;
      this.drugs = data;
      console.log("data loaded");

      this.initSearchByOptions();
      this.loading = false;

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
    for (let prop in this.drugs[0]) {
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
    this.searchTerm$
      .do(term => (this.loading = true))
      //adjust writing speed >TODO:make it dynamic according to user writing speed
      .debounceTime(200)
      .distinctUntilChanged()
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
      //term 3 letters or more?
      .filter(str => {
        if (
          //search by any price length
          (this.searchBy === "price" && str.length > 0 && this.drugs.length) ||
          //make sure there is drugs and at least term is 2 chars
          (str.length > 2 && this.drugs.length)
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
        (res: any[]) => {
          //found in our data
          if (res.length >= 1) {
            this.searchResult = res;
            this.smoothHideLoading();
          } else {
            //not found reset
            this.searchResult = [];
            //set flag
            this.noResults = true;
            this.doApproximate().then((res: any[]) => {
              this.doYouMean = res[0].tradename;
              this.smoothHideLoading();
            });
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  handleBadSearchTerm(): void {
    this.searchResult = [];
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
        this.searchResult = drugs;
        this.smoothHideLoading();
        res("done");
      });
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
            this.searchResult = res;
            this.smoothHideLoading();
            resolve("handled");
          })
          .catch(err => console.log(err));
      }
    });
  }

  //TODO: report this bug to ionic
  reLoadVirtualList(): Promise<any> {
    return Promise.resolve(() => {
      setTimeout(() => {
        this.virtualScroll.renderVirtual(false);
      }, 500);
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
      this.remmemberedState = this.searchResult;
      this.storage
        .get("history")
        .then(history => {
          this.searchResult = history || [];
        })
        .catch(err => console.log(err));
    } else if (this.segment === "all") {
      this.searchResult = this.remmemberedState;
    }
  }

  doApproximate(): Promise<Drug[]> {
    var options = {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [this.searchBy]
    };
    var fuse = new Fuse(this.drugsInitial, options);
    return Promise.resolve(fuse.search(this.searchTerm));
  }

  doSearch(searchTerm): Promise<Drug[]> {
    //todo: optimization should happen here
    this.drugs = this.drugsInitial;
    return Promise.resolve(
      this.drugs.filter(drug => {
        switch (this.searchBy) {
          //this case search with price exactly like input
          case "price":
            return Number(drug.price) === Number(searchTerm);
          case this.searchBy:
            return (
              drug[this.searchBy]
                .toLowerCase()
                .indexOf(searchTerm.toLowerCase()) > -1
            );
          default:
            return (
              drug.tradename.toLowerCase().indexOf(searchTerm.toLowerCase()) >
              -1
            );
        }
      })
    );
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
    alert.setTitle("Choose to search by ...");

    let choices = this.chooseToSearchBy;

    for (let i = 0; i < choices.length; i++) {
      if (choices[i].value === this.searchBy) {
        choices[i].checked = true;
        alert.addInput(choices[i]);
      } else {
        choices[i].checked = false;
        alert.addInput(choices[i]);
      }
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

  onEnterKey() {
    //handle UX
    if (this.drugs.length == 0) {
      this.showApproximate().then(() => {
        this.closeKeyboard();
      });
    } else {
      this.closeKeyboard();
    }
  }

  closeKeyboard() {
    this.keyboard.close();
  }
  shouldHideSpinner() {
    return this.loading;
  }

  readyToSearch() {
    return (
      (this.searchResult.length === 0 && !this.loading) ||
      this.searchResult.length === 0
    );
  }

  isEmptyHistory() {
    return (
      this.drugs.length < 1 &&
      this.loading !== true &&
      this.segment == "history"
    );
  }
}
