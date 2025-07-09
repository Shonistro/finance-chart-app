import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ResponseCountBack,
  ChartData,
} from '../../../shared/interface/count-back.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CountBackService {
  private http = inject(HttpClient);

  constructor() {}

  getCountBack(request: ResponseCountBack): Observable<ChartData> {
    const url = `/api/proxy/bars-count-back`;

    const params = new HttpParams()
      .set('instrumentId', request.instrumentId)
      .set('provider', request.provider)
      .set('interval', request.interval.toString())
      .set('periodicity', request.periodicity)
      .set('barsCount', request.barsCount.toString());

    return this.http.get<ChartData>(url, { params });
  }
}
