import React, { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import { Platform, View, Text, } from "react-native";
import { useNavigation } from '@react-navigation/native';

// Add the requestNotificationPermission function from the first code
const requestNotificationPermission = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert(
      "Push Notifications",
      "We need your permission to send you push notifications.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("User cancelled the notification permission."),
          style: "cancel"
        },
        { text: "Allow", onPress: () => console.log("User allowed the notification permission.") }
      ],
      { cancelable: false }
    );
  }
};

Notifications.setNotificationHandler({
  handleNotification: async (notification) => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    data: notification.request.content.data, // Add this line to get the notification data
  }),
});

const createNotificationChannel = async () => {
  if (Platform.OS === "android") {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get notification permissions");
      return;
    }

    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
};

const PushNotification = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const intervalIdRef = useRef(null); // Use useRef for the interval ID
  const navigation = useNavigation();

  const handleNotification = (notification) => {
   
      console.log("Received notification: ", notification);
      if (notification.request.content.data) {
        const { data } = notification.request.content;
        navigation.navigate('TRACKING', { data }); // Pass the notification data to the TRACKING screen
      }
    }
  

  // Call the requestNotificationPermission function inside the useEffect hook
  useEffect(() => {
    createNotificationChannel();
    requestNotificationPermission();

    (async () => {
      const { status: permissionStatus } = await Notifications.requestPermissionsAsync();
      if (permissionStatus !== 'granted') {
        alert('Failed to get push token for push notification! Push notification permission is required.');
        return;
      }

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
      }, 20000000); // 30 minutes in milliseconds

      Notifications.addNotificationReceivedListener(handleNotification); // Add this line to listen for notifications when the app is in the foreground

      return () => {
        clearInterval(intervalIdRef.current);
        Notifications.removeNotificationSubscription(handleNotification); // Add this line to remove the listener when the component unmounts
      };
    })();
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

 

  return (
    <View style={{ marginBottom:100, alignItems: "center" }}>


    </View>
  );; 
};

export default PushNotification;
