import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, TouchableOpacity, View, Animated } from 'react-native';
import { Marker, Circle, animateToRegion } from 'react-native-maps';
import MapView from "react-native-map-clustering";
import * as Location from "expo-location"
import { ButtonShadow, CharginStationsStyle } from '../style/style';
import { Dimensions } from 'react-native';
import Constants from "expo-constants"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Logo from "../images/Volterra.png"
import { FontAwesome5 } from '@expo/vector-icons';
import FinCities from "./CitiesFinland.json"


const INITIAL_LATITUDE = 65.0800
const INITIAL_LONGITUDE = 25.4800
const INITIAL_LATITUDE_DELTA = 0.0922 //0.5698946772875217  //0.0922
const INITIAL_LONGITUDE_DELTA =0.0421// 0.7116567716002464  // 0.0421
const ZOOM_LATITUDE_DELTA = 0.0922
const ZOOM_LONGITUDE_DELTA = 0.0421
const RADIUS = 10000

const MARKER_BASE_COLOR=CharginStationsStyle.markerColorBase
const MARKER_SELECTED_COLOR=CharginStationsStyle.markerColorSelected
const MARKER_SIZE=CharginStationsStyle.markerSize


export default ChargingStation = ({ navigation }) => {
    const [latitude, setLatitude] = useState(INITIAL_LATITUDE)
    const [longitude, setLongitude] = useState(INITIAL_LONGITUDE)
    const [longitudeDelta, setLongitudeDelta] = useState(INITIAL_LONGITUDE_DELTA)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingData, setIsloadingData] = useState(true)
    const [data, setData] = useState([])
    const [dataClose, setDataClose] = useState([])
    const [showCloseData, setShowCloseData] = useState(false)
    const [scrollIndex, setScrollIndex] = useState("")
    const [closeDataLocation, setCloseDataLocation] = useState()
    const [updateCloseData, setUpdateCloseData] = useState(false)
    const [indexi, setIndexi] = useState()
    const [citiesMarkers, setCitiesMarkers] = useState()
    const [markersData,setMarkersData]=useState()


    //UseRef
    const map = useRef(null);
    const bottomSheetRef = useRef(null);
    const scrollViewRef = useRef(null)

    //useEffect latausasemille
    useEffect(() => {
        charginStationData()
    }, [])
    //UseEffect käyttäjän locaatiolle
    useEffect(() => {
        userLocationData()
        setIsLoading(false)
    }, [])
    //Voidaan lähimmät asemat päivittää , kun liikuttuna tarpeeksi 
    useEffect(() => {
        if (showCloseData) {
            if (RADIUS < haversineDistanceBetweenPoints(closeDataLocation.latitude, closeDataLocation.longitude, latitude, longitude)) {
                setUpdateCloseData(true)
            }

        } else {
            setUpdateCloseData(false)
        }
    }, [latitude, longitude, showCloseData])

    //kaupunkien koordinaatit missä on latauspisteitä
    useEffect(() => {

        const cityMarkersData = []
        if (isLoadingData === false) {
            for (let i = 0; i < FinCities.length; i++) {
                for (let j = 0; j < data.length; j++) {
                    if (5000 > haversineDistanceBetweenPoints(data[j].latitude, data[j].longitude, FinCities[i].lat, FinCities[i].lng)) {
                        if (cityMarkersData.length === 0 && FinCities[i].population>20000) {
                            cityMarkersData.push({
                                id:FinCities[i].city,
                                city: FinCities[i].city,
                                category:"city",
                                latitude: Number(FinCities[i].lat),
                                longitude: Number(FinCities[i].lng)
                            })
                            
                        } else if (cityMarkersData.length > 0 && -1 === cityMarkersData.findIndex(marker => marker.city === FinCities[i].city) && FinCities[i].population>20000) {
                            cityMarkersData.push({
                                id:FinCities[i].city,
                                city: FinCities[i].city,
                                category:"city",
                                latitude: Number(FinCities[i].lat),
                                longitude: Number(FinCities[i].lng)
                            })
                        }
                    }
                }
            }
            setCitiesMarkers(cityMarkersData)
        }
    }, [isLoadingData])
//Zoomin ja zoomout antaa eri markkerit näkyville.
    useEffect(()=>{
 
        if(longitudeDelta<=5 && isLoadingData===false){
            setMarkersData(citiesMarkers)
            //console.log("Tapahtuu elsen alla oleva if ")
        }
        else if(longitudeDelta>=6 && longitudeDelta<8){
            //console.log("KESKIVAIHE")
            const zoomInMarkersData=[]
            data.map(data=>{
                    if(-1===dataClose.findIndex(marker => marker.id === data.id)){
                        zoomInMarkersData.push({...data})
                    }
                    
                }
            )
            setMarkersData(zoomInMarkersData)
        }
        else if(longitudeDelta===12){
            const zoomInMarkersData=[]
            data.map(data=>{
                if(RADIUS>haversineDistanceBetweenPoints(data.latitude,data.longitude,latitude,longitude)){
                    if(-1===dataClose.findIndex(marker => marker.id === data.id)){
                        zoomInMarkersData.push({...data})
                    }
                    
                }
            })
            setMarkersData(zoomInMarkersData)
        }
        else {
            //console.log("tapahtuu else if")
            const zoomInMarkersData=[]
            data.map(data=>{
                if(50000>haversineDistanceBetweenPoints(data.latitude,data.longitude,latitude,longitude)){
                    if(-1===dataClose.findIndex(marker => marker.id === data.id)){
                        zoomInMarkersData.push({...data})
                    }
                    
                }
            })
            setMarkersData(zoomInMarkersData)
        }
    },[longitudeDelta,latitude,longitude])



    //Käyttäjän locatio haetaan
    async function userLocationData() {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== "granted") {
                setIsLoading(false)
                console.log("Geolocation failed.")
                return
            }

            const location = await Location.getCurrentPositionAsync(
                { accuracy: Location.Accuracy.High })
            setLatitude(location.coords.latitude)
            setLongitude(location.coords.longitude)


        } catch (e) {
            alert(e)
            setIsLoading(false)
        }
    }
    //helsinki 3600034914
    //Suomi 3600054224
    //haetaan latausasemien tiedot OpenStreetMapista
    async function charginStationData() {
        try {
            const api = await fetch('https://overpass-api.de/api/interpreter?', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: `[out:json][timeout:25];
                area(id:3600054224)->.searchArea;
                nwr["amenity"="charging_station"](area.searchArea);
                out geom;`
            });
            let answer = await api.json();
            answer = answer.elements
            //console.log(answer.length, "length")
            const arr = []
            for (let i = 0; i < answer.length; i++) {
                if (answer[i].type === "node" && answer[i].tags.name!==undefined) {
                    arr.push({
                        id: answer[i].id,
                        name: answer[i].tags.name,
                        latitude: answer[i].lat,
                        longitude: answer[i].lon,
                        brand: answer[i].tags.brand,
                        operator: answer[i].tags.operator,
                        capacity: answer[i].tags.capacity===undefined ?  "unknown" : answer[i].tags.capacity,
                        socket: answer[i].tags.socket,
                        selected: false
                    })
                }

            }
            setData(arr)
            setMarkersData(arr)
            setIsloadingData(false)

        } catch (e) {
            console.log(e)
        }
    }

    //Lähimmät latausasemat
    function getClosestData() {
        const arr = []

        data.map((mapData, index) => {
            if (haversineDistanceBetweenPoints(latitude, longitude, mapData.latitude, mapData.longitude) < RADIUS) {
                arr.push({ ...mapData, range: haversineDistanceBetweenPoints(latitude, longitude, mapData.latitude, mapData.longitude) })
            }
        })
        arr.sort((a, b) => a.range - b.range);
        setDataClose(arr)
        return arr

    }

    // liikutaan näytöllä niin päivittää sijainnin
    function regionChange(region) {

        setLatitude(region.latitude)
        setLongitude(region.longitude)

        //console.log(region)
    }


    // Välimatka kahden locaation välillä metreinä.
    function haversineDistanceBetweenPoints(lat1, lon1, lat2, lon2) {
        const R = 6371e3;
        const p1 = lat1 * Math.PI / 180;
        const p2 = lat2 * Math.PI / 180;
        const deltaLon = lon2 - lon1;
        const deltaLambda = (deltaLon * Math.PI) / 180;
        const d = Math.acos(
            Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(deltaLambda),
        ) * R;
        return d;
    }

    // Painetaan slider itemistä niin päästään siihen "markeriin"
    function handlePress(item) {
        console.log(item)
        console.log(dataClose.length, "datan koko")
        const currentMapIndex = dataClose.findIndex(mapData => mapData.id === item.id)
        setIndexi(currentMapIndex)
        map.current.animateToRegion({ latitude: item.latitude, longitude: item.longitude, latitudeDelta: ZOOM_LATITUDE_DELTA, longitudeDelta: ZOOM_LONGITUDE_DELTA })

    }

    function zoomInPress(item){
        map.current.animateToRegion({ latitude: item.latitude, longitude: item.longitude, latitudeDelta: ZOOM_LATITUDE_DELTA, longitudeDelta: ZOOM_LONGITUDE_DELTA })
    }
    //buttonille millä saadaa lähimmät asemat slideriin
    // Samaa käytetään myös päivittämiseen.
    function handleCloseDataPress() {

        const arr = getClosestData()
        if (arr.length === 0) {
            Alert.alert("Info", "There are no charging stations in that area.")
            bottomSheetRef.current?.close()
        } else {
            setShowCloseData(true)
            handleOpenPress()
            setScrollIndex(0)
            setIndexi(0)
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true })
            setCloseDataLocation({ latitude: latitude, longitude: longitude })
            setUpdateCloseData(false)
            const zoomInMarkersData=[]
            data.map(data=>{
                    if(-1===arr.findIndex(marker => marker.id === data.id)){
                        zoomInMarkersData.push({...data})
                    }
                    
                }
            )
            setMarkersData(zoomInMarkersData)


        }
    }

    // testataan onko objecti sama vai ei
    function testie(obj) {
        console.log(obj, "Objecti")
        if (obj.length !== dataClose.length) {
            return false
        }
        const arr = []
        for (let i = 0; i < obj.length; i++) {
            for (let j = 0; j < dataClose.length; j++) {
                if (obj[i].id === dataClose[j].id) {
                    arr.push(obj[i])
                }

            }
        }
        console.log(arr.length, "arrin pituus test")
        console.log(dataClose.length, "dataClose pituus test")

        return arr.length !== dataClose.length ? false : true
    }

    //lähimmäisten asemien tarkastelu
    function handleAddDataClose(coordinates) {

        const coordinate = coordinates
        const mapIndex = data.findIndex(map => map.latitude === coordinate.latitude && map.longitude === coordinate.longitude)
        const dataCloseExist = dataClose.findIndex(close => data[mapIndex].id === close.id)
        if (dataCloseExist !== -1) {
            return true
        }
        const newCloseData = [...dataClose]
        newCloseData.unshift(data[mapIndex])
        const check = testie(newCloseData)
        if (check === false) {
            setDataClose(newCloseData)
        }
        return check
    }

    //markkerin painaminen
    function handleMarkerPress(event) {

        const coordinate = event.nativeEvent.coordinate
        setCloseDataLocation({ latitude: coordinate.latitude, longitude: coordinate.longitude })
        console.log(handleAddDataClose(coordinate), "Coordinaatit luettu")
        if (handleAddDataClose(coordinate) === false) {
            setShowCloseData(true)
            handleOpenPress()
            setScrollIndex(0)
            setIndexi(0)
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true })
            setUpdateCloseData(false)
            console.log("done")
        } else {
            const mapIndex = data.findIndex(map => map.latitude === coordinate.latitude && map.longitude === coordinate.longitude)
            const mapId = data[mapIndex].id
            const closeDataIndex = dataClose.findIndex(arr => arr.id === mapId)
            const xAxis = 320 * closeDataIndex
            setShowCloseData(true)
            handleOpenPress()
            setUpdateCloseData(false)
            setIndexi(mapIndex)
            scrollViewRef.current?.scrollTo({ x: xAxis, y: 0, animated: false })
        }
    }

// Sliderin oikeassa reunassa.
    const isCloseToRight = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToRight = 20;
        return layoutMeasurement.width + contentOffset.x >= contentSize.width - paddingToRight;
    };

    //ScrollView scrollin tarkkailu
    function handleScroll(event) {
        //console.log(dataClose.length, "length")
        //console.log(scrollIndex, "scrollIndex")

        const closeRight = isCloseToRight(event.nativeEvent)
        const mod = modulo(parseInt(event.nativeEvent.contentOffset.x), 320)
        //console.log(closeRight, "lähellä loppua")
        if (closeRight === true) {
            const item = dataClose[dataClose.length - 1]
            //const currentMapIndex = data.findIndex(mapData => mapData.id === item.id)
            setIndexi(dataClose.length - 1)
            setScrollIndex(dataClose.length - 1)
            console.log(dataClose.length - 1)
            map.current.animateToRegion({ latitude: item.latitude, longitude: item.longitude, latitudeDelta: INITIAL_LATITUDE_DELTA, longitudeDelta: INITIAL_LONGITUDE_DELTA }, 350)
        } else if (mod === false) {
            return //console.log("modulo false")
        }
        if (parseInt(event.nativeEvent.contentOffset.x / 320) !== scrollIndex && closeRight === false) {
            const item = dataClose[parseInt(event.nativeEvent.contentOffset.x / 320)]
            //const currentMapIndex = data.findIndex(mapData => mapData.id === item.id)
            //console.log(currentMapIndex)
            setIndexi(parseInt(event.nativeEvent.contentOffset.x / 320))
            setScrollIndex(Math.floor(parseInt(event.nativeEvent.contentOffset.x / 320)))
            map.current.animateToRegion({ latitude: item.latitude, longitude: item.longitude, latitudeDelta: INITIAL_LATITUDE_DELTA, longitudeDelta: INITIAL_LONGITUDE_DELTA }, 350)
        }

    }

// kahden numeron modulo
    function modulo(number, modulo) {
        let answer
        if (number % modulo === 0) {
            answer = true
        } else {
            answer = false
        }
        return answer
    }

    const heightSnap = Dimensions.get("window").height * 0.25
    //BottomSheetille snapPoint
    const snapPoints = useMemo(() => [heightSnap], []);
    //Aukaisee BottomSheetScrollview
    const handleOpenPress = () => bottomSheetRef.current?.expand();
    //antaa indexin missä vaiheessa bottomSheet on -1 ei näkyvillä.
    const handleSheetChange = useCallback((index) => {
        console.log("handleSheetChange", index);
        if (index === -1) {
            setShowCloseData(false)
            setIndexi("")
            
        }
    }, []);

    const currentZoomLevel = Math.round(
        Math.log(360 / longitudeDelta) / Math.LN2
    );
    //console.log(currentZoomLevel, "zoom zoom")
    //console.log(data, "useState")
    //console.log(dataClose, "dataClose useState")
    //console.log(data,"kaikki data")
    //console.log(citiesMarkers)
    //console.log(markersData.length,"pituus marker")
    //console.log(longitudeDelta, "longis")
    if (isLoading && isLoadingData) {
        return <View style={CharginStationsStyle.container}><Text style={CharginStationsStyle.loadingText}>Please wait a moment</Text></View>
    } else {

        return (
            <GestureHandlerRootView style={{ flex: 1 }}>

                <View style={CharginStationsStyle.container}>
                    <MapView
                        style={{
                             width: Dimensions.get("window").width,
                              height: Dimensions.get("window").height}}
                        ref={map}
                        initialRegion={{
                            latitude: latitude,
                            longitude: longitude,
                            latitudeDelta: INITIAL_LATITUDE_DELTA,
                            longitudeDelta: INITIAL_LONGITUDE_DELTA
                        }}
                        onRegionChangeComplete={region => regionChange(region)}
                        onRegionChange={region => setLongitudeDelta(prev => {
                            if (prev !== Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2)) {
                                return Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2)
                            } else {
                                return prev
                            }
                        })}
                        mapType='hyprid'
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        followsUserLocation={true}
                        loadingEnabled={true}
                        minZoom={1}
                        maxZoom={2}
                        minPoints={10}
                        clusterColor='red'
                        radius={ Dimensions.get("window").width * 0.2}
                        extent={600}
                        nodeSize={64}
                        spiderLineColor="#ff00f2"

                    >
                        {markersData.map((marker, index) =>
                            <Marker key={marker.id}
                                title={marker.name}
                                id={marker.id}
                                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                                tracksViewChanges={false}

                                onPress={(e) => marker.category==="city" ? zoomInPress(marker) : handleMarkerPress(e)}
                            >

                                <FontAwesome5 name="map-marker-alt" size={MARKER_SIZE} color={MARKER_BASE_COLOR} />
                            </Marker>)}

                            {dataClose?.map((marker,index)=>
                            <Marker key={marker.id}
                            title={marker.name}
                            id={marker.id}
                            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                            tracksViewChanges={false}

                            onPress={(e) => marker.category==="city" ? zoomInPress(marker) : handleMarkerPress(e)}
                        >

                            <FontAwesome5 name="map-marker-alt" size={index === indexi ? 1.25 * MARKER_SIZE : MARKER_SIZE} color={index === indexi ? MARKER_SELECTED_COLOR : MARKER_BASE_COLOR} />
                        </Marker>
                            )}

                        <Circle
                            center={{ latitude: latitude, longitude: longitude }}
                            radius={RADIUS}
                            fillColor='#6599f968'
                        />


                    </MapView>
                    {updateCloseData && 
                    <TouchableOpacity onPress={() => handleCloseDataPress()} style={CharginStationsStyle.updateButtonContainer}>
                        <Text style={CharginStationsStyle.updateText}>Update List</Text>
                    </TouchableOpacity>}

                    {!showCloseData ?
                        <TouchableOpacity onPress={() => handleCloseDataPress()} style={CharginStationsStyle.listButton}>
                            <Text style={CharginStationsStyle.listText}>Show list</Text>
                        </TouchableOpacity>
                        :
                        <BottomSheet
                            ref={bottomSheetRef}
                            index={0}
                            snapPoints={snapPoints}
                            onChange={handleSheetChange}
                            enableContentPanningGesture={false}
                            enablePanDownToClose={true}
                            backgroundStyle={{borderWidth:1,borderColor:'#CBB26A',borderRadius:8, backgroundColor: '#ffffffa4' }}
                            handleIndicatorStyle={[ButtonShadow,{backgroundColor:"#1D1A39"}]}
                        >
                            <BottomSheetScrollView
                                ref={scrollViewRef}
                                horizontal={true}
                                snapToInterval={300 + 20}
                                disableIntervalMomentum={true}
                                contentContainerStyle={{ paddingHorizontal: 20 }}
                                pagingEnabled
                                showsHorizontalScrollIndicator={true}
                                decelerationRate={"fast"}

                                //onScroll={(e) => handleScroll(e)}
                                onScroll={(e) => handleScroll(e)
                                }



                            >
                                {dataClose.map((dataClose, index) =>
                                    <Pressable style={CharginStationsStyle.sliderItemContainer } key={index} onPress={() => handlePress(dataClose)}>
                                            <View style={CharginStationsStyle.sliderItemImageContainer}>
                                                <Image style={CharginStationsStyle.sliderItemImage} source={Logo} resizeMode='contain' />
                                            </View>
                                            <View style={CharginStationsStyle.sliderItemImage}>
                                                <Text style={CharginStationsStyle.sliderItemText}>{dataClose.name}</Text>
                                                <Text style={CharginStationsStyle.sliderItemText}>{dataClose.operator}</Text>
                                                <Text style={CharginStationsStyle.sliderItemText}>Capacity: {dataClose.capacity}</Text>
                                            </View>
                                    </Pressable>)}
                            </BottomSheetScrollView>
                        </BottomSheet>


                    }
                </View>

            </GestureHandlerRootView>
        );
    }
}





