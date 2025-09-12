import { Component, input, output, HostBinding, ViewEncapsulation } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  type = input<ButtonType>('button');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  fullWidth = input<boolean>(false);
  icon = input<string>('');
  iconPosition = input<'left' | 'right'>('left');

  clicked = output<Event>();

  @HostBinding('class')
  get hostClasses(): string {
    return [
      'app-button',
      `app-button--${this.variant()}`,
      `app-button--${this.size()}`,
      this.fullWidth() ? 'app-button--full-width' : '',
      this.disabled() ? 'app-button--disabled' : '',
      this.loading() ? 'app-button--loading' : ''
    ].filter(Boolean).join(' ');
  }

  onClick(event: Event): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}
