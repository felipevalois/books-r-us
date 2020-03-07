import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { HeaderService } from '../services/header.service';
import { timer } from 'rxjs';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
   selector: 'app-login',
   templateUrl: './login.page.html',
   styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
   public loginForm: FormGroup;
   public registerForm: FormGroup;
   public user;

   constructor(
      private authService: AuthService,
      private alertController: AlertController,
      private header: HeaderService,
      private ngzone: NgZone,
      private alert: AlertController,
      private router: Router,
      private storage: Storage
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

   ngOnInit() {
      this.header.setTitle('Login');

      this.update();
      let tim = timer(100, 100);
      tim.subscribe(() => this.update());

   }


   update(): void {
      this.authService.getUser().subscribe(res => {
         this.ngzone.run(async () => {
            this.user = res;
         });
      });
   }


   async signInEmailPassword() {
      try {
         await this.authService.signInEmailPassword(this.loginForm.get('email').value, this.loginForm.get("password").value).then(res => {
         });
         this.router.navigate(['/home']);
         // window.location.replace('/home');
      } catch (error) {
         const alert = await this.alertController.create({
            header: 'Error',
            subHeader: error.code,
            message: error.message,
            buttons: ['OK']
         });
         await alert.present();
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
            this.router.navigate(['/home']);
            // window.location.replace('/home');
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
            // console.log("signedWGoogle")
              this.router.navigate(['/home']);
            // window.location.replace('/home');
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
            // console.log("signedWFB")
            this.router.navigate(['/home']);
            // window.location.replace('/home');
         });
      } catch (e) {
         console.log(e);
      }
   }

   async fbLogin() {
      await this.authService.fbLogin().then(() => {
         this.router.navigate(['/home']);
         // window.location.replace('/home');

      });
   }

   async gLogin() {
      // this.authService.login();
      await this.authService.googleLogin().then(() => {
         this.router.navigate(['/home']);
         // window.location.replace('/home');

      });
   }

   signOut(): void {
      this.authService.logout();
      console.log("logged out")
   }


}

