import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';

export interface Transfer {
  id: string;
  companyKey: string;
  operationType: string;
  currency: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface CreateTransferPayload {
  companyKey: string;
  operationType: string;
  currency: string;
  amount: number;
  sourceAccount?: string;
  beneficiaryRut?: string;
  destination?: string;
  initiatorRut?: string;
}

@Injectable({ providedIn: 'root' })
export class TransfersApi extends ApiService {
  list(companyKey?: string): Observable<{ pagination: any; data: Transfer[] }> {
    return this.get(environment.apiTransfersUrl, '/v1/transfers', companyKey ? { companyKey } : {});
  }

  create(payload: CreateTransferPayload): Observable<Transfer> {
    return this.post(environment.apiTransfersUrl, '/v1/transfers', payload);
  }
}