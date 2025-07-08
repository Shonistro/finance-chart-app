import { Injectable } from '@angular/core';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  ChartOptions,
  DeepPartial,
  ColorType,
  LineSeries,
  HistogramSeries,
} from 'lightweight-charts';
import { CHART_COLORS } from '../../../../../shared/interface/charts-constant.model';

@Injectable({
  providedIn: 'root',
})
export class ChartConfig {
  createChart(container: HTMLElement): IChartApi {
    const chartOptions: DeepPartial<ChartOptions> = {
      width: container.clientWidth,
      height: 400,
      layout: {
        background: { type: ColorType.Solid, color: CHART_COLORS.background },
        textColor: CHART_COLORS.textColor,
      },
      grid: {
        vertLines: { color: CHART_COLORS.gridLines },
        horzLines: { color: CHART_COLORS.gridLines },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: CHART_COLORS.gridLines,
      },
      rightPriceScale: {
        borderColor: CHART_COLORS.gridLines,
      },
      handleScroll: {
        vertTouchDrag: false,
      },
    };

    return createChart(container, chartOptions);
  }

  addLineSeries(chart: IChartApi): ISeriesApi<'Line'> {
    return chart.addSeries(LineSeries, {
      color: CHART_COLORS.lineColor,
      lineWidth: 2,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      lastValueVisible: true,
      priceLineVisible: true,
      priceFormat: {
        type: 'price',
        precision: 4,
        minMove: 0.0001
      }
    });
  }

  addVolumeSeries(chart: IChartApi): ISeriesApi<'Histogram'> {
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: CHART_COLORS.volumeUpColor,
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'volume',
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
      visible: true,
    });

    return volumeSeries;
  }

  setupResizeHandler(
    chart: IChartApi,
    container: HTMLElement,
    onResize?: () => void
  ): () => void {
    const handleResize = () => {
      if (chart && container) {
        chart.applyOptions({
          width: container.clientWidth,
        });

        if (onResize) onResize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }
}
