import { useQuery } from '@apollo/client/react';
import { GET_REPOSITORIES } from '../graphql/queries';

const useRepositories = (variables) => {
  const { data, error, loading, refetch } = useQuery(GET_REPOSITORIES, {
    fetchPolicy: 'cache-and-network',
    variables,
  });

  if (error) {
    console.log('GraphQL Error:', error);
  }
  
  const repositories = data ? data.repositories : undefined;

  return { repositories, loading, refetch };
};

export default useRepositories;