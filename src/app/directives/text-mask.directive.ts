import {
  Directive,
  Input,
  ElementRef,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import { createTextMaskInputElement } from 'text-mask-core';

@Directive({
  selector: '[textMask]',
  standalone: true
})
export class TextMaskDirective implements OnInit, OnDestroy, OnChanges {
  @Input('textMask') textMask: any;
  
  private textMaskInputElement: any;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.createMask();
  }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    if (this.textMaskInputElement) {
      this.textMaskInputElement.update(event.target.value);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['textMask'] && !changes['textMask'].firstChange) {
      this.destroyMask();
      this.createMask();
    }
  }

  ngOnDestroy() {
    this.destroyMask();
  }

  private createMask() {
    if (this.textMask && this.textMask.mask) {
      this.textMaskInputElement = createTextMaskInputElement({
        inputElement: this.elementRef.nativeElement,
        mask: this.textMask.mask,
        guide: this.textMask.guide || false,
        placeholderChar: this.textMask.placeholderChar || '_',
        keepCharPositions: this.textMask.keepCharPositions || false,
        showMask: this.textMask.showMask || false
      });
    }
  }

  private destroyMask() {
    if (this.textMaskInputElement) {
      // Verifica se o método destroy existe antes de chamá-lo
      if (typeof this.textMaskInputElement.destroy === 'function') {
        this.textMaskInputElement.destroy();
      }
      this.textMaskInputElement = null;
    }
  }
}
