import { Component, ViewChild } from '@angular/core';

import { MenuController, NavController, Slides, Content } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';
import { Drug } from "./../../interfaces";
import { AuthPage } from '../auth/auth';

import { Storage } from '@ionic/storage';


export interface User {
  uid: string
  displayName?: string,
  email?: string,
  emailVerified?: boolean,
  phoneNumber?: any,
  photoURL?: string,
  history?: Drug[]

}

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})

export class TutorialPage {
  showSkip: boolean = true;
  @ViewChild(Content)
  content: Content;

  @ViewChild('slides') slides: Slides;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public storage: Storage,
    public translate: TranslateService
  ) {
  }

  changeLanguage() {
    this.translate.use('ar')
    this.translate.setDefaultLang('ar')

  }

  scrollToFeatures() {
    let index = this.slides.getActiveIndex()

    if (index === 1) {
      //TODO:check this
      // window.scrollTo(300,0);
    }
  }

  skipToLogin() {
    this.navCtrl.setRoot(AuthPage).then(res=>{
      this.storage.set('hasSeenTutorial', 'true');
    })
  }

  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

  ionViewWillEnter() {
    this.slides.update();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
    this.slides.ionSlideDidChange.subscribe(res => {
      this.scrollToFeatures();
    })
  }

  showTutorial() {
    this.navCtrl.push(TutorialPage)
  }

}