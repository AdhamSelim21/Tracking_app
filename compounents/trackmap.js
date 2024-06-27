import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps'; // Import Marker component
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import * as Location from 'expo-location';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    marginBottom: 1150,
  },
});
const handleMarkerPress = (location) => {
  // Do something when the marker is pressed
  console.log(`Marker pressed at: ${location.latitude}, ${location.longitude}`);
}

const TrackMap = ({ coordinate }) => {
  const [location, setLocation] = useState(null);
  
  const updateLocation = (newLocation) => {
    setLocation(newLocation);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
            const address = await geocoder.getAddressForLocationAsync(currentLocation.coords);
      console.log(address);
    })();
  }, );
 
  

  return (
    <View style={styles.container}>
      {/* {coordinate && ( */}
    
        <MapView style={styles.map} >
         
          <Marker
            coordinate={{
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
            }}
            title="child location"
            onPress={() => handleMarkerPress(coordinate)}
          />
      
        </MapView>
          
    {/* )} */}
    
    </View>
  );
};

export default TrackMap;