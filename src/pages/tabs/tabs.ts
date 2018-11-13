import { SponsorsPage } from "./../sponsors/sponsors";
import { InteractionsPage } from "./../interactions/interactions";
import { DrugsPage } from "./../drugs/drugs";
import { NavParams, Platform } from "ionic-angular";
import { Page } from "ionic-angular/umd/navigation/nav-util";
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
export interface ITab {
  title:string;
  component:Page;
  icon:string;
  url:string;
  }

@Component({
  selector: "page-tabs",
  templateUrl: "tabs.html"
})
export class TabsPage {
  public tabs:ITab[] = [
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

  constructor(
    navParams: NavParams,
    public plt: Platform,
    private translate:TranslateService,
    public ts: TranslateService) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
    this.isAndroid = this.plt.is("andorid");
  }
}
