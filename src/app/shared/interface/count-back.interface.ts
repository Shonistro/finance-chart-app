import { UTCTimestamp } from 'lightweight-charts';

export interface ChartData {
  data: ChartsInfo[];
}

export interface ChartsInfo {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

export interface ResponseCountBack {
  instrumentId: string;
  provider: string;
  interval: number;
  periodicity: string;
  barsCount: number;
}

export interface ChartSettings {
  interval: number;
  periodicity: string;
  barsCount: number;
}

export interface SelectOption<T> {
  value: T;
  label: string;
}

export interface LineChartPoint {
  time: UTCTimestamp;
  value: number;
}

export interface VolumeChartPoint {
  time: UTCTimestamp;
  value: number;
  color: string;
}
