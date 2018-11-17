import { TabsPage } from './../tabs/tabs';
import { Component, ViewChild } from '@angular/core';

import { MenuController, NavController, Slides, Events, Content } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';

import { AngularFirestore} from '@angular/fire/firestore';
import { Drug } from "./../../interfaces";

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
  email: string = '';
  password: string = '';
  segment: string = "login";
  @ViewChild(Content)
  content: Content;

  @ViewChild('slides') slides: Slides;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public storage: Storage,
    public translate: TranslateService,
    private afAuth: AngularFireAuth,
    private authProvider: AuthProvider,
    private events: Events,
    private afs: AngularFirestore
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
  startApp() {
    this.navCtrl.push(TabsPage).then(() => {
      this.storage.set('hasSeenTutorial', 'true');
    })
  }


  loginGoogle() {
    this.afAuth.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        let token = result.credential["accessToken"];
        console.log(result);

        this.loginJobs()
      })
      .catch(function (error) {
        alert(error.message)
      });

  }
  loginFacebook() {
    this.afAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(result => {
        let token = result.credential["accessToken"];
        this.loginJobs()
      })
      .catch(function (error) {
        alert(error.message)
      });

  }

  loginJobs() {
    const user = this.afAuth.auth.currentUser;

    const userInfo: User = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL
    }

    this.afs.
      collection<User>(`users`)
      .doc(user.uid)
      .set({ ...userInfo })
      .then(res => {
        console.log(res);
      }).catch(err => {
        alert(err)
      })
    this.storage.set('user', userInfo)
    this.events.publish('user:login', user)
    this.startApp();
  }

  guestLogin() {
    this.afAuth.auth.signInAnonymously().then(res => {
      console.log(res);
      this.startApp();
    }).catch(err => {
      alert(err)
    })
  }





  login() {
    this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(result => {
        let token = result.credential["accessToken"];
        this.loginJobs()
        this.startApp();

      })
      .catch(function (error) {
        alert(error.message)
      });
  }

  signup() {
    this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then(result => {
        let token = result.credential["accessToken"];
        this.loginJobs()
        this.startApp();

      })
      .catch(function (error) {
        alert(error.message)
      });
  }

  skipToLogin() {
    this.slides.slideTo(3, 100);
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

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }
  showTutorial() {
    this.navCtrl.push(TutorialPage)
  }

}