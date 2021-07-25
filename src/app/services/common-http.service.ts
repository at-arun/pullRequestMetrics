import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AuthConstants } from './auth-constants';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class CommonHttpService {

  constructor(private http:HttpClient, private cookieService: CookieService) { }

  public sendService(url: string, body: any) {
    return this.http.post(url, body, this.setHeaders())
    .pipe(response=>{
      return response;
    });
  }

  public getService(url: string):Observable<{}> {
    let options:any = {
        headers: this.setHeaders()
        , observe: 'response'
    };
    return this.http.get(url, this.setHeaders())
    .pipe(response=>{
      return response;
    });
  }

  public sendWebService(url: string, body:any):Observable<any> {
    let httpOptions = {
      headers : new HttpHeaders()
      , withCredentials : true
    }
    let requestBody = this.objectToFormData(body);
    return this.http.post(url, requestBody, httpOptions)
    .pipe(response=>{
      return response;
    });
  }

  public getWebService(url: string, body:any):Observable<any> {
    let httpOptions = {
      headers : new HttpHeaders()
      , withCredentials : true
    }
    let queryString = Object.keys(body).map(key => key + '=' + body[key]).join('&');

    url += '?'+queryString;
    return this.http.get(url, httpOptions)
    .pipe(response=>{
      return response;
    });
  }

  private setHeaders(observe = '') {
    AuthConstants.userChosenAuth = 'basic';
    // AuthConstants.authUsername = 'arunkt@nalashaa.com';
    // AuthConstants.authPassword = 'Arun@201420';

    let AuthString:string = '';
    let options:object    = {};

    if (this.cookieService.get('CM_authType') == 'basic') {
      // AuthString = 'Basic '+ btoa(AuthConstants.authUsername+':'+AuthConstants.authPassword);
      // AuthString = 'Basic '+ AuthConstants.authCredentials;
      AuthString = this.cookieService.get('CM_cred');
    } else {
      AuthString = 'Bearer '+AuthConstants.authToken;
    }

    if (observe) {
      options = { observe : 'response'};
    }
    const headerSet = new HttpHeaders().set('Authorization', AuthString);
    Object.assign(options, {headers: headerSet});
    return options;
  }

  private objectToFormData (objectBody) {
    let formData = new FormData();
    Object.keys(objectBody).forEach(key => {
      formData.append(key, objectBody[key]);;
    });
    return formData;
  }
}
