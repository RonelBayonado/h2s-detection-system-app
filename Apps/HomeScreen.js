import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Text, View, Button, Image } from 'react-native';
import useFetchDataFromFirebase from '../firebaseHelper';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const HomeScreen = ({navigation}) => {
  const data = useFetchDataFromFirebase();
  const [notificationInterval, setNotificationInterval] = useState(null);
  const [notificationRange, setNotificationRange] = useState(null);
  const [effects, setEffects] = useState(['Odor Threshold - rotten egg smell', 'Permissible Exposure Level', 'Possible Fatigue, loss of appetite, headache, irritability, poor memory, dizziness, intense odor', 'Odor is sweet or sickeningly sweet', 'Mild irritation - eyes, throat', 'Coughing, eye irritation, loss of smell', 'Altered breathing, drowsiness', 'Throat irritation', 'Symptom severity increases', 'Hemorrhage & Death', 'Loss of smell (olfactory fatigue or paralysis)', 'Significant irritation. Marked conjunctivitis & respiratory tract', 'Pulmonary edema may occur from prolonged exposure', 'Staggering, unconsciousness in 5 minutes. Serious eye damage, 30 minutes.', 'Death 30-60 minutes', 'Rapid unconsciousness, "knockdown" or immediate collapse 1 to 2 breaths. Breathing Stops. Death within minutes.', 'NEARLY INSTANT DEATH.']);
  const [limit, setLimit] = useState([' - 8 hours', ' - 1 hour', ' - 2-15 Minutes', ' - 15-30 minutes', ' - 48 Hours'])
  const [PPMColor, setPPMColor] = useState("mt-3 mb-1 bg-green-500 items-center p-4 rounded-lg")  

  const statusMessage = () => {
    if (data.H2S_Data >= 0.00 && data.H2S_Data <= 1.5) {
      return effects[0] 
    } else if(data.H2S_Data > 1.5 && data.H2S_Data < 10) {
      return effects[0]
    } else if(data.H2S_Data === 10) {
      return effects[1] + limit[0]
    } else if(data.H2S_Data >= 20 && data.H2S_Data < 30) {
      return effects[2]
    } else if(data.H2S_Data >= 30 && data.H2S_Data < 50) {
      return effects[3]
    } else if(data.H2S_Data >= 50 && data.H2S_Data < 100) {
      return effects[4] + limit[1]
    } else if(data.H2S_Data === 100) {
      return effects[5] + limit[2] + '\n' + effects[6] + limit[3] + '\n' + effects[7] + limit[1] + '\n' + effects[8] + '\n' + effects[9] + limit[4]
    } else if(data.H2S_Data > 100 && data.H2S_Data <= 150 ) {
      return effects[10]
    } else if(data.H2S_Data >= 200 && data.H2S_Data <= 300 ) {
      return effects[11] + limit[1] +'\n' + effects[12] + limit[4]
    } 
  }
  useEffect(() => {
    // Request notification permissions when the app first opens
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission for push notifications was denied');
      }
    };

    requestPermissions();
  }, []);
  
  useEffect(() => {
    if(data.H2S_Data >= 0.00 && data.H2S_Data < 20) {
      setPPMColor("mt-3 mb-1 bg-green-500 items-center w-80 rounded-lg pb-2 pt-2")
    } else if(data.H2S_Data >= 20 && data.H2S_Data < 100) {
      setPPMColor("mt-3 mb-1 bg-yellow-400 items-center w-80 rounded-lg pb-2 pt-2")
    } else if(data.H2S_Data >= 100 && data.H2S_Data <= 300) {
      setPPMColor("mt-3 mb-1 bg-red-500 items-center w-80 rounded-lg pb-2 pt-2")
    }
  },[data.H2S_Data])
  
  useEffect(() => {
    // Function to send notifications based on H2S concentration range
    const sendNotification = (range) => {
      if (range === '20-99') {
        schedulePushNotification(5, data, 'Please avoid staying in this area for an extended period of time. Please leave the area if any of the symptoms described applies to you!');
      } else if (range === '100-300') {
        schedulePushNotification(3, data, 'Caution, H2S Concentration is high! Please vacate the area immediately.');
      }
    };

    // Determine the current concentration range
    let currentRange = null;
    if (data.H2S_Data >= 20 && data.H2S_Data < 100) {
      currentRange = '20-99';
    } else if (data.H2S_Data >= 100 && data.H2S_Data <= 300) {
      currentRange = '100-300';
    }

    // Check if concentration range has changed
    if (currentRange !== notificationRange) {
      sendNotification(currentRange); // Send notification if range has changed
      setNotificationRange(currentRange); // Update notification range
    }
    
    // Clear previous interval if exists
    if (notificationInterval) {
      clearInterval(notificationInterval);
    }

    const intervalId = setInterval(() => {
      // Reset the notification range after the cooldown period
      setNotificationRange(null);
    }, 10 * 60 * 1000); // 10 minutes
  
    // Store the interval id in state for cleanup
    setNotificationInterval(intervalId);
      
    // Cleanup function to clear interval when component unmounts or data changes
    return () => {
      if (notificationInterval) {
        clearInterval(notificationInterval);
      }
    };
  }, [data])

  return (
    <View className="flex-1 items-center bg-gray-200">
      <Text className="text-[20px] font-bold mt-2">Location: </Text>
      <Text className="text-[15px] mb-4 ml-5 mr-5 font-bold">Mag-aso Volcanic Steam Spring, Valencia, Negros Oriental</Text>
      <Image 
        source={require('../assets/mag-aso-sulfur-volcanic.jpg')}
        className="w-72 h-72 bg-orange-400 rounded-xl"
      />

      <View className={PPMColor}>
        <Text className="text-[18px] font-bold text-white pl-3 pr-3">H2S Concentration: {data?.H2S_Data ?? "Loading..."} PPM</Text>
        <Text className="text-[18px] font-semibold text-white">Raw Sensor Value: {data?.Sensor_Value ?? "Loading..."}</Text>
      </View>
      <View className="mb-2 bg-orange-400 w-80 rounded-lg p-2">
        <Text className="text-[18px] mb-2 font-bold text-white">Effect Time:</Text>
        <Text className="text-[15px] font-semibold text-white mr-10">{statusMessage() ?? "Loading..."}</Text>
      </View>
      <Button
        title="Concentration History"
        onPress={() => navigation.navigate('History')}
      />
      <StatusBar style="auto" />
    </View>
  );
}

async function schedulePushNotification(second, data, warning) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "H2S Detection System Warning",
      body: `H2S: ${data.H2S_Data}, ${warning}`,
      data: { data: 'goes here' },
    },
    trigger: { seconds: second },
  });
}

export default HomeScreen;