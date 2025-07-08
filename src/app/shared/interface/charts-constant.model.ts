import { SelectOption, ChartSettings } from '../interface/count-back.interface';

export const INTERVAL_OPTIONS: SelectOption<number>[] = [
  { value: 1, label: '1' },
  { value: 5, label: '5' },
  { value: 15, label: '15' },
  { value: 30, label: '30' },
  { value: 60, label: '60' },
];

export const PERIODICITY_OPTIONS: SelectOption<string>[] = [
  { value: 'second', label: 'Second' },
  { value: 'minute', label: 'Minute' },
  { value: 'hour', label: 'Hour' },
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

export const BARS_COUNT_OPTIONS: SelectOption<number>[] = [
  { value: 10, label: '10' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
  { value: 200, label: '200' },
];

export const DEFAULT_CHART_SETTINGS: ChartSettings = {
  interval: 1,
  periodicity: 'minute',
  barsCount: 100,
};

export const CHART_COLORS = {
  background: '#1E222D',
  textColor: '#DDD',
  gridLines: '#2B2B43',
  upColor: '#089981',
  downColor: '#F23645',
  lineColor: '#089981',
  volumeUpColor: 'rgba(8, 153, 129, 0.5)',
  volumeDownColor: 'rgba(242, 54, 69, 0.5)',
};
