import { Directive, Input, ElementRef } from '@angular/core';

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
  constructor(private el: ElementRef) { }

  ngOnInit() {
    //console.dir(this.el.nativeElement.attributes);
    this.el.nativeElement.style.color = `var(--color-${this.color})`;
  }

}


