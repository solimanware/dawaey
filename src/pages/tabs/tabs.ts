import { SponsorsPage } from "./../sponsors/sponsors";
import { InteractionsPage } from "./../interactions/interactions";
import { DrugsPage } from "./../drugs/drugs";
import { Component } from "@angular/core";
import { NavParams, Platform } from "ionic-angular";

@Component({
  selector: "page-tabs",
  templateUrl: "tabs.html"
})
export class TabsPage {
  tabs = [
    {
      title: "Drug Search",
      component: DrugsPage,
      icon: "medical",
      url: "search"
    },
    {
      title: "Drug Interactions",
      component: InteractionsPage,
      icon: "finger-print",
      url: "check"
    },
    {
      title: "Sponsors",
      component: SponsorsPage,
      icon: "ionic",
      url: "welcome"
    }
  ];
  mySelectedIndex: number;
  isAndroid: boolean;

  constructor(navParams: NavParams, public plt: Platform) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
    this.isAndroid = this.plt.is("andorid");
  }

  ionViewDidLoad() {}
}
