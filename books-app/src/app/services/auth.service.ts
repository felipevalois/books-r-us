import { Injectable, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { auth } from 'firebase/app';

import { AngularFireAuth } from "@angular/fire/auth";

import { User } from '../types';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Storage } from '@ionic/storage';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import * as firebase from 'firebase';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AlertController } from '@ionic/angular';


@Injectable({
   providedIn: 'root'
})

export class AuthService {

   userDetails: any;
   currentUser: Observable<User>;
   currentAuth: Observable<firebase.User | null>;

   constructor(
      public firebaseAuth: AngularFireAuth,
      public router: Router,
      private afs: AngularFirestore,
      private storage: Storage,
      private fb: Facebook,
      private googlePlus: GooglePlus,
      private alert: AlertController
   ) {
      this.firebaseAuth.auth.setPersistence('session');
      this.currentUser = this.firebaseAuth.authState.pipe(
         switchMap(cred => {
            if (cred) {
               this.storage.set('uid', cred.uid);
               return this.afs.doc<User>(`users/${cred.uid}`).valueChanges();
            }
            else {
               this.storage.set('uid', null);
               return of(undefined);
            }
         }),
         map(userDetails => userDetails as User)
      );
   }

   //register new account
   async signUp(name: string, email: string, password: string) {
      return await this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
   }

   //email&pass
   async signInEmailPassword(email: string, password: string) {
      return await this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
   }

   //web FB Login
   async signInWithFB() {
      return await this.firebaseAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
   }
   
   //web Google Login
   async signInWithGoogle() {
      return await this.firebaseAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
   }

   getUser(): Observable<User> {
      const currentUser = this.firebaseAuth.auth.currentUser;
      if (currentUser) {
         return this.afs.doc<User>(`users/${currentUser.uid}`).valueChanges();
      }
      return of();
   }

   logout() {
      this.googlePlus.logout();
      this.fb.logout();
      this.firebaseAuth.auth.signOut().then(() => {
         this.storage.remove('uid');
         window.location.replace('/books-r-us/');
      });
   }

   //Add new user data to Firebase
   setUserData(user) {
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
      const userData: User = {
         uid: user.uid,
         email: user.email,
         displayName: user.displayName,
         photoURL: user.photoURL
      }
      return userRef.set(userData, {
         merge: true
      })
   }

   getUserUid() {
      var userInfo = this.firebaseAuth.auth.currentUser.uid;
      return userInfo;
   }

   //Create alert services rather than having them in a component or on a different service
   async presentAlertForLogin() {
      const alert = await this.alert.create({
         header: 'Alert',
         subHeader: 'Must be logged in!',
         message: 'In order to access this page, you must first login.',
         buttons: [
            {
               text: 'Cancel',
               role: 'cancel',
               handler: () => {
                  this.router.navigate(['/home']);
               }
            },
            {
               text: 'Login',
               handler: () => {
                  this.router.navigate(['/login']);
               }
            }
         ]
      });

      await alert.present();
      const result = await alert.onDidDismiss();
   }

   async alreadyLoggedIn() {
      const alert = await this.alert.create({
         header: 'Alert',
         subHeader: 'Already logged in!',
         message: '',
         buttons: [
            {
               text: 'Ok',
               handler: () => {
                  this.router.navigate(['/home']);
               }
            }
         ]
      });

      await alert.present();
      const result = await alert.onDidDismiss();
   }

   //native mobile login -> fb
   async fbLogin() {
      await this.fb.login(['email']).then(res => {
         const credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
         this.firebaseAuth.auth.signInWithCredential(credential).then(res => {
            var obj = {
               uid: res.user.uid,
               displayName: res.user.displayName,
               email: res.user.email,
               photoURL: res.user.photoURL
            }
            this.setUserData(obj);
            this.router.navigate(['/tabs/tab1']);
         });
      });
   }

   //native mobile login -> cordova -> googlePlus plugin
   async googleLogin() {
      await this.googlePlus.login({}).then(res => {
         console.log(res.idToken);
         const credential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
         this.firebaseAuth.auth.signInWithCredential(credential).then(res => {
            var obj = {
               uid: res.user.uid,
               displayName: res.user.displayName,
               email: res.user.email,
               photoURL: res.user.photoURL
            }
            this.setUserData(obj);
            this.router.navigate(['/tabs/tab1']);
         });
      });
   }

}
