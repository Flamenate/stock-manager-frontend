import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  Company,
  CompanyService,
  Product,
} from 'src/app/services/company.service';
import { Flowbite } from 'src/app/flowbite';
import { User, UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Drawer } from 'flowbite';
import { Subscription, debounceTime } from 'rxjs';

type Tab = 'stock' | 'employees';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-dashboard.component.html',
})
@Flowbite()
export class CompanyDashboardComponent implements AfterViewInit {
  authService: AuthService = inject(AuthService);

  company?: Company;
  companyService: CompanyService = inject(CompanyService);

  stock: Product[] = [];
  employees: User[] = [];

  user?: User;
  userService: UserService = inject(UserService);

  selectedTab: Tab = 'stock';

  perPage: number = 10;
  currentPage: number = 1;
  maxPages: number = 1;

  isSubmitting: boolean = false;

  productDrawer!: Drawer;
  productForm: FormGroup = new FormGroup({
    oldName: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description: new FormControl('', []),
    stock: new FormControl(0, [
      Validators.required,
      Validators.min(0),
      Validators.pattern(/\d+/),
    ]),
    price: new FormControl(0, [
      Validators.required,
      Validators.min(0),
      Validators.pattern(/\d+/),
    ]),
  });
  productFormType: 'add' | 'update' = 'add';
  searchForm: FormGroup = new FormGroup({
    query: new FormControl(''),
  });
  obs!: Subscription;

  @ViewChild('productDrawerDiv', { read: ElementRef }) set productDrawerContent(
    content: ElementRef
  ) {
    if (!content) return;
    this.productDrawer = new Drawer(content.nativeElement, {
      placement: 'right',
      backdrop: true,
    });
  }

  employeeForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  employeeDrawer!: Drawer;

  @ViewChild('employeeDrawerDiv', { read: ElementRef })
  set employeeDrawerContent(content: ElementRef) {
    if (!content) return;
    this.employeeDrawer = new Drawer(content.nativeElement, {
      placement: 'right',
      backdrop: true,
    });
  }

  constructor(private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.obs = this.searchForm.valueChanges
      .pipe(debounceTime(250))
      .subscribe((data) => {
        if (!data) return;

        this.companyService
          .searchProducts(this.company!._id, data.query)
          .then((stock: Product[]) => {
            this.stock = stock;
          });
      });

    this.companyService
      .getCompanyById(this.route.snapshot.paramMap.get('id') as string)
      .then((company: Company) => {
        this.company = company;
        this.stock = company.stock;
        this.maxPages = Math.floor(this.stock.length / this.perPage) + 1;

        this.userService
          .getUsersById(this.company.employees)
          .then((employees: User[]) => {
            this.employees = employees;
          });
      });

    const userId: string = this.authService.getAuthenticatedUserId();
    this.userService.getUserById(userId).then((user: User) => {
      this.user = user;
    });
  }

  changeTab(tab: Tab): void {
    if (this.selectedTab == tab) return;
    this.selectedTab = tab;
    if (this.selectedTab == 'employees') this.searchForm.disable();
    if (this.selectedTab == 'stock') this.searchForm.enable();
  }

  nextPage(): void {
    this.currentPage += 1;
  }

  prevPage(): void {
    this.currentPage -= 1;
  }

  showProductDrawer({
    type,
    product,
  }: {
    type: 'add' | 'update';
    product?: Product;
  }): void {
    this.productFormType = type;
    if (type == 'add') this.productForm.reset();
    else {
      this.productForm.get('oldName')?.setValue(product!.name);
      this.productForm.get('name')?.setValue(product!.name);
      this.productForm.get('description')?.setValue(product!.description);
      this.productForm.get('stock')?.setValue(product!.stock_count);
      this.productForm.get('price')?.setValue(product!.unit_price_euro);
    }
    this.productDrawer.show();
  }

  submitProductForm() {
    this.isSubmitting = true;
    if (this.productFormType == 'add') this.addProduct();
    else this.updateProduct();
  }

  addProduct(): void {
    this.companyService
      .addProduct(this.company!._id.toString(), {
        name: this.productForm.get('name')?.value,
        description: this.productForm.get('description')?.value,
        unit_price_euro: this.productForm.get('price')?.value,
        stock_count: this.productForm.get('stock')?.value,
        image_url: '',
      })
      .then((stock: Product[]) => {
        this.productForm.reset();
        this.stock = stock;
        this.maxPages = Math.ceil(stock.length / this.perPage);
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }

  updateProduct(): void {
    this.companyService
      .editProduct(this.company!._id, this.productForm.get('oldName')?.value, {
        name: this.productForm.get('name')?.value,
        description: this.productForm.get('description')?.value,
        unit_price_euro: this.productForm.get('price')?.value,
        stock_count: this.productForm.get('stock')?.value,
        image_url: '',
      })
      .then((stock: Product[]) => {
        this.stock = stock;
      })
      .finally(() => (this.isSubmitting = false));
  }

  deleteProduct(productName: string): void {
    this.companyService
      .deleteProduct(this.company!._id.toString(), productName)
      .then((stock: Product[]) => {
        this.stock = stock;
        this.maxPages = Math.ceil(stock.length / this.perPage);
        if (this.currentPage > this.maxPages) this.prevPage();
      });
  }

  inviteEmployee(): void {
    this.isSubmitting = true;
    this.companyService
      .inviteEmployee(this.company!._id, this.employeeForm.get('email')?.value)
      .then((employees: User[]) => {
        this.employees = employees;
      })
      .finally(() => (this.isSubmitting = false));
  }

  dismissEmployee(_id: string): void {
    this.companyService
      .dismissEmployee(this.company!._id, _id)
      .then((employees: User[]) => {
        this.employees = employees;
      });
  }
}
