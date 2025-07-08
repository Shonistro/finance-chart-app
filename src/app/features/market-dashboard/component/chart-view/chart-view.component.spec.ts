import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartView } from './chart-view.component';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { ChartControl } from '../chart-control/chart-control.component';
 

describe('ChartView', () => {
  let component: ChartView;
  let fixture: ComponentFixture<ChartView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartView],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChartView);
    component = fixture.componentInstance;
    
    const chartControlDebug = fixture.debugElement.query(By.directive(ChartControl));
    if (chartControlDebug) {
      chartControlDebug.componentInstance.settings = {
        interval: 1,
        periodicity: 'minute',
        barsCount: 100
      };
    }

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
