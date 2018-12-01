// change alert in browser behavior
export const messNative = () => {
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
}