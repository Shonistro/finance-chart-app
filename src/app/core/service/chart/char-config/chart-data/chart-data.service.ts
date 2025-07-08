import { Injectable } from '@angular/core';
import { UTCTimestamp } from 'lightweight-charts';
import {
  ChartData,
  LineChartPoint,
  VolumeChartPoint,
} from '../../../../../shared/interface/count-back.interface';
import { CHART_COLORS } from '../../../../../shared/interface/charts-constant.model';

@Injectable({
  providedIn: 'root',
})
export class ChartDataService {
  transformLineData(chartData: ChartData | null): LineChartPoint[] {
    if (!chartData?.data?.length) return [];

    return chartData.data.map((chartBar) => ({
      time: this.convertToTimestamp(chartBar.t),
      value: chartBar.c,
    }));
  }

  transformVolumeData(chartData: ChartData | null): VolumeChartPoint[] {
    if (!chartData?.data?.length) return [];

    return chartData.data.map((chartBar) => ({
      time: this.convertToTimestamp(chartBar.t),
      value: chartBar.v,
      color:
        chartBar.c >= chartBar.o
          ? CHART_COLORS.volumeUpColor
          : CHART_COLORS.volumeDownColor,
    }));
  }

  private convertToTimestamp(dateString: string): UTCTimestamp {
    return Math.floor(new Date(dateString).getTime() / 1000) as UTCTimestamp;
  }
}
