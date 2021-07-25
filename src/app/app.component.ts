import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent, NavigationEnd } from '@angular/router';
import { AuthConstants } from './services/auth-constants';
import { CookieService } from 'ngx-cookie-service';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  @ViewChild(HeaderComponent, {static: false}) HeaderComponent:HeaderComponent;

  title:string          = 'Code Review Metrics';
  showHeader:boolean    = false;

  constructor(private router:Router, private cookieService: CookieService) {

  }
  ngOnInit() {
    this.router.events
    .subscribe(
      (event: NavigationEvent) => {
        if(event instanceof NavigationStart) {
          if (event['url'] == '/login' || event['url'] == '/logout' || event['url'] == '/') {
              this.showHeader = false;
          } else {
              this.showHeader = true;
              if (!this.isValidRequest())
              {
                if (this.HeaderComponent)
                {
                  this.HeaderComponent.logout();
                }
                this.router.navigate(['logout']);
              }
          }
        }
        else if (event instanceof NavigationEnd)
        {
          let urlFragment = event['url'];
          if (urlFragment.match(/#/g))
          {
            let queryStringArray = urlFragment.split('#')[1].split('&');
            queryStringArray.forEach(element => {
              let queryStringParts = element.split('=');
              if (queryStringParts[0] == 'access_token') {
                AuthConstants.authToken = queryStringParts[1];
              } else if (queryStringParts[0] == 'token_type') {
                AuthConstants.authTokenType = queryStringParts[1];
              } else if (queryStringParts[0] == 'expires_in') {
                AuthConstants.authTokenExpiry = new Date().getTime() + parseInt(queryStringParts[1]);
              }
            });
            this.router.navigate(['home']);
          }
        }
    }); //router event ends

  }

  public isValidRequest()
  {
    return (this.cookieService.check('CM_cred')); 
  }
}
