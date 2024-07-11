import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useFetchDataFromFirebase from '../firebaseHelper';
import { ScrollView } from 'react-native-gesture-handler';

const HistoryScreen = () => {
  const data = useFetchDataFromFirebase();
  // Check if data is undefined or does not contain H2S_Data_Per_Hour
  if (!data || !data.H2S_Data_Per_Hour) {
    return <Text>Data is undefined or missing H2S_Data_Per_Hour</Text>;
  }
  // Get the keys (dates) from the H2S_Data_Per_Hour object
  const dataEntries = Object.entries(data.H2S_Data_Per_Hour).map(([date, ppm]) => ({ date, ppm }));
  // Sort the array based on the dates
  dataEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

  const style = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginTop: 2,
    }
  })

  return(
    <ScrollView contentContainerStyle={style.container}>
      {dataEntries.map(({ date, ppm }) => (
        <View key={date} className="flex-row bg-orange-400 rounded-3xl pl-12 pr-12 mb-1">
          <Text className="text-[17px] mr-6 font-bold text-white">{date}:</Text>
          {/* Render PPM data */}
          <Text className="text-[17px] font-semibold text-white">{ppm} PPM</Text>
        </View>
      ))}
    </ScrollView>
  );
}

export default HistoryScreen; 