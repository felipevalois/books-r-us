import { Component, OnInit, NgZone, Input } from '@angular/core';
import { User } from '../types';
import { AuthService } from '../services/auth.service';
import { Observable, of, Subscription, timer } from 'rxjs';
import { HeaderService } from '../services/header.service';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
})
export class UserDetailsPage implements OnInit {

  user: User;

  constructor(private authService: AuthService, private header: HeaderService, private ngzone: NgZone){}


  ngOnInit() {
   this.header.setTitle('User-Deets');

    this.update();
    let tim = timer(100,100);
    tim.subscribe(() => this.update());
  }

  update(): void {
    this.authService.getUser().subscribe(res => {
      this.ngzone.run(()=>{
        this.user = res;
      });
    });
  }

  logout(){
     this.authService.logout();
  }
}
