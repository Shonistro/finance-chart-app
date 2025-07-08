import { TestBed } from '@angular/core/testing';
import { ChartConfig } from './chart-config.service';
import { provideHttpClient } from '@angular/common/http';


describe('ChartConfig', () => {
  let service: ChartConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(ChartConfig);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
