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
    marginTop: -1130,
  },
});

const TrackMap = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {location && (
    
        <MapView style={styles.map} provider="google">
         
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Location"
          />
      
        </MapView>
          
    )}
    
    </View>
  );
};

export default TrackMap;