import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-status-pagamento',
  standalone: true,
  templateUrl: './status-pagamento.component.html',
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StatusPagamentoComponent {
  valorPesquisa = '';
}
