import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[onlyLetters]'
})
export class OnlyLettersDirective {

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);

    if (charCode >= 48 && charCode <= 57) {
      event.preventDefault();
    }
  }
}
