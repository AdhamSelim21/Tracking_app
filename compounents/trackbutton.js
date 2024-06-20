import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import TrackMap from './trackmap';


const ButtonTrack = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState(null);
  const navigation = useNavigation(); // Get navigation reference
  const [locationSubscription, setLocationSubscription] = useState(null);

  const fetchUser = async () => {
    try {
      const url = `http://localhost:3000/location/`;
      const response = await axios.get(url);
      return response.data; // Return the JSON data from the response
    } catch (error) {
      console.error(error);
      return null; // Return null or handle the error in some way
    }
  };
  

  const startTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return; // Handle permission denial
      }
  
      setIsTracking(true); // Set tracking to true on button press
      console.log('Tracking started');
  
      const data = await fetchUser(); // Fetch user data
      if (data === null) {
        console.error('Failed to fetch user data');
        return; // or handle the error in some other way
      }
  
      console.log(data); // Should log { "long": 4534543, "lat": 45645454 }
  
      // Update the state of the map component with the location data
      const longitude = data.long;
      const latitude = data.lat;
  
      // Use latitude and longitude as needed, e.g., update map markers
      // or send to a backend server for further processing
    } catch (error) {
      console.error(error);
    }
  };
  

  const stopTracking = () => {
    console.log('Tracking stopped');
    setIsTracking(false);

 
  };

  const handleHistoryPress = () => {
    navigation.navigate('History'); // Navigate to HistoryScreen
  };

  const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection: 'column', // Buttons stacked vertically
      justifyContent: 'center', // Align buttons at the bottom
      alignItems: 'center',
      left: 100,
      bottom: -110,
      marginTop: 500,
      backgroundColor: 'transparent',
      paddingHorizontal: 100,
      paddingVertical: 6,
    },
    button: {
      paddingHorizontal: 30,
      paddingVertical: 10,
      borderRadius: 100,
      marginTop: 10,
    },
    buttonStart: {
      backgroundColor: '#1e90ff',
    },
    buttonStop: {
      backgroundColor: '#1e90ff',
    },
    buttonHistory: {
      backgroundColor: '#1e90ff',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 60,
      justifyContent: 'center',
      textAlign: 'center',
    },
    buttonText: {
      color: 'white',
      justifyContent: 'center',
      textAlign: 'center',
      fontSize: 20,
    },
    liveTrackingText: {
      fontSize: 30,
      textAlign: 'right',
      marginRight: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      color: '#1e90ff',
      right: 160,
      bottom: 70,
    },
  });

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, isTracking ? styles.buttonStop : styles.buttonStart]}
        onPress={isTracking ? stopTracking : startTracking}>
        <Text style={styles.buttonText}>
          {isTracking ? 'Tracking...' : 'Track'}
        </Text>
      </TouchableOpacity>
      {location && <TrackMap location={location} />}
      <TouchableOpacity
        style={[styles.button, styles.buttonHistory]}
        onPress={handleHistoryPress}>
        <Text style={styles.buttonText}>History</Text>
      </TouchableOpacity>
     
      <Text style={styles.liveTrackingText}>Live Tracking</Text>
    </View>
  );
};

export default ButtonTrack;