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
  loading: boolean;
  drugs: Drug[] = [];
  activeingredients: string[] = [];
  drug: Drug;
  showPharma: boolean = false;
  similars: Drug[] = [];
  @ViewChild(Content)
  content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private drugProvider: DrugProvider,
    private ga: GoogleAnalytics,
    private storage: Storage,
    public alertCtrl: AlertController
  ) {}

  async ionViewDidEnter() {
    this.loading = true;
    //set view
    this.drug = await this.loadDrugDetails();
    this.activeingredients = this.drug.activeingredient.split("+");
    this.loading = false;

    //set analytics
    this.ga.trackView(this.drug.tradename);

    //load similars
    this.similars = await this.loadDrugSimilars();
  }

  loadDrugDetails(): Promise<Drug> {
    return new Promise((resolve, reject) => {
      //getting just id from directlink url
      if (this.navParams.get("drug") == undefined) {
        this.drugProvider.displayDrugs().subscribe((result: Drug[]) => {
          //save array to use later
          this.drugs = result;
          //**you can linear search if you're not certain about id and data**//
          let drugId = Number(this.navParams.get("id")) - 1;
          resolve(this.drugs[drugId]);
        });
      } else {
        //getting details from navigation object
        resolve(this.navParams.get("drug"));
      }
    });
  }

  loadDrugSimilars(): Promise<Drug[]> {
    return new Promise((resolve, reject) => {
      //check we have data here
      if (this.drugs.length) {
        //loop to find which have the save ingredienets;
        for (let i = 0; i < this.drugs.length; i++) {
          if (this.drug.activeingredient === this.drugs[i].activeingredient) {
            const similar = this.drugs[i];
            this.similars.push(similar);
          }
        }
      } else {
        //load it
        this.drugProvider.displayDrugs().subscribe((result: Drug[]) => {
          this.drugs = result;
          //then loop
          //loop to find which have the save ingredienets;
          for (let i = 0; i < this.drugs.length; i++) {
            if (this.drug.activeingredient === this.drugs[i].activeingredient) {
              const similar = this.drugs[i];
              this.similars.push(similar);
            }
          }
        });
      }

      //TODO: implement our ranking function
      function compare(a, b) {
        if (Number(a.price) < Number(b.price)) return -1;
        if (Number(a.price) > Number(b.price)) return 1;
        return 0;
      }

      resolve(this.similars.sort(compare));
    });
  }

  ionViewDidLoad() {}

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
    this.addToHistory(drug)
  }

  togglePharma() {
    this.showPharma = !this.showPharma;
    if (this.showPharma === true) {
      //setting newer id to make new scroll when new view pushes to nav object as id is unique to every element
      this.content.scrollTo(
        0,
        document.getElementById(`pharma${this.drug.id}`).offsetTop,
        500
      );
    } else {
      this.content.scrollToTop(500);
    }
  }

  addToHistory(drug: Drug): void {
    this.storage
      .get("history")
      .then(history => {
        const arr = history || [];
        arr.push(drug);
        this.storage.set("history", arr);
      })
      .catch(err => console.log(err));
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
}
