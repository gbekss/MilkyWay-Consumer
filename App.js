import "react-native-get-random-values";
import { StyleSheet, View } from 'react-native';
import QrScanner from './QRScanner';
export default function App() {


  return (
    <View style={styles.container}>
      <QrScanner/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});