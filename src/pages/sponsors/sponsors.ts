import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';



@Component({
  selector: 'page-sponsors',
  templateUrl: 'sponsors.html'
})
export class SponsorsPage {
  sponsors = []

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private ga: GoogleAnalytics
  ) { 
    this.sponsors = [
      {
        img:"assets/img/angular.png",
        name:"Google Angular",
        since:"7 Jan 2018",
        link:"https://angular.io"
      },
      {
        img:"assets/img/ionic.png",
        name:"IONIC",
        since:"9 Dec 2017",
        link:"https://ionicframework.com"
      }
    ]
  }

  ionViewDidLoad() {
    this.ga.trackView('Sponsors Screen')
  }

}
