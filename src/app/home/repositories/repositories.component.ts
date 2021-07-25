import { Component, OnInit } from '@angular/core';
import { CommonHttpService } from '../../services/common-http.service';
import { Router } from '@angular/router';
import { BitBucketUrls } from '../../models/config.model';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.css']
})
export class RepositoriesComponent implements OnInit {
  showProgress:boolean = false;
  public allRepositories:any  = [];
  public user_name:any        = "";
  public user_avatar:string   = "";
  public is_paginated:boolean = false;
  public nextRepoUrl:string   = '';

  private allRepositoriesUrl  = '';

  constructor(
              private httpClient:CommonHttpService
              , private router:Router
              , private cookieService: CookieService
              , private bitbucketUrls: BitBucketUrls
  ) { }

  ngOnInit() {
    this.getAllRepositories();
  }

  getAllRepositories() {
    this.showProgress = true;

    let webApiUrl = this.bitbucketUrls.getAllRepositoriesUrl();

    this.httpClient.getService(webApiUrl)
    .subscribe(response=>{
      if (response)
      {
        let result = response;
        let allRepositories = result['values'];
        if (result['next'])
        {
          this.is_paginated = true;
          this.nextRepoUrl  = result['next'] ;
        }
        this.updateAllRepoArray(allRepositories);
        this.showProgress = false;
      }
    }, error=>{
      alert('Unable to fetch repositories');
    });
    
  }
  nextRepoResult(url) {
    this.showProgress = true;

    this.httpClient.getService(url)
    .subscribe(response=>{
      let allRepositories = response['values'];
      this.is_paginated = false;
      this.nextRepoUrl  = '';
      if (response['next'])
      {
        this.is_paginated = true;
        this.nextRepoUrl  = response['next'] ;
      }
      this.updateAllRepoArray(allRepositories);
      this.showProgress = false;
    });
  }
  updateAllRepoArray (allRepositories) {
    allRepositories.forEach(repository => {
      this.allRepositories.push({
          'name'            : repository['name']
        , 'type'            : repository['type']
        , 'avatar'          : repository['links']['avatar']['href']
        , 'repoSlug'        : repository['workspace']['uuid']+"^"+repository['uuid']
      });
    });
  }

  // implement the search here.
  searchRepo(name) {
    this.allRepositories.forEach(repository => {
      if (repository.name.indexOf(name))
      {
        
      }
    });
  }
}
