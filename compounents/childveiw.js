import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import * as Location from "expo-location";

const LOCATION_DISTANCE_THRESHOLD = 10; // METERS

const ChildView = () => {
  const [errMsg, setErrMsg] = useState("");
  const [userLat, setUserLat] = useState("");
  const [userLong, setUserLong] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("permission to access location was denied");
        return;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: LOCATION_DISTANCE_THRESHOLD,
        },
        (location) => {
          const { coords } = location;
          const { latitude, longitude } = coords;
          console.log("user latitude:", latitude);
          console.log("user longitude:", longitude);
          setUserLong(longitude.toString());
          setUserLat(latitude.toString());
        }
      );

      return () => {
        if (subscription) {
          subscription.remove();
        }
      };
    };

    getLocation();

    const fetchData = async () => {
      try {
        const response = await axios.get('https://your-backend-api-url.com/data');
        setData(response.data);
      } catch (error) {
        console.log('Error making API request:', error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const requestBackgroundLocation = async () => {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Background location permission denied");
      }
    };

    requestBackgroundLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.textstyle}>Hello </Text>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

});

export default ChildView;