import {Component, DestroyRef, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { InstrumentsResponse } from '../../../../shared/interface/instrument.interface';
import { ReferenceDataService } from '../../../../core/service/reference-data/reference-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InstrumentFilters } from '../instrument-filters/instrument-filters.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CountBack } from '../count-back/count-back.component';
import {
  INTERVAL_OPTIONS,
  PERIODICITY_OPTIONS,
  BARS_COUNT_OPTIONS,
  DEFAULT_CHART_SETTINGS,
} from '../../../../shared/interface/charts-constant.model';
import { Exchanges } from '../../../../shared/interface/exchanges.interface';
import { Instrument } from '../../../../shared/interface/instrument.interface';

@Component({
  selector: 'app-chart-view',
  imports: [InstrumentFilters, CommonModule, FormsModule, CountBack],
  templateUrl: './chart-view.component.html',
  styleUrl: './chart-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartView {
  private referenceDataService = inject(ReferenceDataService);
  private destroyRef = inject(DestroyRef);

  currentProvider = signal<string>('oanda');
  currentKind = signal<string>('forex');
  instruments = signal<InstrumentsResponse | null>(null);
  loading = signal<boolean>(false);
  exchanges = signal<Exchanges | null>(null);
  exchangesLoading = signal(false);

  selectedInstrumentId = signal<string | null>(null);
  chartInterval = signal<number>(DEFAULT_CHART_SETTINGS.interval);
  chartPeriodicity = signal<string>(DEFAULT_CHART_SETTINGS.periodicity);
  chartBarsCount = signal<number>(DEFAULT_CHART_SETTINGS.barsCount);
  lastPrice = signal<{ price: number, time: string } | null>(null);

  readonly intervalOptions = INTERVAL_OPTIONS;
  readonly periodicityOptions = PERIODICITY_OPTIONS;
  readonly barsCountOptions = BARS_COUNT_OPTIONS;

  constructor() {
    this.loadExchanges();
    this.loadInstruments(this.currentProvider(), this.currentKind());
  }

  onFiltersChanged(filters: { provider: string; kind: string }): void {
    this.currentProvider.set(filters.provider);
    this.currentKind.set(filters.kind);

    this.loadInstruments(filters.provider, filters.kind);

    this.selectedInstrumentId.set(null);
  }

  selectInstrument(instrumentId: string): void {
    this.selectedInstrumentId.set(instrumentId);
  }
 
  updateInterval(interval: number): void {
    this.chartInterval.set(interval);
  }

  updatePeriodicity(periodicity: string): void {
    this.chartPeriodicity.set(periodicity);
  }

  updateBarsCount(barsCount: number): void {
    this.chartBarsCount.set(barsCount);
  }

  onLastPriceChange(priceInfo: { price: number, time: string }): void {
    this.lastPrice.set(priceInfo);
  }

  getInstrumentExchanges(instrument: Instrument): string {
    const exchangesData = this.exchanges();
    if (!exchangesData || !instrument.mappings) return '';
    const provider = this.currentProvider();
    const providerExchanges = exchangesData.data[provider] || [];
    const exchanges = Object.values(instrument.mappings)
      .map(m => m.exchange)
      .filter(e => providerExchanges.includes(e) && e);
    return exchanges.length ? exchanges.join(', ') : '';
  }

  private loadInstruments(provider: string, kind: string): void {
    this.loading.set(true);

    this.referenceDataService
      .getInstruments(provider, kind)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.instruments.set(response);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
        },
      });
  }

  private loadExchanges() {
    this.exchangesLoading.set(true);
    this.referenceDataService.getExchanges().subscribe((data) => {
      this.exchanges.set(data);
      this.exchangesLoading.set(false);
    });
  }
}
