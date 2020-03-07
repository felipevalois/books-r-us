import { Injectable } from '@angular/core';
import { Dept, CourseNum, Book, Section } from '../interfaces/model';
import { Favorites } from '../interfaces/favorites';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  httpOptions = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ){ }

  public getDepts(){
    return this.httpClient.get<Dept[]>('https://www.felipevalois.co:8001/departments');
  }

  public getCourse(dept: String){
    return this.httpClient.get<CourseNum[]>('https://www.felipevalois.co:8001/department/' + dept);
  }

  public getSection(dept: String, courseNum: String){
    return this.httpClient.get<Section[]>('https://www.felipevalois.co:8001/sections/' + dept + '/' + courseNum );
  }

  public getISBN(dept: String, course: String, sectionId: String){
    return this.httpClient.get<Book[]>('https://www.felipevalois.co:8001/books/' + dept + '/' + course + '/' + sectionId);
  }

  // ebay
  // https://developer.ebay.com/devzone/shopping/docs/concepts/shoppingapi_formatoverview.html
  public getBooks(isbn: String){
    return this.httpClient.get<any>('https://cors-anywhere.herokuapp.com/http://open.api.ebay.com/shopping?version=515&appid=FelipeCo-MizzouBo-PRD-03882c164-09d27cd9&callname=FindItems&responseencoding=JSON&QueryKeywords=' + isbn, this.httpOptions);
  }

  //ebay -> get single item "323962685693"
  //https://developer.ebay.com/devzone/shopping/docs/CallRef/GetSingleItem.html#Samples
  public getBook(){
    return this.httpClient.get<any>("https://cors-anywhere.herokuapp.com/http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=FelipeCo-MizzouBo-PRD-03882c164-09d27cd9&version=967&ItemID=323962685693", this.httpOptions);
  }

  public addFavorite(itemId: String, userId: String) {
    const endpoint = "https://www.felipevalois.co:8001/favorite/";
    return this.httpClient.post(endpoint, {
      uid: userId,
      itemId: itemId,
    });
  }

  public getFavorites(uid: String){
    return this.httpClient.get<Favorites[]>('https://www.felipevalois.co:8001/favorites/' + uid);
  }

  public getFavoriteBooks(itemId: any){
    return this.httpClient.get<any>("https://cors-anywhere.herokuapp.com/http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=FelipeCo-MizzouBo-PRD-03882c164-09d27cd9&version=967&ItemID=" + itemId, this.httpOptions);
  }

  public deleteFavorite(userId: String, itemId: String){
    return this.httpClient.delete("https://www.felipevalois.co:8001/favorite/" + userId + "/" + itemId, this.httpOptions);
  }
}
