import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonHttpService } from '../../services/common-http.service';
import { BitBucketUrls } from '../../models/config.model';
import { Location } from '@angular/common';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  showProgress:boolean = true;
  pullRequestId:string  = '';
  slugName:string = '';
  commentsData:any      = [];
  pullRequestTitle:string = '';
  selectedRepoName:string = '';
  private commentsUrl:string = '';

  constructor(private httpClient:CommonHttpService, 
    private activatedRoute:ActivatedRoute,
    private location:Location,
    private bitbucketUrls:BitBucketUrls
    ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params=>{
      this.selectedRepoName = params.get('repoName');
      this.pullRequestId  = params.get('id');
      this.slugName       = params.get('slugName');
    });
    if (this.pullRequestId && this.slugName)
    {
      let commentsUrl = this.bitbucketUrls.getCommentsByPullRequestId(this.pullRequestId, this.slugName);
      this.pullComments(commentsUrl);
    }
  }

  pullComments(commentsUrl) {
    this.httpClient.getService(
      commentsUrl
    ).subscribe(response=>{
      let allComments       = response['values'];
      
      allComments.forEach(element => {
        if (!this.pullRequestTitle)
        {
          this.pullRequestTitle = element['pullrequest']['title'];
        }
        if (element['content']['raw']) {
          this.commentsData.push({
              'comment'       : element['content']['raw']
            , 'givenBy'       : element['user']['display_name']
            , 'givenOn'       : element['created_on']
            , 'pullRequestId' : element['pullrequest']['id']
          });
        }
        this.showProgress = false;
      });
    });
  }

  public goBack() {
    this.location.back();
  }
}
