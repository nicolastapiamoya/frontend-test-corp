// ─────────────────────────────────────────────────────────────────
// API service — base class con headers Manhattan v4
// ─────────────────────────────────────────────────────────────────

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  protected get<T>(baseUrl: string, path: string, params?: Record<string, string | number>): Observable<T> {
    return this.http.get<T>(`${baseUrl}${path}`, {
      headers: this.manhattanHeaders(),
      params: this.toParams(params)
    });
  }

  protected post<T>(baseUrl: string, path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${baseUrl}${path}`, body, {
      headers: this.manhattanHeaders()
    });
  }

  private manhattanHeaders(): HttpHeaders {
    const traceId = crypto.randomUUID();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Channel': environment.manhattan.channel,
      'X-Commerce': environment.manhattan.commerce,
      'X-Country': environment.manhattan.country,
      'X-Trace-Id': traceId
    });
  }

  private toParams(params?: Record<string, string | number>): HttpParams {
    let p = new HttpParams();
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        p = p.set(k, String(v));
      }
    }
    return p;
  }
}