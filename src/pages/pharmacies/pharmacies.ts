import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PharmacyProvider } from '../../providers/pharmacy/pharmacy';
import { PharmacyDetailsPage } from '../pharmacy-details/pharmacy-details';
import { Firebase } from '@ionic-native/firebase';
import { AnalyticsProvider } from '../../providers/analytics/analytics';

export interface Pharmacies {
  gov: string
  locations: Location[];
}
export interface Location {
  location: string;
  pharms: Pharmacy[]
}
export interface Pharmacy {
  name: string;
  tel: string;
  address: string;
}

@Component({
  selector: 'page-pharmacies',
  templateUrl: 'pharmacies.html',
})
export class PharmaciesPage {
  pharmacies: Pharmacies[];
  govs = [];
  locations = [];
  choosenGov: string;
  choosenLocation: string;
  filteredPharmacies: Pharmacy[] = [];
  loading = true;
  shouldShowAds: boolean;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private pharmacyProvider: PharmacyProvider,
    private analytics:AnalyticsProvider) {
  }


  govChoosen($event) {
    console.log($event);
    let choise = $event

    for (let i = 0; i < this.pharmacies.length; i++) {
      if (this.pharmacies[i].gov === choise) {
        this.pharmacies[i].locations.forEach(element => {
          this.locations.push(element.location)
        });
      }
    }
  }

  locationChoosen(location) {
    for (let i = 0; i < this.pharmacies.length; i++) {
      if (this.pharmacies[i].gov === this.choosenGov) {
        this.pharmacies[i].locations.forEach((loc: Location) => {          
          if (loc.location === location) {
            console.log('found location');
            this.filteredPharmacies = loc.pharms
          }
        })
      }
    }
    this.shouldShowAds = false;
  }


  registerNewPharmacy(){
    this.navCtrl.push(PharmacyDetailsPage)
  }

  ionViewDidLoad() {
    this.analytics.trackScreen("Pharmacies Screen");
    this.shouldShowAds = true;
    this.pharmacyProvider.getAll().subscribe((res: Pharmacies[]) => {
      this.pharmacies = res;
      this.loading = false;
      for (let pharm of this.pharmacies) {
        this.govs.push(pharm.gov)
      }

      console.log(this.govs);

    })
  }
  goAddPharmacyPage(){
    this.navCtrl.push(PharmacyDetailsPage)
  }


  geoFindMe() {
    var output = document.getElementById("out");

    if (!navigator.geolocation) {
      output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
      return;
    }

    function success(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;

      console.log(latitude, longitude);


      output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

      var img = new Image();
      img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

      output.appendChild(img);
    }

    function error() {
      output.innerHTML = "Unable to retrieve your location";
    }

    output.innerHTML = "<p>Locating…</p>";

    navigator.geolocation.getCurrentPosition(success, error);
  }


}
