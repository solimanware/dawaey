import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { TabsPage } from '../tabs/tabs';


@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
})
export class AuthPage {
  email: string = '';
  password: string = '';
  segment: string = "login";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthProvider,
    private menu: MenuController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuthPage');
    this.auth.trySilent()
      .then(res => {
        this.startApp();
      })
      .catch(err => {
        console.log(err);
      });
  }

  loginGoogle() {
    this.auth.loginGoogle()
      .then(res => {
        this.startApp();
      })
      .catch(err => {
        console.log(err);
      });
  }
  loginFacebook() {
    this.auth.loginFacebook()
      .then(res => {
        this.startApp();
      })
      .catch(err => {
        console.log(err);
      })
  }
  login() {
    this.auth.login(this.email, this.password)
      .then(res => {
        this.startApp();
      })
      .catch(err => {
        console.log(err);
      })

  }
  signup() {
    this.auth.signup(this.email, this.password)
      .then(res => {
        this.startApp();
      })
      .catch(err => {
        console.log(err);
      })
  }

  guestLogin() {
    this.startApp();
  }

  startApp() {
    this.navCtrl.push(TabsPage)
    // enable the root left menu when starting
    this.menu.enable(true);

  }

}
