import { TutorialPage } from './../tutorial/tutorial';
import { Storage } from '@ionic/storage';
import { DrugProvider } from './../../providers/drug/drug';
import { SettingsProvider } from './../../providers/settings/settings';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  defaultCountry: string;
  defaultLanguage: string;
  defaultColor: string;
  countryChoices: { value: string; name: string; }[];
  languageChoices: { value: string; name: string; }[];
  colorChoices: { value: string; name: string; }[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public settingsProvider: SettingsProvider,
    private storage: Storage,
    private drugProvider: DrugProvider,
    private toastCtrl: ToastController,
    private translate: TranslateService
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
    this.colorChoices = [
      { value: "red", name: 'Red' },
      { value: "pink", name: 'Pink' },
      { value: "deepPurple", name: 'Deep Purple' },
      { value: "indigo", name: 'Indigo' },
      { value: "blue", name: 'Blue' },
      { value: "lightBlue", name: 'Light Blue' },
      { value: "cyan", name: 'Cyan' },
      { value: "teal", name: 'Teal' },
      { value: "green", name: 'Green' },
      { value: "lightGreen", name: 'Light Green' },
      { value: "yello", name: 'Yello' },
      { value: "amber", name: 'Amber' },
      { value: "orange", name: 'Orange' },
      { value: "deepOrange", name: 'Deep Orange' },
      { value: "brown", name: 'Brown' },
      { value: "gray", name: 'Gray' },
      { value: "blueGray", name: 'blueGray' },
    ]
    this.storage.get('country')
      .then(c => {
        this.defaultCountry = c || 'eg';
      })
    this.storage.get('language')
      .then(l => {
        this.defaultLanguage = l || 'en';
      })
    this.storage.get('color')
      .then(color => {
        this.defaultColor = color || 'red';
      })

      

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
   // this.translate.setDefaultLang('en')
  }
  updateDefaultCountry(ev) {
    console.log(ev);
    this.settingsProvider.setCountry(ev)
    this.presentToast('You have successfully updated the default country')
  }
  updateDefaultLanguage(ev) {
    this.translate.use(ev)
    this.defaultLanguage = ev;
    this.storage.set('language',ev)
  }
  waitNextVersion(ev){
   // this.presentToast('Wait this feature in the next version')
  }
  changeColor(color){
    console.log('change color');
    console.log(color);
    
    this.settingsProvider.setColor(color)
  }
  updateDatabase() {
    this.presentToast('Updating ...')
    this.drugProvider.updateDrugs().subscribe(data => {
      console.log(data.length);
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
