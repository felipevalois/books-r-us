import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, Form, FormBuilder } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
// import { SellingInfo } from 'firebase';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  private sellBookForm: FormGroup;
   
  
  constructor(private authService: AuthService) {}

  async sellBook() {
    
  }

}
