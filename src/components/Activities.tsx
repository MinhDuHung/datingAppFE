import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import { KANIT_REGULAR } from '../assets/fonts/font'
import { FlatList } from 'react-native-gesture-handler'
import { Image } from 'react-native'
import { AppContext } from '../context/AppContext'
import { MAIN_COLOR } from '../assets/color'

const Activities = ({ data, navigation }: any) => {
    const { user, setUser }: any = useContext(AppContext)
    return (
        <View style={{ flex: 1, gap: 10, width: '100%', paddingHorizontal: 30 }}>
            <Text style={styles.txt}>Activities</Text>
            <FlatList
                data={data}
                keyExtractor={(item, index): any => (item + index)}
                horizontal
                ListHeaderComponent={() => {
                    return (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Activites', { userId: user._id })}
                            style={styles.avatar}>
                            <Image source={{ uri: user.images[0] }} style={styles.avatar} />
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('PostActivity')
                                }}
                                style={styles.add}>
                                <Text style={styles.addtxt}>+</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )
                }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Activites', { userId: item._id })}
                            style={styles.avatar}>
                            <Image source={{ uri: item.images[0] }} style={styles.avatar} />
                        </TouchableOpacity>
                    )
                }}
                contentContainerStyle={{ gap: 10 }}
            />
        </View >
    )
}

export default Activities

const styles = StyleSheet.create({
    add: {
        backgroundColor: MAIN_COLOR, height: 20, width: 20, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
        position: 'absolute',
    },
    addtxt: {
        color: 'white', fontWeight: 'bold'
    },
    txt: {
        fontFamily: KANIT_REGULAR, color: 'black', fontSize: 18,
    },
    avatar: {
        height: 60, width: 60, borderRadius: 30, backgroundColor: 'blue'
    }
})