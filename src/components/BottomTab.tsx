import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Discover from '../screens/inApp/Discover';
import Matches from '../screens/inApp/Matches';
import Messages from '../screens/inApp/Messages';
import Profile from '../screens/inApp/Profile';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MAIN_COLOR, SECOND_COLOR } from '../assets/color';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BlurView } from '@react-native-community/blur';
const { height, width } = Dimensions.get('window')

const BottomTab = () => {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: '#ffff', height: 60
                },
                // tabBarBackground:() => (
                //     <BlurView blurType="light" blurAmount={100} style={StyleSheet.absoluteFill} />
                //   )
            }}
        >
            <Tab.Screen
                options={{
                    tabBarIcon: ({ focused }: any) => {
                        return (
                            <TouchableOpacity style={[styles.icon, { borderTopColor: focused ? MAIN_COLOR : 'white' }]}>
                                <Ionicons name='copy' size={30} color={focused ? MAIN_COLOR : 'gray'} />
                            </TouchableOpacity>
                        )
                    }
                }}
                name="Discover" component={Discover} />
            <Tab.Screen
                options={{
                    tabBarIcon: ({ focused }: any) => {
                        return (
                            <TouchableOpacity style={[styles.icon, { borderTopColor: focused ? MAIN_COLOR : 'white' }]}>
                                <Entypo name='heart' size={35} color={focused ? MAIN_COLOR : 'gray'} />
                            </TouchableOpacity>
                        )
                    }
                }}
                name="Matches" component={Matches} />
            <Tab.Screen
                options={{
                    tabBarIcon: ({ focused }: any) => {
                        return (
                            <TouchableOpacity style={[styles.icon, { borderTopColor: focused ? MAIN_COLOR : 'white' }]}>
                                <Ionicons name='chatbubble-sharp' size={30} color={focused ? MAIN_COLOR : 'gray'} />
                            </TouchableOpacity>
                        )
                    }
                }}
                name="Messages" component={Messages} />
            <Tab.Screen
                options={{
                    tabBarIcon: ({ focused }: any) => {
                        return (
                            <TouchableOpacity style={[styles.icon, { borderTopColor: focused ? MAIN_COLOR : 'white' }]}>
                                <FontAwesome name='user' size={30} color={focused ? MAIN_COLOR : 'gray'} />
                            </TouchableOpacity>
                        )
                    }
                }}
                name="Profile" component={Profile} />
        </Tab.Navigator>
    )
}

export default BottomTab

const styles = StyleSheet.create({
    icon: {
        justifyContent: 'center', alignItems: 'center', flex: 1,
        width: width / 4, borderTopWidth: 2
    }
})