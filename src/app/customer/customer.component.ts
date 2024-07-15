import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent {
  customerForm! : FormGroup;
  customerList: any = [];

  displayedColumns: string[] = [
    'id',
    'name',
    'creditLimit',
    'action',
  ];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private unsubscribe$ = new Subject<void>();

  hasAdd = false;
  hasEdit= false;
  hasDelete = false;

  accessRoleByCustomerData: any;
  editCustomer: boolean = false;
  customerId: any;

  constructor(private authService: AuthService, private toastr: ToastrService, private fb: FormBuilder) {
    this.customerForm = this.fb.group({
      name: ['', {validators: [Validators.required]}],
      creditLimit: ['', {validators: [Validators.required, Validators.min(1000)]}],
    })
  }

  ngOnInit(): void {
    this.setAccessPermission();
  }

  getAllCustomersList() {
    this.authService.getAllCustomers().subscribe((res) => {
      this.customerList = res;
      this.dataSource = new MatTableDataSource(this.customerList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onEditCustomer(customerInfo: any) {
    console.log("customer info is... ", customerInfo)
    if(this.hasEdit) {
      this.editCustomer = true;
      this.customerId = customerInfo.id;
      this.customerForm.setValue({
        name: customerInfo.name,
        creditLimit: customerInfo.creditLimit
      })
    } else {
      this.toastr.warning("Don't have access to edit customer!")
    }
  }

  updateCustomer() {
    if(this.customerForm.valid) {
      console.log("on customer edit... ", this.customerForm.value);
      // return
      this.authService.updateCustomer(this.customerId, this.customerForm.value).subscribe((res) => {
        console.log("customer updated res is... ", res)
        this.toastr.success("Customer updated successfully!")
        this.getAllCustomersList();
        this.customerForm.reset();
      })
    }
    // this.toastr.success("Proceed with edit customer!")
  }

  addCustomer() {
    if(this.hasAdd) {
      if(this.customerForm.valid) {
        console.log("on customer add... ", this.customerForm.value);
        console.log(this.customerForm.value);
        this.authService.createCustomers(this.customerForm.value).subscribe((res) => {
          console.log("customer added res is... ", res)
          this.toastr.success("Customer added successfully!")
          this.getAllCustomersList();
          this.customerForm.reset();
        })
      }
      // this.toastr.success("Proceed with add customer!")
    } else {
      this.toastr.warning("Don't have access to add customer!")
    }
  }
  deleteCustomer(id:  any) {
    if(this.hasDelete) {
      this.authService.deleteCustomer(id).subscribe((res) => {
        console.log("customer deleted res is... ", res)
        this.toastr.success("Customer deleted successfully!")
        this.getAllCustomersList();
      })
      // this.toastr.success("Proceed with delete customer!")
    } else {
      this.toastr.warning("Don't have access to delete customer!")
    }
  }

  setAccessPermission() {
    this.authService.getCustomerByRole(this.authService.getUserRole()?.toLowerCase(), 'customer').subscribe((res) => {
      this.accessRoleByCustomerData = res;
      console.log("customer by role is... ", this.accessRoleByCustomerData);
      if(this.accessRoleByCustomerData.length > 0) {
        const filteredCustomerRole = this.accessRoleByCustomerData.filter((item: { role: string; menu: string; }) => (item.role == 'admin' && item.menu =='customer') || item.role == 'user' && item.menu =='customer' || item.role == 'tech' && item.menu =='customer')
        console.log("filteredCustomerRole is... ", filteredCustomerRole)
        if(filteredCustomerRole.length > 0) {
          this.hasAdd = filteredCustomerRole[0].hasAdd;
          this.hasEdit = filteredCustomerRole[0].hasEdit;
          this.hasDelete = filteredCustomerRole[0].hasDelete;

          console.log("has add is... ", this.hasAdd)
          console.log("has edit is... ", this.hasEdit)
          console.log("has delete is... ", this.hasDelete)

          this.getAllCustomersList();
        }
      } else {
        console.log("Unauthorised")
        this.toastr.error("You are not authorised to access!");
      }
    })
  }
}
