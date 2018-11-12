import { Directive, Input, ElementRef } from '@angular/core';
import { Platform } from 'ionic-angular';

/**
 * Generated class for the ColorDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[color]' // Attribute selector
})
export class ColorDirective {
  @Input('color') color: string;
  constructor(private el: ElementRef,private platform:Platform) { }

  ngOnInit() {
    //console.dir(this.el.nativeElement.attributes);
    if(this.color === 'light' && this.platform.is('ios')){
      this.color = 'primary'
      this.el.nativeElement.style.color = `var(--color-${this.color})`;
    }else{
      this.el.nativeElement.style.color = `var(--color-${this.color})`;
    }
    
  }

}


