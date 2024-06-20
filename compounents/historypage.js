import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import {storeLocationHistory} from './LocationUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const storeCurrentLocation = async () => {
  const track = true; // Set to true when the user clicks the track button
  const location = await fetchCurrentLocation(track);
  if (location) {
    // Call the backend API to get the user's last location and date/time update
    try {
      const response = await axios.get("http://localhost:3000/last-location?fieldName=child_id&value=1", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourAccessToken}` // Add your access token here
        }
      });

      if (response.status === 200) {
        const data = response.data;
        // Update the user's last location and date/time update in AsyncStorage
        await storeLocationHistory(location, data.dateTimeUpdate);
        console.log('Location and date/time update stored successfully!');
      } else {
        console.error('Error fetching last location from backend:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching last location from backend:', error);
    }
  } else {
    console.log('Failed to get location.');
  }
};

function HistoryPage() {
  const [locationHistory, setLocationHistory] = useState([]);

  useEffect(() => {
    const retrieveLocationHistory = async () => {
      try {
        const data = await AsyncStorage.getItem('@LocationHistory');
        if (data !== null) {
          setLocationHistory(JSON.parse(data));
        }
      } catch (error) {
        console.error('Error retrieving location history:', error);
      }
    };

    retrieveLocationHistory();
  }, []); // Include an empty dependency array initially

  const renderItem = ({ item }) => {
    const { location, dateTimeUpdate } = item;
    const formattedDate = new Date(dateTimeUpdate).toLocaleString(); // Format date/time update

    return (
      <View style={{ margin: 10, padding: 10, borderWidth: 1, borderRadius: 5 }}>
        <Text>Date & Time: {formattedDate}</Text>
        <Text>Latitude: {location.coords.latitude}</Text>
        <Text>Longitude: {location.coords.longitude}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 20, textAlign: 'center', marginVertical: 10, color: '#1e90ff' }}>Location History</Text>
      <FlatList
        data={locationHistory}
        renderItem={renderItem}
        keyExtractor={(item) => item.dateTimeUpdate}
      />
    </View>
  );
}

export default HistoryPage;