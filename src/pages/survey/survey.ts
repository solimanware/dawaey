import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { Storage } from "@ionic/storage";
import { DrugsPage } from '../drugs/drugs';
import { UserDetail } from '../../interfaces';
import { ThrowStmt } from '@angular/compiler';
import { Firebase } from '@ionic-native/firebase';
import { AnalyticsProvider } from '../../providers/analytics/analytics';

@Component({
  selector: 'page-survey',
  templateUrl: 'survey.html',
})

export class SurveyPage {
  showFirst = true;
  areYou = "student";
  fieldOfStudy = "pharmacy";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userDetails: UserProvider,
    public storage: Storage,
    private analytics:AnalyticsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SurveyPage');
    this.analytics.trackScreen("Survey Screen")
  }

  submit() {
    let info = {
      areYou : this.areYou,
      fieldOfStudy: this.fieldOfStudy
    };
    //save details that he submitted
    this.userDetails.saveUserDetails(info).then(() => {
      //navigate to main page
      this.navCtrl.push(DrugsPage);
    }).catch((err) => {
      console.log(err);
      alert("Submit was not completed");
    });
  }

}
