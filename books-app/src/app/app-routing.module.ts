import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { LoginGuardService } from './services/login-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./tab1/tab1.module').then( m => m.Tab1PageModule) },
  { path: 'books', loadChildren: () => import('./tab2/tab2.module').then( m => m.Tab2PageModule) },
  { path: 'cart', loadChildren: () => import('./tab5/tab5.module').then( m => m.Tab5PageModule), canActivate: [AuthGuardService] },
  { path: 'login', loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule), canActivate: [LoginGuardService] },
  { path: 'user-details', loadChildren: () => import('./user-details/user-details.module').then( m => m.UserDetailsPageModule), canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {}
