import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import * as Location from "expo-location";

const API_URL = "http://172.20.10.9localhost:3000/save-location";

const ChildView = () => {
  const [errMsg, setErrMsg] = useState("");
  const [userLat, setUserLat] = useState("");
  const [userLong, setUserLong] = useState("");

  const sendLocation = async () => {
    try {
      const url = "http://172.20.10.9localhost:3000/save-location";
      const response = await axios.post(API_URL, {
        latitude: userLat,
        longitude: userLong,
      })
      console.log('Location saved successfully:', response.data);
    } catch (error) {
      console.log('Error saving location:', error.message);
    }
  };

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
          sendLocation();
        }
      );

      return () => {
        if (subscription) {
          subscription.remove();
        }
      };
    };

    getLocation();

       // Send location every 10 minutes
       setInterval(sendLocation, 600000); // 600000 ms = 10 minutes
  }, );

  useEffect(() => {
    const requestBackgroundLocation = async () => {
      const { status } = await Location.requestBackgroundPermissionsAsync();
     if (status !== "granted") {
        console.log("Background location permission denied");
      }
    };

    requestBackgroundLocation();
  }, );

  return (
    <View style={styles.container}>
      <Text style={styles.textstyle}> </Text>
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
