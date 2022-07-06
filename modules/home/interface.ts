/*{
  organization: {
    name
    url
    repository: {
      id
      name
      url
      stargazers {
        totalCount
      }
      viewerHasStarred
      issues: {
        edges: [ 
          {
            node: {
              id
              title
              url
              number
              reactions: {
                edges: [
                  node: {
                    id
                    content
                  }
                ]
                totalCount
                pageInfo {
                  endCursor
                  hasNextPage
                }
              }
            }
          }
        ]
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
}*/

export interface OrganizationInterface {
    name: string;
    url: string;
    repository: RepositoryInterface;
}


export interface RepositoryInterface {
    id: string;
    name: string;
    url: string;
    viewerHasStarred: boolean;
    stargazers: {
      totalCount: number;
    };
    issues: IssuesInterface;
}

export interface IssuesInterface {
  edges: [
    {
      node: IssueInterface
    }
  ];
  totalCount: number;
  pageInfo: {
    endCursor: string;
    hasNextPage: boolean;
  }
}

export interface IssueInterface {
    id: string;
    title: string;
    url: string;
    number: number;
    reactions: {
      edges: [
        {
          node: {
            id: string;
            content: string;
          }
        }
      ];
      totalCount: number;
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
    };
}
