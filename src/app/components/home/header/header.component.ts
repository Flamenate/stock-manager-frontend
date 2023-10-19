import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  darkMode: boolean = true;

  toggleDarkMode() {
    this.darkMode = !this.darkMode;

    if (document.documentElement.classList.contains('dark'))
      document.documentElement.classList.remove('dark');
    else document.documentElement.classList.add('dark');
  }
}
