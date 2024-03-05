import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import Feather from 'react-native-vector-icons/Feather'
import { MAIN_COLOR } from '../../assets/color'
import { FlatList, Gesture, GestureDetector, PinchGestureHandler, PinchGestureHandlerGestureEvent, TouchableOpacity } from 'react-native-gesture-handler'
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { AppContext } from '../../context/AppContext'

const { height, width } = Dimensions.get('window')
const ImageDetails = ({ navigation, route }: any) => {
    const { img } = route.params
    const [Img, setImg] = useState(img)
    const { user, setUser }: any = useContext(AppContext)
    const scale = useSharedValue(1)
    const posX = useSharedValue(0)
    const posY = useSharedValue(0)
    const AnimatedImg = Animated.createAnimatedComponent(Image)

    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = e.scale
            posX.value = e.focalX
            posY.value = e.focalY
        })
        .onEnd((e) => {
            scale.value = withTiming(1)
        })

    const rScale = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: posX.value },
                { translateY: posY.value },
                { translateX: -width / 2 },
                { translateY: -height / 2 },
                { scale: scale.value },
                { translateX: -posX.value },
                { translateY: -posY.value },
                { translateX: width / 2 },
                { translateY: height / 2 }
            ]
        }
    })
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 8, }}>
                <GestureDetector gesture={pinchGesture}>
                    <Animated.View>
                        <AnimatedImg
                            source={{ uri: Img }}
                            style={[{ height: '100%', width: '100%', resizeMode: 'contain', }, rScale]} />
                        {/* <Animated.View style={[rPos, { height: 10, width: 10, }]} /> */}
                    </Animated.View>
                </GestureDetector>
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={{ position: "absolute", right: 20, top: 20, height: 30, width: 30 }}
                >
                    <Feather
                        name='x-circle' size={30} color={MAIN_COLOR} />
                </Pressable>
            </View>
            <View style={{ marginHorizontal: 20, flex: 2, }}>
                <FlatList
                    data={user.images}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    contentContainerStyle={{ gap: 10, justifyContent: "center", alignItems: 'center' }}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => { setImg(item) }}>
                                {
                                    item != Img ?
                                        <Image
                                            source={{ uri: item }}
                                            style={{ height: 80, width: 80, borderRadius: 10 }}
                                        /> :
                                        <Image
                                            source={{ uri: item }}
                                            style={{ height: 100, width: 100, borderRadius: 10 }} />
                                }
                                {
                                    item != Img && <Pressable
                                        style={{ backgroundColor: 'rgba(255,255,255,.3)', position: 'absolute', height: 80, width: 80, borderRadius: 10 }}
                                    />
                                }
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        </View>
    )
}

export default ImageDetails

const styles = StyleSheet.create({})