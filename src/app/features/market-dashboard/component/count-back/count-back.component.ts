import {
  Component,
  inject,
  signal,
  computed,
  input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  DestroyRef,
  effect,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartManagerService } from '../../../../core/service/chart/char-config/chart-manager/chart-manager.service';
import { WebsocketService } from '../../../../core/service/websocket/websocket.service';
import { L1Update } from '../../../../shared/interface/realtime-update.interface';
import { AuthService } from '../../../../core/service/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-count-back',
  imports: [CommonModule],
  templateUrl: './count-back.component.html',
  styleUrl: './count-back.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountBack implements AfterViewInit, OnDestroy {
  private chartManager = inject(ChartManagerService);
  private destroyRef = inject(DestroyRef);
  private wsService = inject(WebsocketService);
  private auth = inject(AuthService);
  private wsSubscription: any;
  private accessToken = this.auth.getToken();

  instrumentId = input.required<string>();
  provider = input.required<string>();
  interval = input<number>(5);
  periodicity = input<string>('minute');
  barsCount = input<number>(100);

  lastPrice = signal<{ price: number, time: string } | null>(null);
  lastPriceChange = output<{ price: number, time: string }>();
  longLoading = signal(false);

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  chartState = signal(this.chartManager.getCurrentState());
  loading = computed(() => this.chartState().loading);
  error = computed(() => this.chartState().error);
  hasData = computed(() => this.chartManager.hasData());

  private chartInitialized = false;
  private wsSubscriptionDestroy$ = new Subject<void>();

  constructor() {
    
    this.chartManager.state$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        this.chartState.set(state);
        if (state.loading) {
          this.startLongLoadingTimer();
        } else {
          this.longLoading.set(false);
          this.clearLongLoadingTimer();
        }
      });

   
    effect(() => {
      const currentInstrumentId = this.instrumentId();
      const currentProvider = this.provider();
      const currentInterval = this.interval();
      const currentPeriodicity = this.periodicity();
      const currentBarsCount = this.barsCount();

      if (this.chartInitialized && currentInstrumentId && currentProvider) {
        this.chartManager.clearChartData();
        this.loadChartData();
      }
    });

    let prevInstrumentId: string | null = null;
    let prevProvider: string | null = null;

    effect(() => {
      const currentInstrumentId = this.instrumentId();
      const currentProvider = this.provider();

      if (
        currentInstrumentId !== prevInstrumentId ||
        currentProvider !== prevProvider
      ) {
        this.wsSubscriptionDestroy$.next();

        if (prevInstrumentId && prevProvider) {
          this.wsService.send({
            type: 'l1-subscription',
            id: '1',
            instrumentId: prevInstrumentId,
            provider: prevProvider,
            subscribe: false,
            kinds: ['ask', 'bid', 'last']
          });
        }

        if (!this.wsService.isConnected()) {
          this.wsService.connect(this.accessToken || '');
        }

        if (currentInstrumentId && currentProvider) {
          this.wsService.send({
            type: 'l1-subscription',
            id: '1',
            instrumentId: currentInstrumentId,
            provider: currentProvider,
            subscribe: true,
            kinds: ['ask', 'bid', 'last']
          });
          this.wsService.messages$
            .pipe(takeUntil(this.wsSubscriptionDestroy$))
            .subscribe((msg: L1Update) => {
              this.handleRealtimeUpdate(msg);
            });
        }

        prevInstrumentId = currentInstrumentId;
        prevProvider = currentProvider;
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeChart();
    }, 100);
  }

  ngOnDestroy(): void {
    this.chartManager.destroy();
    this.wsService.disconnect();
    this.wsSubscriptionDestroy$.next();
    this.wsSubscriptionDestroy$.complete();
  }

  initializeChart(): void {
    if (!this.chartContainer?.nativeElement) {
      return;
    }
    this.chartManager.initializeChart(this.chartContainer);
    this.chartInitialized = true;
    this.loadChartData();
  }

  loadChartData(): void {
    if (!this.chartInitialized) return;
    this.chartManager.loadChartData(
      {
        instrumentId: this.instrumentId(),
        provider: this.provider(),
        interval: this.interval(),
        periodicity: this.periodicity(),
        barsCount: this.barsCount(),
      },
      this.destroyRef
    );
    this.chartManager.state$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(state => {
      const bars = state.data?.data;
      if (bars && bars.length > 0) {
        const lastBar = bars[bars.length - 1];
        this.lastPrice.set({ price: lastBar.c, time: lastBar.t });
        this.lastPriceChange.emit({ price: lastBar.c, time: lastBar.t });
      } else {
        this.lastPrice.set(null);
        this.lastPriceChange.emit(null as any);
      }
    });
  }

  private handleRealtimeUpdate(msg: L1Update): void {
    if (msg.type !== 'l1-update' || !msg.last) return;
    const newBar = {
      t: msg.last.timestamp,
      o: msg.last.price,
      h: msg.last.price,
      l: msg.last.price,
      c: msg.last.price,
      v: msg.last.volume
    };
    this.chartManager.addRealtimeBar(newBar);
    this.lastPrice.set({ price: msg.last.price, time: msg.last.timestamp });
    this.lastPriceChange.emit({ price: msg.last.price, time: msg.last.timestamp });
  }

  private longLoadingTimeout: any = null;

  private startLongLoadingTimer() {
    this.clearLongLoadingTimer();
    this.longLoadingTimeout = setTimeout(() => {
      this.longLoading.set(true);
    }, 7000);
  }

  private clearLongLoadingTimer() {
    if (this.longLoadingTimeout) {
      clearTimeout(this.longLoadingTimeout);
      this.longLoadingTimeout = null;
    }
  }
}
