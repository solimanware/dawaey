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
import { Drug } from "../../interfaces";
import { Firebase } from "@ionic-native/firebase";

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
    private firebase:Firebase,
    private storage: Storage
  ) {}

  //Setting live cycle event of entering this component
  async ionViewDidEnter() {
    this.loading = true;
    //set view
    this.drug = await this.loadDrugDetails();
    this.activeingredients = this.drug.activeingredient.split("+");
    this.loading = false;

    //set analytics
    this.firebase.setScreenName(this.drug.tradename);

    //load similars
    this.similars = await this.loadDrugSimilars();
  }


  //load this drug information
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

  //load similar drugs for this current drug in view
  loadDrugSimilars(): Promise<Drug[]> {
    let similarDrugs = [];
    //function to push similar drugs to class similars array
    const pushSimilars = () => {
      //loop to find which have the save ingredienets;
      for (let i = 0; i < this.drugs.length; i++) {
        if (this.drug.activeingredient === this.drugs[i].activeingredient) {
          //push if similar -> similar has the same active ingredient
          similarDrugs.push(this.drugs[i]);
        }
      }
    };

    const quickRank = (drugs) => {
      const lowestPrice = (a, b) => Number(a.price) - Number(b.price);
      return drugs.sort(lowestPrice)
    }

    //method returns promise of similar drugs...
    return new Promise((resolve, reject) => {
      //we have data already loaded 
      //usually we have it when we use direct link
      if (this.drugs.length) {
          pushSimilars();
          quickRank(similarDrugs);
      } else {
        //coming from navigation page
        //load the drugs to pick similar 
        //current data is limited to data coming from nav object
        this.drugProvider.displayDrugs().subscribe((result: Drug[]) => {
          this.drugs = result;
          pushSimilars();
          quickRank(similarDrugs);
        });
      }

      

      
      resolve(similarDrugs);
    });
  }


  //open link with company search parameter in main screen
  viewCompanyProducts() {
    let company = this.drug.company;
    this.navCtrl.push(DrugsPage, {
      searchBy: "company",
      inputToSearch: company
    });
  }

  //open link with active ingredient search parameter in main screen
  searchActiveIngredient(item) {
    this.navCtrl.push(DrugsPage, {
      searchBy: "activeingredient",
      inputToSearch: item
    });
  }

  //open link with drug group search parameter in main screen
  viewDrugGroup() {
    let group = this.drug.group;
    this.navCtrl.push(DrugsPage, {
      searchBy: "group",
      inputToSearch: group
    });
  }

  //open link with drug details in another screen and add it to screen
  openDrug(drug) {
    this.navCtrl.push(DrugDetails, {
      id: drug.id,
      drug: drug
    });
    this.addToHistory(drug);
  }

  //toggle showing pharma details and scroll to it
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

  //add to history function
  addToHistory(drug: Drug): void {
    this.storage
      .get("history")
      .then(history => {
        const arr = history || [];
        arr.push(drug);
        this.drugProvider.saveDrugSearch(drug)
        this.storage.set("history", arr);
      })
      .catch(err => console.log(err));
  }

  //view drug picture externally
  viewPicture() {
    this.openLinkSystemBrowser(
      `https://www.google.com/search?tbm=isch&q=${this.drug.tradename
        .split(" ")
        .slice(0, 2)
        .join(" ")} drug`
    );
  }

  //google more about drug externally
  googleMore() {
    this.openLinkSystemBrowser(
      `https://www.google.com/search?&q=${this.drug.tradename
        .split(" ")
        .slice(0, 2)
        .join(" ")} drug`
    );
  }

  //in app browser open link is system browser
  openLinkSystemBrowser(link) {
    window.open(link, "_system");
  }
}
