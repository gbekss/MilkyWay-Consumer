import "react-native-get-random-values";
import React, { useState, useEffect } from 'react';
import { Text, View, Button, FlatList } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import contract from './MilkChain';

export default function QrScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState('');
  const [contractData, setContractData] = useState([]);

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
      const result = await contract.methods.getLot(parseInt(data)).call();
      console.log(result);

      // Converti i valori BigInt in numeri JavaScript
      const formattedData = result.map(item => ({
        name: item[0],
        supervisor: item[1],
        completed: item[2],
        startTime: parseInt(item[3].toString()),
        endTime: parseInt(item[4].toString()),
        location: item[5],
        lotNumber: parseInt(item[6].toString())
      }));

      setContractData(formattedData);
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

      <FlatList
        data={contractData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>Step Name: {item.name}</Text>
            <Text>Supervisor: {item.supervisor}</Text>
            <Text>Completed: {item.completed ? "Yes" : "No"}</Text>
            <Text>Start Time: {new Date(item.startTime * 1000).toLocaleString()}</Text>
            <Text>End Time: {new Date(item.endTime * 1000).toLocaleString()}</Text>
            <Text>Location: {item.location}</Text>
            <Text>Lot Number: {item.lotNumber}</Text>
          </View>
        )}
      />
    </View>
  );
}