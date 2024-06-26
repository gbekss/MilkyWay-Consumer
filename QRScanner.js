import "react-native-get-random-values";
import React, { useState, useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import contract from './MilkChain';

export default function QrScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState('');
  const [contractData, setContractData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setData(data);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);

    // Recupera i dati dal contratto
    try {
      const result = await contract.methods.getLot(data).call();
      console.log(result);
      setContractData(result);
    } catch (error) {
      console.error("Errore nel recuperare i dati dal contratto: ", error);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ height: 400, width: 400 }}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
      <Text>Scanned Data: {data}</Text>
      {contractData && (
        <View>
          <Text>Step Name: {contractData[0]}</Text>
          <Text>Supervisor: {contractData[1]}</Text>
          <Text>Completed: {contractData[2] ? "Yes" : "No"}</Text>
          <Text>Start Time: {new Date(contractData[3] * 1000).toLocaleString()}</Text>
          <Text>End Time: {new Date(contractData[4] * 1000).toLocaleString()}</Text>
          <Text>Location: {contractData[5]}</Text>
          <Text>Lot Number: {contractData[6]}</Text>
        </View>
      )}
    </View>
  );
}