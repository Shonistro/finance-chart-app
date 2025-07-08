import { TestBed } from '@angular/core/testing';
 
import { ReferenceDataService } from './reference-data.service';
import { provideHttpClient } from '@angular/common/http';

describe('ReferenceDataService', () => {
  let service: ReferenceDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(ReferenceDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
