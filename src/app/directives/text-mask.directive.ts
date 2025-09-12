import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[textMask]',
  standalone: true
})
export class TextMaskDirective {
  @Input('textMask') textMask: any;
}
