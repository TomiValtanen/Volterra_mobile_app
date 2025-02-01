
import { Text, View, Image, TouchableOpacity, ScrollView } from "react-native"
import { getUserData } from "./Auth";
import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ChargingMenuStyle, MainPageStyle, chargingTableStyle } from '../style/style';
import { CircularProgression } from './CircularProgress';
import { db, PRICES_REF } from '../firebase/Config';
import { ref, get } from '@firebase/database';



function ChargingMenu() {

    const user = getAuth().currentUser
    const [userData, setUserData] = useState(null);
    const [formattedChargingFinishTime, setFormattedChargingFinishTime] = useState('--:--');
    const [formattedChargingFinishDate, setFormattedChargingFinishDate] = useState([])
    const [formattedChargingStartDate, setFormattedChargingStartDate] = useState([])
    const [chargingStatus, setChargingStatus] = useState(false)
    const [allPrices, setAllPrices] = useState();
    const [isLoading, setIsLoading] = useState(true)
    const [totalPrice, setTotalPrice] = useState()

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dbRef = ref(db, PRICES_REF);
                const snapshot = await get(dbRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const dataArray = Object.values(data);

                    dataArray.flat().sort((a, b) => {
                        const dateA = new Date(`${a.startDate} ${a.startTime}`);
                        const dateB = new Date(`${b.startDate} ${b.startTime}`);
                        return dateA - dateB;
                    });

                    setAllPrices(dataArray);
                    setIsLoading(false);
                    console.log('Fetching data from Firebase successful!');
                    console.log(allPrices)
                } else if (isLoading) {
                    fetchPrices();
                }
            } catch (error) {
                console.error('Error fetching data from Firebase:', error.message);
            }
        };

        fetchData();
    }, [isLoading]);


    let capacityLeft
    let chargingTime
    let chargingHoursMinutes
    let charging_hours
    let charging_minutes

    if (userData && userData.car) {
        capacityLeft = parseFloat(userData.car.capacity / 100 * userData.car.capacityLeft).toFixed(1)
        chargingTime = parseFloat((userData.car.capacity - capacityLeft) / userData.car.chargePower * 60).toFixed(2)
        chargingHoursMinutes = parseFloat((userData.car.capacity - capacityLeft) / userData.car.chargePower).toFixed(2)
        charging_hours = Math.floor(chargingHoursMinutes)
        charging_minutes = Math.round((chargingHoursMinutes - charging_hours) * 60)
        console.log('Charging Time:', charging_hours, ':', charging_minutes)
    }

    const ChargingTimeCalculation = () => {
        const currentDateTime = new Date()
        setChargingStatus((prevChargingStatus) => !prevChargingStatus)
        if (chargingStatus === false) {
            const chargingFinishTime = new Date(currentDateTime.getTime() + chargingTime * 60000);
            const formattedChargingFinishTime = `${charging_hours}:${charging_minutes < 10 ? '0' : ''}${charging_minutes}`
            setFormattedChargingFinishTime(formattedChargingFinishTime)

            const finish_hours = chargingFinishTime.getHours().toString().padStart(2, '0');
            const finish_minutes = chargingFinishTime.getMinutes().toString().padStart(2, '0');
            const finish_year = chargingFinishTime.getFullYear();
            const finish_month = (chargingFinishTime.getMonth() + 1).toString().padStart(2, '0');
            const finish_day = chargingFinishTime.getDate().toString().padStart(2, '0');

            const formattedChargingFinishDate = `${finish_hours} : 00T${finish_year}-${finish_month}-${finish_day}`;
            setFormattedChargingFinishDate(formattedChargingFinishDate)

            const start_hours = currentDateTime.getHours().toString().padStart(2, '0');
            const start_minutes = currentDateTime.getMinutes().toString().padStart(2, '0');
            const start_year = currentDateTime.getFullYear();
            const start_month = (currentDateTime.getMonth() + 1).toString().padStart(2, '0');
            const start_day = currentDateTime.getDate().toString().padStart(2, '0');

            const formattedChargingStartDate = `${start_hours} : 00T${start_year}-${start_month}-${start_day}`;
            setFormattedChargingStartDate(formattedChargingStartDate)
            console.log(formattedChargingStartDate)
            console.log(formattedChargingFinishDate)

            const [time, date] = formattedChargingStartDate.split('T');
            const targetDate = date;
            const [hours, minutes] = time.split(':')
            const targetTime = hours + ':' + minutes;
            console.log(targetTime)

            const [finish_time, finish_date] = formattedChargingFinishDate.split('T');
            const finish_targetDate = date;
            const [formattedFinish_hours, formattedFinish_minutes] = finish_time.split(':')
            const finish_targetTime = formattedFinish_hours + ':' + formattedFinish_minutes;
            console.log(finish_targetTime)

            const initialStartHours = parseInt(hours, 10);
            const initialStartMinutes = parseInt(minutes, 10);
            const initialFinishHours = parseInt(formattedFinish_hours, 10)
            const initialFinishMinutes = parseInt(formattedFinish_minutes, 10)
            const chargingStartMinutes = parseInt(start_minutes, 10)
            const chargingFinishMinutes = parseInt(finish_minutes, 10)

            console.log('Start/Finish minutes:', chargingStartMinutes, chargingFinishMinutes)

            const incrementedTimes = [];

            if (charging_minutes > 0) {
                charging_hours = charging_hours + 1
                for (let i = 0; i < charging_hours; i++) {
                    const incrementedHours = (initialStartHours + i) % 24
                    const incrementedMinutes = initialStartMinutes;

                    const incrementedTime = `${incrementedHours < 10 ? '0' : ''}${incrementedHours} : ${incrementedMinutes < 10 ? '0' : ''}${incrementedMinutes}`;

                    incrementedTimes.push({ targetTime: incrementedTime, targetDate: finish_targetDate });
                }
            }
            else {

                for (let i = 0; i < charging_hours; i++) {
                    const incrementedHours = (initialStartHours + i) % 24
                    const incrementedMinutes = initialStartMinutes;

                    const incrementedTime = `${incrementedHours < 10 ? '0' : ''}${incrementedHours} : ${incrementedMinutes < 10 ? '0' : ''}${incrementedMinutes}`;

                    incrementedTimes.push({ targetTime: incrementedTime, targetDate: finish_targetDate });
                }
            }
            console.log('Incremented Times:', incrementedTimes);

            const targetDateTimePairs = [];

            targetDateTimePairs.push(...incrementedTimes)

            const findObject = (startDate, startTime) => {
                return allPrices[0].find((item) => item.startDate === startDate && item.startTime === startTime);
            };

            const prices = [];

            targetDateTimePairs.forEach(({ targetDate, targetTime }) => {
                const resultObject = findObject(targetDate, targetTime);

                if (resultObject) {
                    if (resultObject.price < 0) {
                        prices.push(0);
                    }
                    else {
                        prices.push(resultObject.price);
                        console.log(`Found. Price for ${targetDate} ${targetTime}:`, resultObject.price)
                    }
                } else {
                    console.log(`Not found for ${targetDate} ${targetTime}`);
                }
            });

            console.log('Saved Prices:', prices);


            const first_hourPrice = ((prices[0] * userData.car.chargePower) / 60) * (60 - chargingStartMinutes)
            console.log(first_hourPrice)

            const last_hourPrice = ((prices[prices.length - 1] * userData.car.chargePower) / 60) * chargingFinishMinutes
            console.log(last_hourPrice)

            const rest_hours = prices.slice(1, -1)

            const rest_huorsPrice = (rest_hours.reduce((acc, value) => acc + value, 0)) * userData.car.chargePower

            setTotalPrice(parseFloat((last_hourPrice + first_hourPrice + rest_huorsPrice) / 100).toFixed(2))





        }
        else {
            setFormattedChargingFinishTime(' -- : --')
            setTotalPrice(' -- ')
        }


        console.log(totalPrice)


    }

    return (

       /*  <ScrollView style={{ flex: 1, }}
        contentContainerStyle={{ justifyContent: "flex-start", alignItems: "stretch" }}
        overScrollMode='never'
    > */
        <View style={ChargingMenuStyle.container}>
        
            { userData && 
            <>
            <View style={ChargingMenuStyle.container}>
                <View style={ChargingMenuStyle.bigStatusBox}>
                {/* <Text style={ChargingMenuStyle.text}>Charging Status:</Text>  */}
                    <View style={[ChargingMenuStyle.StatusBox, {backgroundColor: chargingStatus ? '#1ED1B1' : '#094f44'}]}>
                        <Text style={[ChargingMenuStyle.text2, {color: chargingStatus ? '#1D1A39' : '#ffffff'}]}>{chargingStatus ? 'On Charge': 'Not charging'}</Text>
                    </View>
                </View>
                <View style={[MainPageStyle.battery, {margin: 0, padding: 0}]}>
                    <CircularProgression />
                </View>  
                <TouchableOpacity onPress={() => {ChargingTimeCalculation()}} style={[ChargingMenuStyle.chargingButton, {backgroundColor: chargingStatus ? '#1ED1B1' : '#cbb26a', marginTop: 0}]}>
                    <Text style={[ChargingMenuStyle.buttonText, {color: chargingStatus ? '#1D1A39' : '#1D1A39'}]}>{chargingStatus ? 'Stop Charging': 'Start Charging'}</Text>
                </TouchableOpacity>   
                {/* <View style = {chargingTableStyle.bigCSquare}> */}
                <View style={{backgroundColor: '#094f458f', padding: 5, margin: 10, marginBottom: 20, borderRadius: 8,}}>
                    <View style={chargingTableStyle.row}>
                        <View style = {chargingTableStyle.cSquare}> 
                            <Text style={chargingTableStyle.label}>Finishing Time:</Text>
                            <Text style={chargingTableStyle.value}>{formattedChargingFinishTime}</Text>
                        </View>
                    <View style = {chargingTableStyle.cSquare}>
                        <Text style={chargingTableStyle.label}>Charging Power:</Text>
                        <Text style={chargingTableStyle.value}>{userData.car.chargePower} kW</Text>
                    </View>
                    <View style = {chargingTableStyle.cSquare}>
                        <Text style={chargingTableStyle.label}>Charging Total Price:</Text>
                        <Text style={chargingTableStyle.value}>{totalPrice} €</Text>
                    </View>
                    </View>
                </View>
                </View>
            {/* </View> */}
            </>
            } 
            
            
        </View>
    
    /* </ScrollView> */
        )
    }

export default ChargingMenu