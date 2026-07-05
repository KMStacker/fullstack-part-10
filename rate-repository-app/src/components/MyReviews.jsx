import { FlatList, View, StyleSheet, Pressable, Alert } from 'react-native';
import { useQuery, useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-native';
import { ME } from '../graphql/queries';
import { DELETE_REVIEW } from '../graphql/mutations';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  mainContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  viewButton: {
    backgroundColor: '#125096',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },

  deleteButton: {
    backgroundColor: '#da2b3d',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const ReviewItem = ({ review, onView, onDelete }) => {
  const date = new Date(review.createdAt).toLocaleDateString();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.infoContainer}>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{review.rating}</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.titleText}>{review.repository.fullName}</Text>
          <Text style={styles.dateText}>{date}</Text>
          <Text>{review.text}</Text>
        </View>
      </View>
      <View style={styles.actionsContainer}>
        <Pressable style={styles.viewButton} onPress={onView}>
          <Text style={styles.buttonText}>View repository</Text>
        </Pressable>
        <Pressable style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.buttonText}>Delete review</Text>
        </Pressable>
      </View>
    </View>
  );
};

const MyReviews = () => {
  const navigate = useNavigate();
  const [deleteReview] = useMutation(DELETE_REVIEW);
  
  const { data, loading, refetch } = useQuery(ME, {
    variables: { includeReviews: true },
    fetchPolicy: 'cache-and-network',
  });

  if (loading || !data?.me) {
    return null;
  }

  const handleDelete = (id) => {
    Alert.alert(
      'Delete review',
      'Are you sure you want to delete this review?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteReview({ variables: { id } });
              refetch();
            } catch (e) {
              console.log(e);
            }
          },
        },
      ]
    );
  };

  const reviewNodes = data.me.reviews
    ? data.me.reviews.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={reviewNodes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => (
        <ReviewItem
          review={item}
          onView={() => navigate(`/repository/${item.repository.id}`)}
          onDelete={() => handleDelete(item.id)}
        />
      )}
      keyExtractor={({ id }) => id}
    />
  );
};

export default MyReviews;