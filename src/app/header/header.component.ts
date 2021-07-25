import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonHttpService } from '../services/common-http.service';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterContentInit {
  public userName:string    = '';
  public userAvatar:string  = '';

  constructor(
      private router:Router
      , private httpClient:CommonHttpService
      , public dialog: MatDialog
      , private cookieService: CookieService
  ) { }

  ngOnInit() { }

  ngAfterContentInit () {
    this.fetchUserDetails();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '19%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.data)
      {
        this.logout();
      }
      return true;
    });
  }

  logout()
  {
    this.cookieService.deleteAll('', 'localhost');
    // redirection logic
    this.router.navigate(['/login']);
  }

  fetchUserDetails ()
  {
    this.userName = this.cookieService.get('CM_displayName');
    this.userAvatar = this.cookieService.get('CM_avatar');
  }
}

// dialogue code

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
            <h5 mat-dialog-title>Do you wish to logout?</h5>
            <div mat-dialog-actions class="dialogueAction">
              <button mat-flat-button class="customSuccessBtn" (click)="onNoClick()">No</button>
              <button mat-flat-button class="floatRight" (click)="onYesClick()"	color="warn"  cdkFocusInitial>Yes</button>
            </div>
  `,
  styleUrls: ['./header.component.css']
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>
    ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close({data: true});
  }
}
