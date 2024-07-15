import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const routeUrl = route.url;
      console.log("url check... ", routeUrl)
      if(this.authService.isLoggedInUser()) {
        if(routeUrl.length > 0) {
          console.log("auth guard role is... ", this.authService.getUserRole())
          const currenturlPath = routeUrl[0].path;
          if(currenturlPath == "user") {
            if(this.authService.getUserRole() == "Admin") {
              return true;
            } else {
              this.router.navigate(['']);
              this.toastr.warning("Only Admin is Authorised to access user page!");
              return false;
            }
          } else {
            return true;
          }
        }
        return true;
      } else {
        this.router.navigate(['login'])
        this.toastr.warning("Please login to access!")
        return false;
      }
  }
  
}
