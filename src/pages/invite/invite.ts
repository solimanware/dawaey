import { Component } from "@angular/core";
import { NavController, NavParams, Platform } from "ionic-angular";

@Component({
  selector: "page-invite",
  templateUrl: "invite.html"
})
export class InvitePage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private plt: Platform
  ) {}

  ionViewDidLoad() {}

  openLinkSystemBrowser(link) {
    window.open(link, "_system");
  }

  shareViaFacebook() {
    if (this.plt.is("android") || this.plt.is("ios")) {
      this.openLinkSystemBrowser(
        "https://www.facebook.com/sharer/sharer.php?u=https://dawaey.com"
      );
    }
  }
  shareViaWhatsApp() {
    if (this.plt.is("android") || this.plt.is("ios")) {
      this.openLinkSystemBrowser(
        "whatsapp://send?text=Check.. https://dawaey.com"
      );
    }
  }
}
