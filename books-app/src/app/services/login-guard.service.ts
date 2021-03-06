import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})

export class LoginGuardService implements CanActivate {

   constructor(private router:Router, private authService: AuthService, private alert: AlertController) { }

   canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
     return this.authService.currentUser.pipe(
       take(1),
       map(user => {
         if (user == null) {
           return true;
         } else {
           return false;
         }
       }),
       tap(loggedIn => {
          if(!loggedIn){
            this.authService.alreadyLoggedIn();
         }
          else{
          }
       })
     );
   }
  
}
