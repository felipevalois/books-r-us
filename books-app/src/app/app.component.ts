import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthService } from './services/auth.service';
import { User } from './types';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { HeaderService } from './services/header.service';

@Component({
   selector: 'app-root',
   templateUrl: 'app.component.html',
   styleUrls: ['app.component.scss']
})
export class AppComponent {

   title = 'Home';
   user: User;
   currentUser: User;


   constructor(
      private platform: Platform,
      private splashScreen: SplashScreen,
      private statusBar: StatusBar,
      private authService: AuthService,
      private router: Router,
      private header: HeaderService
   ) {
      this.initializeApp();
   }

   initializeApp() {
      this.platform.ready().then(() => {
         this.statusBar.styleDefault();
         this.splashScreen.hide();
      });
   }

   ngOnInit() {
      this.update();
      let tim = timer(100, 100);
      tim.subscribe(() => this.update());

      this.header.title.subscribe(title => {
         this.title = title;
      });
   }

   userDetails() {
      if(this.user){
         this.router.navigate(['/user-details']);
      }
      else{
         this.router.navigate(['/login']);
      }
   }

   login() {
      this.router.navigate(['/login']);
   }

   update(): void {
      this.authService.getUser().subscribe(res => {
         this.user = res;
      });
   }

   titleHome(){
      this.title = 'Home';
   }

   titleBooks(){
      this.title = 'Books';
   }

   titleDeets(){
      this.title = 'Deets';
   }

   titleLogin(){
      this.title = 'Login';
   }

   titleCart(){
      this.title = 'Cart';
   }
}
