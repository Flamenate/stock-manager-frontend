import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderComponent, RouterModule],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  windowScrolled = false;

  constructor() {}

  ngOnInit() {
    window.addEventListener('scroll', () => {
      this.windowScrolled = window.scrollY !== 0;
    });
  }
}
