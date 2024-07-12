import React, { useState, useEffect } from 'react';
import "react-native-get-random-values";
import 'text-encoding';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Text, View, FlatList, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import Web3 from 'web3';
import { Ionicons } from '@expo/vector-icons';
import { Nunito_400Regular, Nunito_700Bold, Nunito_900Black } from '@expo-google-fonts/nunito';
import { getContract } from './web3';

SplashScreen.preventAutoHideAsync();

export default function DataDisplay({ lotNumber, onScanAgain }) {
  const [contractData, setContractData] = useState([]);
  const [loaded, error] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_900Black,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
    const fetchData = async () => {
      try {
        const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.0.119:7545"));
        const factoryContract = await getContract(web3, "MilkProcessFactory", "0xB4D7a9990B85a91eb000275AD5Bb2f302Bcf2F06");
        const processAddresses = await factoryContract.methods.getAllProcesses().call();

        if (processAddresses.length > 0) {
          // Cerca l'address che ha il numero di lotto corrispondente
          var foundLotData = null;

          for (const address of processAddresses) {
            const processContract = await getContract(web3, 'MilkProcess', address);
            const result = await processContract.methods.lotNumber().call();

            if(String(result) === lotNumber){
              foundLotData = await processContract.methods.getSteps().call();

              const formattedData = foundLotData.map(item => ({
                name: item[0],
                supervisor: item[1],
                completed: item[2],
                startTime: parseInt(item[3].toString()),
                endTime: parseInt(item[4].toString()),
                location: item[5],
                lotNumber: parseInt(item[6].toString())
              }));
    
              setContractData(formattedData);
              break;
            }
          }
        }

      } catch (error) {
        console.error("Errore nel recuperare i dati dal contratto: ", error);
      }
    };

    if (lotNumber) {
      fetchData();
    }
  }, [lotNumber, loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Lotto {lotNumber}</Text>
        <FlatList
          data={contractData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.regular}>Nome Fase: {item.name}</Text>
              <Text style={styles.regular}>
                Supervisore: {index === 1 ? "Sensor for temperature" : item.supervisor}
              </Text>
              <Text style={styles.regular}>Completato: {item.completed ? "Sì" : "No"}</Text>
              <Text style={styles.regular}>Ora Inizio: {new Date(item.startTime * 1000).toLocaleString()}</Text>
              <Text style={styles.regular}>Ora Fine: {new Date(item.endTime * 1000).toLocaleString()}</Text>
              <Text style={styles.regular}>Posizione: {item.location}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false} // Rimuove il cursore laterale
        />
      </View>
      <TouchableOpacity style={styles.fab} onPress={onScanAgain}>
        <Ionicons name="qr-code" size={24} color="#497DAC" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    maxWidth: '85%', // Aggiungi padding per evitare la barra di stato
    marginLeft: '5%',
    marginRight: '5%',
  },
  title: {
    fontFamily: Platform.select({
      android: 'Nunito_900Black',
      ios: 'Nunito-Black',
    }),
    textAlign: 'center',
    color: 'white',
    fontSize: 40, // Aumenta la dimensione del font
    marginBottom: 20,
    marginTop: 20,
  },
  regular: {
    fontFamily: Platform.select({
      android: 'Nunito_400Regular',
      ios: 'Nunito-Regular',
    }),
    fontSize: 14,
    color: 'white', // Assicurati che il testo sia visibile sul gradiente
  },
  bold: {
    fontFamily: Platform.select({
      android: 'Nunito_700Bold',
      ios: 'Nunito-Bold'
    }),
  },
  black: {
    fontFamily: Platform.select({
      android: 'Nunito_900Black',
      ios: 'Nunito-Black',
    })
  },
  fab: {
    position: 'absolute',
    width: 80,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 30,
    backgroundColor: 'white',
    borderRadius: 30,
    elevation: 8,
  },
});