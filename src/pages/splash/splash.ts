import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private splashScreen:SplashScreen,private viewCtrl: ViewController,private platform:Platform) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashPage');
  }

  ionViewDidEnter() {
    if (this.platform.is("cordova")) {
    this.splashScreen.hide();
  }
 
    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 500);
 
  }

}
