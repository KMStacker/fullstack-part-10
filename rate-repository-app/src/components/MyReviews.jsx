import { FlatList, View, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client/react';
import { ME } from '../graphql/queries';
import Text from './Text';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  container: {
    backgroundColor: '#ffffff',
    padding: 10,
    flexDirection: 'row',
  },
  ratingContainer: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    borderColor: '#125096',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  ratingText: {
    color: '#125096',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  titleText: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateText: {
    color: 'grey',
    marginBottom: 10,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const ReviewItem = ({ review }) => {
  const date = new Date(review.createdAt).toLocaleDateString();

  return (
    <View style={styles.container}>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{review.rating}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>{review.repository.fullName}</Text>
        <Text style={styles.dateText}>{date}</Text>
        <Text>{review.text}</Text>
      </View>
    </View>
  );
};

const MyReviews = () => {
  const { data, loading } = useQuery(ME, {
    variables: { includeReviews: true },
    fetchPolicy: 'cache-and-network',
  });

  if (loading || !data?.me) {
    return null;
  }

  const reviewNodes = data.me.reviews
    ? data.me.reviews.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={reviewNodes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={({ id }) => id}
    />
  );
};

export default MyReviews;