//mess with browser please
import { messNative } from './native-override';
//import native please
import { Storage } from "@ionic/storage";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { OSNotificationOpenedResult, OSNotification } from "@ionic-native/onesignal";
//import pages please
import { TutorialPage } from "./../pages/tutorial/tutorial";
import { SplashPage } from "../pages/splash/splash";
import { TabsPage } from "./../pages/tabs/tabs";
//import providers
import { DrugProvider } from "./../providers/drug/drug";
import { AuthProvider, User } from "../providers/auth/auth";
import { AnalyticsProvider } from "../providers/analytics/analytics";
import { PushProvider } from "../providers/push/push";
//import ionic angular
import { Nav, Platform, Events, ModalController, AlertController, ActionSheetController } from "ionic-angular";
//import angular stuff please
import { AngularFireAuth } from "@angular/fire/auth";
import { Component, ViewChild } from "@angular/core";
//import angular libs
import { TranslateService } from "@ngx-translate/core";
//import globals please
import { matColors } from "./global";
import { sideMenuPages } from './sidemenu';
import { MaterialColors } from '../interfaces';
// get root
const root = document.documentElement;
@Component({
  templateUrl: "app.html"
})
//App Entry Class //This is JavaScript in C# flavor.. this is TypeScript https://www.typescriptlang.org/
export class MyApp {
  @ViewChild(Nav)
  nav: Nav; //nav to avoid circular dipendency
  rootPage: any; //Caution: careful using Page type here (framework bug)
  menuPages = []; //this can't be anything but array
  firstTime: boolean;  // is this first time to visit the app?
  matColors: MaterialColors; // app color choises where we normally use Material Colors
  user: User //user of app interface
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
    // Caution: DONING ANYTHING ABOVE THIS LINE IS DANGEROUS
    this.platformReady();
    this.menuPages = sideMenuPages;
  }
  // Is platform ready? all browser things are loaded?
  platformReady() {
    this.platform.ready().then(async () => {
      //is this cordova platform? give me native plugins please
      if (this.platform.is("cordova")) {
        this.doNativeStuff();
      } else {
        this.doPWAStuff();
      }
      //give me your memory please
      await this.recoverRememberedState();
      //Listen to app events
      this.listenToEvents();
      //Start app background intelligent jobs
      this.startBackgroundJobs();
      //mess normal browser behaviors
      messNative();
      //end platform ready
    });
    //Caution: careful doing something before ready
  }
  //do native stuff while you have power to
  async doNativeStuff(){
    setTimeout(() => {
      //hide splash
      this.splashScreen.hide()
    }, 500);;
    //change status bar color if it's android platform
    if (this.platform.is("android")) {
      this.rememberAndroidStatusColor();
    }
    //google analytics
    this.startAnalytics();
    //fcm
    this.startPushService();
  }

  //is it browser with limited native power?
  doPWAStuff(){
    //PWA splash
    let splash = this.modalCtrl.create(SplashPage, undefined, { cssClass: "modal-fullscreen" });
    splash.present();
  }
  async rememberAndroidStatusColor(){
    //set statusbar color to match theme
    this.statusBar.backgroundColorByHexString("#7b1fa2");
    const savedColor: string = await this.storage.get("color")
    //remember saved color
    if (savedColor) {
      this.statusBar.backgroundColorByHexString(this.matColors[savedColor].primary);
    }
  }

  //recover app state in newer usages
  async recoverRememberedState() {
    await this.rememberSavedUser();
    await this.rememberSavedColor();
    await this.rememberSavedLanguage();
  }

  //do you remember the user?
  async rememberSavedUser(){
    const savedUser: User = await this.storage.get('user');
    if (savedUser && savedUser.logged === true) {
      this.rootPage = TabsPage;
      this.user = savedUser;
    } else {
      this.rootPage = TutorialPage
    }
  }
  //do you remember user color choise?
  async rememberSavedColor(){
    const savedColor: string = await this.storage.get("color")
    if (savedColor && savedColor.length) {
      root.style.setProperty(`--color-primary`, this.matColors[savedColor].primary);
      root.style.setProperty(`--color-secondary`, this.matColors[savedColor].secondary);
    }
  }

  //do you remember use language?
  async rememberSavedLanguage(){
    const savedLanguage: string = await this.storage.get('language')
    if (savedLanguage && savedLanguage.length) {
      this.translate.use(savedLanguage)
    }
  }
  
  //logout please
  logOut() {
    this.authProvider.signOut()
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        alert(err)
      })
  }
  //Starts intelligent backgroud jobs for better user experince
  startBackgroundJobs() {
    //load data at first time app launch
    //not has seen tutorial === first time
    if (localStorage.hasSeenTutorial !== "true") {
      //load default data //TODO:get user country and langauge
      this.drugProvider.getAndStoreDrugsByDefaultCountry().subscribe();
    } else {
      this.startCheckingForUpdates();
    }
  }

  //Starts behaviour analytics jobs
  startAnalytics() {
    this.analytics.setup();
  }

  //Starts push notification services
  startPushService() {
    this.push.init();
    this.push.handleNotificationOpened()
      .subscribe((res: OSNotificationOpenedResult) => {
        alert(res.notification.data)
      }, err => {
        alert(err)
      })
    this.push.handleNotificationReceived()
      .subscribe((res: OSNotification) => {
        alert(res.payload.body)
      }, err => {
        alert(err)
      })
    //important end init
    this.push.endInit();
  }

  //Check for app new updates?
  startCheckingForUpdates() {
    this.drugProvider.checkForUpdates().subscribe();
    //TODO listen for newer pharmacy added
  }

  //Listen to App Events
  listenToEvents() {
    /*************country change event*************/
    this.events.subscribe("country:changed", () => {
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
