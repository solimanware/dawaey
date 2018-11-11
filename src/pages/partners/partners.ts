import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { PartnerProvider } from '../../providers/partner/partner';


@Component({
  selector: 'page-partners',
  templateUrl: 'partners.html'
})
export class PartnersPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private ga: GoogleAnalytics,private partnerProvider: PartnerProvider) { }
  partners = [];
  ionViewDidLoad() {
    this.partners = [
      { img:"assets/img/mostafa.jpg",name: "Dr Mustafa MaHrouky", since: "June 29, 2016", fb: "mostafa.elmahrouky" },
      { img:"assets/img/osama.jpg",name: "Osama Soliman", since: "The Begining", fb: "DrOs96" },
    ]
    this.partnerProvider.getPartnersByDefaultCountry().subscribe(partners=>{
      if(partners.length >= 1){
        for(let p of partners){
          this.partners.push(p);
        }
        
      }
    })
    this.ga.trackView('Parteners Screen')
  }

  openFacebook(username){
    this.openLinkSystemBrowser(`https://www.facebook.com/${username}`);
  }
  openLinkSystemBrowser(link) {
    window.open(link, "_system");
  }

}
