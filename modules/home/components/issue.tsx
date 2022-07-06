import { IssueInterface } from '../interface'

interface Props {
  issue: IssueInterface;
  onFetchMoreReactions: (issueNumber: number, cursor: string) => void;
}

export const Issue = ({issue, onFetchMoreReactions}: Props) => {
  const { endCursor, hasNextPage } = issue.reactions.pageInfo;
  return (
    <li>
      <a href={issue.url}>{issue.title}</a>
      <ul>
        {issue.reactions.edges.map(({ node }) => (
          <li key={node.id}>
            {node.content}
          </li>
        ))}
      </ul>
      { hasNextPage && 
        <button onClick={() => onFetchMoreReactions(issue.number, endCursor)}>
          More
        </button>
      }
    </li>
  )
}

export default Issue;