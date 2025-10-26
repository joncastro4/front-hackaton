import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit {
  constructor (
    private authService: AuthService
  ) { }

  isAuthenticated: boolean = false;

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
  }
}
