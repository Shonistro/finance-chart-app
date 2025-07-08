import {
  Injectable,
  inject,
  DestroyRef,
  ElementRef,
  signal,
  Signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IChartApi, ISeriesApi } from 'lightweight-charts';
import { Observable, BehaviorSubject } from 'rxjs';

import { CountBackService } from '../../../count-back/count-back.service';
import { ChartConfig } from '../chart-config/chart-config.service';
import { ChartDataService } from '../chart-data/chart-data.service';
import {
  ChartData,
  ResponseCountBack,
} from '../../../../../shared/interface/count-back.interface';

export interface ChartState {
  loading: boolean;
  error: string | null;
  data: ChartData | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChartManagerService {
  private countBackService = inject(CountBackService);
  private chartConfig = inject(ChartConfig);
  private chartDataService = inject(ChartDataService);

  private stateSubject = new BehaviorSubject<ChartState>({
    loading: false,
    error: null,
    data: null,
  });

  public state$ = this.stateSubject.asObservable();

  private chart: IChartApi | null = null;
  private lineSeries: ISeriesApi<'Line'> | null = null;
  private volumeSeries: ISeriesApi<'Histogram'> | null = null;
  private resizeCleanup: (() => void) | null = null;

  initializeChart(container: ElementRef<HTMLElement>): void {
    if (!container?.nativeElement) {
      this.setError('Chart container not found');
      return;
    }

    try {
      this.chart = this.chartConfig.createChart(container.nativeElement);

      this.lineSeries = this.chartConfig.addLineSeries(this.chart);
      this.volumeSeries = this.chartConfig.addVolumeSeries(this.chart);

      this.resizeCleanup = this.chartConfig.setupResizeHandler(
        this.chart,
        container.nativeElement
      );

      this.setLoading(false);
    } catch (error) {
      console.error('Error initializing chart:', error);
      this.setError('Ошибка при инициализации графика');
    }
  }

  loadChartData(params: ResponseCountBack, destroyRef: DestroyRef): void {
    this.setLoading(true);
    this.setError(null);

    this.countBackService
      .getCountBack(params)
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe({
        next: (data) => {
          this.setData(data);
          this.updateChart();
          this.setLoading(false);
        },
        error: (error) => {
          console.error('Error loading chart data:', error);
          this.setError('Ошибка загрузки данных');
          this.setLoading(false);
        },
      });
  }

  private updateChart(): void {
    if (!this.chart) {
      this.setError('Chart not initialized');
      return;
    }
    const currentData = this.stateSubject.getValue().data;
    if (!currentData || !currentData.data || currentData.data.length === 0) {
      this.setError('No data to update chart');
      return;
    }

    try {
      const lineData = this.chartDataService.transformLineData(currentData);
      const volumeData = this.chartDataService.transformVolumeData(currentData);

      if (lineData.length === 0) {
        console.warn('No data points to render');
        return;
      }

      this.lineSeries?.setData(lineData);
      this.volumeSeries?.setData(volumeData);

      this.chart.timeScale().fitContent();

    } catch (error) {
      console.error('Error updating chart:', error);
      this.setError('Ошибка при обновлении графика');
    }
  }

  destroy(): void {
    if (this.chart) {
      console.log('Cleaning up chart resources');
      this.chart.remove();
      this.chart = null;
      this.lineSeries = null;
      this.volumeSeries = null;
    }

    if (this.resizeCleanup) {
      this.resizeCleanup();
      this.resizeCleanup = null;
    }
  }

  hasData(): boolean {
    return !!this.stateSubject.value.data?.data?.length;
  }

  getCurrentState(): ChartState {
    return this.stateSubject.value;
  }

  private setLoading(loading: boolean): void {
    this.stateSubject.next({
      ...this.stateSubject.value,
      loading,
    });
  }

  private setError(error: string | null): void {
    this.stateSubject.next({
      ...this.stateSubject.value,
      error,
    });
  }

  private setData(data: ChartData | null): void {
    this.stateSubject.next({
      ...this.stateSubject.value,
      data,
    });
  }
  
  addRealtimeBar(bar: any): void {
    const currentData = this.stateSubject.getValue().data;
    if (!currentData || !currentData.data) return;
    const chartBars = currentData.data;
    const chartBarsMap = new Map<number, any>();
    for (const barItem of chartBars) {
      const barTimestamp = Math.floor(new Date(barItem.t).getTime() / 1000);
      chartBarsMap.set(barTimestamp, barItem);
    }
    const newBarTimestamp = Math.floor(new Date(bar.t).getTime() / 1000);
    chartBarsMap.set(newBarTimestamp, bar);
    const uniqueChartBars = Array.from(chartBarsMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(entry => entry[1]);
    const updatedChartData = { ...currentData, data: uniqueChartBars };
    this.setData(updatedChartData);
    this.updateChart();
  }

  clearChartData(): void {
    this.setData(null);
    this.updateChart();
  }
  
}
