import { Component, OnInit, ViewChild,  } from '@angular/core';
import { DataService } from '../services/data.service';
import { Dept, CourseNum, Book, ISBN, Section } from '../interfaces/model';
import { Favorites } from '../interfaces/favorites';

import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { HeaderService } from '../services/header.service';

import { IonicSelectableComponent } from 'ionic-selectable';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page implements OnInit {

  @ViewChild('courseselect', {static:true}) courseselect: IonicSelectableComponent;
  @ViewChild('sectionselect', {static:true}) sectionselect: IonicSelectableComponent;

  //perhaps clean up a bit and create a new model for the data
  selectedDept;
  selectedCourse;
  selectedSection;
  depts: Dept[];
  courses: CourseNum[];
  sections: Section[];
  books: Book[];
  isbn: ISBN[];
  items = [];

  deptSelect: string;
  courseSelect: string;
  sectionSelect: string;

  favorites: Favorites[];

  userId;

  showSpinner: boolean = false;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private alertController: AlertController,
    private header: HeaderService
  ) {}

  ngOnInit(){
    this.getDepts();
    this.header.setTitle('Books');
  }

  getDepts(){
    this.dataService.getDepts().subscribe(res => {
      this.depts = res;
    });
  }

  onChangeDept(dept: String){
    console.log(dept);
    this.selectedDept = dept;
    this.dataService.getCourse(dept).subscribe(res => {
      this.courses = res;
      this.courseselect.open();
   })
   
    this.courseSelect = null;
    this.sectionSelect = null;
  }

  onChangeCourses(course: String){
    this.selectedCourse = course;
    this.dataService.getSection(this.selectedDept, course).subscribe(res => {
      this.sections = res;
      this.sectionselect.open();
   })

    this.sectionSelect = null;
  }

  onChangeSection(section: String){
    this.selectedSection = section;
    this.dataService.getISBN(this.selectedDept, this.selectedCourse, section).subscribe(async res => {
      this.books = res;
      if(this.books[0].isbn.charAt(0) == '2'){
        this.items = null;
        const alert = await this.alertController.create({
          header: '',
          message: 'No Textbook Required!',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  getBook(isbn: String){
    this.showSpinner = true;
    this.dataService.getBooks(isbn).subscribe(async res => {
      if(res){
        this.items = res.Item;
        this.showSpinner = false;
      }
      if(res.TotalItems == 0){
        this.items = null;
        this.showSpinner = false;
        const alert = await this.alertController.create({
          header: '',
          message: 'No Books Found!',
          buttons: ['OK']
        });
    
        await alert.present();
      }
    });
  }

  addFavorite(favoriteBook: String) {
    this.userId = this.authService.getUserUid();
    this.dataService.addFavorite(favoriteBook, this.userId).subscribe(async res => {
      if(res){
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Book added to favorites.',
          buttons: ['OK']
        });
    
        await alert.present();
      }
    });
  }


}
