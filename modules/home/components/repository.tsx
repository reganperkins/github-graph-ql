import { RepositoryInterface } from '../interface'
import Issue from './issue'

interface Props {
  repository: RepositoryInterface;
  onFetchMoreIssues: (event: React.MouseEvent<HTMLElement>) => void;
  onStarRepository: (id: string, viewerHasStarred: boolean) => void;
  onFetchMoreReactions: (issueNumber: number, cursor: string) => void;
}

const Repository = ({ repository, onFetchMoreIssues, onStarRepository, onFetchMoreReactions }: Props) => (
<div>
    <p>
      <strong>In Repository:</strong>
      <a href={repository.url}>{repository.name}</a>
      <button
        type="button"
        onClick={() => onStarRepository(repository.id, repository.viewerHasStarred)}
      >
        {repository.viewerHasStarred ? 'Unstar' : 'Star'}
      </button>
    </p>
    <ul>
        {repository.issues.edges.map(({node}) => 
            <Issue key={node.id} issue={node} onFetchMoreReactions={onFetchMoreReactions} />
        )}
    </ul>
    <hr />
    { repository.issues.pageInfo.hasNextPage
      && <button onClick={onFetchMoreIssues}>More</button>}
</div>
);

export default Repository;