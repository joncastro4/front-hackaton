import { Component, OnInit } from '@angular/core';
import { TestService } from '../../services/test-service';

@Component({
  selector: 'app-test',
  imports: [],
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class Test implements OnInit {
  constructor(
    private testService: TestService
  ) {}

  ngOnInit(): void {
    console.log(this.testService.getCharacters())
  }
}
