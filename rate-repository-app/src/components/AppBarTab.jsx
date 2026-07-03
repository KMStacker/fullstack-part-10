import { View, StyleSheet } from 'react-native';
import Text from './Text';

const styles = StyleSheet.create({
  tab: {
    padding: 15,
  },
  text: {
    color: '#ffffff',
  },
});

const AppBarTab = ({ text }) => {
  return (
    <View style={styles.tab}>
      <Text fontWeight="bold" fontSize="subheading" style={styles.text}>
        {text}
      </Text>
    </View>
  );
};

export default AppBarTab;