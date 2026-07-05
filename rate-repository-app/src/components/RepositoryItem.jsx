import { View, Image, StyleSheet, Pressable } from 'react-native';
import * as Linking from 'expo-linking';
import Text from './Text';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#ffffff',
  },
  topContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  githubButton: {
    backgroundColor: '#125096',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  githubButtonText: {
    color: '#ffffff',
  },
});

const formatCount = (count) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count;
};

const RepositoryItem = ({ item, showGitHubButton = false }) => {
  const openGitHub = () => {
    Linking.openURL(item.url);
  };

  return (
    <View testID="repositoryItem" style={styles.container}>
      <View style={styles.topContainer}>
        <Image source={{ uri: item.ownerAvatarUrl }} style={styles.avatar} />
        <View style={styles.infoContainer}>
          <Text style={{ fontWeight: 'bold' }}>{item.fullName}</Text>
          <Text>{item.description}</Text>
          <Text style={{ backgroundColor: '#125096 ', color: '#ffffff', alignSelf: 'flex-start', padding: 4, borderRadius: 4, marginTop: 4 }}>
            {item.language}
          </Text>
        </View>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={{ fontWeight: 'bold' }}>{formatCount(item.stargazersCount)}</Text>
          <Text>Stars</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={{ fontWeight: 'bold' }}>{formatCount(item.forksCount)}</Text>
          <Text>Forks</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={{ fontWeight: 'bold' }}>{formatCount(item.reviewCount)}</Text>
          <Text>Reviews</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={{ fontWeight: 'bold' }}>{formatCount(item.ratingAverage)}</Text>
          <Text>Rating</Text>
        </View>
      </View>
      {showGitHubButton && (
        <Pressable onPress={openGitHub} style={styles.githubButton}>
          <Text style={styles.githubButtonText}>Open in GitHub</Text>
        </Pressable>
      )}
    </View>
  );
};

export default RepositoryItem;