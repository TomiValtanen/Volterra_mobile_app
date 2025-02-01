
import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'react-native';

import { useState } from 'react';
import RootNavigator from "./components/RootStack"

export default function App() {
  
  const [userUid, setUserUid] = useState(null);
  StatusBar.setBarStyle('light-content');
  
  return (
    <NavigationContainer>
      <RootNavigator userUid={userUid} />
    </NavigationContainer>

  );
}