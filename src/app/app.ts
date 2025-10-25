import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardSideNav } from "./components/dashboard/dashboard-side-nav/dashboard-side-nav";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DashboardSideNav],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Protocolo-V');
}
