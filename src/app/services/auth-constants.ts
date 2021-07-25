/**
 * This functionality must be handled by SESSION.
 *  */ 
export class AuthConstants {

  constructor() {
    
   }

  public static authUrl:string          = 'https://bitbucket.org/site/oauth2/authorize';
  public static authTokenUrl:string     = 'https://bitbucket.org/site/oauth2/access_token';
  public static authClientId:string     = 'KuPLkNSNF9TSzuPyRV';
  public static authClientSecret:string = '99RepLgq4T3cDHXDFsMxSB27H8Qjn9Wk';
  public static authToken:string        = '';
  public static authTokenType:string    = '';
  public static authTokenExpiry:number  = 0;

  public static authUsername:string     = '';
  public static authPassword:string     = '';
  public static authCredentials:string  = ''; 
  public static userChosenAuth:string   = 'basic';

  public static API_URL:string          = '';
  public static API_VERSION:string      = '';
  public static API_TEAMS:string        = '';
  public static API_ALL_REPOSITORIES:String = '';
  public static API_PULL_REQUESTS_START_POINT = '';
  public static API_PULL_REQUESTS_END_POINT:String = '';

  public static isBasicAuthChosen() {
    return (AuthConstants.userChosenAuth === 'basic')  ? true : false;
  }

  public static setBitbucketUrls() {
    AuthConstants.API_URL     = 'https://api.bitbucket.org';
    AuthConstants.API_VERSION = '2.0';
    AuthConstants.API_TEAMS   = 'teams/?role=member';
    AuthConstants.API_ALL_REPOSITORIES = 'repositories/?role=contributor';
    AuthConstants.API_PULL_REQUESTS_START_POINT = 'repositories';
    AuthConstants.API_PULL_REQUESTS_END_POINT = 'pullrequests';
  }

  public static setGithubUrls() {
    AuthConstants.API_URL     = 'https://api.github.com/';
    AuthConstants.API_VERSION = '';
  }
}
