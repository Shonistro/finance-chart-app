import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Providers } from '../../../shared/interface/providers.interface';
import { KindsResponse } from '../../../shared/interface/kind.interface';
import { Exchanges } from '../../../shared/interface/exchanges.interface';
import { InstrumentsResponse } from '../../../shared/interface/instrument.interface';

@Injectable({
  providedIn: 'root',
})
export class ReferenceDataService {
  private http = inject(HttpClient);

  getProviders(): Observable<Providers> {
    const url = '/api/instruments/v1/providers';
    return this.http.get<Providers>(url);
  }

  getKinds(): Observable<KindsResponse> {
    const url = '/api/instruments/v1/kinds';
    return this.http.get<KindsResponse>(url);
  }

  getExchanges(): Observable<Exchanges> {
    const url = '/api/instruments/v1/exchanges';
    return this.http.get<Exchanges>(url);
  }

  getInstruments(provider: string, kind: string): Observable<InstrumentsResponse> {
    const url = '/api/instruments/v1/instruments';
    const params = new HttpParams().set('provider', provider).set('kind', kind);
    return this.http.get<InstrumentsResponse>(url, { params });
  }
} 