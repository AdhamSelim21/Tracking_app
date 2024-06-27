import React, { useState , useEffect} from 'react';
import { View, StyleSheet} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ButtonTrack from './compounents/trackbutton';
import PushNotification from './compounents/pushnotification';
 import HistoryPage from './compounents/historypage';
import TrackMap from './compounents/trackmap';
import ChildView from './compounents/childveiw';

const App = () => {

 

  const [isTracking, setIsTracking] = useState(false);
  const [coordinate, setCoordinate] = useState({longitude: "", latitude: ""});

  const handleToggleTracking = () => {
    setIsTracking(!isTracking);
    // Add your button press logic here
  };
  const handlecoordinatedata = (coord) => {
    setCoordinate(coord) 
  }
  const Stack = createNativeStackNavigator();
// 

  return (
    
     <NavigationContainer>
       <Stack.Navigator>
        <Stack.Screen name="TRACKING" >
          {({ navigation }) => (
            <View style={styles.container}>
              <ButtonTrack onPress={handleToggleTracking} isTracking={isTracking}  setCoordinateData={handlecoordinatedata} />
               <PushNotification  /> 
              <ChildView/> 
              <TrackMap coordinate={coordinate} />
            
            </View>
          )}
        </Stack.Screen>
         <Stack.Screen name="History" component={HistoryPage} /> 
       </Stack.Navigator>
     </NavigationContainer>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0ffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
