import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-pharmacies-detials',
  templateUrl: 'pharmacies-detials.html',
})
export class PharmaciesDetialsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PharmaciesDetialsPage');
  }

}
