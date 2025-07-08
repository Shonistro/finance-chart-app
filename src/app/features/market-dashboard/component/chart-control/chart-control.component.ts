import { Component, output, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  INTERVAL_OPTIONS,
  PERIODICITY_OPTIONS,
  BARS_COUNT_OPTIONS,
} from '../../../../shared/interface/charts-constant.model';
import { ChartSettings } from '../../../../shared/interface/count-back.interface';

@Component({
  selector: 'app-chart-control',
  imports: [CommonModule, FormsModule],
  templateUrl: './chart-control.component.html',
  styleUrl: './chart-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartControl {
  settings = input.required<ChartSettings>();

  settingsChange = output<ChartSettings>();
  refresh = output<void>();

  readonly intervalOptions = INTERVAL_OPTIONS;
  readonly periodicityOptions = PERIODICITY_OPTIONS;
  readonly barsCountOptions = BARS_COUNT_OPTIONS;

  onChangeInterval(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.settingsChange.emit({
      ...this.settings(),
      interval: value,
    });
  }

  onChangePeriodicity(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.settingsChange.emit({
      ...this.settings(),
      periodicity: value,
    });
  }

  onChangeBarsCount(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.settingsChange.emit({
      ...this.settings(),
      barsCount: value,
    });
  }

  onRefresh(): void {
    this.refresh.emit();
  }
}
