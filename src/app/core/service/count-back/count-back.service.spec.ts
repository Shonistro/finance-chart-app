import { TestBed } from '@angular/core/testing';
import { CountBackService } from './count-back.service';
import { provideHttpClient } from '@angular/common/http';


describe('CountBackService', () => {
  let service: CountBackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(CountBackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
