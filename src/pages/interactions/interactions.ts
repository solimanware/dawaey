import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';
import { AnalyticsProvider } from '../../providers/analytics/analytics';



@Component({
  selector: 'page-interactions',
  templateUrl: 'interactions.html'
})
export class InteractionsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private analytics:AnalyticsProvider) {}

  ionViewDidLoad() {
    this.analytics.trackScreen("Interactions Screen");
  }

}
