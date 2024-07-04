import React, { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Text, View, FlatList, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import contract from './MilkChain';
import { Nunito_400Regular, Nunito_700Bold, Nunito_900Black } from '@expo-google-fonts/nunito';

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
        const result = await contract.methods.getLot(parseInt(lotNumber)).call();

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
          renderItem={({ item }) => (
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.regular}>Nome Fase: {item.name}</Text>
              <Text style={styles.regular}>Supervisore: {item.supervisor}</Text>
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
