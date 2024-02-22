import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Modal, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { KANIT_BOLD, KANIT_THIN } from '../../assets/fonts/font';
import { MAIN_COLOR } from '../../assets/color';
import axios from 'axios';
import { compareTokenApi } from '../../utils/API/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../../context/AppContext';
import { useFocusEffect } from '@react-navigation/native';


const Welcome = ({ navigation }: any) => {
    const scale = useSharedValue(0);
    const left = useSharedValue(300);
    const right = useSharedValue(-300);
    const [isloading, setIsLoading] = useState(false)
    const { user, setUser }: any = useContext(AppContext)
    
    useFocusEffect(
        React.useCallback(() => {
            // Trigger the animation when the component mounts
            scale.value = withSpring(1, { damping: 4, stiffness: 40 });
            left.value = withSpring(0, { damping: 8, stiffness: 80 });
            right.value = withSpring(0, { damping: 8, stiffness: 80 });

            const intervalId = setInterval(() => {
                compareToken();
            }, 1500);

            return () => clearInterval(intervalId);
        }, [])
    );

    const compareToken = async () => {
        setIsLoading(true)
        const token = await AsyncStorage.getItem('token');
        if (token) {
            try {
                const result = await axios.get(compareTokenApi, {
                    params: {
                        token
                    }
                })
                if (result.status == 200) {
                    setUser(result.data.user)
                    navigation.navigate('BottomTab')
                }
            } catch (error) {
                navigation.navigate('Onboarding')
            }
        }
        else {
            navigation.navigate('Onboarding')
        }
        setIsLoading(false)
    }

    const scaleAni = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });
    const leftTxt = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: left.value }],
        };
    });
    const rightTxt = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: right.value }],
        };
    });

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffff' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.View style={[{ width: 200, height: 200, backgroundColor: 'transparent' }, scaleAni]}>
                    <Animated.Image style={[{ width: '100%', height: '100%', resizeMode: 'contain' }]} source={require('../../assets/images/trademark.png')} />
                </Animated.View>
            </View>
            <View style={styles.below}>
                <Animated.Text style={[styles.title, leftTxt]}>Welcome to</Animated.Text>
                <Animated.Text style={[styles.title, rightTxt]}>HUMI chatapp</Animated.Text>
            </View>
            <Modal
                transparent={true}
                visible={isloading}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,.3)' }}>
                    <ActivityIndicator color={'blue'} size={50} />
                </View>

            </Modal>
        </SafeAreaView>
    );
};

export default Welcome;

const styles = StyleSheet.create({
    title: {
        fontFamily: KANIT_BOLD,
        color: MAIN_COLOR,
        fontSize: 40,
    },
    content: {
        fontFamily: KANIT_THIN,
        color: 'black',
        fontSize: 30,
        textAlign: 'center',
    },
    below: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
});
