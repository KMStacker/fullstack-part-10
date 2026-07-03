import { Pressable, StyleSheet } from 'react-native';
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
    <Pressable style={styles.tab}>
      <Text fontWeight="bold" fontSize="subheading" style={styles.text}>
        {text}
      </Text>
    </Pressable>
  );
};

export default AppBarTab;