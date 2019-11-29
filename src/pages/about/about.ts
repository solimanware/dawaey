import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AnalyticsProvider } from '../../providers/analytics/analytics';


@IonicPage({
  name:'about',
  segment: 'about'
})
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private analytics:AnalyticsProvider) { }

  ionViewDidLoad() {
    this.analytics.trackScreen("Developer Screen");
  }

  openLink(url){
    window.open(url,"_system")
  }

}
