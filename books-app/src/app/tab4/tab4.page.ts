import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, Form, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
   selector: 'app-tab4',
   templateUrl: 'tab4.page.html',
   styleUrls: ['tab4.page.scss']
})

export class Tab4Page implements OnInit {

   public loginForm: FormGroup;
   public registerForm: FormGroup;
   public user;

   constructor(
      private authService: AuthService,
      private router: Router,
      private alertController: AlertController
   ) {
      this.loginForm = new FormGroup(
         {
            email: new FormControl('', Validators.email),
            password: new FormControl('')
         },
         Validators.required
      );

      this.registerForm = new FormGroup(
         {
            name: new FormControl(''),
            email: new FormControl('', Validators.email),
            password: new FormControl('', Validators.minLength(8))
         },
         Validators.required
      );
   }

   ngOnInit() {}

   async signInEmailPassword() {
      try {
         await this.authService.signInEmailPassword(this.loginForm.get('email').value, this.loginForm.get("password").value).then(res => {
            // console.log("Welcome ..." + res.user.displayName);
            this.router.navigate(['tabs/tab1']);
         }
      );
      } catch (error) {
         const alert = await this.alertController.create({
            header: 'Error',
            subHeader: error.code,
            message: error.message,
            buttons: ['OK']
         });

         await alert.present();
         console.log(error);
      }
   }

   async register() {
      try {
         await this.authService.signUp(this.registerForm.get("name").value, this.registerForm.get('email').value, this.registerForm.get("password").value).then(res => {
            let name = this.registerForm.get("name").value
            const newUser = {
               displayName: name,
               email: res.user.email,
               uid: res.user.uid,
               photoURL: name[0]
            };
            this.authService.setUserData(newUser);
            this.router.navigate(['tabs/tab1']);
         });
      } catch (e) {
         const alert = await this.alertController.create({
            header: 'Error',
            subHeader: e.code,
            message: e.message,
            buttons: ['OK']
         });

         await alert.present();
         console.log(e);
      }
   }

   async signInWithGoogle() {
      try {
         await this.authService.signInWithGoogle().then((res) => {
            var obj = {
               uid: res.user.uid,
               displayName: res.user.displayName,
               email: res.user.email,
               photoURL: res.user.photoURL
            }
            this.authService.setUserData(obj);
            this.router.navigate(['/tabs/tab1']);
         });
      } catch (e) {
         console.log(e);
      }
   }

   async signInWithFB() {
      try {
         await this.authService.signInWithFB().then((res) => {
            var obj = {
               uid: res.user.uid,
               displayName: res.user.displayName,
               email: res.user.email,
               photoURL: res.user.photoURL
            }
            this.authService.setUserData(obj);
            this.router.navigate(['/tabs/tab1']);
         });
      } catch (e) {
         console.log(e);
      }
   }

   //Mobile
   async fbLogin() {
      await this.authService.fbLogin().then(() => {
         this.router.navigate(['/tabs/tab1']);
      });
   }
   
   //Mobile
   async gLogin() {
      await this.authService.googleLogin().then(() => {
         this.router.navigate(['/tabs/tab1']);
      });
   }

   signOut(): void {
      this.authService.logout();
      console.log("logged out")
   }

}