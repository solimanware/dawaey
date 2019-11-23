import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user/user';
import { UserDetail } from '../../interfaces';
import { Firebase } from '@ionic-native/firebase';
import { AnalyticsProvider } from '../../providers/analytics/analytics';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user: any;
  countryCode: string;
  mobileNumber: string;
  occupation: string;
  countryCodeNumber: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private userDetails: UserProvider,
    private analytics:AnalyticsProvider) {
  }

  async ionViewDidLoad() {
    this.analytics.trackScreen("Profile Screen");
    this.countryCodeNumber = {
      eg: '+20',
      kw: '+965'
    }
    this.userDetails.getCurrentUserDetails()
      .then((res: UserDetail) => {
        console.log(res);
        let userDetails: UserDetail = res;
        if (userDetails) {
          this.occupation = userDetails.occupation;
          let egycode = '+20';
          let kuwaitcode = '+965'
          if(userDetails.mobileNumber.toString().startsWith(egycode)){
            this.countryCode = 'eg';
            this.mobileNumber = userDetails.mobileNumber.toString().split(egycode)[1];
          }else if(userDetails.mobileNumber.toString().startsWith(kuwaitcode)){
            this.countryCode = 'kw';
            this.mobileNumber = userDetails.mobileNumber.toString().split(kuwaitcode)[1];
          }
      }
      })
      .catch(err => {
        console.log(err);
        //set initial values
        this.countryCode = "eg"
        this.mobileNumber = ""
        this.occupation = ""


      })
    this.user = await this.storage.get('user');
    console.log(this.user);



  }

  submitInfo() {
    this.userDetails.saveUserDetails({
      mobileNumber: this.countryCodeNumber[this.countryCode] + this.mobileNumber,
      occupation: this.occupation
    }).then(res => {
      alert('success');

    }).catch(err => {
      console.log(err);

    })
  }

}
