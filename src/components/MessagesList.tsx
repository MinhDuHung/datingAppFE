import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo, useContext } from 'react'
import { KANIT_BOLD, KANIT_EXTRALIGHT, KANIT_ITALIC, KANIT_REGULAR, KANIT_SEMIBOLD, KANIT_THIN } from '../assets/fonts/font'
import { FlatList } from 'react-native-gesture-handler'
import { MAIN_COLOR } from '../assets/color'
import { AppContext } from '../context/AppContext'

const MessagesList = ({ navigation, setIsChatRoomOn, data, specifiedUser }: any) => {
    const { user, setUser }: any = useContext(AppContext)
    return (
        <View style={{ flex: 1, gap: 10, width: '100%', paddingHorizontal: 30 }}>
            <Text style={styles.txt}>Messages</Text>
            <FlatList
                data={data}
                keyExtractor={(item, index): any => (item + index)}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    const sender = item.lastMess?.sender == user._id ? 'You' : ''
                    return (
                        <TouchableOpacity style={styles.card}
                            onPress={() => {
                                setIsChatRoomOn(true)
                                specifiedUser.current = item
                            }}
                        >
                            <TouchableOpacity
                                style={styles.avatar}>
                                <Image source={{ uri: item.images[0] }} style={styles.avatar} />
                            </TouchableOpacity>
                            <View>
                                <Text numberOfLines={1} style={styles.name}>{item.lastName + ' ' + item.firstName}</Text>
                                {
                                    item.lastMess?.text ?
                                        <Text numberOfLines={1} style={styles.chatContent}>{sender + ': ' + item.lastMess?.text}</Text> :
                                        (item.lastMess?.video ? <Text numberOfLines={1} style={styles.chatContent}>{sender + ' sent a video'}</Text> :
                                            item.lastMess?.img ? <Text numberOfLines={1} style={styles.chatContent}>{sender + ' sent an image'}</Text> :
                                                item.lastMess?.music ? <Text numberOfLines={1} style={styles.chatContent}>{sender + ' sent an audio voice'}</Text> :
                                                    <Text numberOfLines={1} style={styles.chatContent}>{item.lastMess}</Text>)
                                }

                            </View>
                            <View style={{ position: 'absolute', right: 0 }}>
                                <Text style={styles.date}>30ms</Text>
                                <View style={styles.newMess}>
                                    <Text style={styles.newMessText}>9+</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                }}
                contentContainerStyle={{ gap: 15 }}
            />
        </View >
    )
}

export default memo(MessagesList)

const styles = StyleSheet.create({
    name: {
        fontFamily: KANIT_SEMIBOLD, color: 'black', fontSize: 16, maxWidth: 150
    },
    chatContent: {
        fontFamily: KANIT_ITALIC, color: 'black', fontSize: 14, maxWidth: 160,
    },
    newMess: {
        backgroundColor: MAIN_COLOR, justifyContent: 'center', alignItems: 'center', height: 25, width: 25, borderRadius: 20
    },
    newMessText: {
        fontFamily: KANIT_REGULAR, color: 'white', fontSize: 15,
    },
    date: {
        fontFamily: KANIT_REGULAR, color: 'gray', fontSize: 14,
    },
    card: {
        height: 70, width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: .2
    },
    txt: {
        fontFamily: KANIT_REGULAR, color: 'black', fontSize: 18,
    },
    avatar: {
        height: 60, width: 60, borderRadius: 30, backgroundColor: 'blue'
    }
})