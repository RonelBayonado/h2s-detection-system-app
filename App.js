import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Apps/HomeScreen';
import HistoryScreen from './Apps/HistoryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerTitleStyle: {
              fontSize: 18, // Customize the font size
              color: 'black', // Customize the color
              // Other style properties you want to change
          },
      }}
      >
        <Stack.Screen name="H2S Detection App (NORSU Project Study)" component={HomeScreen}  />
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
