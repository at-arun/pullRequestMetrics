import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonHttpService } from '../services/common-http.service';
import { BitBucketUrls } from '../models/config.model';
import { AuthConstants } from '../services/auth-constants';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 
  username:string     = '';
  password:string     = '';

  // registration related
  codeRepoTypes:any[]     = [];
  jiraDomainName:string   = '';
  jiraUserName:string     = '';
  jiraPassword:string     = '';
  codeRepoUsername:string = '';
  codeRepoPassword:string = '';
  codeRepoSelected:any[] = [];

  appUsername: string = '';
  appPassword:string = '';

  showRegistrationForm:boolean = false;
  showLoginForm:boolean = true;

  registrationHelpersFetched:boolean = false;

  constructor( private router:Router
              , private httpClient:CommonHttpService
              , private bitBucketUrl: BitBucketUrls
              , private cookieService: CookieService
  ) { 
   
  }

  ngOnInit() {
    
  }
 
  validateUser() {
    let username = this.username;
    let password = this.password;
   
    this.authenticateUser(username, password);
  }

  authenticateUser (username, password) {
    let cred = 'Basic '+ btoa(username+':'+password);
    this.cookieService.set('CM_cred', cred);
    this.cookieService.set('CM_authType', 'basic');
  
    let authenticationUrl = this.bitBucketUrl.getLoginUrl();
    this.httpClient.getService(authenticationUrl)
    .subscribe(response=>{
      let userDisplayName = response['display_name'];
      let userAvatar = response['links']['avatar']['href'];

      this.cookieService.set('CM_displayName', userDisplayName);
      this.cookieService.set('CM_avatar', userAvatar);

      this.router.navigate(['/repositories']);
    }, error=>{
      alert('Invalid credentials');
    });
  }
}
