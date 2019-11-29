import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AnalyticsProvider } from '../../providers/analytics/analytics';



@Component({
  selector: 'page-sponsors',
  templateUrl: 'sponsors.html'
})
export class SponsorsPage {
  sponsors = []

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private analytics:AnalyticsProvider
  ) { 
    this.sponsors = [
      {
        img:"assets/imgs/angular.png",
        name:"Google Angular",
        since:"7 Jan 2018",
        link:"https://angular.io"
      },
      {
        img:"assets/imgs/ionic.png",
        name:"Ionic Team",
        since:"9 Dec 2017",
        link:"https://ionicframework.com"
      }
    ]
  }

  ionViewDidLoad() {
    this.analytics.trackScreen("Sponsors Screen");
  }

}
