import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChartView } from './features/market-dashboard/component/chart-view/chart-view.component';
 

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChartView],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'finance-chart-app';
}
