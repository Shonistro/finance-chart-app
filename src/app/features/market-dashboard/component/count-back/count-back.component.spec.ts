import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountBack } from './count-back.component';
import { provideHttpClient } from '@angular/common/http';

@Component({
  template: `
    <app-count-back
      [instrumentId]="instrumentId"
      [provider]="provider"
      [interval]="interval"
      [periodicity]="periodicity"
      [barsCount]="barsCount"
    ></app-count-back>
  `,
  standalone: true,
  imports: [CountBack]
})
class HostTestComponent {
  instrumentId = 'mock-instrument';
  provider = 'mock-provider';
  interval = 1;
  periodicity = 'minute';
  barsCount = 100;
}

describe('CountBack', () => {
  let fixture: ComponentFixture<HostTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostTestComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(HostTestComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    const countBackInstance = fixture.debugElement.children[0].componentInstance;
    expect(countBackInstance).toBeTruthy();
  });
});
