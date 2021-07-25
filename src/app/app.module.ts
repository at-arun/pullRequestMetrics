import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent, DialogOverviewExampleDialog } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommentsComponent } from './home/comments/comments.component';
import { RepositoriesComponent } from './home/repositories/repositories.component';
import { PullRequestsComponent } from './home/pull-requests/pull-requests.component';
import { BitBucketUrls } from './models/config.model';

// below module are required for material design and there is scope for optimization.
/*  material module import starts here */
  import { MatCardModule } from '@angular/material/card';
  import { MatFormFieldModule } from '@angular/material';
  import { MatGridListModule } from '@angular/material/grid-list';
  import { MatTooltipModule } from '@angular/material/tooltip';
  import { MatButtonModule } from '@angular/material/button';
  import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
  import { MatProgressBarModule } from '@angular/material/progress-bar';
  
  import { MatSelectModule } from '@angular/material/select';
  import { MatNativeDateModule } from '@angular/material/core';
  import { MatDatepickerModule } from '@angular/material/datepicker';
  import { MatInputModule } from '@angular/material';
  import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
  import { MatMenuModule } from '@angular/material/menu';
  import { MatAutocompleteModule } from '@angular/material/autocomplete';
  import { MatListModule } from '@angular/material/list';
  import { MatIconModule } from '@angular/material/icon';


/*  material module import ends here */

/** cookie service */
import { CookieService } from 'ngx-cookie-service';

const appRoutes: Routes = [
    { path: 'login',          component: LoginComponent }

  , { path: 'repositories',   component: RepositoriesComponent}
  , { path: 'pull-requests/:repoSlug',   component: PullRequestsComponent}
  , { path: 'comments/:repoName/:id/:slugName',   component: CommentsComponent}

  , { path: 'logout',               component: LoginComponent}
  , { path: '',               component: LoginComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    CommentsComponent,
    RepositoriesComponent,
    PullRequestsComponent,
    DialogOverviewExampleDialog,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,

    MatProgressBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatGridListModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatMenuModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatListModule,
    MatIconModule
  ],
  entryComponents: [HeaderComponent, DialogOverviewExampleDialog],
  providers: [
              { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
              , CookieService
              , BitBucketUrls
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }

