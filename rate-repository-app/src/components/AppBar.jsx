import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import theme from '../theme';
import AppBarTab from './AppBarTab';
import { Link } from 'react-router-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBarBackground,
    flexDirection: 'row',
  },
  tab: {
    padding: 15,
  },
  text: {
    color: '#ffffff',
  },
});

const AppBar = () => {
  return (
    <View style={styles.container}>
      <Link to="/">
        <AppBarTab text="Repositories" />
      </Link>
      <Link to="/signin">
        <AppBarTab text="Sign in" />
      </Link>
    </View>
  );
};

export default AppBar;