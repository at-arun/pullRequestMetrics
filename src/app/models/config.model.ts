
export class BitBucketUrls {
    private API_URL 					= 'https://api.bitbucket.org';
	private API_VERSION 				= '2.0';
    private API_ALL_REPOSITORIES 		= 'repositories/?role=contributor';
    private API_PULL_REQUEST_START_POINT= 'repositories';
	private API_PULL_REQUEST_END_POINT 	= 'pullrequests';
	private API_PR_COMMENTS_END_POINT 	= 'comments';

    public getLoginUrl()
    {
        return this.API_URL+'/'+this.API_VERSION+'/user';
    }

    public getAllRepositoriesUrl()
    {
        return this.API_URL+'/'+this.API_VERSION+'/'+this.API_ALL_REPOSITORIES;
    }

    public getPullRequestsByRepo(repoName)
    {
        return this.API_URL+'/'+this.API_VERSION+'/'+this.API_PULL_REQUEST_START_POINT+'/'+repoName+'/'+this.API_PULL_REQUEST_END_POINT;
    }

    public getCommentsByPullRequestId(pullRequestId, slugName)
    {
        return this.API_URL+'/'+this.API_VERSION+'/'+this.API_PULL_REQUEST_START_POINT+'/'+slugName+'/'+this.API_PULL_REQUEST_END_POINT+'/'+pullRequestId+'/'+this.API_PR_COMMENTS_END_POINT;
    }
}
