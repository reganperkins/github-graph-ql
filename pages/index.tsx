import type { NextPage } from 'next'
import axios from 'axios';
import Head from 'next/head'
import Organization from '../modules/home/components/organization'
import {useState, useEffect} from 'react'
import styles from '../styles/Home.module.css'

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${
      process.env.NEXT_PUBLIC_GITHUB_PERSONAL_ACCESS_TOKEN
    }`,
  },
});
const TITLE = 'React GraphQL GitHub Client';

const GET_ISSUES_OF_REPOSITORY = `
  query ($organization: String!, $repository: String!, $cursor: String) {
    organization(login: $organization) {
      name
      url
      repository(name: $repository) {
        id
        name
        url
        viewerHasStarred
        stargazers {
          totalCount
        }
        issues(first: 5, after: $cursor, states: [OPEN]) {
          edges {
            node {
              id
              title
              url
              number
              reactions(first: 3) {
                edges {
                  node {
                    id
                    content
                  }
                }
                totalCount
                pageInfo {
                  endCursor
                  hasNextPage
                }
              }
            }
          }
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`;

const GET_MORE_REACTIONS = `
  query($organization: String!, $repository: String!, $issueNumber: Int!, $cursor: String!) {
    repository(owner: $organization, name: $repository) {
      issue(number: $issueNumber) {
        reactions(first: 3, after: $cursor) {
          edges {
            node {
              id
              content
            }
          }
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`;

const REMOVE_STAR = `
  mutation ($id: ID!) {
    removeStar(input:{starrableId: $id}) {
      starrable {
        viewerHasStarred
      }
    }
  }
`;

const ADD_STAR = `
  mutation ($id: ID!) {
    addStar(input:{starrableId: $id}) {
      starrable {
        viewerHasStarred
      }
    }
  }
`;

interface initialErrorProps {
  message: string;
}

const Home: NextPage = () => {
  const [path, setPath] = useState('the-road-to-learn-react/the-road-to-learn-react');
  const [organization, setOrganization] = useState();
  const [errors, setErrors] = useState<initialErrorProps[] | undefined>();

  const getIssuesOfRepository = (cursor?: string) => {
    const [org, repo] = path.split('/');
    axiosGitHubGraphQL
      .post('', {
        query: GET_ISSUES_OF_REPOSITORY,
        variables: {
          organization: org,
          repository: repo,
          cursor
        },
      })
      .then((queryResult) => resolveIssuesQuery(queryResult, cursor));
  }

  const resolveIssuesQuery = (queryResult, cursor?: string) => {
    const { data, errors } = queryResult.data;

    if (!cursor) {
      setOrganization(data.organization);
    } else if (organization) {
      const { edges: oldIssues } = organization.repository.issues;
      const { edges: newIssues } = data.organization.repository.issues;
      setOrganization({
        ...data.organization,
        repository: {
          ...data.organization.repository,
          issues: {
            ...data.organization.repository.issues,
            edges: [...oldIssues, ...newIssues],
          },
        },
      });
    }
    setErrors(errors);
  }

  const onFetchMoreIssues = () => {
    if (organization) {
      const {endCursor} = organization.repository.issues.pageInfo;
      getIssuesOfRepository(endCursor);
    }
  }

  const onFetchMoreReactions = (issueNumber: number, cursor: string) => {
    const [org, repo] = path.split('/');
    axiosGitHubGraphQL
      .post('', {
        query: GET_MORE_REACTIONS,
        variables: {
          organization: org,
          repository: repo,
          issueNumber,
          cursor
        },
      })
        .then((queryResult) => resolveReactionsQuery(queryResult, issueNumber))
  }

  const resolveReactionsQuery = (queryResult, issueNumber: number) => {
    const { data, errors } = queryResult.data;
    const updatedIssueEdges = organization.repository.issues.edges.map((edge) => {
      if (edge.node.number === issueNumber) {
        return {
          ...edge,
          ...{
            node: {
              ...edge.node,
              reactions: {
                ...edge.node.reactions,
                edges: [...edge.node.reactions.edges, ...data.repository.issue.reactions.edges],
                pageInfo: {
                  ...data.repository.issue.reactions.pageInfo,
                },
                totalCount: data.repository.issue.reactions.totalCount
              }
            }
          }
        };
      }
      return edge;
    })
    
    setOrganization({
      ...organization,
      repository: {
        ...organization.repository,
        issues: {
          ...organization.repository.issues,
          edges: updatedIssueEdges,
        }
      }
    });
    setErrors(errors);
  }

  const onStarRepository = (id: string, isStared: boolean) => {
    if (isStared) {
      removeStarToRepository(id);
    } else {
      addStarToRepository(id);
    }
  };

  const resolveRemoveStarMutation = (mutationResult) => {
    const {  viewerHasStarred } = mutationResult.data.data.removeStar.starrable;
    const { totalCount } = organization.repository.stargazers;
    setOrganization({
      ...organization,
      repository: {
        ...organization.repository,
        viewerHasStarred,
        stargazers: {
          totalCount: totalCount - 1,
        }
      }
    });
  };

  const removeStarToRepository = (id: string) => {
    return axiosGitHubGraphQL.post('', {
      query: REMOVE_STAR,
      variables: { id },
    })
      .then(resolveRemoveStarMutation);
  };

  const resolveAddStarMutation = (mutationResult) => {
    // if (!organization) return;
    const {  viewerHasStarred } = mutationResult.data.data.addStar.starrable;
    const { totalCount } = organization.repository.stargazers;
    setOrganization({
      ...organization,
      repository: {
        ...organization.repository,
        viewerHasStarred,
        stargazers: {
          totalCount: totalCount + 1,
        }
      }
    });
  };

  const addStarToRepository = (id: string) => {
    return axiosGitHubGraphQL.post('', {
      query: ADD_STAR,
      variables: { id },
    })
      .then(resolveAddStarMutation);
  };

  useEffect(() => {
   getIssuesOfRepository();
  }, []);

  const inputUpdated = (e: React.ChangeEvent<HTMLInputElement>) => setPath(e.currentTarget.value);
  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    getIssuesOfRepository();
  };
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <main>
        <h1>{TITLE}</h1>
        <form onSubmit={submitForm}>
          <label htmlFor="url">
            Show open issues for https://github.com/
          </label>
          <input
            id="url"
            type="text"
            value={path}
            onChange={inputUpdated}
            autoFocus
          />
          <button type="submit">Submit</button>
        </form>

        <hr />
        { errors ?
          <p>
            <strong>Something went wrong:</strong>
            {errors.map(error => error.message).join(' ')}
          </p>
        : (organization
          ? <Organization
              organization={organization}
              onFetchMoreIssues={onFetchMoreIssues}
              onStarRepository={onStarRepository}
              onFetchMoreReactions={onFetchMoreReactions}
            />
          : <p>No information yet ...</p>
        )
      } 
      </main>
    </div>
  )
}

export default Home
