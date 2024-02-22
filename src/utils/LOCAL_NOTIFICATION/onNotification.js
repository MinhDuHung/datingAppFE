
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { MAIN_COLOR } from '../../assets/color';


export const showNotification = async (body) => {
    try {
        // Xử lý dữ liệu từ remoteMessage và tạo thông báo Notifee
        const channelId = await notifee.createChannel({
            id: 'default 3',
            name: 'Default Channel 3',
            importance: AndroidImportance.HIGH,
            sound: 'default',
        });

        if (!channelId) {
            throw new Error('Channel creation failed');
        }

        const text = body

        await notifee.displayNotification({
            title: 'HUMI chat app!',
            body: text,
            android: {
                channelId,
                smallIcon: 'ic_launcher',
                color: MAIN_COLOR,
                pressAction: {
                    id: 'default',
                },
            },
        });
    } catch (error) {
        console.error('Error handling FCM message:', error);
    }
}
