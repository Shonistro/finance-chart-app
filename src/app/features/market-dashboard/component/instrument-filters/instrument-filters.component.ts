import {
  Component,
  signal,
  inject,
  output,
  OnInit,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ReferenceDataService } from '../../../../core/service/reference-data/reference-data.service';
import { KindsResponse } from '../../../../shared/interface/kind.interface';
import { Providers } from '../../../../shared/interface/providers.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-instrument-filters',
  imports: [CommonModule, FormsModule],
  templateUrl: './instrument-filters.component.html',
  styleUrl: './instrument-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstrumentFilters implements OnInit {
  private referenceDataService = inject(ReferenceDataService);
  private destroyRef = inject(DestroyRef);

  providers = signal<Providers | null>(null);
  kinds = signal<KindsResponse | null>(null);

  providersLoading = signal(false);
  kindsLoading = signal(false);

  selectedProvider = signal('oanda');
  selectedKind = signal('forex');

  filtersChanged = output<{ provider: string; kind: string }>();

  ngOnInit() {
    this.loadProviders();
    this.loadKinds();

    this.emitFiltersChange();
  }

  private loadProviders() {
    this.referenceDataService.getProviders().subscribe((data) => {
      this.providers.set(data);
    });
  }

  private loadKinds() {
    this.referenceDataService.getKinds().subscribe((data) => {
      this.kinds.set(data);
    });
  }

  onProviderChange(provider: string): void {
    this.selectedProvider.set(provider);
    this.emitFiltersChange();
  }

  onKindChange(kind: string): void {
    this.selectedKind.set(kind);
    this.emitFiltersChange();
  }

  private emitFiltersChange(): void {
    this.filtersChanged.emit({
      provider: this.selectedProvider(),
      kind: this.selectedKind(),
    });
  }
}
