import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';


@IonicPage({
  name:'about',
  segment: 'about'
})
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private firebase:Firebase) { }

  ionViewDidLoad() {
    this.firebase.setScreenName("Developer Screen");
  }

  openLink(url){
    window.open(url,"_system")
  }

}
