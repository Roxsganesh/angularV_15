import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements DoCheck, OnInit {
  title = 'AngularLearningV_15';
  showHeaderMenu = false;
  isAdminRole = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {

  }

  ngDoCheck(): void {
    const currentUrl = this.router.url;
    if (currentUrl == '/login' || currentUrl == '/register') {
      this.showHeaderMenu = false;
    } else {
      this.showHeaderMenu = true;
    }

    if(this.authService.getUserRole() == 'Admin') {
      this.isAdminRole = true;
    } else {
      this.isAdminRole = false;
    }
  }
}
