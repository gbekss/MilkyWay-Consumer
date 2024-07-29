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
import Timeline from 'react-native-timeline-flatlist';

SplashScreen.preventAutoHideAsync();

export default function DataDisplay({ lotNumber, onScanAgain }) {
  const [contractData, setContractData] = useState([]);
  const [lotDate, setLotDate] = useState([]);
  const [loaded, error] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_900Black,
  });

  const data = [
    { time: '09:00', title: 'Event 1', description: 'Event 1 Description' },
    { time: '10:45', title: 'Event 2', description: 'Event 2 Description' },
    { time: '12:00', title: 'Event 3', description: 'Event 3 Description' },
    { time: '14:00', title: 'Event 4', description: 'Event 4 Description' },
    { time: '16:30', title: 'Event 5', description: 'Event 5 Description' },
  ];

  const monthsMap = {
    "Jan": "Gennaio",
    "Feb": "Febbraio",
    "Mar": "Marzo",
    "Apr": "Aprile",
    "May": "Maggio",
    "Jun": "Giugno",
    "Jul": "Luglio",
    "Aug": "Agosto",
    "Sep": "Settembre",
    "Oct": "Ottobre",
    "Nov": "Novembre",
    "Dec": "Dicembre"
};

// Funzione per sostituire le iniziali dei mesi con i nomi completi
function translateMonth(inputString) {
  return inputString.replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g, function(match) {
      return monthsMap[match];
  });
}

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
    const fetchData = async () => {
      try {
        const web3 = new Web3(new Web3.providers.HttpProvider("http://ip_address:7545"));
        const factoryContract = await getContract(web3, "MilkProcessFactory", "0xBD870AAd7e837BB3330638F5e40d3518739C6879");
        const processAddresses = await factoryContract.methods.getAllProcesses().call();

        if (processAddresses.length > 0) {
          // Cerca l'address che ha il numero di lotto corrispondente
          var foundLotData = null;

          for (const address of processAddresses) {
            const processContract = await getContract(web3, 'MilkProcess', address);
            const result = await processContract.methods.lotNumber().call();

            if (String(result) === lotNumber) {
              foundLotData = await processContract.methods.getSteps().call();
              const msec = parseInt(foundLotData[0]["3"]) * 1000;
              const lotDate = new Date(msec).toString();
              const stringDate = lotDate.substring(8, 10) + " " + translateMonth(lotDate.substring(4, 7)) + " " + lotDate.substring(11, 15);
              setLotDate(stringDate);

              const formattedData = foundLotData.map(item => ({
                title: item["0"],
                time: Date(parseInt(item["3"]) * 1000).toString().substring(16, 21),
                description: item["5"]
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

  useEffect(() => {
    console.log("data", contractData);
  }, [contractData]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Lotto {lotNumber}</Text>
        <Text style={styles.subtitle}>Processato il {lotDate}</Text>
        <Timeline
        style={styles.timelineStyle}
        circleSize={15}
        separator={true}
        separatorStyle={styles.separatorStyle}
        circleColor="white"
        lineColor="white"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        lineWidth={5}
        data={contractData}
        descriptionStyle={styles.descriptionStyle}
        timeContainerStyle={styles.timeContainerStyle}
        timeStyle={styles.timeStyle}
        circleStyle={styles.circleStyle}
        titleStyle={styles.titleStyle}
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
    maxWidth: '100%',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  title: {
    fontFamily: Platform.select({
      android: 'Nunito_900Black',
      ios: 'Nunito-Black',
    }),
    textAlign: 'center',
    color: 'white',
    fontSize: 40,
    marginBottom: 5,
    marginTop: 20,
  },
  subtitle: {
    fontFamily: Platform.select({
      android: 'Nunito_700Bold',
      ios: 'Nunito-Bold',
    }),
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    marginBottom: 20,
  },
  regular: {
    fontFamily: Platform.select({
      android: 'Nunito_400Regular',
      ios: 'Nunito-Regular',
    }),
    fontSize: 14,
    color: 'white',
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
  timelineStyle: {
    minWidth: '100%',
    paddingBottom: 20
  },
  descriptionStyle: {
    fontFamily: Platform.select({
      android: 'Nunito_400Regular',
      ios: 'Nunito-Regular'
    }),
    color: 'white',
  },
  timeContainerStyle: {
    backgroundColor: 'white',
    borderRadius: 12,
    display: 'inline-block',
    minWidth: '10%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  timeStyle : {
    color: '#137EB0',
    fontFamily: Platform.select({
      android: 'Nunito_700Bold',
      ios: 'Nunito-Bold',
    }),
    padding: 10,
  },
  titleStyle: {
    fontFamily: Platform.select({
      android: 'Nunito_900Black',
      ios: 'Nunito-Black',
    }),
    color: 'white'
  },
  separatorStyle: {
    backgroundColor: 'white'
  }
});