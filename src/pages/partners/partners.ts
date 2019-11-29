import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PartnerProvider } from '../../providers/partner/partner';
import { AnalyticsProvider } from '../../providers/analytics/analytics';


@Component({
  selector: 'page-partners',
  templateUrl: 'partners.html'
})
export class PartnersPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private analytics:AnalyticsProvider,private partnerProvider: PartnerProvider) { }
  partners = [];
  ionViewDidLoad() {
    this.partners = [
      { img:"assets/imgs/osama.jpg",name: "Osama Soliman", since: "The Start", fb: "DrOs96" },
    ]
    this.partnerProvider.getPartnersByDefaultCountry().subscribe(partners=>{
      if(partners.length >= 1){
        for(let p of partners){
          this.partners.push(p);
        }
        
      }
    })
    this.analytics.trackScreen("Parteners Screen");
  }

  openFacebook(username){
    this.openLinkSystemBrowser(`https://www.facebook.com/${username}`);
  }
  openLinkSystemBrowser(link) {
    window.open(link, "_system");
  }

}
