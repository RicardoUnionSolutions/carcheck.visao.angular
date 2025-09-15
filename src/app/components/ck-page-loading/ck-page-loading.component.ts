import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ck-page-loading',
  templateUrl: './ck-page-loading.component.html',
  styleUrls: ['./ck-page-loading.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CkPageLoadingComponent {
  @Input() loading: boolean = false;
  @Input() text: string = 'Carregando...';
}
