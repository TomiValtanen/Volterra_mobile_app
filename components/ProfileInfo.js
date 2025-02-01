import { Text, View } from "react-native"
import { getUserData } from './Auth';
import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import styles, { HomeStyle } from '../style/style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';


function ProfileInfo(){

    const user = getAuth().currentUser
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const user = await getUserData();
            setUserData(user);
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
        };

        fetchUserData();
    }, []);

    const UserInfoTable = ({ userData }) => {
        const tableData = [
          { label: 'User name', value: userData.name },
          { label: 'Email', value: userData.email },
          { label: 'Phone', value: userData.phone },
          { label: 'Car', value: `Volterra ${userData.car.value}` },
        ];
      
        return (
          <View style={{
            height:Dimensions.get("window").height * 0.45,
            width:Dimensions.get("window").width * 0.73,
            borderRadius:8,padding: 10, backgroundColor:"#E5D9B6",
            borderColor:"#cbb26a",borderWidth:3,shadowColor: "#000000",
            elevation: 4
          }}>
            <View style={{alignItems:"center"}}>
            <MaterialCommunityIcons name="account-box" size={110} color="#1D1A39" />
          
            </View>
           
            {tableData.map((rowData, index) => (
              <View key={index} style={{
                borderBottomWidth: 1,
                borderColor: '#cbb26a',
                paddingVertical: 6,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems:"center"
              }}>
                <Text style={[HomeStyle.text, {color:"#1a1a1a",fontSize: 18}]}>{rowData.label}</Text>
                <Text style={[HomeStyle.text,{color:"#1a1a1a",fontSize: 18}]}>{rowData.value}</Text>
              </View>
            ))}
          </View>
        );
      };

    return(
        <View style={[HomeStyle.container]}>
          {userData && 
            <UserInfoTable userData={userData} />}
        </View>
        
    )
}
export default ProfileInfo