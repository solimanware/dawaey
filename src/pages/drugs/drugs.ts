import {DrugProvider} from './../../providers/drug/drug';
import {DrugDetails} from './../drug-details/drug-details';
import {Component, ViewChild, OnChanges} from '@angular/core';

import {
  NavController,
  AlertController,
  Content,
  LoadingController,
  Loading,
  FabContainer,
  NavParams,
  VirtualScroll
} from 'ionic-angular';
import {Keyboard} from '@ionic-native/keyboard';

import {GoogleAnalytics} from '@ionic-native/google-analytics';

import * as Fuse from 'fuse.js';
import {Drug} from '../../interfaces'
import {Storage} from '@ionic/storage';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

const wait = (ms) => new Promise(r => setTimeout(r, ms))

@Component({selector: 'page-drugs', templateUrl: 'drugs.html'})

export class DrugsPage {
  noResults: boolean = false;
  shouldShowSpinner : boolean;
  searchResult : Drug[] = [];
  remmemberedState : Drug[];
  doYouMean : String;
  displayOptions : any = {};
  schema : {};
  history : Drug[] = [];
  searchTerm : string = '';
  searchTerm$ = new Subject < string > ()
  drugsInitial : Drug[] = []; //initialize your drugsInitial array empty
  drugs : Drug[] = []; //initialize your drugs array empty
  chooseToSearchBy = []
  searchBy = "tradename";
  segment = 'all';
  @ViewChild(Content)content : Content;
  loading : boolean = true;
  @ViewChild('virtualScroll', {read: VirtualScroll})virtualScroll : VirtualScroll;

  constructor(public keyboard : Keyboard, public alertCtrl : AlertController, public navCtrl : NavController, public navParams : NavParams, private drugProvider : DrugProvider, private ga : GoogleAnalytics, private loadingCtrl : LoadingController, private storage : Storage) {
    this.chooseToSearchBy = []
    this.schema = {
      id: "Code",
      tradename: "Trade Name",
      activeingredient: "Active Ingredients",
      price: "Price",
      company: "Company",
      group: "Group",
      pamphlet: "Pamphlet",
      priceHistory: ""
    }
    this
      .storage
      .get('country')
      .then(country => {
        if (country == 'kw') {
          this.displayOptions.currency = {
            currencyCode: 'KWD',
            digitInfo: '1.3-3'
          };
        } else {
          this.displayOptions.currency = {
            currencyCode: 'EGP',
            digitInfo: '1.2-2'
          }

        }
      })
    this.doMagic();

  };

  // ngOnChanges(changes) {   console.log(changes);   this.readyToSearch();
  // this.shouldShowDrugList();   this.isEmptyHistory() }
  ionViewDidEnter() {
    this.loading = true;
    this
      .reLoadVirtualList()
      .then(async() => {
        this.smoothHideLoading();
      })
  }
  ionViewDidLoad() {
    this.loading = true;
    console.log('didLoad');
    this.drugs = this.drugsInitial;
    //report analytics
    this
      .ga
      .trackView('Main Screen')

    //+ no need to load every didEnter
    this
      .drugProvider
      .displayDrugs()
      .subscribe(data => {
        //todo: optimization should happen here
        this.drugsInitial = data;
        this.drugs = data;
        this.loading = false;

        this
          .handleComingFromOtherPage()
          .then(() => {
            this.smoothHideLoading();
          })
          .catch((err) => {
            console.log(err);
            this.smoothHideLoading();
          })
          const optionArr = []
        for (let prop in this.drugs[0]) {
          if (prop && this.schema[prop]) {
            const myObj = {
              type: 'radio',
              label: this.schema[prop],
              value: prop,
              checked: false
            }
            optionArr.push(myObj)
          }
        }
        this.chooseToSearchBy = optionArr;
      })
    //careful doing something outside this observation
  }

  doMagic() : void {
    //todo: move to search provider
    this.searchTerm$.do 
      (() => {
        //set flag
        this.loading = true;
      }).map(String)
      //avrage user righting speed better ux for high mid or low end devices
        .debounceTime(1000)
        .distinctUntilChanged()
        .filter(str => {
          if(str.length >= 3){
            //okay pass this from stream
            return true
          }else{
            this.loading = false;
            //reset to empty array
            this.searchResult = [];
          }
        })
        .do 
          ((term) => {
            this.searchTerm = term
          }).switchMap((searchTerm : string) => this.doSearch(searchTerm)).subscribe((res : Drug[]) => {
            //found in our data
            if (res.length >= 1) {
              this.searchResult = res;
              this.smoothHideLoading();
            } else {
              //not found
              //reset
              this.searchResult = [];
              //set flag
              this.noResults = true;
              this
                .doApproximate()
                .then((res : Drug[]) => {
                  console.log(this.drugs.length);
                  this.doYouMean = res[0].tradename;
                  console.log(res[0]);
                  this.smoothHideLoading();
                })
            }
          })
    }

  async smoothHideLoading() {
    await wait(500)
    this.loading = false;
    console.log('hide loading spinner');
  }

  showApproximate() : Promise < string > {
    this.loading = true;
    return new Promise((res, rej) => {
      this
        .doApproximate()
        .then(async(drugs : Drug[]) => {
          this.searchResult = drugs;
          this.smoothHideLoading();
          res('done')
        })
    })

  }

  handleComingFromOtherPage() : Promise < string > {
    let foundParams = this
      .navParams
      .get("searchBy") && this
      .navParams
      .get("inputToSearch");

    console.log(this.navParams);
    return new Promise((resolve, rej) => {
      if (foundParams) {
        this.searchBy = this
          .navParams
          .get("searchBy");
        this
          .searchTerm$
          .next(this.navParams.data.inputToSearch)
        console.log('inside handling function');
        this
          .doSearch(this.navParams.get("inputToSearch"))
          .then((res : Drug[]) => {
            this.searchResult = res;
            this.smoothHideLoading();
            resolve('handled')
          });
      }
    })
  }
  //todo: report this bug to ionic
  reLoadVirtualList() : Promise < any > {
    return Promise.resolve(() => {
      setTimeout(() => {
        this
          .virtualScroll
          .renderVirtual(false)
      }, 500)
    })
  }

  openDrug(drug) : void {
    this
      .navCtrl
      .push(DrugDetails, {
        id: drug.id,
        drug: drug
      });
    this.addToHistory(drug);
  }

  addToHistory(drug) : void {
    //todo: needs refactoring
    console.log('adding to history');
    this
      .storage
      .get('history')
      .then((history) => {
        console.log(history);
        const arr = history || [];
        arr.push(drug)
        this
          .storage
          .set('history', arr)
      })
      .catch(err => console.log(err))
  }

  toggleSegments() : void {
    if(this.segment == 'all') {
      this.drugs = this.remmemberedState;
    } else if (this.segment == 'history') {
      this.remmemberedState = this.drugs;
      this
        .storage
        .get('history')
        .then((history) => {
          this.drugs = history || [];
        })
        .catch(err => console.log(err))
    }
  }

  doApproximate() : Promise < Drug[] > {
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
    return Promise.resolve(fuse.search(this.searchTerm))
  }

  doSearch(searchTerm) : Promise < Drug[] > {
    //todo: optimization should happen here
    this.drugs = this.drugsInitial;

    // value is an empty string don't filter the drugs
    //todo: only accept 3 letters as minimum else reset drugs count to 0
    if (searchTerm && searchTerm.trim() != '' && searchTerm.length > 2) {
      return Promise.resolve(this.drugs.filter((drug) => {
        switch (this.searchBy) {
          case "tradename":
            return (drug.tradename.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
          case "activeingredient":
            return (drug.activeingredient.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
          case "group":
            return (drug.group.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
          case "company":
            return (drug.company.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
          case "price":
            return Number(drug.price) === Number(searchTerm);
          case "pamphlet":
            return (drug.pamphlet.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
          default:
            return (drug.tradename.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
        }
      }))
    }
  }

  //helper ranking function
  //todo:need to implement our ranking
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
    return Promise.resolve(first.concat(others))
  }

  showRadio() {
    let alert = this
      .alertCtrl
      .create();
    alert.setTitle('Choose to search by ...');

    let choices = this.chooseToSearchBy;

    for (let i = 0; i < choices.length; i++) {
      console.log(choices[i].value);
      if (choices[i].value === this.searchBy) {
        choices[i].checked = true;
        console.log(choices[i].value, choices[i].checked);
        alert.addInput(choices[i]);
      } else {
        console.log(choices[i].value, choices[i].checked);
        choices[i].checked = false;
        alert.addInput(choices[i]);
        console.log(choices[i]);
      }

    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: value => {
        this.searchBy = value;
        console.log(value);

      }
    });
    alert.present();
  }

  onEnterKey() {
    //handle UX
    if (this.drugs.length == 0) {
      this
        .showApproximate()
        .then(() => {
          this.closeKeyboard();
        })
    } else {
      this.closeKeyboard();
    }

  }

  closeKeyboard() {
    this
      .keyboard
      .close();
  }
  shouldHideSpinner() {
    return this.loading
  }

  readyToSearch() {
    return (this.searchResult.length === 0 && !this.loading) || this.searchResult.length === 0;
  }

  isEmptyHistory() {
    return this.drugs.length < 1 && this.loading !== true && this.segment == 'history'
  }
}
