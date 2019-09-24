import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageServiceService {

  private APIKey = environment.APIKey;
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  getImage(topic): Observable<any> {
    const URl = environment.serAPI.replace('Topic', topic.trim() + ' musique').replace('API', this.APIKey);
    console.log(URl);
    return this.http.get(URl);
  }
}
