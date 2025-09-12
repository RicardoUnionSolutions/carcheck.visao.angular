import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[inlineSVG]',
  standalone: true
})
export class InlineSVGDirective implements OnInit {
  @Input('inlineSVG') src: string = '';
  @Input() removeSVGAttributes: string[] = [];

  constructor(private el: ElementRef) {}

  async ngOnInit() {
    if (!this.src) {
      return;
    }
    try {
      const response = await fetch(`/assets/images/svg/${this.src}`);
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'image/svg+xml');
      const svgEl = doc.documentElement;
      this.removeSVGAttributes.forEach(attr => svgEl.removeAttribute(attr));
      this.el.nativeElement.innerHTML = svgEl.outerHTML;
    } catch (err) {
      console.error('inlineSVG load error', err);
    }
  }
}
