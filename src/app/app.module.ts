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
import { OneSignal } from '@ionic-native/onesignal';

import { SettingsProvider } from '../providers/settings/settings';

import { SocialSharing } from '@ionic-native/social-sharing';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DrugProvider } from '../providers/drug/drug';
import { PartnerProvider } from '../providers/partner/partner';
import { IonicStorageModule } from '@ionic/storage';


import { HttpClientModule,HttpClient } from '@angular/common/http';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ColorDirective } from '../directives/color/color';
import { DirectivesModule } from '../directives/directives.module';
import { BackgroundColorDirective } from '../directives/background-color/background-color';
import { SplashPage } from '../pages/splash/splash';



// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
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
    ColorDirective,
    BackgroundColorDirective,
    SplashPage
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
          { component: TutorialPage, name: 'TutorialPage', segment:'tutorial'}
        ]
      }),
      IonicStorageModule.forRoot({
        name: '__dawaeyapp',
        driverOrder: ['indexeddb', 'sqlite', 'websql']
      }), //<-add this
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
    SplashPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    GoogleAnalytics,
    OneSignal,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SettingsProvider,
    SocialSharing,
    InAppBrowser,
    DrugProvider,
    PartnerProvider
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
