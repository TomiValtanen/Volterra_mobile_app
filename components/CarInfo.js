import { Text, View, Image } from "react-native"
import { getUserData } from "./Auth";
import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { HomeStyle, MainPageStyle } from '../style/style';
import { Dimensions } from 'react-native';
function CarInfo(){

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

    const CarInfoTable = ({ userData }) => {
        const tableData = [
          ['Model', `Volterra ${userData.car.value}`],
          ['Drive', userData.car.drive],
          ['Total power', `${userData.car.totalPower} kW`],
          ['Torque', `${userData.car.torque} Nm`],
          ['Range', `${userData.car.range} km`],
          ['Battery capacity', `${userData.car.capacity} kWh`],
          ['Charging power', `${userData.car.chargePower} kW`],
          ['Consumption', `${userData.car.consumption} kW/100km`],
        ];

        return (
            <View style={{ 
                borderWidth: 3,
                borderRadius:8,
                borderColor: '#cbb26a',
                backgroundColor:"#E5D9B6" ,
                padding: 18,
                width:Dimensions.get("window").width * 0.75,
                height:Dimensions.get("window").height * 0.49,
                marginBottom:10,shadowColor: "#000000",
                elevation: 4,
            }}>
              {tableData.map((rowData, index) => (
                <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between',borderBottomWidth: 1, borderColor: '#cbb26a', paddingVertical: 6 }}>
                  <Text style={[HomeStyle.text, {fontSize: 18,color:"#1a1a1a"}]}>{rowData[0]}</Text>
                  <Text style={[HomeStyle.text, {fontSize: 18,color:"#1a1a1a"}]}>{rowData[1]}</Text>
                </View>
              ))}
            </View>
          );
        };

        let componentToShow;

        if (userData && userData.car) {
            switch (userData.car.value) {
            case 'Flash EV':
                componentToShow = (
                <Image
                    source={require('../images/CarTransparent.png')}
                    style={{ width: Dimensions.get("window").width * 0.8, height:Dimensions.get("window").height * 0.28, resizeMode: 'contain' }}
                />
                );
                break;
            case 'Lightning EV':
                componentToShow = (
                <Image
                    source={require('../images/CarEV.png')}
                    style={{ width:Dimensions.get("window").width * 0.8, height: Dimensions.get("window").height * 0.28, resizeMode: 'contain' }}
                />
                );
                break;
            case 'Bolt EV':
                componentToShow = <Image
                source={require('../images/VOlterraBoltEV2.png')}
                style={{ width: Dimensions.get("window").width * 1, height: Dimensions.get("window").height * 0.3, resizeMode: 'contain' }}
                />
                break;
            default:
                componentToShow = null;
            }
        } else {
            componentToShow = null;
        }

    return(
        <View style={{flex:1,flexDirection:"column",justifyContent:"flex-start",alignItems:"center",backgroundColor: '#1D1A39'}}>
            <View style={{justifyContent:"flex-start",alignItems:"center"}}>
                {componentToShow}
            </View>
            {userData && <CarInfoTable userData={userData}/>}
        </View>
        
    )
}
export default CarInfo