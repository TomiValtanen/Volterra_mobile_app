import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { MainPageStyle } from '../style/style';
import { getUserData } from "./Auth";
import { getAuth } from 'firebase/auth';

const CircularProgression = () => {

    const user = getAuth().currentUser
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const user = await getUserData();
            setUserData(user);
            console.log(userData)
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
        };

        fetchUserData();
    }, []);

    let circleValue
    let titleShow
    let titleColor

    if (userData && userData.car) {
        circleValue = userData.car.capacityLeft
        titleShow = [`${Math.round(userData.car.range / 100 * userData.car.capacityLeft)} km`]
        switch (true) {
            case (userData.car.capacityLeft <= 100 && userData.car.capacityLeft >= 80):
              titleColor = '#1eb400';
              break;
            case (userData.car.capacityLeft < 80 && userData.car.capacityLeft >= 40):
              titleColor = '#fffb00';
              break;
            case (userData.car.capacityLeft < 40 && userData.car.capacityLeft >= 20):
              titleColor = '#ff9100';
              break;
            case (userData.car.capacityLeft < 20 && userData.car.capacityLeft >= 1):
              titleColor = '#ff0000';
              break;
            default:
              titleColor = '#ffffff';
          }
        
        }
    else {
        circleValue = 0
    }

    return (
        <View style={MainPageStyle.circularContainer}>
            <View>
                <CircularProgress
                    value={circleValue}
                    radius={100}
                    progressValueColor={titleColor}
                    duration={2000}
                    strokeColorConfig={[
                        { color: '#ff0000', value: 1 },
                        { color: '#ff9100', value: 25 },
                        { color: '#fffb00', value: 50 },
                        { color: '#1eb400', value: 100 },
                    ]}
                    maxValue={100}
                    valueSuffix={'%'}
                    inActiveStrokeColor={titleColor}
                    inActiveStrokeOpacity={0.2}
                    inActiveStrokeWidth={5}
                    activeStrokeWidth={5}
                    
                    dashedStrokeConfig={{
                        count: 50,
                        width: 15,
                        
                    }} 
                    title={titleShow}
                    titleColor={titleColor}
                    titleStyle={{fontSize: 28, marginBottom: 3}}
                    progressValueStyle={{fontWeight: 'normal'}}
                />
            </View>
        </View>
    )
}

export {CircularProgression}