import Link from 'next/link'
import Repository from './repository'

interface OrganizationProps {
  organization: {
    name: string;
    url: string;
    repository: {
      name: string;
      url: string;
      issues: {
        edges: [
          {
            node: {
              id: string;
              title: string;
              url: string;
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
              }
            }
          }
        ]
      }
    }
  };
  onFetchMoreIssues: React.MouseEventHandler<HTMLButtonElement>;
}

const Organization = ({ organization, onFetchMoreIssues }: OrganizationProps) => {
  return (
    <div>
      <p>
        <strong>Issues from Organization:</strong>
        <Link href={organization.url}>
          <a>{organization.name}</a>
        </Link>
      </p>
      <Repository repository={organization.repository} onFetchMoreIssues={onFetchMoreIssues} />
    </div>
  )
}

export default Organization;