import { useQuery } from '@apollo/client/react';
import { GET_REPOSITORY } from '../graphql/queries';

const useRepository = (id) => {
  const { data, error, loading, refetch } = useQuery(GET_REPOSITORY, {
    fetchPolicy: 'cache-and-network',
    variables: { id },
  });

  if (error) {
    console.log('GraphQL Error:', error);
  }

  const repository = data ? data.repository : undefined;

  return { repository, loading, refetch };
};

export default useRepository;