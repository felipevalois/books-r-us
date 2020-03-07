import { Component, OnInit } from '@angular/core';
import { User } from '../types';
import { HeaderService } from '../services/header.service';

@Component({
   selector: 'app-tab1',
   templateUrl: 'tab1.page.html',
   styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {
   user: User;

   currentUser: User;
   constructor(private header: HeaderService) {}

   ngOnInit() {
      this.header.setTitle('Home');
   }
}

