import { SettingsPage } from './../../pages/settings/settings';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PharmaciesPage } from '../../pages/pharmacies/pharmacies';
@Component({
  selector: 'ads',
  templateUrl: 'ads.html'
})
export class AdsComponent {
  shouldShowAds:boolean;

  constructor(private navCtrl:NavController) {
    this.shouldShowAds = true;
  }

  hide(){
    this.shouldShowAds = false;
  }

  goPharmaciesPage() {
    this.navCtrl.push(PharmaciesPage)
  }
  goSettingsPage(){
    this.navCtrl.push(SettingsPage)
  }

}
