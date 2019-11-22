import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';



@Component({
  selector: 'page-interactions',
  templateUrl: 'interactions.html'
})
export class InteractionsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private firebase: Firebase) {}

  ionViewDidLoad() {
    this.firebase.setScreenName("Interactions Screen");
  }

}
