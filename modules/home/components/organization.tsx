import { OrganizationInterface } from '../interface'
import Link from 'next/link'
import Repository from './repository'

interface Props {
  organization: OrganizationInterface;
  onFetchMoreIssues: (event: React.MouseEvent<HTMLElement>) => void;
  onStarRepository: (id: string, viewerHasStarred: boolean) => void;
  onFetchMoreReactions: (issueNumber: number, cursor: string) => void;
}

const Organization = ({ organization, onFetchMoreIssues, onStarRepository, onFetchMoreReactions }: Props) => {
  return (
    <div>
      <p>
        <strong>Issues from Organization:</strong>
        <Link href={organization.url}>
          <a>{organization.name}</a>
        </Link>
      </p>
      <Repository
        repository={organization.repository}
        onFetchMoreIssues={onFetchMoreIssues}
        onStarRepository={onStarRepository}
        onFetchMoreReactions={onFetchMoreReactions}
      />
    </div>
  )
}

export default Organization;