import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { HomeStyle } from '../style/style';
import { signIn } from "./Auth";
import { database } from 'firebase/database';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { auth } from '../firebase/Config';

export default function Login ({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');
    const [conditionError, setConditionError] = useState(false)


    const handleLogin = async () => {
        
      if (!email) {
        Alert.alert('Email is required!')
        setError('Email is required!')
        setConditionError(true)
      }
      else if (!password) {
        Alert.alert('Password is required!')
        setError('Password is required!')
        setConditionError(true)
      }
      else {
        /* await signIn(email, password) */
          try {
            const loginSuccess = await signIn(email, password);
            if (loginSuccess) {
              const user = getAuth().currentUser;
              navigation.navigate('Main Page', { userUid: user.uid });
            } else {
              Alert.alert('Login failed!');
              setEmail('')
              setPassword('')
              setError('Login failed!')
            }
          } catch (error) {
            console.error('Error during login: ', error.message);
          }
        }
      }

  return (
    <View style={HomeStyle.container}>
    <View style={HomeStyle.containerLogin}>
      <Text style={HomeStyle.header}>LOGIN</Text>
      {error ? <Text style={{color:'red', textAlign: 'center', marginBottom: 5}}>{error}</Text> : null}
      <TextInput
        style={HomeStyle.textInput}
        placeholder={conditionError ? "Email is required!" : "Enter your email*"}
        value={email}
        onChangeText={(email) => setEmail(email.trim())}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={HomeStyle.textInput}
        placeholder={conditionError ? "Password is required!" : "Enter your password*"}
        value={password}
        onChangeText={(password) => setPassword(password)}
        secureTextEntry={true}
      />
      <TouchableOpacity
        style={HomeStyle.loginButton} onPress={handleLogin}
      >
        <Text style={HomeStyle.loginButtonText}>LOG IN</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}
