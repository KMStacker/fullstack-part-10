import { FlatList, View, StyleSheet, Pressable, TextInput } from 'react-native';
import { useNavigate } from 'react-router-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useDebounce } from 'use-debounce';
import RepositoryItem from './RepositoryItem';
import useRepositories from '../hooks/useRepositories';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  searchBar: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#dddddd',
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const RepositoryListHeader = ({ selectedOrder, setSelectedOrder, searchKeyword, setSearchKeyword }) => {
  return (
    <View style={{ padding: 10, backgroundColor: '#f0f0f0' }}>
      <TextInput
        placeholder="Search..."
        value={searchKeyword}
        onChangeText={(value) => setSearchKeyword(value)}
        style={styles.searchBar}
      />
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

export const RepositoryListContainer = ({ repositories, selectedOrder, setSelectedOrder, searchKeyword, setSearchKeyword, }) => {
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
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
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
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearchKeyword] = useDebounce(searchKeyword, 666);

  let variables = { orderBy: 'CREATED_AT', orderDirection: 'DESC', searchKeyword: debouncedSearchKeyword };

  if (selectedOrder === 'HIGHEST_RATED') {
    variables = { orderBy: 'RATING_AVERAGE', orderDirection: 'DESC', searchKeyword: debouncedSearchKeyword };
  } else if (selectedOrder === 'LOWEST_RATED') {
    variables = { orderBy: 'RATING_AVERAGE', orderDirection: 'ASC', searchKeyword: debouncedSearchKeyword };
  }

  const { repositories } = useRepositories(variables);

  return (
    <RepositoryListContainer
      repositories={repositories}
      selectedOrder={selectedOrder}
      setSelectedOrder={setSelectedOrder}
      searchKeyword={searchKeyword}
      setSearchKeyword={setSearchKeyword}
    />
  );
};

export default RepositoryList;