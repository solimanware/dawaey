import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';


@IonicPage({
  name:'about',
  segment: 'about'
})
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private ga: GoogleAnalytics) { }

  ionViewDidLoad() {
    this.ga.trackView('Developer Screen')
  }

}
