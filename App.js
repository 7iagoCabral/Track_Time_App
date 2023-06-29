import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, watchPositionAsync, LocationAccuracy } from 'expo-location'
import { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';

export default function App() {

  const [location, setLocation] = useState(null)
  const [allLocation, setAllLocation] = useState([])
  async function requestLocationPermission (){
    const { granted } = await requestForegroundPermissionsAsync()
    if(granted){
      const CurrentPosition = await getCurrentPositionAsync()
      setLocation(CurrentPosition)
      setAllLocation(arr => [...arr, CurrentPosition])

    }
  }
  useEffect(()=>{
    requestLocationPermission()
  },[])

  useEffect(()=>{
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1, /// miliseconds
      distanceInterval: 1,

    }, (response) => {
      // console.log("new loc: " + response.coords)
      setLocation(response)
      setAllLocation(arr => [...arr, response])
    })
  },[])
  if(location){

      return (
        <View style={styles.container}>
          <MapView 
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
             
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
            />
            {allLocation.map((loc, i) => <Marker key={i} coordinate={{ latitude: loc.coords.latitude, longitude: loc.coords.longitude,}} />)}
          </MapView>
          {location && <Text>Current position: lat: {location.coords.latitude} long: {location.coords.longitude}</Text>}
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#777777',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
  },
});
