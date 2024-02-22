import { Dimensions, FlatList, TouchableOpacity, Image, StyleSheet, Text, View, Pressable, ActivityIndicator, Linking, Alert, PermissionsAndroid } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { formatDate } from '../../utils/formatDate';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Header from '../../components/Header';
import axios from 'axios';
import { authTokenApi, findUserByPaginationApi, updateLocationApi } from '../../utils/API/user';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, runOnJS, interpolate, Extrapolation, interpolateColor, withDecay } from 'react-native-reanimated';
import { MAIN_COLOR, SECOND_COLOR } from '../../assets/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Modal } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { calculateAge } from '../../utils/calculateAge';
import { KANIT_SEMIBOLD, KANIT_ITALIC } from '../../assets/fonts/font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlertModal from '../../components/AlertModal';
import { sendToUserNotiTokenApi } from '../../utils/API/sendNotification';
import { getNotificationsTokenByUserIdApi, insertTokenNotificationsApi } from '../../utils/API/tokenNotifications';
import messaging from '@react-native-firebase/messaging';
import { addReceiverUserApi } from '../../utils/API/usersendingmatches';
import Geolocation from '@react-native-community/geolocation';
import { haversine } from '../../utils/haversine';
import { isCoordinateStringValid, parseCoordinateString } from '../../utils/checkIsCoodinate';

const { height, width } = Dimensions.get('window')
const Discover = ({ navigation }: any) => {
    const { user, setUser }: any = useContext(AppContext)
    const [pos, setPos] = useState({ lat: 0, lon: 0 });
    const cursor: any = useRef(null)
    const [data, setData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const position = useSharedValue({ x: 0, y: 1 });
    const [checkauth, setCheckauth] = useState('');
    const [visible, setVisible] = useState(false);
    const [address, setAddress] = useState('');
    const [content, setContent] = useState('');

    const LocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message:
                        'Cool Photo App needs access to your camera ' +
                        'so you can take awesome pictures.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the location');
                await _getCurrentLocationAndThenUpdate();
            } else {
                console.log('Location permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const _getCurrentLocationAndThenUpdate = async () => {
        try {
            _getCurrentLocation();
            await updateLocation();
        } catch (error) {
            console.error(error);
        }
    };

    const getAddressFromCoordinates = async (lat: any, lon: any) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=xxx`
            );

            const data = await response.json();
            console.log(data)
            const formattedAddress = data?.results[3]?.formatted_address || 'unknown';
            setAddress(formattedAddress)
        } catch (error) {
            console.error(error);
        }
    };
    const _getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setPos({ lat: latitude, lon: longitude })
            },
            error => {
                console.error(error)
            },
        );
    };

    const updateLocation = async () => {
        try {
            const res = await axios.post(updateLocationApi, {
                _id: user._id,
                location: pos.lat + " " + pos.lon,
            });
            if (res.status === 200) {
                console.log('UPDATE location OK');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            findUserByPagination();
            LocationPermission()
            setTokeNoti()
        }, [])
    );

    useEffect(() => {
        authToken()
    }, [data])

    const setTokeNoti = useCallback(async () => {
        const _token = await messaging().getToken();
        const res = await axios.post(insertTokenNotificationsApi, {
            userId: user._id,
            token: _token
        })
        if (res.status == 200) {
            console.log(res.data.message)
        }
    }, [])

    const authToken = async () => {
        const _token = await AsyncStorage.getItem('token');
        try {
            const res = await axios.get(authTokenApi, {
                params: {
                    token: _token
                }
            })
            if (res.status == 200) {

            }
        } catch (error) {
            setContent('Your session is end or someone is using your account.')
            setVisible(true)
            setCheckauth('Onboarding')
        }
    }

    async function findUserByPagination() {
        await axios.get(findUserByPaginationApi, {
            params: {
                cursor: cursor.current,
                location: user.location,
                gender: user.gender, interests: user.interests
            }
        }).then((result: any) => {
            setData(result.data.matchingUsers)
        }).catch((e) => {
            console.error(e)
        })
        // setIsLoading(false)
    }

    const handleCancel = () => {
        removeFirstItem()
    }

    const removeFirstItem = () => {
        setData((pre: any) => pre.slice(1));
        position.value = ({ x: 0, y: 0 })
        if (data.length <= 2) {
            findUserByPagination();
        }
    }
    const handleMatching = async () => {
        try {
            const res = await axios.post(addReceiverUserApi, {
                userId: user._id,
                receiver: {
                    receiverId: data[0]._id,
                    time: new Date()
                }
            })
            if (res.status == 200) {
                removeFirstItem()
                const res = await axios.get(getNotificationsTokenByUserIdApi, {
                    params: {
                        userId: data[0]._id
                    }
                })
                if (res.status == 200) {
                    const token: any = res.data[0].token
                    const _res = await axios.post(sendToUserNotiTokenApi, {
                        receivedToken: token,
                        title: "HUMI chat app",
                        body: 'Someone has just liked you!!'
                    })
                    if (_res.status == 200) {

                    }
                }
            }
        } catch (error) {
            console.error('error adding usersendingmatches ', error)
        }
    }

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            position.value = { x: e.translationX, y: e.translationY }
        })
        .onEnd((e) => {
            if (position.value.x > 150) {
                position.value = ({ x: 500, y: 0 })
                runOnJS(handleMatching)()
            }
            else if (position.value.x < -150) {
                position.value = ({ x: -500, y: 0 })
                runOnJS(handleCancel)()
            }

            else position.value = withTiming({ x: 0, y: 0 })
            // runOnJS(setTimeout)(resetPosition, 100);
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: position.value.x },
                { translateY: position.value.y },
                { rotateZ: `${position.value.x - position.value.x * .9}deg` }
            ],
        }
    });


    const animatedColor = useAnimatedStyle(() => {
        const opacity = interpolate(position.value.x, [-150, 0, 150], [1, 0, 1], Extrapolation.CLAMP);
        return {
            backgroundColor: interpolateColor(
                position.value.x,
                [-100, 0, 100],
                ['#f27121', 'transparent', MAIN_COLOR]
            ),
            opacity
        };
    });

    const scaleLikeAnim = useAnimatedStyle(() => {
        const scale = interpolate(position.value.x, [0, 150], [1, 1.3], Extrapolation.CLAMP);
        return {
            transform: [
                { scale }
            ]
        };
    });

    const scaleCancelAnim = useAnimatedStyle(() => {
        const scale = interpolate(position.value.x, [-150, 0], [1.3, 1], Extrapolation.CLAMP);
        return {
            transform: [
                { scale }
            ]
        };
    });

    const behideImgAnim = useAnimatedStyle(() => {
        const scaleX = interpolate(position.value.x, [-150, 0, 150], [1.13, 1, 1.13], Extrapolation.CLAMP);
        const scaleY = interpolate(position.value.x, [-150, 0, 150], [1.18, 1, 1.18], Extrapolation.CLAMP);
        const translateY = interpolate(position.value.x, [-150, 0, 150], [70, 0, 70], Extrapolation.CLAMP);
        return {
            transform: [
                { scaleX },
                { translateY },
                { scaleY }
            ],
        };
    });

    const opacityAnim = useAnimatedStyle(() => {
        const opacity = interpolate(position.value.x, [-150, 0, 150], [1, 0.3, 1], Extrapolation.CLAMP);
        return {
            opacity,
        };
    });

    const PressableAnim = Animated.createAnimatedComponent(Pressable)
    const TouchableOpacityAnim = Animated.createAnimatedComponent(TouchableOpacity)
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 1 }}>
                <Header headerTitle={"Discover"} headerIcon={'filter-circle'} userLocation={data ? address : ''} />
            </View>
            <View style={{ flex: 9 }}>
                <View style={styles.user}>
                    {
                        // data.length == 0 ? setIsLoading(false) :
                        data.map((item: any, index: any) => {
                            const images: string[] = item.images || [];
                            if (index == 0) {
                                cursor.current = item.createdAt
                                let distance: string = '-1'
                                if (isCoordinateStringValid(item.location)) {
                                    const coordinate = parseCoordinateString(item.location)
                                    getAddressFromCoordinates(coordinate?.latitude, coordinate?.longitude)
                                    distance = (haversine(pos.lat, pos.lon, coordinate?.latitude, coordinate?.longitude))
                                } else {
                                    distance = (haversine(pos.lat, pos.lon, (Math.random() * 10) / 100 + pos.lat, (Math.random() * 10) / 100 + pos.lon))
                                }
                                return (
                                    <GestureDetector
                                        key={index} gesture={panGesture}>
                                        <PressableAnim
                                            onPress={() => { navigation.navigate('PreviewProfile', { chosenId: item._id }) }}
                                            style={[styles.card, { top: 40 }, { zIndex: 10 - index }, animatedStyle]}>
                                            <Image source={{ uri: images[0] }} style={[styles.img]} />
                                            <View style={styles.distance}>
                                                <Text style={styles.distancetxt}>{distance}</Text>
                                            </View>
                                            <Animated.View style={[{ height: '100%', width: '100%', position: 'absolute', borderRadius: 15 }, animatedColor]} />
                                            <View>
                                                <View
                                                    style={styles.blurview}
                                                >
                                                    <BlurView
                                                        style={{ flex: 1 }}
                                                        blurType="light"
                                                        blurAmount={2}
                                                    />
                                                    <View style={{ position: 'absolute', left: 15, top: 20 }}>
                                                        <Text style={styles.name}>{item.firstName + " " + item.lastName}, {calculateAge(item.dateOfBirth)}</Text>
                                                        <Text style={styles.job}>{item.job}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </PressableAnim>
                                    </GestureDetector>
                                )
                            }
                            return (
                                <Animated.View
                                    key={index}
                                    style={[styles.card, { top: 10 }, { zIndex: 10 - index }, behideImgAnim, { backgroundColor: 'white' }]}>
                                    {/* <Animated.View style={[styles.img1]}> */}
                                    <Animated.Image source={{ uri: images[0] }} style={[styles.img1, opacityAnim]} />
                                    <View>
                                        <View
                                            style={[styles.blurview, { height: 80 }]}
                                        >
                                            <BlurView
                                                style={{ flex: 1 }}
                                                blurType="light"
                                                blurAmount={2}
                                            />
                                            <View style={{ position: 'absolute', left: 15, top: 20 }}>
                                                <Text style={styles.name}>{item.firstName + " " + item.lastName}, {calculateAge(item.dateOfBirth)}</Text>
                                                <Text style={styles.job}>{item.job}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    {/* </Animated.View> */}
                                </Animated.View>
                            )
                        })
                    }
                </View>
                <View style={styles.controll}>
                    <TouchableOpacityAnim
                        onPress={() => {
                            handleCancel()
                        }}
                        style={[styles.circle, scaleCancelAnim]}>
                        <Ionicons name='close' size={40} color={'#f27121'} />
                    </TouchableOpacityAnim>
                    <TouchableOpacity
                        onPress={() => {
                            handleCancel()
                        }}
                        style={[styles.circle, { height: 90, width: 90, backgroundColor: '#8a2387' }]}>
                        <AntDesign name='star' size={50} color={'white'} />
                    </TouchableOpacity>
                    <TouchableOpacityAnim
                        onPress={() => {
                            handleMatching()
                        }}
                        style={[styles.circle, scaleLikeAnim]}>
                        <AntDesign name='heart' size={35} color={MAIN_COLOR} />
                    </TouchableOpacityAnim>
                </View>
                <Modal
                    transparent={true}
                    visible={isLoading}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,.3)' }}>
                        <ActivityIndicator color={'blue'} size={50} />
                    </View>

                </Modal>
            </View>
            <AlertModal visible={visible} setVisible={setVisible} content={content} checkauth={checkauth} />
        </View>
    )
}

export default Discover

const styles = StyleSheet.create({
    distancetxt: {
        fontFamily: KANIT_ITALIC, color: 'black', fontSize: 12
    },
    distance: {
        height: 30, width: 40, borderRadius: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',
        elevation: 2, position: 'absolute', top: 10, left: 10
    },
    name: {
        fontFamily: KANIT_SEMIBOLD, color: 'white', fontSize: 20, maxWidth: 250, lineHeight: 25
    },
    job: {
        fontFamily: KANIT_ITALIC, color: 'white', fontSize: 15, maxWidth: 250
    },
    blurview: {
        width: '100%', height: 100, position: 'absolute', bottom: 0, borderBottomLeftRadius: 15, overflow: 'hidden', borderBottomRightRadius: 15
    },
    circle: {
        height: 70, width: 70, borderRadius: 60, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', elevation: 2
    },
    card: {
        flex: 1, position: 'absolute', borderRadius: 15
    },
    user: {
        flex: 7, justifyContent: 'center', alignItems: 'center'
    },
    controll: {
        flex: 2, justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'row',
        paddingHorizontal: 30,
    },
    img: {
        height: height * .6, width: width * .8,
        borderRadius: 15,
    },
    img1: {
        height: height * .5, width: width * .7,
        borderRadius: 15,
    }
})
