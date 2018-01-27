import { Storage } from '@ionic/storage';
import { TutorialPage } from './../pages/tutorial/tutorial';
import { DrugProvider } from './../providers/drug/drug';
import { InvitePage } from './../pages/invite/invite';
import { SettingsPage } from './../pages/settings/settings';

import { AboutPage } from './../pages/about/about';
import { PartnersPage } from './../pages/partners/partners';
import { TabsPage } from './../pages/tabs/tabs';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { OneSignal } from '@ionic-native/onesignal';

const wait = (ms) => new Promise(r => setTimeout(r, ms))


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;


  rootPage: any;
  menuPages = [
    { title: "Home", component: TabsPage, icon: "home" },
    { title: "Partners", component: PartnersPage, icon: "cash" },
    { title: "Settings", component: SettingsPage, icon: "cog" },
    { title: "Invite Your Friends 👌", component: InvitePage, icon: "share" },
    { title: "About", component: AboutPage, icon: "bug" }
  ]
  firstTime: boolean;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private ga: GoogleAnalytics,
    private oneSignal: OneSignal,
    private drugProvider: DrugProvider,
    private events: Events,
    public storage: Storage
  ) {
      this.firstTime = true;
     // Check if the user has already seen the tutorial
     // Careful this is string or null so string is always true;
     this.storage.get('hasSeenTutorial')
     .then((hasSeenTutorial) => {
       if (hasSeenTutorial) {
         //so it's not first time
         //go to main page directly
         this.rootPage = TabsPage;
         //set flag to false
         this.firstTime = false;
       } else {
         //first time
         this.rootPage = TutorialPage;
       }
       this.platformReady()
     });
  }

  platformReady() {
    // Call any initial plugins when ready
      this.platform.ready().then(() => {
        if(this.platform.is('cordova')){
          //hide splash
          setTimeout(()=>{
            this.splashScreen.hide();
          },2000)
          this.statusBar.styleDefault();
          //google analytics
          this.startAnalytics();
          //oneSignal
          this.startPushService();

        }
        this.listenToEvents();
        this.startBackgroundJobs();

    })
  }

  startBackgroundJobs(){
    //for better UX
    if(this.firstTime){
      //load default data //todo:get user country and langauge
      this.drugProvider.getAndStoreDrugsByDefaultCountry().subscribe();
    }
  }


  startAnalytics(){
    //start getting analytics
    this.ga.startTrackerWithId('UA-88642709-1')
    .then(() => {
      console.log('Google analytics is ready now');
    })
    .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  startPushService(){
      //start registring and getting pushs
      this.oneSignal.startInit("daaa8674-68e2-49a3-aa58-3844d767a9aa", "1061030166084");
      this.oneSignal.handleNotificationReceived().subscribe((jsonData) => {
        console.log(JSON.stringify(jsonData));
      });

      this.oneSignal.handleNotificationOpened().subscribe((jsonData) => {
        // do something when a notification is opened
        console.log(JSON.stringify(jsonData));
      });

      this.oneSignal.endInit();
  }

  listenToEvents() {
    this.events.subscribe('country:changed', (c) => {
      console.log('country:changed getAndStoreDrugs for ' + c);
      this.drugProvider.getAndStoreDrugsByDefaultCountry().subscribe();
    })
  }


  //menu view method
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

//todo:make app color changeable and localizable
//todo:add user rating intellegience and feedback
//todo: better market MEO
//todo: change app licence for open source
//todo: reduce app size by optimizing resources folder ionic cordova resources not very optimized
//todo: app upload autimation
//todo: cross-walk support for lower api than 19 > second apk than normal one
//todo: push updates to appstore
//todo: handle user segments
//todo: fix history bugs and rename it and add more functionality
//tood: add the ability to write prescription and scan drugs
//todo: add the ability to enter drug by camera or voice
//todo: fix undefined when click seachbar clear button
//todo: optimize resources generation > 
//todo: active-user counting implementation
//todo: fix undefined when after firing cancel event
//todo: edit report templates
//todo: be more ready for pwa