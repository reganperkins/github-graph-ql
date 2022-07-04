import Link from 'next/link'

interface OrganizationProps {
  organization: {
    name: string;
    url: string;
  },
  errors: {
    message: string,
  }[],
}

const Organization = ({ organization, errors }: OrganizationProps) => {
  if (errors) return (
    <p>
      <strong>Something went wrong:</strong>
      {errors.map(error => error.message).join(' ')}
    </p>
  );

  return (
    <div>
      <p>
        <strong>Issues from Organization:</strong>
        <Link href={organization.url}>
          <a>{organization.name}</a>
        </Link>
      </p>
    </div>
  )
}

export default Organization;