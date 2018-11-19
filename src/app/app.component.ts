import { Storage } from "@ionic/storage";
import { TutorialPage } from "./../pages/tutorial/tutorial";
import { DrugProvider } from "./../providers/drug/drug";
import { InvitePage } from "./../pages/invite/invite";
import { SettingsPage } from "./../pages/settings/settings";

import { AboutPage } from "./../pages/about/about";
import { PartnersPage } from "./../pages/partners/partners";
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
import { PharmaciesPage } from "../pages/pharmacies/pharmacies";
import { FcmProvider } from "../providers/fcm/fcm";


const wait = ms => new Promise(r => setTimeout(r, ms));
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
    private ga: GoogleAnalytics,
    private drugProvider: DrugProvider,
    private events: Events,
    public storage: Storage,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private translate: TranslateService,
    public actionCtrl: ActionSheetController,
    public authProvider: AuthProvider,
    private afAuth: AngularFireAuth,
    private fcm: FcmProvider
  ) {
    this.matColors = {
      red: {
        "primary": "#B71C1C",
        "secondary": "#E53935",
      },
      pink: {
        "primary": "#880E4F",
        "secondary": "#D81B60",
      },
      purple: {
        "primary": "#4A148C",
        "secondary": "#8E24AA",
      },
      deepPurple: {
        "primary": "#311B92",
        "secondary": "#5E35B1",
      },
      indigo: {
        "primary": "#1A237E",
        "secondary": "#3949AB",
      },
      blue: {
        "primary": "#0D47A1",
        "secondary": "#1E88E5",
      },
      lightBlue: {
        "primary": "#01579B",
        "secondary": "#039BE5",
      },
      cyan: {
        "primary": "#006064",
        "secondary": "#00ACC1",
      },
      teal: {
        "primary": "#004D40",
        "secondary": "#00897B",
      },
      green: {
        "primary": "#1B5E20",
        "secondary": "#43A047",
      },
      lightGreen: {
        "primary": "#33691E",
        "secondary": "#7CB342",
      },
      lime: {
        "primary": "#827717",
        "secondary": "#C0CA33",
      },
      yello: {
        "primary": "#F57F17",
        "secondary": "#FDD835",
      },
      amber: {
        "primary": "#FF6F00",
        "secondary": "#FFB300",
      },
      orange: {
        "primary": "#E65100",
        "secondary": "#FB8C00",
      },
      deepOrange: {
        "primary": "#BF360C",
        "secondary": "#F4511E",
      },
      brown: {
        "primary": "#3E2723",
        "secondary": "#6D4C41",
      },
      gray: {
        "primary": "#212121",
        "secondary": "#757575",
      },
      blueGray: {
        "primary": "#263238",
        "secondary": "#546E7A",
      }
    };
    this.platformReady();
  }

  async recoverRememberedState() {
    //get saved user
    const savedUser: User = await this.storage.get('user')
    if (savedUser && savedUser.displayName && savedUser.displayName.length) {
      this.rootPage = TabsPage;
      this.user = savedUser;
    } else {
      this.rootPage = TutorialPage
    }

    //get saved color
    const savedColor: string = await this.storage.get("color")
    if (savedColor && savedColor.length) {
      root.style.setProperty(`--color-primary`, this.matColors[savedColor].primary);
      root.style.setProperty(`--color-secondary`, this.matColors[savedColor].secondary);
    }

    //get saved language
    const savedLanguage: string = await this.storage.get('language')
    if (savedLanguage && savedLanguage.length) {
      this.translate.use(savedLanguage)
    }
  }

  logOut() {
    this.storage.remove('user')

    this.authProvider.afAuth.auth.signOut()
      .then(() => {
        this.platform.exitApp()
      })
      .catch((err) => {
        alert(err)
      })

  }

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
      let splash = this.modalCtrl.create(SplashPage, undefined, { cssClass: "modal-fullscreen" });
      splash.present();
      this.listenToEvents();
      this.startBackgroundJobs();


      //change alert behavior
      (() => {
        window.alert = null;
        window.alert = (msg) => {
          console.warn(msg)
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

  startAnalytics() {
    //start getting analytics
    this.ga
      .startTrackerWithId("UA-88642709-1")
      .then(() => {
        console.log("Google analytics is ready now");
      })
      .catch(e => console.log("Error starting GoogleAnalytics", e));
  }

  startPushService() {
    //start registring and getting pushs
    // Get a FCM token
    this.fcm.getToken()

    // Listen to incoming messages
    this.fcm.listenToNotifications().subscribe((data:any)=>{
      alert(data.message)
    })
  }

  startCheckingForUpdates() {
    this.drugProvider.checkForUpdates().subscribe();
  }

  listenToEvents() {
    this.events.subscribe("country:changed", c => {
      console.log("country:changed getAndStoreDrugs for " + c);
      this.drugProvider.getAndStoreDrugsByDefaultCountry().subscribe();
    });
    this.events.subscribe("user:login", user => {
      console.log("user has logined", user);
      if (user) {
        this.user = this.afAuth.auth.currentUser
      } else {
        this.storage.get('user').then(res => {
          this.user = res;
        })
      }

    });
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
//TODO: change app licence for open source
//TODO: reduce app size by optimizing resources folder ionic cordova resources not very optimized
//TODO: app upload autimation
//TODO: cross-walk support for lower api than 19 > second apk than normal one
//TODO: push updates to appstore
//TODO: handle user segments
//TODO: fix history bugs and rename it and add more functionality
//TODO: add the ability to write prescription and scan drugs
//TODO: add the ability to enter drug by camera or voice
//TODO: fix undefined when click seachbar clear button
//TODO: optimize resources generation >
//TODO: active-user counting implementation
//TODO: fix undefined when after firing cancel event
//TODO: edit report templates
//TODO: be more ready for pwa
//TODO: Charge ppl outside egypt
//TODO: share ability
