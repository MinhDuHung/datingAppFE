/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import notifee, { EventType } from "@notifee/react-native";
import { showNotification } from './src/utils/LOCAL_NOTIFICATION/onNotification';

// Đăng ký event listener khi ứng dụng chạy ở background
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  // showNotification()
});

// Đăng ký event listener cho sự kiện khi ứng dụng chạy ở foreground
notifee.onForegroundEvent(({ type, detail }) => {
  switch (type) {
    case EventType.DISMISSED:
      console.log('User dismissed notification', detail.notification);
      break;
    case EventType.PRESS:
      console.log('User pressed notification', detail.notification);
      break;
  }
});

// Đăng ký event listener cho sự kiện khi ứng dụng chạy ở background
notifee.onBackgroundEvent(async (event) => {
  switch (event.type) {
    case EventType.DISMISSED:
      console.log('User dismissed notification in background', event.detail.notification);
      break;
    case EventType.PRESS:
      console.log('User pressed notification in background', event.detail.notification);
      break;
    // Xử lý các sự kiện khác nếu cần
  }
})

// Đăng ký component chính của ứng dụng
AppRegistry.registerComponent(appName, () => App);
