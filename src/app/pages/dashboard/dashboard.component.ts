import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Dashboard</h1>
    <p class="hint">Estado de los servicios del stack local.</p>

    <div class="cards">
      <div class="card">
        <h3>api-test-corp-transfers</h3>
        <div *ngIf="transfersHealth; else loadingTransfers" class="health">
          <div class="status-pill" [class.up]="transfersHealth.status === 'UP'" [class.down]="transfersHealth.status === 'DOWN'">
            {{ transfersHealth.status }}
          </div>
          <p><strong>DB:</strong> {{ transfersHealth.db }}</p>
          <p><strong>Go:</strong> {{ transfersHealth.goVersion }}</p>
          <p><strong>Uptime:</strong> {{ transfersHealth.uptime }}</p>
          <p><strong>Memoria:</strong> {{ transfersHealth.memoryMb | number:'1.2-2' }} MB</p>
        </div>
        <ng-template #loadingTransfers>
          <p class="loading">Loading...</p>
        </ng-template>
      </div>

      <div class="card">
        <h3>api-test-corp-loans</h3>
        <div *ngIf="loansHealth; else loadingLoans" class="health">
          <div class="status-pill" [class.up]="loansHealth.status === 'UP'" [class.down]="loansHealth.status === 'DOWN'">
            {{ loansHealth.status }}
          </div>
          <p><strong>DB:</strong> {{ loansHealth.db }}</p>
          <p><strong>Go:</strong> {{ loansHealth.goVersion }}</p>
          <p><strong>Uptime:</strong> {{ loansHealth.uptime }}</p>
          <p><strong>Memoria:</strong> {{ loansHealth.memoryMb | number:'1.2-2' }} MB</p>
        </div>
        <ng-template #loadingLoans>
          <p class="loading">Loading...</p>
        </ng-template>
      </div>
    </div>

    <style>
      h1 { margin: 0 0 8px; font-size: 24px; }
      .hint { color: #6b7280; margin: 0 0 24px; font-size: 14px; }
      .cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .card {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      }
      .card h3 { margin: 0 0 16px; font-size: 14px; color: #374151; }
      .health p { margin: 8px 0; font-size: 13px; }
      .status-pill {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 12px;
      }
      .status-pill.up { background: #d1fae5; color: #065f46; }
      .status-pill.down { background: #fee2e2; color: #991b1b; }
      .loading { color: #9ca3af; }
    </style>
  `
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);

  transfersHealth: any = null;
  loansHealth: any = null;

  ngOnInit() {
    this.fetchHealth(environment.apiTransfersUrl + '/health').then(h => this.transfersHealth = h).catch(() => {});
    this.fetchHealth(environment.apiLoansUrl + '/health').then(h => this.loansHealth = h).catch(() => {});
  }

  private async fetchHealth(url: string): Promise<any> {
    return firstValueFrom(
      this.http.get(url, { headers: new HttpHeaders() })
    );
  }
}