import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { MAIN_COLOR, SECOND_COLOR } from '../../assets/color'
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { KANIT_BOLD, KANIT_EXTRALIGHT, KANIT_MEDIUM } from '../../assets/fonts/font'
const { height, width } = Dimensions.get('window')
const SuccessfulMatching = ({ navigation, route }: any) => {
    const { img } = route.params
    const { user, setUser }: any = useContext(AppContext)
    const left = useSharedValue(-200)
    const right = useSharedValue(200)
    const translateRight = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: right.value },
                { rotateZ: `${interpolate(right.value, [200, 0], [0, 10])}deg` }
            ]
        }
    })
    const translateLeft = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: left.value },
                { rotateZ: `${interpolate(left.value, [-200, 0], [0, -10])}deg` }
            ]
        }
    })

    useEffect(() => {
        setTimeout(() => {
            left.value = withSpring(0, { damping: 7, stiffness: 50 });
            right.value = withSpring(0, { damping: 7, stiffness: 50 });
        }, 200);
    }, [])
    return (
        <View style={{ flex: 1, }}>
            <View style={styles.body}>
                <View style={{ flex: 8 }}>
                    <Animated.View style={[styles.card, translateRight, { top: 60, right: -150 }]}>
                        <View style={[styles.circle, { top: -30, }]}>
                            <AntDesign name='heart' size={40} color={MAIN_COLOR} />
                        </View>

                        <Image source={{ uri: user.images[0] }} style={styles.img} />
                    </Animated.View>
                    <Animated.View style={[styles.card, translateLeft, { top: 150, right: -40 }]}>
                        <View style={[styles.circle, { bottom: -30, }]}>
                            <AntDesign name='heart' size={40} color={MAIN_COLOR} />
                        </View>
                        <Image source={{ uri: img }} style={styles.img} />
                    </Animated.View>
                </View>
                <View style={{ flex: 2, }}>
                    <Text style={styles.title}>It's a match, {user.lastName}!</Text>
                    <Text style={styles.content}>Start a conversation now with each other</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('ChatRoom')
                    }}
                    style={[styles.btn, { backgroundColor: MAIN_COLOR }]}
                >
                    <Text style={[styles.txt, { color: 'white' }]}>Say Hello</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack()
                    }}
                    style={[styles.btn, { backgroundColor: SECOND_COLOR }]}
                >
                    <Text style={[styles.txt, { color: MAIN_COLOR }]}>Keep Swiping</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SuccessfulMatching

const styles = StyleSheet.create({
    title: {
        fontSize: 30, fontFamily: KANIT_BOLD, color: MAIN_COLOR, textAlign: 'center'
    },
    content: {
        fontSize: 14, fontFamily: KANIT_EXTRALIGHT, color: 'black', textAlign: 'center'
    },
    btn: {
        width: width * .8, borderRadius: 15, height: 50, justifyContent: 'center', alignItems: 'center', elevation: 3
    },
    txt: {
        fontSize: 24, fontFamily: KANIT_MEDIUM
    },
    body: {
        flex: 8, justifyContent: 'center', alignItems: 'center',
    },
    circle: {
        height: 60, width: 60, borderRadius: 30, backgroundColor: 'white', justifyContent: 'center',
        alignItems: 'center', elevation: 5, position: 'absolute', zIndex: 1,
        left: -20

    },
    img: {
        height: 280, width: 190, borderRadius: 20, resizeMode: 'cover'
    },
    footer: {
        flex: 2, justifyContent: 'space-evenly', alignItems: 'center'
    },
    card: {
        elevation: 10, height: 280, width: 190, borderRadius: 10, position: 'absolute',
    }
})