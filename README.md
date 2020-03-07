# Report

## URL to Instance

[Hosted Version](https://www.felipevalois.co/books-r-us)  
[iOS App (.ipa)](https://github.com/felipevalois/books-r-us/blob/master/books-r-us.ipa)

## URL to Final Presentation

[reveal.js Slides](https://slides.com/sarahmclaughlin-1/deck/live#/)

The HTML file of the Presentation can be found in the [presentation folder](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/tree/master/presentation). 

## Intro

When brainstorming ideas for this project our group valued one attribute higher than most - practicality. While choosing projects for classwork it is easy to choose something entertaining in order to gain your audiences attention, however as rising graduates we truly wanted to develop an idea that we could be proud of for years to come. An idea that had sophistication and general merit to its application to fufill a need.

Therefore we came up with **Books-R-Us!** A one of a kind application to help make required textbook purchases a breeze for your coursework each semester.

### Group Members

Felipe Costa - Senior CS Major  
Sarah McLaughlin - Senior CS/IT Major  
Jessica Dean - Senior IT Major

## The Problem

As college students, buying books can get quite expensive especially through any campus bookstore. Should you opt to find feasible copycats using other renting or buying options you can quickly rack up hours of comparison switching back and forth from site to site to correctly be prepared for class with a college students budget.

## The Solution

Our goal was to provide students with cheaper options to purchase textbooks that would resolve the tedious cross site comparison by scraping the University of Missouri Columbia (Mizzou) bookstore information to identify required materials for classes and automatically searching on ebay for comparable options. We allow our users to add the books directly to their cart for a quick and simple checkout and user experience. By calling APIs we are able to display Ebay's description and images posted on the website to undoubtedly determine the correct textbook is acquired.

## Implementation

### [0] Technologies Used

1. Web Scraper - Scrapy
2. Backend - Node.js, Express.js & mongodDB
3. Frontend - Ionic(Angular)
4. User Authentication - Firebase

### [1] Web Scraping

The MU Bookstore website was scraped, in order to acquire courses and book information for the Spring 2020 semester
By observing, and playing around with the website, I realized that once you selected a book you were redirected to a page in which the url contained an ID for the course(s) selected (mu.verbacompare.com/comparison?id=<ID>)

There were multiple steps required to finally scrape all the data and add it to mongodDB:

1. Copy JSON file from bookstore website by observing the API call on the networks tab on developers tool
[Bookstore - Department IDs](https://mu.verbacompare.com/compare/departments/?term=155)

2. Used the file above to create an array containing the DEPT_ID, which was then used to collect every course ID
   - Url scraped:  `mu.verbacompare.com/compare/courses/?id=<DEPT_ID>&term_id=155`  
   - Command:`$ scrapy runspider -o results.json scrapi.py`
   - [Scrapy Spider 1](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/scrapy-books/scrapi.py)

3. Similarly, the output generated from the previous step was used to create a file containing each section ID
   - Url scraped: `https://mu.verbacompare.com/compare/sections/?id=<COURSE_ID>&term=155`
   - Command: `$ scrapy runspider -o courses.json courses.py`
   - [Scrapy Spider 2](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/scrapy-books/courses.py)

4. Finally, we had  a json file containing every section ID that could then be used to populate the Database  
   - Url scraped: `https://mu.verbacompare.com/print/<SECTION_ID>`
   - Command: `$ scrapy crawl -o mongo.json bookspider.py`
   - [Scrapy Project](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/tree/master/code/scrapy-books/books)

The following fields were then added to our database:

- Department
- Course#
- SectionId
- Name
- Professor
- Section
- ISBN
- Required/Optional
- Price(from bookstore)
- Condition
   - New
   - Used
   - e-book

P.S The following url (`https://mu.verbacompare.com/print/<SECTION_ID>`) was used rather than the original URL that is called when a user selects a course (`mu.verbacompare.com/comparison?id=<SECTION_ID>`) because it contains pure HTML, therefore it was easier to scrape it.

### [2] Backend

The API was developed using Node.js, Express.js & Mongoose
[API code](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/server/index.js)

#### [2.1] Courses & Books Data - API

The following endpoints were defined and used to display content in the BookList Tab (GET)

1. Generate departments in select-option
`https://www.felipevalois.co:8001/departments`

2. Generate courses in select-option  
`https://felipevalois/co:8001/department/<DEPT>`

3. Generate sections in select-option  
`https://felipevalois.co:8001/sections/<DEPT>/<COURSE_NUMBER>`

4. Generate course info including books  
`https://felipevalois.co:8001/books/<DEPT/<COURSE_NUMBER>/<SECTION_ID> `

**[2.1.1] Books Interface**
Used to define the type of model data that were going to be stored regarding books, departments, course number and sections.
[Books Interface => model.ts](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/interfaces/model.ts)

```typescript
    export class Book{
        department: String;
        courseNumber: String;
        className: String;
        professor: String;
        isbn: String;
    }

    export class Dept{
        department: String;
    }

    export class CourseNum{
        courseNumber: String;
    }

    export class ISBN{
        isbn: String;
    }

    export class Section{
        section: String;
    }
```

#### [2.2] Favorites - API
The following endpoints were used for CRUD operations in the booklist tab and the favorites tab

1. Create (POST)
`https://felipevalois.co:8001/favorite/<USER_ID>/<ITEM_ID>`

2. Read (GET)
`https://felipevalois.co:8001/favorites/<USER_ID>`

3. Delete (DELETE)
`https://felipevalois.co:8001/favorite/<USER_ID>/<ITEM_ID>`

**[2.2.1] Favorites Interface**
Used to define the type of data types that were going to be stored of book favorites/checkout cart.
[Favorites Interface => favorites.ts](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/interfaces/favorites.ts)

```typescript
    export interface Favorites {
        uid: String;
        itemId: String;
        isbn: String;
    }
```

#### [2.3] Ebay Shopping API

We used the Ebay API to:
1. Search for books using the isbn of the selected course/section as a parameter
2. Search for specific books saved to be displayed in the favorites tab  
3. [Ebay Shopping API - docs](https://developer.ebay.com/devzone/shopping/docs/concepts/shoppingapi_formatoverview.html)

#### [2.4] User Authentication - Firebase

We decided to use Firebase for user authentication, for two reasons: first because we had already a good idea from the class work; and second because it allowed us to add social login.  
Since we decided to develop an App using Ionic & also have an application on the web, we had to develop a different implementation for each social login method(google and facebook)

**[2.4.1] Firebase Setup**  
The first thing was to enable the sign-in providers: Email/Password, Google, Facebook.  
Then two projects were created in the firebase console, one for the web and one for iOS.

**[2.4.2] Mobile**  
For mobile authentication the cordova plugins were used for both Facebook and Google.
The following commands were used to install the plugins, and its dependencies:

1. Google Plus 

- Plugin installation

```bash
$  ionic cordova platform add ios
$  ionic cordova plugin add cordova-plugin-googleplus --save --variable
      REVERSED_CLIENT_ID=myreversedclientid --variable
      WEB_APPLICATION_CLIENT_ID=mywebapplicationclientid
$   npm install --save @ionic-native/google-plus
```

- [Auth Service => auth.service.ts => line 93](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/services/auth.service.ts)

```typescript
   async googleLogin(){
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
```

- [Login Page => login.page.ts => line 130](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/login/login.page.ts)

```typescript
   async gLogin(){
     await this.authService.googleLogin().then(()=> {
       this.router.navigate(['/tabs/tab1']);
     });
   }
```

2. Facebook

The plugin installation for facebook was very similar, the difference was that the plugin required cocoapods to be installed.

```bash
$  sudo gem install cocoapods
$  sudo gem install cocoapods-dependencies
$  ionic cordova plugin add cordova-plugin-facebook4 --variable
      APP_ID=myAppID --variable APP_NAME=myAppName
```

- [Auth Service => auth.service.ts => line 75](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/services/auth.service.ts)

```typescript
async fbLogin(){
  await this.fb.login(['email']).then( res => {
    console.log(res);
    const credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
    this.firebaseAuth.auth.signInWithCredential(credential).then(res => {
      var obj = {
        uid: res.user.uid,
        displayName: res.user.displayName,
        email: res.user.email,
        photoURL: res.user.photoURL
      }
      this.setUserData(obj);
      console.log("signedWFB")
      this.router.navigate(['/tabs/tab1']);
    });
  });
}
```

- [Login Page => login.page.ts => line 124 ](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/login/login.page.ts)

``` typescript
async fbLogin(){
  await this.authService.fbLogin().then(()=>{
    this.router.navigate(['/tabs/tab1']);
  });
}
```

**[2.4.3] Web**  
Web Authentication was a lot simpler, since it did not require any plugins.

1. Google Plus

- [Auth Service => auth.service.ts => line 137](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/services/auth.service.ts)

```typescript
async signInWithGoogle() {
      return await this.firebaseAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
}
```

- [Login Page => login.page.ts => line 88](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/login/login.page.ts)

```typescript
async signInWithGoogle() {
   try{
    await this.authService.signInWithGoogle().then((res)=>{
      var obj = {
        uid: res.user.uid,
        displayName: res.user.displayName,
        email: res.user.email,
        photoURL: res.user.photoURL
      }
      this.authService.setUserData(obj);
      this.router.navigate(['/tabs/tab1']);
    });
  } catch (e){
    console.log(e);
  }
}
```

2. Facebook

- [Auth Service => auth.service.ts => line 75](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/services/auth.service.ts)

```typescript
async signInWithFB() {
      return await this.firebaseAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
}
```

- [Login Page => login.page.ts => line 124 ](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/login/login.page.ts)

``` typescript
async signInWithFB() {
  try{
    await this.authService.signInWithFB().then((res)=>{
      var obj = {
        uid: res.user.uid,
        displayName: res.user.displayName,
        email: res.user.email,
        photoURL: res.user.photoURL
      }
      this.authService.setUserData(obj);
      this.router.navigate(['/tabs/tab1']);
    });
  } catch (e){
    console.log(e);
  }
}
```

**[2.4.4] Common Elements**  
The email/password authentication, as well as the registration functionality only had to be implemented once since it works in native apps, as well as in web applications.

1. Email/password  
[Auth Service => auth.services.ts => line 70](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/services/auth.service.ts)  

``` typescript
async signInEmailPassword(email: string, password: string){
    return await this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
}
```  

[Login Page => login.page.ts => line 50](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/login/login.page.ts)  

```typescript
async signInEmailPassword(){
  try{
    console.log(this.loginForm.get('email'));
    await this.authService.signInEmailPassword(this.loginForm.get('email').value, this.loginForm.get("password").value).then(res => {
      console.log(res);
    });
    this.router.navigate(['tabs/tab1']);
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
```  

2. Registration  

[Auth Service => auth.services.ts => line 66](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/services/auth.service.ts)

``` typescript
async signUp(name: string, email: string, password: string){
  return await this.firebaseAuth.auth.createUserWithEmailAndPassword(email,password);
}
```

[Login Page => login.page.ts => line 70](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/login/login.page.ts)  

```typescript
async register(){
  try{
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
  } catch (e){
    console.log(e);
  }
}
```  

3. Saving User Data  
This method was called whenever a user signed up, in order to add that user's info to the firebase user database. The variables saved are uid, email, display Name, and photo.  
[Auth Service => auth.services.ts => line 158](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/services/auth.service.ts)  

``` typescript
setUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    console.log(user);
    console.log
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
 ```

The User Interface was used to store data types regarding the user.

 - [User Interface => types.ts](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/types.ts)
 ``` typescript
     export interface User {
       uid: string;
       displayName: string;
       email: string;
       photoURL: any;
     }
 ```

4. Logout  

In order to sign out, the user had to navigate to the user-details page which was in the top right.  
If the user signed up with social login, and he/she had a photo available that image is  displayed there. Otherwise a circle with the user initial is displayed.  

[Auth Service => auth.services.ts => line 149](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/services/auth.service.ts)

``` typescript
logout() {
  this.googlePlus.logout();
  this.fb.logout();
  this.firebaseAuth.auth.signOut().then(()=>{
    this.storage.remove('uid');
    this.router.navigate(['/login']);
  });
}
```

***Finally each method shown above was called in its respective html file.***

**[2.4.5] Auth Guard**  
In order to secure user authentication, an auth guard was created. The implementation designed was taken from the GPADistribution App developed by Professor Wergeles.  
The Auth Guard Service basically calls a User Observable in the Authorization Service, to check if there is an authorized user logged in.  
If it fails it sends the user to the login page using the router.  

[Auth Service => auth.service.ts => lines 35-64](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/services/auth.service.ts)

```typescript
export class AuthService {
   //some lines were hidden
   // showing only the lines that are used for the Guard
  currentUser: Observable<User>;

  constructor(
    public firebaseAuth: AngularFireAuth,
    public router: Router,
    private afs: AngularFirestore,
  ) {
    this.firebaseAuth.auth.setPersistence('session');
    this.currentUser = this.currentAuth.pipe(
      switchMap((cred: firebase.User | null) => {
        if(cred){
          return this.afs.doc<User>(`users/${cred.uid}`).valueChanges();
        }
        else{
          return of(undefined);
        }
      }),
      map(userDetails => userDetails as User)
    );
  }
```

[Auth Guard => `auth-guard.service.ts` => line 1](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/services/auth-guard.service.ts)

```typescript
canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
  return this.authService.currentUser.pipe(
    take(1),
    map(user => {
      if (!!user) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    })
  );
}
```

### [3] Frontend

Our frontend UI was impletmented using Angular, AngularJS Material UI, and the Ionic Framework for a consistent theme, styling and the ability to use a mobile device.

#### [3.1] Angular

We were already familiar with HTML, CSS and JavaScript, so we decided use an Angular application as our base for our application.

**[3.1.1] Angular Setup**

In order to begin our new applicaton we had to install AngularJS and create a new application where all of our code and libraries would be hosted. In general, we followed the [Angular Docs](https://angular.io/guide/setup-local) when downloading Angular and Node.js.

Calls done in terminal within the [Code folder](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/tree/master/code)

```typescript
    $ node -v
    $ sudo npm install -g @angular/cli 
```

**[3.1.2] Angular Reactive Forms**

We used the Angular Rective Forms to retreive the user's login data or registering a user.

[Login Form => login.page.html => line 11](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/login/login.page.html)

```typescript
    <form [formGroup]="loginForm" (ngSubmit)="signInEmailPassword()">
        <ion-input type="text" formControlName="email" placeholder="Email"></ion-input>
        <ion-input type="password" formControlName="password" placeholder="Password"></ion-input>
        <ion-button expand="full" (click)="signInEmailPassword()" [disabled]="!loginForm.valid">Login</ion-button>
    </form>
```

**[3.1.3] Angular Alert and Await**

The Angular alerts were used when there was no data found or if an error had occured in login/registration.
[Await Alert => tab2.page.ts => line 129](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/tab2/tab2.page.ts)

```typescript
if(res){
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Book added to favorites.',
          buttons: ['OK']
        });
        await alert.present();
      }
```

#### [3.3] AngularJS Material UI

We downloaded AngularJS Material so that we could use mat-card-image and mat-tabs to display images and use Angular Reactive Forms.

[Material Image => tab5.page.ts => line 74](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/tab5/tab5.page.ts)

```typescript
    <img style="width: 200px; height: 250px; align-items: center;"  mat-card-image src='{{item.GalleryURL}}'>
```

#### [3.3] Ionic

In order to make our application user friendly, mobile, and visually appealing, we implemented the installation of Ionic Framework. 

**[3.3.1] Ionic Setup**

After installation of the up-to-date Angular and Node.js files, we were able to install and create a new Ionic Application ysing the Tabs app template.

Creation of Ionic Application done within the [Code folder](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/tree/master/code):

```typescript
    $ sudo npm install -g ionic cordova
    $ ionic start final-project-app tabs
```

**[3.3.2] Ion-Tabs**

We decided to use the ion-tabs built in with the Ionic Framework. In doing this we were able to create the tabs: Home, Book List, and Checkout. Each of these tabs used [ion-icons](https://ionicons.com/) and required Angular router so that each tab would take the user to the correct page. In addition, we included the user's details/image and the tab header along the ehader of each tab so that the user could sign out on any page. 

1. [Tabs Routing => tabs-routing.module.ts => line 5](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/tabs/tabs-routing.module.ts)

```typescript
    path: 'tab2',
      children: [
        {
          path: '',
          loadChildren: () =>
            import('../tab2/tab2.module').then(m => m.Tab2PageModule)
        }
      ]
    }
```

2. [User Details on each Tab Header => tabs.page.html => line 2](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/tabs/tabs.page.html)

```typescript
    <ion-toolbar>
      <ion-title>{{title}}</ion-title>
      <ion-buttons slot="end">
          <ion-button (click)="userDetails()">
            <div *ngIf="user">
              <div *ngIf="user.photoURL.length > 1; else noImage">
                <img style="width: 30px; height: 30px;" src="{{user.photoURL}}">
              </div>
              <ng-template #noImage>
                <div class="userDetails" style="width: 30px; height: 30px;">
                  <div class='userx'>{{user.photoURL}}</div> 
                </div> 
              </ng-template>
            </div> 
          </ion-button>
        </ion-buttons>
    </ion-toolbar>
```

3. [Ion Tab Buttons => tabs.page.html => line 22](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/tabs/tabs.page.html)

```typescript
    <ion-tab-button tab="tab1" (click)="titleHome()">
      <ion-icon name="home"></ion-icon>
      <ion-label>Home</ion-label>
    </ion-tab-button>
```

**[3.3.3] Home Page**
We used the Home page to summarize our project, add an [image of books](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/assets/book.jpg) and included link resources to different book stores.

**[3.3.4] Ionic UI Components**
Each page, specifically the Book List page, too advantage of multiple Ionic UI Components that [Ion offers](https://ionicframework.com/docs).

1. ionChange in Ionic is used in the case the the ion-select item has been changed. We used this to both make a new call to our API within our [data service](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/services/data.service.ts) and to also clear out the data of each of the other ion-selects so that new data can be retreived.

[ionChange => tabs2.page.html => line 15](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/tab2/tab2.page.html)

```typescript
    <ion-select [(ngModel)]="deptSelect" name="dept" id="depts" (ionChange)="onChange($event.target.value)"
      [interfaceOptions]="customAlertOptions" interface="alert" placeholder="Select One">
      <ion-select-option *ngFor="let dept of depts" value="{{dept}}">{{dept}}</ion-select-option>
    </ion-select>
```
[ionChange(onChange) => tabs2.page.ts => line 63](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/tab2/tabs2.page.ts)

```typescript
    onChange(dept: String){
      console.log(dept);
      this.selectedDept = dept;
      this.dataService
        .getCourse(dept).subscribe(res => {
        this.courses = res;
      })

      this.courseSelect = null;
      this.sectionSelect = null;
    }
```

2. *ngFor was used multiple times throughout or project. It was most important when retreiving each each book that we either required or optional for the specific section selected.
[*ngFor => tabs2.page.html => line 39](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/tab2/tab2.page.html)

```typescript
    <div *ngFor="let b of books; let i = index">
    <div *ngIf="i===0">
      <ion-toolbar>
        <ion-title>Course: {{b.className}}
          <ion-text class="professor">
            Professor: {{b.professor}}
          </ion-text>
        </ion-title>
      </ion-toolbar>
    </div>
```

3. We used *ngIf many times to check and display data, and to change the color of the status of the book depending on if it was required (red) or if it was optional (green).
[*ngIf color => tabs2.page.html => line 52](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/tab2/tab2.page.html)

```typescript
    <ion-title size="small">Status:
      <ion-text size="small" *ngIf="b.status == 'Required'" style="color:#ff0000;">{{b.status}}</ion-text>
      <ion-text size="small" *ngIf="b.status != 'Required'" style="color:#000000;">{{b.status}}</ion-text>
    </ion-title>
```

4. ion-card was used to divide each book that could be found within the eBay API. Within each card, the specific book title, URL image, price and option to add to favorites was included.
[ion-card => tabs2.page.html => line 67](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/tab2/tab2.page.html)

```typescript
    <ion-card *ngFor='let item of items'>
      <ion-card-header>
        <ion-card-title>{{item.Title}}</ion-card-title>
      </ion-card-header>
      <img mat-card-image src='{{item.GalleryURL}}'>
      <ion-card-content>
        $ {{item.ConvertedCurrentPrice.Value}} {{item.ConvertedCurrentPrice.CurrencyID}}
      </ion-card-content>
      <ion-button full name="add" (click)="addFavorite(item.ItemID)">
        <ion-icon name="add-circle"></ion-icon> &nbsp;Add to Cart
      </ion-button>
    </ion-card>
```

5. ion-spinner returns a Boolean value of either true or false. We used this so that if data existed to be returned (true) the spinner would be shown. If not an error message was shown that there is no data to be retreived.
[ion-spinner => tabs5.page.html => line 10](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/tab5/tab5.page.html)

```typescript
    <ion-spinner *ngIf="showSpinner"></ion-spinner>
```

[ion-spinner default changed to true => tabs5.page.ts => line 34](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/tab5/tab5.page.ts) 

```typescript
    getFavorites(){
        this.items = [];
        this.userId = this.authService.getUserUid();
        this.showSpinner = true;
        ...
    }
```

6. ion-button was used on every tab. We were able to also implement the buttons using colors and ion-icons.

[ion-button and color => tab4.page.html => line 31](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/tab5/tab5.page.html)

```typescript
    <ion-button color="danger" full name="add" (click)="deleteFavorite(item.ItemID)">
      Remove from Cart &nbsp;<ion-icon name="remove-circle"></ion-icon>
    </ion-button>
```

7. [Ionic Storage](https://ionicframework.com/docs/building/storage) was used only for our Sell/Buy Locally tabs (not included in final project, only used for demo and presentation purposes). We Used this to temporarily store the books that were being sold by users and to retrieve that data from storage.

[Ionic Save Selling Data => data.service.ts => line 106](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/services/data.service/ts)

```typescript
saveSellingData(name: string, data: Selling[]){
    this.storage.set(name, data);
  }
```

[Ionic Get Selling Data => data.service.ts => line 101](https://github.com/Mizzou-CSIT2830-CS7830-F19/hackweekprojects-get-out-me-swamp/blob/master/code/final-project-app/src/app/services/data.service/ts)

```typescript
getSellingData(name: string){
    return this.storage.get(name);
  }
```

## Knowledge Gained

### 1. Firebase authentication

Firebase authentication using social login for both mobile and the web. It requires setting up accounts with Firebase and the social platform selected, as well as installing plugins to work with native mobile applications

### 2. Ion Spinner

Working with the Spinner component `<ion-spinner>`. The spinner can be then toggled using the angular directive ngIf tied to a boolean variable.

## Future Work

### Local Market (Sell/Buy Books directly from students)

- Sell any books to other user and include information about the book (Title, ISBN, Condition, Seller, Location - Zip Code)
- Allow users to buy books to find books for sale in the area (using Zip Code)
- Show the books being sold locally in the search of each section reuired/options books

### Search for BOOKS in other sources (using more apis i.e. Amazon, Valorebooks, Google Books, Barnes & Noble)

- Ideally we would further develop this application for cross site comparison within the program to optimize your options based on best match, lowest price, or best quality from additional retailers such as Amazon, Barnes & Noble, and other trusted sites
- We would intend to monitor credible sources by standarizing a set of criteria that needs to be met in order to back a website and allow them to be listed as a fact-checked retailer on our website (Criteria such as maximum shipping time, high user rating, etc.)

### eBay's Affiliate Program

- Our intention should this project be fully developed and deployed for commercial use would be to enroll in eBay's Affiliate Program
- This would allow us to monetize our buisness depending on traffic to ebay's site due to number of clikcs using our link when buying and viewing books
- Additionally this would also allow us to set up a universal account to grant users access to directly checkout through our buisness website meaning an easy transfer between your cart on our application to ebay's checkout process to finalize the payment procedure

### Allow for interchangable settings/filters to appeal to all students

Such as:

- Language changes on site
- textbooks in other languages
- currency exchange changes/rates
- Larger print
- Braille textbooks

## References

### 1. Authentication/ Login

- [Implement Google login in Ionic 4 apps using Firebase](https://medium.com/enappd/implement-google-login-in-ionic-4-apps-using-firebase-57334bad0910)
- [Facebook login in Ionic 4 Apps using Firebase 🔥](https://medium.com/enappdfacebook-login-in-ionic-4-apps-using-firebase-d765c76f79ab)
- [How to add facebook login to your Ionic App](https://www.back4app.com/docs/ionicionic-framework-login)
- [Ionic Google Login With Firebase and AngularFire](https://angularfirebase.comlessons/ionic-google-login-with-firebase-and-angularfire/)
- [How to integrate Google Login into an Ionic app with Firebase](https:/www.freecodecamp.org/news/how-to-integrate-google-login-into-an-ionic-app-withfirebase-41cb69234919/)
- [Full Angular 7|8|9 Firebase Authentication Tutorial Examples](https:/www.positronx.io/full-angular-7-firebase-authentication-system/)
- [Connect Firebase Realtime NoSQL Cloud Database with Angular App fromScratch](https://www.positronx.io/how-to-connect-firebase-realtime-nosql-clouddatabase-with-angular-app-from-scratch/)
- [Ionic 4 | Create Simple Login and Prevent Page Access using Angular Guards](https:/www.freakyjolly.com/ionic-4-create-simple-login-and-prevent-page-access-using-angularguards/)
- [Firebase Authentication for Web](https://howtofirebase.com/firebase-authenticationfor-web-d58aad62cf6d)
- [Complete Step-by-Step Firebase Authentication in Angular 2 — Part 1](https:/itnext.io/step-by-step-complete-firebase-authentication-in-angular-2-97ca73b8eb32)
- [Complete Step-by-Step Firebase Authentication in Angular 2 — Part 2](https:/itnext.io/part-2-complete-step-by-step-firebase-authentication-in-angular-225d284102632)

### 2. Node API

- [Building A REST API With MongoDB, Mongoose, And Node.js](https://www.thepolyglotdeveloper.com/2019/02/building-rest-api-mongodb-mongoose-nodejs/)
- [How To Build Simple RESTful API With NodeJs, ExpressJs And MongoDb](https://medium.com/@dinyangetoh/how-to-build-simple-restful-api-with-nodejs-expressjs-and-mongodb-99348012925d)

### 3. Angular HTTPClient API Calls

- [Angular HTTPClient](https://angular.io/guide/http)

### 4. Compiling Ionic to executable iOS application

- [Export IPA without a paid Apple Dev Account](https://www.youtube.com/watch?v=ME4_RHCaCAk)

### 5. Angular

- [Creating a New Angular Application](https://angular.io/guide/setup-local)
- [Angular Reactive Forms](https://angular.io/guide/forms-overview)

### 6. AngularJS Material UI

- [Angular Material Getting Started](https://material.angular.io/guide/getting-started)
- [Material Card Component](https://material.angular.io/components/card/overview)

### 7. Ionic Framework

- [Ionic Installation](https://ionicframework.com/docs/installation/cli)
- [Ionic Framework Starter Templates](http://www.blog.planetfor.us/blog/Ionic-Templates.html)
- [Ionic Docs](https://ionicframework.com/docs)
- [Ion Icons](https://ionicons.com/)
- [Ionic Data Storage](https://ionicframework.com/docs/building/storage)

### 8. Reveal.js Presentation

- [Reveal.js Slides](https://revealjs.com/#/)
- [Reveal.js GitHub Slides and Implementation Instructions](https://github.com/hakimel/reveal.js/)
