import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import Constants from 'expo-constants';
import theme from '../theme';
import AppBarTab from './AppBarTab';
import { Link } from 'react-router-native';
import { useQuery, useApolloClient } from '@apollo/client/react';
import { ME } from '../graphql/queries';
import useAuthStorage from '../hooks/useAuthStorage';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBarBackground,
  },
  scrollView: {
    flexDirection: 'row',
  },
});

const AppBar = () => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();
  const { data } = useQuery(ME, {
    fetchPolicy: 'cache-and-network',
  });

  const me = data ? data.me : null;

  const signOut = async () => {
    await authStorage.removeAccessToken();
    await apolloClient.resetStore();
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.scrollView}>
        <Link to="/">
          <AppBarTab text="Repositories" />
        </Link>
        {me ? (
          <Pressable onPress={signOut}>
            <AppBarTab text="Sign out" />
          </Pressable>
        ) : (
          <Link to="/signin">
            <AppBarTab text="Sign in" />
          </Link>
        )}
      </ScrollView>
    </View>
  );
};

export default AppBar;