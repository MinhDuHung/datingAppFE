import messaging from '@react-native-firebase/messaging';
import NavigationServices from '../NavigationServices';
import { showNotification } from '../LOCAL_NOTIFICATION/onNotification';
import axios from 'axios';
import { insertTokenNotificationsApi } from '../API/tokenNotifications';
export async function requestUserPermission() {
    await getToken()
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }
}

async function getToken() {
    try {
        const token = await messaging().getToken();
        console.log('tokeNoti :', token)
    } catch (error) {
        console.error(error)
    }
}

export async function notificationListeners() {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('A new FCM message arrived!', remoteMessage);
        showNotification(remoteMessage.notification.body)
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage,
        );
        setTimeout(() => {
            NavigationServices.navigate('Matches');
        }, 200);
    });

    // Check whether an initial notification is available
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
            }
        });

    return unsubscribe;
}
