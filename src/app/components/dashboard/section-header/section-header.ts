import { Component, input, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-section-header',
  imports: [RouterLink],
  templateUrl: './section-header.html',
  styleUrl: './section-header.css',
})
export class SectionHeader {
  @Input({ required: true }) title!: string
  @Input({ required: true }) route!: string
  @Input({ required: true }) imgRoute!: string
}
