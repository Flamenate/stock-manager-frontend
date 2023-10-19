import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { LoginComponent } from './components/login/login.component';
import { CompanyDashboardComponent } from './components/company-dashboard/company-dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { loggedInGuard, loggedOutGuard } from './services/auth.guard';

const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Project',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Sign up',
    canActivate: [loggedOutGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
    canActivate: [loggedOutGuard],
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    title: 'Profile',
    canActivate: [loggedInGuard],
  },
  {
    path: 'company/:id',
    component: CompanyDashboardComponent,
    title: 'Company Dashboard',
    canActivate: [loggedInGuard],
  },
  { path: '**', component: NotFoundComponent, title: '404 Not Found' },
];

export default routeConfig;
