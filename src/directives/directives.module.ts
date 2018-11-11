import { NgModule } from '@angular/core';
import { ColorDirective } from './color/color';
import { BackgroundColorDirective } from './background-color/background-color';
@NgModule({
	declarations: [ColorDirective,
    BackgroundColorDirective],
	imports: [],
	exports: [ColorDirective,
    BackgroundColorDirective]
})
export class DirectivesModule {}
