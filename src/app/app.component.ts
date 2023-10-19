import { Component, OnInit, inject } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<router-outlet></router-outlet>`,
  imports: [HomeComponent, RouterModule],
})
export class AppComponent implements OnInit {
  title = 'Hassen';
  userService: UserService = inject(UserService);
  cookieService: CookieService = inject(CookieService);

  constructor() {}

  ngOnInit(): void {
    initFlowbite();
  }
}
