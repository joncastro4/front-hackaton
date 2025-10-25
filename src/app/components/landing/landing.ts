import { Component } from '@angular/core';
import { Nav } from "../nav/nav";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-landing',
  imports: [Nav, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {

}
