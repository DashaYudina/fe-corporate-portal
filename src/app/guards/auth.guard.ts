import {Inject, Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AUTH_SERVICE_TOKEN, IAuthService} from '../services/interfaces/iauth-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE_TOKEN) private authService: IAuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.authService.isAuth()) {
      return true;
    }

    this.router.navigate(['/login']);

    return false;
  }

}
