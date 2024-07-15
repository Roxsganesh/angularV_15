import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterModel } from '../register/register.modal';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiEndPointUrl = "http://localhost:3000/user";

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<any>(this.apiEndPointUrl);
  }

  getAllUserRole() {
    const apiEndPointUrl = "http://localhost:3000/role";
    return this.http.get<any>(apiEndPointUrl);
  }

  GetUserbyCode(id:any){
    return this.http.get(this.apiEndPointUrl+'/'+id);
  }

  getAuthUserById(roleCode: any) {
    const id = roleCode;
    // return this.http.get<RegisterModel>(this.apiEndPointUrl+'/'+id);
    return this.http.get<RegisterModel>(this.apiEndPointUrl+'?name='+roleCode);
  }

  registerUser(regiterationData: any) {
    return this.http.post<RegisterModel>(this.apiEndPointUrl, regiterationData);
  }

  updateUser(roleCode: any, regiterationData: any){
    return this.http.put<any>(this.apiEndPointUrl+'/'+roleCode, regiterationData);
  }

  //Get Customer Data
  getAllCustomers() {
    const apiEndPointUrl = "http://localhost:3000/customer";
    return this.http.get<any>(apiEndPointUrl);
  }

  //Get Customer By Role
  getCustomerByRole(role: any, menu: any) {
    const apiEndPointUrl = "http://localhost:3000/roleAccess?role="+role+"&menu="+menu;
    return this.http.get<any>(apiEndPointUrl);
  }

  //Add Customers
  createCustomers(customerData: any) {
    const apiEndPointUrl = "http://localhost:3000/customer";
    return this.http.post<any>(apiEndPointUrl, customerData);
  }

  //Update Customer
  updateCustomer(updateId: number | string, customerData: any) {
    const apiEndPointUrl = "http://localhost:3000/customer";
    return this.http.put<any>(apiEndPointUrl+'/'+updateId, customerData);
  }

  //Delete Customer
  deleteCustomer(updateId: number | string) {
    const apiEndPointUrl = "http://localhost:3000/customer";
    return this.http.delete<any>(apiEndPointUrl+'/'+updateId);
  }

  //Guard Clause
  isLoggedInUser() {
    return sessionStorage.getItem("username") !== null;
  }

  getUserRole() {
    return sessionStorage.getItem("userrole") !== null ? sessionStorage?.getItem("userrole")?.toString() : "";
  }
}
