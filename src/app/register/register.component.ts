import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { RegisterModel } from './register.modal';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{

  registrationFrom!: FormGroup;
  registerationData: RegisterModel[] = [];

  constructor(private fb: FormBuilder, private toastr: ToastrService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
      this.registrationFrom = this.fb.group({
        id: ['', {validators: [Validators.required, Validators.minLength(5)]}],
        name: ['', {validators: [Validators.required]}],
        email: ['', {validators: [Validators.required, Validators.email]}],
        password: ['', {validators: [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]}],
        gender: ['male'],
        role: [''],
        isActive: [false],
      })
  }

  proceedRegistration() {
    if(this.registrationFrom.valid) {
      // this.registerationData = this.registrationFrom.getRawValue();
      this.registerationData = this.registrationFrom.value;
      this.authService.registerUser(this.registerationData).subscribe((res) => {
        console.log("resp is... ", res)
        this.toastr.success("User Registered Successfully!", "Please Login!");
        this.router.navigate(["login"])
        // res.error(
        //   this.toastr.error("Something went wrong!")
        // )
      })
    } else {
      this.toastr.warning("Please provide valid details");
    }
  }
}
