import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../types';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { HeaderService } from '../services/header.service';


@Component({
   selector: 'app-tabs',
   templateUrl: 'tabs.page.html',
   styleUrls: ['tabs.page.scss']
})

export class TabsPage implements OnInit {
   title = 'Home';
   user: User;
   currentUser: User;
   constructor(private authService: AuthService, private router: Router, private header: HeaderService) { }

   ngOnInit() {
      // this.currentUser = this.authService.getUser()
      this.update();
      let tim = timer(100, 100);
      tim.subscribe(() => this.update());

      this.header.title.subscribe(title => {
         this.title = title;
      });
   }

   userDetails() {
      this.router.navigate(['/user-details']);
   }

   login() {
      this.router.navigate(['/login']);
   }

   update(): void {
      this.authService.getUser().subscribe(res => {
         this.user = res;
      });
   }
}
