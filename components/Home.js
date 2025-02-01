import { useState } from "react";
import { TextInput, View, Text, Keyboard, TouchableOpacity, Image } from 'react-native'
/* import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'; */
import style, { HomeStyle } from '../style/style'
import LogoAnimation from "./LogoAnimation";


export default Home = ({ navigation }) => {

    return (
        <View style={HomeStyle.container}> 
            <LogoAnimation navigation={navigation}/>
        </View>
    )
}