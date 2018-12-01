import { TutorialPage } from './../pages/tutorial/tutorial';
import { InvitePage } from './../pages/invite/invite';
import { SettingsPage } from './../pages/settings/settings';
import { AboutPage } from './../pages/about/about';
import { PartnersPage } from './../pages/partners/partners';
import { SponsorsPage } from './../pages/sponsors/sponsors';
import { InteractionsPage } from './../pages/interactions/interactions';
import { DrugDetails } from './../pages/drug-details/drug-details';
import { DrugsPage } from './../pages/drugs/drugs';
import { TabsPage } from './../pages/tabs/tabs';
import { Keyboard } from '@ionic-native/keyboard';
import { BrowserModule } from '@angular/platform-browser';


import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { GoogleAnalytics } from '@ionic-native/google-analytics';

import { SettingsProvider } from '../providers/settings/settings';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DrugProvider } from '../providers/drug/drug';
import { PartnerProvider } from '../providers/partner/partner';
import { IonicStorageModule } from '@ionic/storage';


import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DirectivesModule } from '../directives/directives.module';
import { SplashPage } from '../pages/splash/splash';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { AuthProvider } from '../providers/auth/auth';
import { firebaseConfig } from './config';
import { Facebook } from '@ionic-native/facebook';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { PharmaciesPage } from '../pages/pharmacies/pharmacies';
import { PharmacyProvider } from '../providers/pharmacy/pharmacy';
import { PharmacyDetailsPage } from '../pages/pharmacy-details/pharmacy-details';
import { Push } from '@ionic-native/push';
import { GooglePlus } from '@ionic-native/google-plus';
import { PushProvider } from '../providers/push/push';

import { OneSignal } from '@ionic-native/onesignal';
import { AnalyticsProvider } from '../providers/analytics/analytics';
import { AuthPage } from '../pages/auth/auth';
import { ComponentsModule } from '../components/components.module';
import { ProfilePage } from '../pages/profile/profile';
import { UserProvider } from '../providers/user/user';



// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    './assets/i18n/', // or whatever path you're using
    '.json'
  );
}








@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    DrugsPage,
    DrugDetails,
    InteractionsPage,
    SponsorsPage,
    PartnersPage,
    AboutPage,
    SettingsPage,
    InvitePage,
    TutorialPage,
    SplashPage,
    PharmaciesPage,
    PharmacyDetailsPage,
    AuthPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
    }, {
        links: [
          { component: TabsPage, name: 'TabsPage', segment: 'home' },
          { component: DrugsPage, name: 'DrugsPage', segment: 'drugs' },
          { component: DrugDetails, name: 'DrugDetail', segment: 'drugs/:id' },
          { component: InteractionsPage, name: 'InteractionsPage', segment: 'interactions' },
          { component: PartnersPage, name: 'PartnersPage', segment: 'partners' },
          { component: SponsorsPage, name: 'SponsorsPage', segment: 'sponsors' },
          { component: SettingsPage, name: 'SettingsPage', segment: 'settings' },
          { component: AboutPage, name: 'AboutPage', segment: 'about' },
          { component: InvitePage, name: 'InvitePage', segment: 'invite' },
          { component: TutorialPage, name: 'TutorialPage', segment: 'tutorial' },
          { component: PharmaciesPage, name: 'PharmaciesPage', segment: 'pharmacies' },
          { component: PharmacyDetailsPage, name: 'PharmaciesPage', segment: 'pharmacies/:id' },
          { component: ProfilePage, name: 'ProfilePage', segment: 'profile' },
          { component: AuthPage, name: 'AuthPage', segment: 'auth' }
        ]
      }),
    IonicStorageModule.forRoot({
      name: '__dawaeyapp',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }), //<-add this
    DirectivesModule,
    ComponentsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule // imports firebase/auth, only needed for auth features,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    DrugsPage,
    DrugDetails,
    InteractionsPage,
    SponsorsPage,
    PartnersPage,
    AboutPage,
    SettingsPage,
    InvitePage,
    TutorialPage,
    SplashPage,
    PharmaciesPage,
    PharmacyDetailsPage,
    AuthPage,
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    GoogleAnalytics,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SettingsProvider,
    InAppBrowser,
    DrugProvider,
    PartnerProvider,
    AuthProvider,
    AngularFireAuth,
    AngularFirestore,
    AngularFireDatabase,
    Facebook,
    PharmacyProvider,
    Push,
    Facebook,
    GooglePlus,
    PushProvider,
    OneSignal,
    AnalyticsProvider,
    UserProvider,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
