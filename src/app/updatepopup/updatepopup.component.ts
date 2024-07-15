import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { RegisterModel } from '../register/register.modal';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-updatepopup',
  templateUrl: './updatepopup.component.html',
  styleUrls: ['./updatepopup.component.scss'],
})
export class UpdatepopupComponent {
  registrationFrom!: FormGroup;
  updateRegisteredUserData: RegisterModel;
  pageType: any;
  private unsubscribe$ = new Subject<void>();

  roleList: any = [];

  registeredUserData: any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    public dialogRef: MatDialogRef<UpdatepopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // First Approach - Getting Data from Mat Dialog Modal
    console.log('dialog user data is... ', this.data);
    this.updateRegisteredUserData = this.data['userInfo'];
    this.pageType = this.data['type'];

    // if(this.updateRegisteredUserData) {
    //   this.registrationFrom = this.fb.group({
    //     id: [
    //       this.updateRegisteredUserData['id'],
    //       { validators: [Validators.required, Validators.minLength(5)] },
    //     ],
    //     name: [
    //       this.updateRegisteredUserData['name'],
    //       { validators: [Validators.required] },
    //     ],
    //     email: [
    //       this.updateRegisteredUserData['email'],
    //       { validators: [Validators.required, Validators.email] },
    //     ],
    //     password: [
    //       this.updateRegisteredUserData['password'],
    //       {
    //         validators: [
    //           Validators.required,
    //           Validators.pattern(
    //             '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
    //           ),
    //         ],
    //       },
    //     ],
    //     gender: [this.updateRegisteredUserData['gender']],
    //     role: [this.updateRegisteredUserData['role']],
    //     isActive: [this.updateRegisteredUserData['isActive']],
    //   });
    // }

  }

  ngOnInit(): void {
    this.getAllRegisteredUserList();

    //Second Approach - Getting Data from API
    if(this.data.id !== null && this.data.id !== "") {
      this.getRegisteredUserById(this.data.id);
    }
  }

  getAllRegisteredUserList() {
    this.authService
    .getAllUserRole()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res) => {
      this.roleList = res;
    });
  }

  getRegisteredUserById(id: any) {
    this.registrationFrom = this.fb.group({
      id: [
        '',
        { validators: [Validators.required, Validators.minLength(5)] },
      ],
      name: [
        '',
        { validators: [Validators.required] },
      ],
      email: [
        '',
        { validators: [Validators.required, Validators.email] },
      ],
      password: [
        '',
        {
          validators: [
            Validators.required,
            Validators.pattern(
              '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
            ),
          ],
        },
      ],
      gender: [''],
      role: [''],
      isActive: [''],
    });

    //Second Approach - Getting Data from API
    this.authService.GetUserbyCode(id).pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.registeredUserData = res;
      console.log("res is... ", this.registeredUserData)
          this.registrationFrom.setValue({
            id: this.registeredUserData.id,
            name: this.registeredUserData.name,
            email: this.registeredUserData.email,
            gender: this.registeredUserData.gender,
            password: this.registeredUserData.password,
            role: this.registeredUserData.role,
            isActive: this.registeredUserData.isActive,
          })
    })
    
  }

  updateRegisteredUser() {
    if(this.registrationFrom.valid) {
      // this.registerationData = this.registrationFrom.getRawValue();
      this.updateRegisteredUserData = this.registrationFrom.value;
      this.authService
        .updateUser(this.updateRegisteredUserData.id, this.updateRegisteredUserData)
        .subscribe((res) => {
          console.log('resp is... ', res);
          this.toastr.success(
            'User Role Updated Successfully!'
          );
        });
    } else {
      this.toastr.warning('Please Select Role.');
    }
  }

  closePopup() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
