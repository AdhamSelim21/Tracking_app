import * as Location from 'expo-location'; // Import Expo Location
import AsyncStorage from '@react-native-async-storage/async-storage';

async function requestLocationPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permission to access location was denied');
    return null; // Handle permission denial (optional)
  }
  return true;
}

async function storeLocationHistory(locationData) {
  const timestamp = new Date().toISOString();
  const data = JSON.stringify({ timestamp, ...locationData });
  try {
    await AsyncStorage.setItem('@LocationHistory', data);
  } catch (error) {
    console.error('Error storing location history:', error);
    // Handle errors gracefully (e.g., display a user-friendly message)
  }
}

async function fetchCurrentLocation() {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    return null;
  }

  try {
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    return { latitude, longitude };
  } catch (error) {
    console.error('Error obtaining location:', error);
    return null;
  }
}

(async () => {
  const location = await fetchCurrentLocation();
  if (location) {
    await storeLocationHistory(location);
    console.log('Location stored successfully!'); // Optional success message
  } else {
    console.log('Failed to get location. Please enable location services.'); // Informative error message
  }
})();

export default storeLocationHistory; 