import { Storage } from "@ionic/storage";
import { TutorialPage } from "./../pages/tutorial/tutorial";
import { DrugProvider } from "./../providers/drug/drug";
import { TabsPage } from "./../pages/tabs/tabs";
import { Component, ViewChild } from "@angular/core";
import { Nav, Platform, Events, ModalController, AlertController, ActionSheetController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { GoogleAnalytics } from "@ionic-native/google-analytics";
import { SplashPage } from "../pages/splash/splash";
import { TranslateService } from "@ngx-translate/core";
import { AuthProvider } from "../providers/auth/auth";
import { User } from "firebase";
import firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { matColors } from "./global";
import { AnalyticsProvider } from "../providers/analytics/analytics";
import { PushProvider } from "../providers/push/push";
import { PharmaciesPage } from "../pages/pharmacies/pharmacies";
import { PartnersPage } from "../pages/partners/partners";
import { SettingsPage } from "../pages/settings/settings";
import { InvitePage } from "../pages/invite/invite";
import { AboutPage } from "../pages/about/about";
import { AuthPage } from "../pages/auth/auth";

const root = document.documentElement;
export interface MaterialColors {
  [key: string]: MaterialColor
}
export interface MaterialColor {
  primary: string;
  secondary: string;
}

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;
  rootPage: any;
  menuPages = [
    {
      title: "Home",
      component: TabsPage,
      icon: "home"
    },
    {
      title: "Nearby Pharmacies",
      component: PharmaciesPage,
      icon: "medkit"
    },
    {
      title: "Partners",
      component: PartnersPage,
      icon: "cash"
    },
    {
      title: "Settings",
      component: SettingsPage,
      icon: "cog"
    },
    {
      title: "Invite Your Friends",
      component: InvitePage,
      icon: "share"
    },
    {
      title: "About",
      component: AboutPage,
      icon: "information-circle"
    }
  ];
  firstTime: boolean;
  matColors: MaterialColors;
  user: firebase.User;
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private drugProvider: DrugProvider,
    private events: Events,
    public storage: Storage,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private translate: TranslateService,
    public actionCtrl: ActionSheetController,
    public authProvider: AuthProvider,
    private afAuth: AngularFireAuth,
    private analytics: AnalyticsProvider,
    private push: PushProvider
  ) {
    this.matColors = matColors;
    this.platformReady();
  }

  async recoverRememberedState() {
    /*****************remember saved user*****************/
    const savedUser: User = await this.storage.get('user')
    if (savedUser && savedUser.displayName && savedUser.displayName.length) {
      this.rootPage = TabsPage;
      this.user = savedUser;
    } else {
      this.rootPage = TutorialPage
    }
    /*******************remember saved color*******************/
    const savedColor: string = await this.storage.get("color")
    if (savedColor && savedColor.length) {
      root.style.setProperty(`--color-primary`, this.matColors[savedColor].primary);
      root.style.setProperty(`--color-secondary`, this.matColors[savedColor].secondary);
    }
    /********************remember saved language********************/
    const savedLanguage: string = await this.storage.get('language')
    if (savedLanguage && savedLanguage.length) {
      this.translate.use(savedLanguage)
    }
  }
  //logout button
  logOut() {
    this.authProvider.signOut()
      .then(() => {
        this.platform.exitApp()
      })
      .catch((err) => {
        alert(err)
      })
  }
  //is platform ready? all things are loaded?
  platformReady() {
    // Call any initial plugins when ready
    this.platform.ready().then(async () => {
      //platform is ready?
      await this.recoverRememberedState();
      //is it cordova?
      if (this.platform.is("cordova")) {
        //change status bar color
        if (this.platform.is("android")) {
          //set statusbar color to match theme
          this.statusBar.backgroundColorByHexString("#7b1fa2");
          const savedColor: string = await this.storage.get("color")
          if (savedColor) {
            this.statusBar.backgroundColorByHexString(this.matColors[savedColor].primary);
          }
        }
        //google analytics
        this.startAnalytics();
        //fcm
        this.startPushService();
      }

      //PWA splash
      let splash = this.modalCtrl.create(SplashPage, undefined, { cssClass: "modal-fullscreen" });
      splash.present();

      //Listen to app events
      this.listenToEvents();
      //Start app background intelligent jobs
      this.startBackgroundJobs();

      //change alert in browser behavior
      (() => {
        window.alert = null;
        window.alert = (msg) => {
          console.warn(msg)
          if (!msg || msg.length === 0) return;
          const alert = this.alertCtrl.create({
            title: 'Info!',
            subTitle: msg,
            buttons: ['OK']
          });
          alert.present();
        }
      })()
      //end platform ready
    });
    //careful doing something before ready
  }

  startBackgroundJobs() {
    //for better UX
    //load data at first time app launch
    //not has seen tutorial === first time
    if (localStorage.hasSeenTutorial !== "true") {
      //load default data //TODO:get user country and langauge
      this.drugProvider.getAndStoreDrugsByDefaultCountry().subscribe();
    } else {
      this.startCheckingForUpdates();
    }
  }

  //Start behaviour analytics jobs
  startAnalytics() {
    this.analytics.setup();
  }

  //Start push notification services
  startPushService() {
    this.push.handleNotifications()
      .subscribe(res => {
        alert(res.notification.data)
      }, err => {
        alert(err)
      })
  }

  //Check for new updates?
  startCheckingForUpdates() {
    this.drugProvider.checkForUpdates().subscribe();
  }

  //Listen to App Events
  listenToEvents() {
    /*************country change event*************/
    this.events.subscribe("country:changed", c => {
      this.drugProvider.getAndStoreDrugsByDefaultCountry().subscribe();
    });
    /***************user login event****************/
    this.events.subscribe("user:login", user => {
      if (user) {
        this.user = this.afAuth.auth.currentUser
      } else {
        this.storage.get('user').then(res => {
          this.user = res;
        })
      }
    });
    /**************app color change event***************/
    this.events.subscribe("color:changed", (color) => {
      root.style.setProperty(`--color-primary`, this.matColors[color].primary);
      root.style.setProperty(`--color-secondary`, this.matColors[color].secondary);
      this.statusBar.backgroundColorByHexString(this.matColors[color].primary);
    });
  }

  //menu view method
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

//TODO: add user rating intellegience and feedback
//TODO: better market MEO
//TODO: app upload automation
//TODO: cross-walk support for lower api than 19 > second apk than normal one
//TODO: handle user segments
//TODO: add the ability to write prescription and scan drugs
//TODO: add the ability to enter drug by camera or voice
//TODO: active-user counting implementation
//TODO: Charge ppl outside egypt
//TODO: add share ability
