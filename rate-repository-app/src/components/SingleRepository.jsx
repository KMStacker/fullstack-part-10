import { useParams } from 'react-router-native';
import { View, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import Text from './Text';
import RepositoryItem from './RepositoryItem';
import useRepository from '../hooks/useRepository';
import theme from '../theme';
import { useQuery } from '@apollo/client/react';
import { GET_REPOSITORY } from '../graphql/queries';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  reviewContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    flexDirection: 'row',
  },
  ratingContainer: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  ratingText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  usernameText: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dateText: {
    color: theme.colors.textSecondary,
    marginBottom: 10,
  },
});

const ReviewItem = ({ review }) => {
  const formattedDate = format(new Date(review.createdAt), 'dd MMM yyyy');

  return (
    <View style={styles.reviewContainer}>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{review.rating}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.usernameText}>{review.user.username}</Text>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Text>{review.text}</Text>
      </View>
    </View>
  );
};

const ItemSeparator = () => <View style={styles.separator} />;

const SingleRepository = () => {
  const { id } = useParams();
  const { data, loading, fetchMore, networkStatus } = useQuery(GET_REPOSITORY, {
    variables: { id, first: 2 },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const handleFetchMore = () => {
    const canFetchMore = !loading && data?.repository?.reviews?.pageInfo?.hasNextPage;

    if (!canFetchMore || networkStatus === 3) {
      return;
    }

    fetchMore({
      variables: {
        after: data.repository.reviews.pageInfo.endCursor,
        id,
        first: 1,
      },
      
    });
  };
  
  const repository = data ? data.repository : undefined;

  if (loading && !repository) {
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size="large" color="#125096" />
      </View>
    );
  }

  const reviews = repository.reviews
    ? repository.reviews.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={({ id }) => id}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={
        <View style={{ marginBottom: 10 }}>
          <RepositoryItem item={repository} showGitHubButton />
        </View>
      }
      onEndReached={handleFetchMore}
      onEndReachedThreshold={0.5}
    />
  );
};

export default SingleRepository;