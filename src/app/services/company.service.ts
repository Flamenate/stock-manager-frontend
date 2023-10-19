import { Injectable } from '@angular/core';
import axios from 'axios';
import { User } from './user.service';

export type Product = {
  name: string;
  description: string;
  stock_count: number;
  unit_price_euro: number;
  image_url: string;
};

export interface Company extends PartialCompany {
  employees: string[];
  stock: Product[];
}

export interface PartialCompany {
  _id: string;
  name: string;
  owner: string;
  employee_count?: number;
}

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private url = 'http://127.0.0.1';

  constructor() {}

  async getCompanyById(id: string): Promise<Company> {
    const response = await axios.get<Company>(`${this.url}/companies/${id}`);
    return response.data;
  }

  async createCompany(name: string, owner: User): Promise<Company> {
    const response = await axios.post<Company>(`${this.url}/companies`, {
      name,
      owner_id: owner._id,
    });
    return response.data;
  }

  async addProduct(companyId: string, product: Product): Promise<Product[]> {
    const response = await axios.post<Product[]>(
      `${this.url}/companies/${companyId}/stock`,
      product
    );
    return response.data;
  }

  async editProduct(
    companyId: string,
    productName: string,
    newProduct: Product
  ): Promise<Product[]> {
    const response = await axios.patch<Product[]>(
      `${this.url}/companies/${companyId}/stock/${encodeURI(productName)}`,
      newProduct
    );
    return response.data;
  }

  async deleteProduct(
    companyId: string,
    productName: string
  ): Promise<Product[]> {
    const response = await axios.delete<Product[]>(
      `${this.url}/companies/${companyId}/stock/${encodeURI(productName)}`
    );
    return response.data;
  }

  async searchProducts(companyId: string, query: string): Promise<Product[]> {
    const response = await axios.get<Product[]>(
      `${this.url}/companies/${companyId}/stock?query=${encodeURI(query)}`
    );
    return response.data;
  }

  async inviteEmployee(companyId: string, userEmail: string): Promise<User[]> {
    const response = await axios.post<User[]>(
      `${this.url}/companies/${companyId}/employees`,
      { userEmail }
    );
    return response.data;
  }

  async dismissEmployee(
    companyId: string,
    employeeId: string
  ): Promise<User[]> {
    const response = await axios.delete<User[]>(
      `${this.url}/companies/${companyId}/employees/${employeeId}`
    );
    return response.data;
  }
}
