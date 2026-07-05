import { FlatList, View, StyleSheet, Pressable } from 'react-native';
import { useNavigate } from 'react-router-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import RepositoryItem from './RepositoryItem';
import useRepositories from '../hooks/useRepositories';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const RepositoryListHeader = ({ selectedOrder, setSelectedOrder }) => {
  return (
    <View style={{ padding: 10, backgroundColor: '#f0f0f0' }}>
      <Picker
        selectedValue={selectedOrder}
        onValueChange={(itemValue) => setSelectedOrder(itemValue)}
      >
        <Picker.Item label="Select an item..." value={null} enabled={false} />
        <Picker.Item label="Latest repositories" value="LATEST" />
        <Picker.Item label="Highest rated repositories" value="HIGHEST_RATED" />
        <Picker.Item label="Lowest rated repositories" value="LOWEST_RATED" />
      </Picker>
    </View>
  );
};

export const RepositoryListContainer = ({ repositories, selectedOrder, setSelectedOrder }) => {
  const navigate = useNavigate();

  const repositoryNodes = repositories
    ? repositories.edges.map(edge => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={
        <RepositoryListHeader
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
      }
      renderItem={({ item }) => (
        <Pressable onPress={() => navigate(`/repository/${item.id}`)}>
          <RepositoryItem item={item} />
        </Pressable>
      )}
      keyExtractor={item => item.id}
    />
  );
};

const RepositoryList = () => {
  const [selectedOrder, setSelectedOrder] = useState('LATEST');

  let variables = { orderBy: 'CREATED_AT', orderDirection: 'DESC' };

  if (selectedOrder === 'HIGHEST_RATED') {
    variables = { orderBy: 'RATING_AVERAGE', orderDirection: 'DESC' };
  } else if (selectedOrder === 'LOWEST_RATED') {
    variables = { orderBy: 'RATING_AVERAGE', orderDirection: 'ASC' };
  }

  const { repositories } = useRepositories(variables);

  return (
    <RepositoryListContainer
      repositories={repositories}
      selectedOrder={selectedOrder}
      setSelectedOrder={setSelectedOrder}
    />
  );
};

export default RepositoryList;