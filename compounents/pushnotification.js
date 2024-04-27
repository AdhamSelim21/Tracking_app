import React, { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import { Platform, View, Text, TouchableOpacity } from "react-native";
//import * as Linking from "expo-linking";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const PushNotification = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const intervalIdRef = useRef(null); // Use useRef for the interval ID

  useEffect(() => {
    console.log("Registering for push notifications...");
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log("token: ", token);
        setExpoPushToken(token);
      })
      .catch((err) => console.log(err));

    intervalIdRef.current = setInterval(async () => {
      console.log("Sending notification every 30 minutes...");
      const location = await Location.getCurrentPositionAsync({});
      const mapsLink = `https://www.google.com/maps/search/?api=1&query=${location.coords.latitude},${location.coords.longitude}`;
      await sendNotification(mapsLink);
    }, 1000000); // 30 minutes in milliseconds

    return () => {
      clearInterval(intervalIdRef.current); 
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "33968461-6183-4976-a65d-aeb83f77cde6",
        })
      ).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  const sendNotification = async (mapsLink) => {
    console.log("Sending push notification...");

    const message = {
      to: expoPushToken,
      sound: "default",
      title: "TRACKING",
      body: mapsLink,
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        host: "exp.host",
        accept: "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  const handleNotificationPress = async (url) => {
    console.log("Notification pressed with URL:", url);
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Don't know how to open URL:", url);
    }

  };

  return (
    <View style={{ marginBottom:100, alignItems: "center" }}>
    </View>
  );; 
};

export default PushNotification;