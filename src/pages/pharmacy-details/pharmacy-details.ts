import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-pharmacy-details',
  templateUrl: 'pharmacy-details.html',
})
export class PharmacyDetailsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PharmacyDetailsPage');
  }

}
