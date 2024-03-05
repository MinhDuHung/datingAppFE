import { Dimensions, StyleSheet, Text, Image, TouchableOpacity, View, TextInput, ScrollView, Modal, ActivityIndicator, ImageBackground } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { KANIT_BLACK_ITALIC, KANIT_BOLD, KANIT_EXTRABOLD, KANIT_EXTRALIGHT, KANIT_ITALIC, KANIT_MEDIUM, KANIT_REGULAR, KANIT_SEMIBOLD, KANIT_THIN } from '../../assets/fonts/font'
import { MAIN_COLOR, SECOND_COLOR } from '../../assets/color'
import AntDesign from 'react-native-vector-icons/AntDesign'
import DatePicker from 'react-native-date-picker'
import { formatDate } from '../../utils/formatDate'
import { isAdult } from '../../utils/isAdult'
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { AppContext } from '../../context/AppContext';
import { FlatList } from 'react-native-gesture-handler';
import axios from 'axios';
import { authPasswordApi, authTokenApi, findUserByIdApi, updateUserApi } from '../../utils/API/user';
import AlertModal from '../../components/AlertModal';
import { sha256Hash } from '../../utils/encryptSha256';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DraggableFlatList, { OpacityDecorator, ScaleDecorator, ShadowDecorator, useOnCellActiveAnimation } from 'react-native-draggable-flatlist';
import { AnimatedImage } from 'react-native-reanimated/lib/typescript/reanimated2/component/Image';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { BlurView } from '@react-native-community/blur';
import { calculateAge } from '../../utils/calculateAge'
const { height, width } = Dimensions.get('window')

const PreviewProfile = ({ navigation, route }: any) => {
    const { chosenId } = route.params
    const { user, setUser }: any = useContext(AppContext)
    const [chosenUser, setChosenUser] = useState({
        firstName: "loading...",
        lastName: "loading...",
        dateOfBirth: "2024-01-12T17:00:00.000Z",
        gender: "loading...",
        job: "loading...",
        about: "loading...",
        location: "loading...",
        images: ["https://th.bing.com/th/id/OIP.6c9aZ6JK0kDWdaMrM_UVGgAAAA?rs=1&pid=ImgDetMain"],
        interests: ["loading..."],
    });
    const [isReadmore, setIsReadMore] = useState(true);
    const [blur, setBlur] = useState(0);

    useEffect(() => {
        async function initFunc() {
            await authToken()
            await findChosenUserById()
        }
        initFunc()
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
            navigation.navigate('Onboarding')
        }
    }

    async function findChosenUserById() {
        try {
            const res = await axios.get(findUserByIdApi, {
                params: {
                    _id: chosenId
                }
            })
            if (res.status == 200) {
                setChosenUser(res.data.user)
            }
        } catch (error: any) {
            if (error.respone && error.respone.status == 404) {
                console.error(error.respone.data.error)
            }
            console.error(error)
        }
    }
    return (
        <View style={{ backgroundColor: 'black', height, width }}>
            <View>
                <Image source={{ uri: chosenUser.images[0] }} style={{ height: height / 2, width, position: 'absolute' }} />
                {
                    blur > 0 && <BlurView
                        blurType="light"
                        blurAmount={blur}
                        style={{ height: height / 2, width, position: 'absolute' }}
                    />
                }
                <AntDesign
                    onPress={() => navigation.goBack()}
                    name='leftcircleo' size={30} color={MAIN_COLOR} style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }} />
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={(e) => {
                    setBlur(Math.floor(e.nativeEvent.contentOffset.y / 10))
                }}
            >
                <View style={[styles.bottomSheet, { marginTop: height / 2.2 }]}>
                    <View style={styles.headerSheet}>
                        <TouchableOpacity
                            onPress={() => {

                            }}
                            style={styles.circle}>
                            <Ionicons name='close' size={40} color={'#f27121'} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {

                            }}
                            style={[styles.circle, { height: 90, width: 90, backgroundColor: MAIN_COLOR }]}>
                            <AntDesign name='heart' size={45} color={'white'} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {

                            }}
                            style={styles.circle}>
                            <AntDesign name='star' size={35} color={'#8a2387'} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ paddingTop: 100, paddingHorizontal: 30, justifyContent: 'space-between', flex: 1 }}>
                        <View style={styles.section}>
                            <View>
                                <Text style={styles.name}>{chosenUser.firstName + " " + chosenUser.lastName}, {calculateAge(chosenUser.dateOfBirth)}</Text>
                                <Text style={styles.job}>{chosenUser.job}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => {

                                }}
                                style={styles.map}
                            >
                                <FontAwesome6 name='location-arrow' size={30} color={MAIN_COLOR} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.section}>
                            <View>
                                <Text style={styles.name}>Location</Text>
                                <Text style={styles.job}>{chosenUser.location}</Text>
                            </View>
                            <View
                                style={styles.distance}>
                                <FontAwesome6 name='location-dot' size={20} color={MAIN_COLOR} />
                                <Text style={styles.redTxt}>1 Km</Text>
                            </View>
                        </View>
                        <View style={styles.section}>
                            <View>
                                <Text style={styles.name}>About</Text>
                                {
                                    isReadmore ? <Text numberOfLines={4} style={[styles.job, { maxWidth: '100%' }]}>{chosenUser.about}</Text> :
                                        <Text style={[styles.job, { maxWidth: '100%' }]}>{chosenUser.about}</Text>

                                }
                                <TouchableOpacity
                                    style={{ height: 30, width: 100 }}
                                    onPress={() => setIsReadMore(!isReadmore)}>
                                    <Text style={styles.redTxt}>{isReadmore ? 'Read more' : 'Hide'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <View style={{ width: '100%' }}>
                                <Text style={styles.name}>Interests</Text>
                                <FlatList
                                    data={chosenUser.interests}
                                    keyExtractor={(item, index) => index.toString()}
                                    contentContainerStyle={{ gap: 10, }}
                                    columnWrapperStyle={{ justifyContent: 'space-evenly', width: '100%' }}
                                    scrollEnabled={false}
                                    numColumns={3}
                                    renderItem={({ item }) => {
                                        const isSimilar = user.interests.includes(item);
                                        return (
                                            <View style={[styles.box, { borderColor: isSimilar ? MAIN_COLOR : 'grey' }]}>
                                                {isSimilar && <Ionicons name="checkmark-done-outline" size={20} color={MAIN_COLOR} />}
                                                <Text style={[styles.redTxt, { color: isSimilar ? MAIN_COLOR : 'grey' }]}>{item}</Text>
                                            </View>
                                        );
                                    }}
                                />
                            </View>
                        </View>
                        <View style={styles.section}>
                            <View style={{ width: '100%', }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    <Text style={styles.name}>Gallery</Text>
                                    <Text style={styles.redTxt}>See all</Text>
                                </View>
                                <FlatList
                                    data={chosenUser.images.slice(0, 2)}
                                    keyExtractor={(item, index) => index.toString()}
                                    contentContainerStyle={{ gap: 10, }}
                                    scrollEnabled={false}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate('ImageDetails', { img: item })}>
                                                <Image
                                                    source={{ uri: item }} style={{ borderRadius: 10, height: 250, width: width / 2 - 35, }} />
                                            </TouchableOpacity>
                                        );
                                    }}
                                />
                                <FlatList
                                    data={chosenUser.images.slice(2, 5)}
                                    keyExtractor={(item, index) => index.toString()}
                                    contentContainerStyle={{ gap: 5, }}
                                    scrollEnabled={false}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate('ImageDetails', { img: item })}>
                                                <Image
                                                    source={{ uri: item }} style={{ borderRadius: 10, height: 150, width: width / 3 - 25, marginTop: 10 }} />
                                            </TouchableOpacity>
                                        );
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView >
        </View >
    );
};
export default PreviewProfile

const styles = StyleSheet.create({
    interests: {
        flexDirection: 'row', justifyContent: 'space-evenly', maxWidth: '100%'
    },
    box: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', borderRadius: 10, borderWidth: 1, padding: 5,
    },
    redtxt: {
        fontFamily: KANIT_THIN, color: 'black', fontSize: 20,
    },
    distance: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: 90, height: 40, backgroundColor: SECOND_COLOR, borderRadius: 10
    },
    section: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', },
    map: {
        height: 60, width: 60, borderRadius: 15, borderWidth: .3, borderColor: 'black', justifyContent: 'center', alignItems: 'center',
    },
    name: {
        fontFamily: KANIT_SEMIBOLD, color: 'black', fontSize: 24, maxWidth: 200, lineHeight: 25
    },
    job: {
        fontFamily: KANIT_ITALIC, color: 'black', fontSize: 18, maxWidth: 250
    },
    headerSheet: {
        position: 'absolute', top: -40, justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'row',
        width: width, paddingHorizontal: 30
    },
    circle: {
        height: 70, width: 70, borderRadius: 60, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', elevation: 2
    },
    bottomSheet: {
        backgroundColor: 'white', width, borderRadius: 50, height: height * 1.7,
    },
    title: {
        fontFamily: KANIT_MEDIUM, color: 'black', fontSize: 26,
    },
    redTxt: {
        fontFamily: KANIT_MEDIUM, fontSize: 18,
    },
    header: {
        flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', borderBottomRightRadius: 15, borderBottomLeftRadius: 15
    },
    body: {
        flex: 8,
    },
    footer: {
        flex: 1, justifyContent: 'center', alignItems: 'center'
    }
})