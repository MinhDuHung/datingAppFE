import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from './src/screens/outApp/Onboarding';
import Signup from './src/screens/outApp/Signup';
import SignupWithEmail from './src/screens/outApp/SignupWithEmail';
import SignupWithPhone from './src/screens/outApp/SignupWithPhone';
import Profile from './src/screens/outApp/Profile';
import Gender from './src/screens/outApp/Gender';
import Interests from './src/screens/outApp/Interests';
import InformationForm from './src/screens/outApp/InformationForm';
import CreatePassword from './src/screens/outApp/CreatePassword';
import { AppContext, AppProvider } from './src/context/AppContext';
import Signin from './src/screens/outApp/Signin';
import Welcome from './src/screens/outApp/Welcome';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Discover from './src/screens/inApp/Discover';
import BottomTab from './src/components/BottomTab';
import ImageDetails from './src/screens/inApp/ImageDetails';
import PreviewProfile from './src/screens/inApp/PreviewProfile';
import SuccessfulMatching from './src/screens/inApp/SuccessfulMatching';
import ChatRoom from './src/components/ChatRoom';
import NavigationServices from './src/utils/NavigationServices';
import { Platform, PermissionsAndroid } from 'react-native';
import { requestUserPermission, notificationListeners } from './src/utils/FCM/notifications';
import PostActivity from './src/screens/inApp/PostActivity';
import Activites from './src/screens/inApp/Activites';
import DetailImages from './src/screens/inApp/DetailImages';
import { AppState } from 'react-native';
const Stack = createNativeStackNavigator();
function App() {
  async function requestNotificationPermission() {
    try {
      if (Platform.OS == 'android') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS).then((res) => {
          console.log('res ', res)
          if (!!res && res == 'granted') {
            // requestUserPermission()
          }
          requestUserPermission()
          notificationListeners()
        }).catch((err) => {
          console.error(err)
        })
      }
    } catch (error) {
      console.warn(error);
    }
  }

  const appStateChangeHandler = (nextAppState: any) => {
    console.log(nextAppState)
  };

  React.useEffect(() => {
    requestNotificationPermission()
  }, [])

  AppState.addEventListener('change', appStateChangeHandler);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer ref={(ref) => NavigationServices.setTopLevelNavigator(ref)}>
        <AppProvider>
          <Stack.Navigator screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="PostActivity" component={PostActivity} />
            <Stack.Screen name="Activites" component={Activites} />
            <Stack.Screen name="Signin" component={Signin} />
            <Stack.Screen name="CreatePassword" component={CreatePassword} />
            <Stack.Screen name="BottomTab" component={BottomTab} />
            <Stack.Screen name="InformationForm" component={InformationForm} />
            <Stack.Screen name="Interests" component={Interests} />
            <Stack.Screen name="DetailImages" component={DetailImages} />
            <Stack.Screen name="Gender" component={Gender} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="SignupWithEmail" component={SignupWithEmail} />
            <Stack.Screen name="SignupWithPhone" component={SignupWithPhone} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="ImageDetails" component={ImageDetails} />
            <Stack.Screen name="PreviewProfile" component={PreviewProfile} />
            <Stack.Screen name="SuccessfulMatching" component={SuccessfulMatching} />
          </Stack.Navigator>
        </AppProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;