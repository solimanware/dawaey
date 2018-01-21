import { TutorialPage } from './../tutorial/tutorial';
import { Storage } from '@ionic/storage';
import { DrugProvider } from './../../providers/drug/drug';
import { SettingsProvider } from './../../providers/settings/settings';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  defaultCountry: string;
  defaultLanguage: string;
  countryChoices: { value: string; name: string; }[];
  languageChoices: { value: string; name: string; }[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public settingsProvider: SettingsProvider,
    private storage: Storage,
    private drugProvider: DrugProvider,
    private toastCtrl: ToastController
  ) {
    this.languageChoices = [
      { value: "ar", name: 'Arabic' },
      { value: "da", name: 'Danish' },
      { value: "nl", name: 'Dutch' },
      { value: "en", name: 'English' },
      { value: "fi", name: 'Finnish' },
      { value: "fr", name: 'French' },
      { value: "de", name: 'German' },
      { value: "lt", name: "Lithuanian" },
      { value: "nb", name: 'Norwegian' },
      { value: "ru", name: 'Russian' },
      { value: "es", name: 'Spanish' },
      { value: "sv", name: 'Swedish' },
    ]
    this.countryChoices = [
      { value: "eg", name: 'Egypt' },
      { value: "kw", name: 'Kuwait' }
    ]
    this.storage.get('country')
      .then(c => {
        this.defaultCountry = c || 'eg';
      })
    this.storage.get('language')
      .then(l => {
        this.defaultLanguage = l || 'en';
      })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  updateDefaultCountry(ev) {
    console.log(ev);
    this.settingsProvider.setCountry(ev)
    this.presentToast('You have successfully updated the default country')
  }
  updateDefaultLanguage(ev) {
    console.log(ev);
    this.presentToast('Wait this feature in the next version')
  }
  waitNextVersion(ev){
    this.presentToast('Wait this feature in the next version')
  }
  updateDatabase() {
    this.presentToast('Updating ...')
    this.drugProvider.updateDrugs().subscribe(data => {
      this.presentToast('You have successfully updated the application data')
    });
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }


  resetData(){
    this.storage.clear();
  }

  showTutorial(){
    this.navCtrl.setRoot(TutorialPage);
  }

}
