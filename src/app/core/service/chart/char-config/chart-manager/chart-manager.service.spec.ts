import { TestBed } from '@angular/core/testing';
import { ChartManagerService } from './chart-manager.service';
import { provideHttpClient } from '@angular/common/http';

describe('ChartManagerService', () => {
  let service: ChartManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(ChartManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
