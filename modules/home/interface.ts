/*{
  repository: {
    issues: {
      edges: [ 
        {
          node: {
            reactions: {
              edges: [
                node: {

                }
              ]
            }
          }
          pageInfo
        }
      ]
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
