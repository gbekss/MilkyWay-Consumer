import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { CameraView, Camera } from "expo-camera";

export default function QRScanner({ onScan }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    onScan(data);
  };

  if (hasPermission === null) {
    return <Text>Richiesta permesso fotocamera</Text>;
  }
  if (hasPermission === false) {
    return <Text>Nessun accesso alla fotocamera</Text>;
  }

  return (
    <View style={styles.container}>
      <StatusBar/>
      <CameraView
        style={styles.fillScreen}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
      />
      {scanned && (
        <View style={styles.buttonContainer}>
          <Button title={'Tocca per scansionare di nuovo'} onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  fillScreen:{
    minWidth: '100%',
    minHeight: '100%',
  }
});

