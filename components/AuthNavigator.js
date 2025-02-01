import React from 'react';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavigator from './MainNavigator';

const AuthStack = createStackNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Home" component={Home} options={{headerShown: false }}/>
    <AuthStack.Screen name="Login" component={Login} options={{headerShown: false }}/>
    <AuthStack.Screen name="Register" component={Register} options={{headerShown: false }} />
    <AuthStack.Screen name="Main Page" component={MainNavigator} initialParams={{ userUid: null }} options={{headerShown: false }}/>
  </AuthStack.Navigator>
);


export default AuthNavigator
