import React, { Component, useEffect, useState } from 'react';
import { Image, Animated, TouchableOpacity, Text } from 'react-native';
import {LogoAnimationStyle} from '../style/style';

const LogoAnimation = ({ navigation }) => {
  
  const logoFadeAnim = new Animated.Value(0);
  const buttonFadeAnim = new Animated.Value(0);

    const [userName, setUserName] = useState('')
    const [hasUserName, setHasUserName] = useState(true) // vaihta false/true manuaalisesti jos haluat katsoa Login/Register sivut

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoFadeAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      }),
      Animated.timing(buttonFadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: logoFadeAnim,
        transform: [{ scale: logoFadeAnim }],
      }}
    >
      <Image
        source={require('../images/Volterra.png')}
        style={{ width: 270, height: 270 }}
      />
      <Animated.View
        style={{
          opacity: buttonFadeAnim,
          transform: [{ scale: buttonFadeAnim }],
        }}
      > 
      
            <TouchableOpacity
            style={LogoAnimationStyle.animationB}
            onPress={() => navigation.navigate('Login', { user: userName })}
            >
            <Text style={LogoAnimationStyle.animationBtext}>LOGIN</Text>
            </TouchableOpacity>
            <Text></Text>
            <TouchableOpacity style={LogoAnimationStyle.animationB} onPress={() => navigation.navigate('Register')}>
                <Text style={LogoAnimationStyle.animationBtext}>REGISTRATION</Text>
            </TouchableOpacity>
        
      </Animated.View>
    </Animated.View>
  );
};

export default LogoAnimation;
