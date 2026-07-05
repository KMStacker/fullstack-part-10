import { useParams } from 'react-router-native';
import { View, ActivityIndicator } from 'react-native';
import RepositoryItem from './RepositoryItem';
import useRepository from '../hooks/useRepository';

const SingleRepository = () => {
  const { id } = useParams();
  const { repository, loading } = useRepository(id);

  if (loading || !repository) {
    return (
      <View style={{ padding: 10 }}>
        <ActivityIndicator size="large" color="#125096" />
      </View>
    );
  }

  return <RepositoryItem item={repository} showGitHubButton />;
};

export default SingleRepository;