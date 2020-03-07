import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ISBN } from '../interfaces/model';
import { Favorites } from '../interfaces/favorites';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { HeaderService } from '../services/header.service';


@Component({
   selector: 'app-tab5',
   templateUrl: 'tab5.page.html',
   styleUrls: ['tab5.page.scss']
})
export class Tab5Page implements OnInit {

   favorites: Favorites[];
   userId;

   isbn: ISBN[];
   items = [];

   bookId: String;
   showSpinner: boolean = false;

   constructor(
      private dataService: DataService,
      private authService: AuthService,
      private alert: AlertController,
      private header: HeaderService
   ) {}

   ngOnInit() {
      this.header.setTitle('Cart');
   }

   getFavorites() {
      this.items = [];
      this.userId = this.authService.getUserUid();
      this.showSpinner = true;
      this.dataService.getFavorites(this.userId).subscribe(async res => {
         if (res) {
            this.favorites = res;
            this.favorites.forEach(item => {
               this.dataService.getFavoriteBooks(item).subscribe(res => {
                  this.items.push(res.Item);
                  this.showSpinner = false;
               });
            });
         }
         if (res.length == 0) {
            const alert = await this.alert.create({
               header: '',
               message: 'No Books added to favorites',
               buttons: ['OK']
            });

            await alert.present();
            this.showSpinner = false;
         }
      });
   }

   deleteFavorite(itemId: String) {
      this.userId = this.authService.getUserUid();
      this.showSpinner = true;
      this.dataService.deleteFavorite(this.userId, itemId).subscribe(res => {
         this.getFavorites();
      });
      this.showSpinner = false;
   }

   ionViewWillEnter() {
      this.getFavorites();
   }

}