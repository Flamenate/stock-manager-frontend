import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { User, UserService } from 'src/app/services/user.service';
import { Router, RouterModule } from '@angular/router';
import {
  Company,
  CompanyService,
  PartialCompany,
} from 'src/app/services/company.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Flowbite } from 'src/app/flowbite';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-profile.component.html',
})
@Flowbite()
export class UserProfileComponent implements OnInit {
  currentUser?: User;
  companies: PartialCompany[] = [];
  owners: User[] = [];

  cookieService: CookieService = inject(CookieService);
  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  companyService: CompanyService = inject(CompanyService);

  createCompanyForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });
  isSubmitting: boolean = false;
  errored: boolean = false;
  get canSubmit() {
    return !this.isSubmitting && this.createCompanyForm.valid;
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userId: string = this.authService.getAuthenticatedUserId();
    this.userService
      .getUserById(userId)
      .then((user: User) => {
        this.currentUser = user;
        this.userService
          .getUserCompanies(user._id)
          .then((companies: PartialCompany[]) => {
            this.companies = companies;
            this.userService
              .getUsersById(companies.map((company) => company.owner))
              .then((owners: User[]) => (this.owners = owners));
          });
      })
      .catch((e) => {
        console.error(e);
        this.cookieService.deleteAll();
      });
  }

  logout() {
    this.cookieService.deleteAll();
    this.router.navigate(['']);
  }

  createCompany() {
    this.isSubmitting = true;
    this.companyService
      .createCompany(
        this.createCompanyForm.get('name')!.value,
        this.currentUser!
      )
      .then((company: Company) => {
        this.router.navigate(['/company', company._id]);
      })
      .catch((e) => {
        this.isSubmitting = false;
        this.errored = true;
        console.error(e);
      });
  }
}
