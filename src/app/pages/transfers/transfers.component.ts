import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransfersApi, Transfer, CreateTransferPayload } from '../../services/transfers.api';

@Component({
  selector: 'app-transfers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Transfers</h1>
    <p class="hint">CRUD básico contra api-test-corp-transfers:8081.</p>

    <details class="form-panel">
      <summary>＋ Crear transferencia</summary>
      <form (submit)="onCreate($event)" class="form">
        <div class="row">
          <label>Company Key <input [(ngModel)]="form.companyKey" name="companyKey" required></label>
          <label>Tipo <input [(ngModel)]="form.operationType" name="operationType" required></label>
        </div>
        <div class="row">
          <label>Moneda <input [(ngModel)]="form.currency" name="currency" required></label>
          <label>Monto <input type="number" [(ngModel)]="form.amount" name="amount" required></label>
        </div>
        <div class="row">
          <label>Cuenta origen <input [(ngModel)]="form.sourceAccount" name="sourceAccount"></label>
          <label>RUT beneficiario <input [(ngModel)]="form.beneficiaryRut" name="beneficiaryRut"></label>
        </div>
        <div class="row">
          <label>Destino <input [(ngModel)]="form.destination" name="destination"></label>
          <label>RUT iniciador <input [(ngModel)]="form.initiatorRut" name="initiatorRut"></label>
        </div>
        <button type="submit" [disabled]="creating">{{ creating ? 'Creando...' : 'Crear' }}</button>
        <span *ngIf="createError" class="error">{{ createError }}</span>
      </form>
    </details>

    <div class="table-section">
      <h3>Listado ({{ transfers.length }})</h3>
      <button class="secondary" (click)="loadList()">Refrescar</button>
      <table *ngIf="transfers.length > 0">
        <thead>
          <tr>
            <th>ID</th><th>Company</th><th>Tipo</th><th>Moneda</th><th>Monto</th><th>Status</th><th>Created</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let t of transfers">
            <td><code>{{ t.id.slice(0, 8) }}…</code></td>
            <td>{{ t.companyKey }}</td>
            <td>{{ t.operationType }}</td>
            <td>{{ t.currency }}</td>
            <td>{{ t.amount | number:'1.2-2' }}</td>
            <td><span class="status-{{ t.status }}">{{ t.status }}</span></td>
            <td>{{ t.createdAt | date:'short' }}</td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="transfers.length === 0 && !loading" class="empty">Sin transferencias. Creá una con el form de arriba.</p>
      <p *ngIf="loading" class="loading">Cargando...</p>
    </div>

    <style>
      h1 { margin: 0 0 8px; font-size: 24px; }
      .hint { color: #6b7280; margin: 0 0 24px; font-size: 14px; }
      .form-panel { background: white; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px; }
      .form-panel summary { cursor: pointer; font-weight: 600; }
      .form { margin-top: 16px; display: flex; flex-direction: column; gap: 12px; }
      .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .row label { display: flex; flex-direction: column; font-size: 12px; color: #6b7280; gap: 4px; }
      .error { color: #dc2626; font-size: 13px; margin-left: 12px; }
      .table-section h3 { display: inline-block; margin-right: 12px; }
      .empty { color: #9ca3af; }
      .loading { color: #6b7280; }
      code { font-size: 12px; color: #6b7280; }
    </style>
  `
})
export class TransfersComponent implements OnInit {
  private api = inject(TransfersApi);

  transfers: Transfer[] = [];
  loading = false;
  creating = false;
  createError: string | null = null;

  form: CreateTransferPayload = {
    companyKey: '',
    operationType: 'WIRE_TRANSFER_EXTERNAL',
    currency: 'CLP',
    amount: 0
  };

  ngOnInit() {
    this.loadList();
  }

  loadList() {
    this.loading = true;
    this.api.list().subscribe({
      next: (res) => { this.transfers = res.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onCreate(e: Event) {
    e.preventDefault();
    this.creating = true;
    this.createError = null;
    this.api.create(this.form).subscribe({
      next: () => {
        this.creating = false;
        this.form = { companyKey: '', operationType: 'WIRE_TRANSFER_EXTERNAL', currency: 'CLP', amount: 0 };
        this.loadList();
      },
      error: (err) => {
        this.creating = false;
        this.createError = err?.error?.message || 'Error al crear transferencia';
      }
    });
  }
}