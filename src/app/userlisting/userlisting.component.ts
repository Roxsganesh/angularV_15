import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { RegisterModel } from '../register/register.modal';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UpdatepopupComponent } from '../updatepopup/updatepopup.component';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

@Component({
  selector: 'app-userlisting',
  templateUrl: './userlisting.component.html',
  styleUrls: ['./userlisting.component.scss'],
})
export class UserlistingComponent implements OnInit {
  userList: RegisterModel[] = [];

  displayedColumns: string[] = [
    'id',
    'username',
    'email',
    'role',
    'isActive',
    'action',
  ];
  dataSource = new MatTableDataSource<RegisterModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private dialogRef: any;
  private unsubscribe$ = new Subject<void>();

  constructor(private authService: AuthService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllUserList();
  }

  getAllUserList() {
    this.authService.getAll().subscribe((res) => {
      this.userList = res;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  updateUser(userInfo: any) {
    let widthPercetage = '';
    let data: any = {};
    data.type = 'updateUser';
    data.userInfo = userInfo;
    data.id = userInfo.id;
    this.openDialog(data, widthPercetage);
  }

  public openDialog(data: any, widthPercetage: any): void {
    let width = '50%';
    if (widthPercetage) {
      width = widthPercetage + '%';
    }
    if (!this.dialogRef) {
      this.dialogRef = this.dialog.open(UpdatepopupComponent, {
        enterAnimationDuration: '1000ms',
        exitAnimationDuration: '1000ms',
        width: width,
        height: 'auto',
        panelClass: 'ws-user-custom-info-dialog',
        data: data,
        disableClose: true,
      });
    }
    this.dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result: any) => {
        console.log("result is... ", result)
        this.dialogRef = false;
        // this.loadPeople(this.searchQueryItems);
        this.getAllUserList();
      });
  }

  // addPeople() {
  //   let widthPercetage = '';
  //   let data: any = {};
  //   data.type = 'addPeople';
  //   data.currentZone = this.currentZone;
  //   this.openDialog(data, widthPercetage);
  // }

  // editUserDetails(userData) {
  //   let widthPercetage = '';
  //   let data: any = { userData };
  //   data.type = 'editPeople';
  //   data.currentZone = this.currentZone;
  //   this.openDialog(data, widthPercetage);
  // }
}
