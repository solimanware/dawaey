import { Directive, Input, ElementRef } from '@angular/core';

/**
 * Generated class for the BackgroundColorDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[backgroundColor]' // Attribute selector
})
export class BackgroundColorDirective {
  @Input() backgroundColor: string;
  constructor(private el: ElementRef) {
    console.log('Hello BackgroundColorDirective Directive');
  }
  ngOnInit(){
    this.el.nativeElement.style.backgroundColor = `var(--color-${this.backgroundColor})`;
  }

}
