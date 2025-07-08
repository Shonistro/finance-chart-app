import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartControl } from './chart-control.component';

@Component({
  template: `
    <app-chart-control [settings]="settings"></app-chart-control>
  `,
  standalone: true,
  imports: [ChartControl]
})
class HostTestComponent {
  settings = {
    interval: 1,
    periodicity: 'minute',
    barsCount: 100
  };
}

describe('ChartControl', () => {
  let fixture: ComponentFixture<HostTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostTestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HostTestComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    const chartControlInstance = fixture.debugElement.children[0].componentInstance;
    expect(chartControlInstance).toBeTruthy();
  });
});
