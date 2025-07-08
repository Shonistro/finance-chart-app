import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstrumentFilters } from './instrument-filters.component';
import { provideHttpClient } from '@angular/common/http';

describe('InstrumentFilters', () => {
  let component: InstrumentFilters;
  let fixture: ComponentFixture<InstrumentFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstrumentFilters],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(InstrumentFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
