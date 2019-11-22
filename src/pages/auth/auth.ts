import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { TabsPage } from '../tabs/tabs';
import { ProfilePage } from '../profile/profile';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'firebase';
import { UserProvider } from '../../providers/user/user';
import { UserDetails } from '../../interfaces';


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
    private menu: MenuController,
    private afs: AngularFirestore,
    private user: UserProvider ) {
  }

  ionViewDidLoad() {
   //do nothing
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

  //login by mail
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
    //this.startApp();
  }

  completeProfile() {
    this.navCtrl.push(ProfilePage)
  }

  startApp() {
    this.openMainPage();
    // this.user.doUserHaveFullDetails().then(res=>{
    //   if(res === true){
    //     console.log('user have full details');
    //     this.openMainPage();
    //   }else{
    //     console.log('use do not have full details');
        
    //     this.completeProfile();
    //   }
    // })
  }

  openMainPage(){
    this.navCtrl.push(TabsPage)
    // enable the root left menu when starting
    this.menu.enable(true);
  }

}
