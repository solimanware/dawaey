import { Storage } from "@ionic/storage";
import { DrugsPage } from "./../drugs/drugs";
import { DrugProvider } from "./../../providers/drug/drug";
import { ViewChild, Component } from "@angular/core";
import {
  Content,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";
import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { Drug } from "../../interfaces";

@Component({
  selector: "page-drug-details",
  templateUrl: "drug-details.html"
})
export class DrugDetails {
  showPharma: boolean = false;
  activeingredients: string[] = [];
  id;
  drug: Drug;
  similars = [];
  displayOptions: any = {};
  @ViewChild(Content)
  content: Content;
  pharmaPosition: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private drugProvider: DrugProvider,
    private ga: GoogleAnalytics,
    private storage: Storage,
    public alertCtrl: AlertController
  ) {
    this.storage.get("country").then(country => {
      if (country == "kw") {
        this.displayOptions.showPicture = false;
        this.displayOptions.currency = {
          currencyCode: "KWD",
          digitInfo: "1.3-3"
        };
      } else {
        this.displayOptions.showPicture = true;
        this.displayOptions.currency = {
          currencyCode: "EGP",
          digitInfo: "1.2-2"
        };
      }
    });
    let currentId = navParams.get("id");

    if (navParams.get("drug") == undefined) {
      this.drugProvider.displayDrugs().subscribe(drugs => {
        for (let i = 0; i < drugs.length; i++) {
          if (drugs[i].id == currentId) {
            this.drug = drugs[i];
            this.activeingredients = this.drug.activeingredient.split("+");
          }
        }
      });
    } else {
      this.drug = navParams.get("drug");
      this.activeingredients = this.drug.activeingredient.split("+");
    }

    let currentDrugAI;
    this.drugProvider.displayDrugs().subscribe(drugs => {
      for (let i = 0; i < drugs.length; i++) {
        if (drugs[i].id == currentId) {
          this.ga.trackView(drugs[i].tradename);
          currentDrugAI = drugs[i].activeingredient;
        }
      }
      for (let i = 0; i < drugs.length; i++) {
        if (drugs[i].activeingredient === currentDrugAI) {
          let obj = drugs[i];
          this.similars.push(obj);
        }
      }
      function compare(a, b) {
        if (Number(a.price) < Number(b.price)) return -1;
        if (Number(a.price) > Number(b.price)) return 1;
        return 0;
      }

      this.similars = this.similars.sort(compare);
    });
  }
  viewCompanyProducts() {
    let company = this.drug.company;
    this.navCtrl.push(DrugsPage, {
      searchBy: "company",
      inputToSearch: company
    });
  }
  searchActiveIngredient(item) {
    this.navCtrl.push(DrugsPage, {
      searchBy: "activeingredient",
      inputToSearch: item
    });
  }
  viewDrugGroup() {
    let group = this.drug.group;
    this.navCtrl.push(DrugsPage, {
      searchBy: "group",
      inputToSearch: group
    });
  }

  openDrug(drug) {
    this.navCtrl.push(DrugDetails, {
      id: drug.id,
      drug: drug
    });
  }

  togglePharma() {
    this.showPharma = !this.showPharma;

    if (this.showPharma === true) {
        this.content.scrollTo(0, document.getElementById('start-pharma').offsetTop,500);
    } else {
      this.content.scrollToTop(500);
    }

    // let confirm = this.alertCtrl.create({
    //   title: 'This is a paid feature',
    //   message: 'Viewing Pamphlet will cost you EGP1... Do you want to proceed?',
    //   buttons: [
    //     {
    //       text: 'Dismiss',
    //       handler: () => {
    //         this.showPamphlet = false;
    //       }
    //     },
    //     {
    //       text: "Proceed",
    //       handler: () => {
    //         this.callIt('*868*2*01063116380*1#')
    //         setTimeout(()=>{
    //           this.showPamphlet = true;
    //         },500)
    //       }
    //     }
    //   ]
    // });
    // confirm.present();
  }
  callIt(passedNumber) {
    passedNumber = encodeURIComponent(passedNumber);
    (<any>window).location = "tel:" + passedNumber;
  }
  viewPicture() {
    this.openLinkSystemBrowser(
      `https://www.google.com/search?tbm=isch&q=${this.drug.tradename
        .split(" ")
        .slice(0, 2)
        .join(" ")} drug`
    );
  }
  googleMore() {
    this.openLinkSystemBrowser(
      `https://www.google.com/search?&q=${this.drug.tradename
        .split(" ")
        .slice(0, 2)
        .join(" ")} drug`
    );
  }
  openLinkSystemBrowser(link) {
    window.open(link, "_system");
  }
  ionViewDidLoad() {  }
}
