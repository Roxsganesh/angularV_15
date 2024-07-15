import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;
  loggedInUserData: any;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private authService: AuthService, private router: Router) {
    sessionStorage.clear();
  }

  ngOnInit(): void {
      this.loginForm = this.fb.group({
        name: ['', {validators: [Validators.required]}],
        password: ['', {validators: [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]}]
      })
  }

  proceedLogin() {
    if(this.loginForm.valid) {
      this.authService.getAuthUserById(this.loginForm.value.name).subscribe((res) => {
        this.loggedInUserData = res;
        console.log("resp is... ", this.loggedInUserData)
        if(this.loggedInUserData[0].password === this.loginForm.value.password) {
          if(this.loggedInUserData[0].isActive === true) {
            sessionStorage.setItem("username", this.loggedInUserData[0].id)
            sessionStorage.setItem("userrole", this.loggedInUserData[0].role)
            this.router.navigate(['']) // navigate to home page
          } else {
            this.toastr.error("In active user", "Please contact admin to enable access!");
          }
        } else {
          this.toastr.error("Invalid Credential", "Please add valid credential")
        }
      })
    } else {
      this.toastr.warning("Please provide valid details");
    }
  }
}
