import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './src/screens/HomeScreen';
import AddMedicationScreen from './src/screens/AddMedicationScreen';
import MyMedicinesScreen from './src/screens/MyMedicinesScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import TipsScreen from './src/screens/TipsScreen';
import { Colors } from './src/styles/colors';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: Colors.background },
            animationEnabled: true,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen
            name="AddMedication"
            component={AddMedicationScreen}
          />
          <Stack.Screen
            name="MyMedicines"
            component={MyMedicinesScreen}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen
            name="HistoryScreen"
            component={HistoryScreen}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen
            name="TipsScreen"
            component={TipsScreen}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen name="Tips" component={TipsScreen} />
          <Stack.Screen
            name="EditMedication"
            component={AddMedicationScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
