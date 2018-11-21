import { TutorialPage } from './../tutorial/tutorial';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { SettingsProvider } from '../../providers/settings/settings';
import { Events } from 'ionic-angular';


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
    private storage: Storage,
    private toastCtrl: ToastController,
    public translate: TranslateService,
    public settings:SettingsProvider,
    private events:Events
  ) {
    this.languageChoices = [
      { value: "ar", name: 'Arabic' },
      { value: "en", name: 'English' }
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
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
  updateDefaultCountry(ev) {
    this.settings.setCountry(ev)
    this.presentToast('You have successfully updated the default country')
  }
  updateDefaultLanguage(ev) {
    this.translate.use(ev)
    this.defaultLanguage = ev;
    this.storage.set('language', ev)
  }
  waitNextVersion(ev) {
    this.presentToast('Wait this feature in the next version')
  }
  changeColor(color) {
    this.settings.setColor(color)
  }
  updateDatabase() {
    this.presentToast('Updating ...')
    this.events.publish('drugs:update');
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }


  resetData() {
    this.storage.clear();
  }

  showTutorial() {
    this.navCtrl.setRoot(TutorialPage);
  }

}
