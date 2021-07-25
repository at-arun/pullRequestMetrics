import { Component, OnInit } from '@angular/core';
import { CommonHttpService } from '../../services/common-http.service';
import { BitBucketUrls } from '../../models/config.model';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthConstants } from '../../services/auth-constants';
import { forkJoin } from 'rxjs';
import { formatDate } from '@angular/common';


/* custom date-picker _starts */
  import {FormControl} from '@angular/forms';
  import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
  import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
  import {MatDatepicker, MatDatepickerInputEvent} from '@angular/material/datepicker';
  import * as _moment from 'moment';
  import {default as _rollupMoment, Moment} from 'moment';
  const moment = _rollupMoment || _moment;

  export const MY_FORMATS = {
    parse: {
      dateInput: 'MM/YYYY',
    },
    display: {
      dateInput: 'MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };
/* custom date-picker _ends */

@Component({
  selector: 'app-pull-requests',
  templateUrl: './pull-requests.component.html',
  styleUrls: ['./pull-requests.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class PullRequestsComponent implements OnInit {
  showProgress:boolean = true;
  repoSlug:string = '';
  pullRequestArray:any = [];
  is_paginated:boolean = false;
  nextResultUrl:string   = '';
  previousResultUrl:string = '';
  totalPages:number = 0;
  pages:any = [];
  activePage:number = -1;
  nextPageLink:any = '';
  showPageNavs:boolean = false;
  previousPageLink:any = '';
  selectedRepositoryName:string = '';

  pullRequestStatus:any = [
    {value: 'OPEN', viewValue: 'Open'},
    {value: 'MERGED', viewValue: 'Merged'},
    {value: 'DECLINED', viewValue: 'Declined'}
  ];
  selectedPrStatus:string = '';
  dateFilter = '';

  private allPullRequestsUrl: string = '';

  date = new FormControl(moment());
  constructor(private httpClient:CommonHttpService 
    , private activatedRoute:ActivatedRoute
    , private bitbucketUrls:BitBucketUrls
    , private router:Router
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params=>{
      this.repoSlug = params.get('repoSlug');
    });
    this.selectedPrStatus = 'OPEN';
    if (this.repoSlug)
    {
      this.repoSlug = this.repoSlug.replace('^', '/');
      this.getApiUrlDetails();
    }
   
  }

  getApiUrlDetails () {
    this.allPullRequestsUrl = this.bitbucketUrls.getPullRequestsByRepo(this.repoSlug);
    this.filterPullRequest();

  }
 
  getPullRequests (status, dateArray) {
    this.showProgress = true;
    let pullRequestStatus = 'OPEN';
    let dateFilter = '';
    if (status)
    {
      pullRequestStatus = status;
    }
    if (dateArray.length > 0)
    {
      dateFilter = dateArray;
    }
    let filters = '(state="'+pullRequestStatus+'")';
    if (dateFilter)
    {
      filters += 'AND ( ';
      filters += (dateArray[0]) ? 'created_on > '+dateFilter[0] : '';
      filters += (dateArray[1]) ? 'AND created_on < '+dateFilter[1] : '';
      filters += ' )';

    }

    let pullRquestsUrl = this.allPullRequestsUrl + '?q='+filters;
    this.httpClient.getService(
      pullRquestsUrl
    ).subscribe(response=>{
      let pullRequests = response['values'];
      this.buildPagination(response['size'], response['page'], response['next'])
      this.updatePullRequestArray(pullRequests, true);
      this.showProgress = false;
    });
  }

  updatePullRequestArray(pullRequests, clear) {
    if (clear)
    {
      this.pullRequestArray = [];
    }
    pullRequests.forEach(pullRequest => {
      this.pullRequestArray.push({
          'pullRequestId' : pullRequest['id']
        , 'title'         : pullRequest['title']
        , 'commentsLink'  : pullRequest['links']['comments']['href']
        , 'totalComments' : pullRequest['comment_count']
        , 'state'         : pullRequest['state']
        , 'created'       : pullRequest['created_on']
        , 'author'        : pullRequest['author']['display_name']
        , 'authorImage'   : pullRequest['author']['links']['avatar']['href']
      });
      this.selectedRepositoryName = pullRequest['source']['repository']['name'];
    });
  }

  buildPagination(size, currentPage, nextLink) {
    
    this.pages            = [];
    this.totalPages       = Math.ceil(size / 10);
    if (this.totalPages <= 1)
    {
      return false;
    }
    this.showPageNavs = (this.totalPages > 7 ) ? true : false;
    let paginationStart:number   = currentPage;
    let activePagesToShow = 0;
    var isAtRight         = false;
    var ellipseObect      = {index: -1, link: ''};

    if (this.showPageNavs)
    {
      activePagesToShow   = (currentPage + 2 >= this.totalPages) ? paginationStart +1 : currentPage + 2;
      if ( (this.totalPages - currentPage) < (currentPage - 1) )
      {
        isAtRight         = true;
        paginationStart   = currentPage - 2;
        activePagesToShow = currentPage;
      }
    }
    else
    {
      paginationStart   = 1;
      activePagesToShow = this.totalPages - 1;
    }
    
    let page              = [];
    let pageReplaceRegExp = /(page=\d*)/;

    this.activePage       = currentPage;
    let nextPage          = currentPage + 1;
    let prevPage          = Number(currentPage)-1;
    
    this.nextPageLink     = nextLink.replace( pageReplaceRegExp, 'page='+nextPage);
    this.previousPageLink = nextLink.replace( pageReplaceRegExp, 'page='+prevPage);

    for (let index:number = paginationStart; index <= activePagesToShow; index++) {
      let replaceWith = 'page='+index;
      page.push({
        'index' : index,
        'link'  : nextLink.replace(pageReplaceRegExp, replaceWith)
      });
    }

    if (this.showPageNavs)
    {
      if (isAtRight)
      {
        let replaceWith = 'page='+1;
        page.unshift({ 
          index: 1,
          link:  nextLink.replace(pageReplaceRegExp, replaceWith)
        },
        ellipseObect);
      }
      else
      {
        let replaceWith = 'page='+ this.totalPages;
        page.push(
          ellipseObect,
          { 
            index: this.totalPages,
            link:  nextLink.replace(pageReplaceRegExp, replaceWith)
          });
      }
    }
    this.pages = page;
  }

  pullNextResult(link) {
    window.scroll(0, 0);
    this.showProgress = true;
    this.httpClient.getService(
      link
    ).subscribe(response=>{
      let pullRequests = response['values'];
      if (response['size'] > 10)
      {
        let nextLink = (response['next']) ? response['next'] : response['previous'];
        this.buildPagination(response['size'], response['page'], nextLink);
      }
      this.updatePullRequestArray(pullRequests, true);
      this.showProgress = false;
    });
  }

  filterPullRequest() {
    let dateObject = this.date.value;
    let status = this.selectedPrStatus;

    let firstDay = new Date(dateObject.year(), dateObject.month(), 1); 
    let lastDay = new Date(dateObject.year(), dateObject.month() + 1, 0);

    let firstDayIso = firstDay.toISOString();
    let lastDayIso = lastDay.toISOString();

    let dateFilterArray:any = [firstDayIso, lastDayIso];
    this.getPullRequests (status, dateFilterArray);
  }

  exportToCsv () {
    var exportArray = [];
    this.pullRequestArray.forEach(pullRequest => {
      exportArray.push(
        {
          'Issue Key'       : this.ticketNumberFromPRTitle(pullRequest['title'])
          , 'Title'           : pullRequest['title']
          , 'Total comments'  : pullRequest['totalComments']
          , 'Status'          : pullRequest['state']
          , 'Assigned To'     : pullRequest['author']
        }
      )
    });
    let serviceArray= [];
    for (var key in this.pullRequestArray)
    {
      let commnetsLink = this.pullRequestArray[key]['commentsLink'] + '?page=1&pagelen=100';
      serviceArray.push(this.httpClient.getService( commnetsLink ));
    }
   
    forkJoin(serviceArray).subscribe(allResults=>{
        for (var key in allResults)
        {
          let response = allResults[key]['values'];
          let commentsData = [];
          response.forEach(element=>{
            if (element['content']['raw'] != '') {
              commentsData.push({
                  'comment'       : element['content']['raw']
                , 'givenBy'       : element['user']['display_name']
                , 'givenOn'       : formatDate(element['created_on'], 'medium', 'en-US')
                , 'pullRequestId' : element['pullrequest']['id']
              });
            }
          }); // outer foreach
          exportArray[key]['comments'] = commentsData;
        }
        this.initiateExportToCSV(exportArray);
    }); // end of forkJoin
   
  }

  initiateExportToCSV(dataArray) {
    if (!dataArray.length) {
      return;
    }

    let dateObject = this.date.value;
    let yearAndMonth = dateObject.format("YYYY-MMM");
    let fileName = "codeReviewMetrics-" + yearAndMonth + ".csv";
    let csvContent = "data:text/csv;charset=utf-8,";

    csvContent += this.objectToCSVRow(dataArray);

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link); 
  }

  objectToCSVRow (dataObject) {

    const separator   = ',';
    let CsvString     = '';
    
    const keys        = Object.keys(dataObject[0]);
    keys.push('Reviewed By');
    const blankCells  = keys.length - 2;

    let blankCellData = '';
    for (var i=1; i< blankCells; i++)
    {
      blankCellData += ''+separator;
    }
    // build the header by the object keys.
    CsvString += keys.join(separator) + '\n';

    // build the data row.
    dataObject.forEach(rowData => {
      keys.map(k=>{
        let cellData = rowData[k];
        
        let cellDataType = typeof cellData;
        if (cellDataType == 'string' || cellDataType == 'number')
        {
          cellData = this.sanitazieExcelCellData(cellData);
          CsvString += cellData + separator;
        }
        else if( cellDataType == 'object' && cellData.length > 0)
        {
          let isFirstLine = true;
          let lineBreak   = '';
          cellData.forEach(commentObject => {
            
            let comment = commentObject['comment'];
            let givenBy = ( commentObject['givenBy'] ) ? commentObject['givenBy'] : "";
            comment     = this.sanitazieExcelCellData(comment);
            givenBy     = this.sanitazieExcelCellData(givenBy);
            if (isFirstLine)
            {
              lineBreak = '';
            }
            CsvString += lineBreak +  comment + separator + givenBy + separator  + '\n';
            isFirstLine = false;
            lineBreak   = blankCellData + separator;
          });
          // remove the new line added to the end of each comment block
          // CsvString = CsvString.trimRight();
        }
      });
      CsvString += '\n';
    });
    return CsvString;

  }// func ends

  sanitazieExcelCellData (cell)
  {
    cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
    if (cell.search(/("|,|\n)/g) >= 0) {
      cell = `"${cell}"`;
    }
    return cell;
  }

  ticketNumberFromPRTitle(title)
  {
    let issueKey  = "";
    let regExp    = /(crm-[\d]{1,4})/i;
    let matches   = title.match(regExp);

    if (matches.length > 0)
    {
      issueKey = matches[0];
    }
    return issueKey;
  }
  /* date picker handler _starts */
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  
    let dateObject = this.date.value;
    let date = dateObject.year()+'-'+dateObject.month();
  }
  /* date picker handler _ends */
  setCommentsLinkAndRedirect(repoName, slugName, id) {
    // this.sharedDataService.setSharedUrl(link);
    this.router.navigate(['/comments', repoName, id, slugName]);
  }
} // class ends
