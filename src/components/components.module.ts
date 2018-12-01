import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AdsComponent } from './ads/ads';
@NgModule({
	declarations: [AdsComponent],
	imports: [BrowserModule],
	exports: [AdsComponent]
})
export class ComponentsModule {}
