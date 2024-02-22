import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { MAIN_COLOR } from '../assets/color'
import { KANIT_BLACK, KANIT_BLACK_ITALIC, KANIT_REGULAR, KANIT_SEMIBOLD, KANIT_THIN } from '../assets/fonts/font'

const Header = ({ headerIcon, headerTitle, userLocation, navigation }: any) => {
    const rotate = headerTitle == 'Matches' ? '90deg' : '0deg'
    if (headerTitle == 'Post your story')
        return (
            <View style={styles.container}>
                <Ionicons
                onPress={()=> navigation.goBack()}
                name={headerIcon} size={40} color={MAIN_COLOR} style={{ transform: [{ rotateZ: rotate }] }} />
                <View style={{}}>
                    <Text style={styles.title}>{headerTitle}</Text>
                    {
                        headerTitle == 'Discover' ? <Text numberOfLines={1} style={[styles.location, { maxWidth: 200 }]}>{userLocation}</Text> :
                            <Text style={styles.location}>{userLocation}</Text>
                    }
                </View>
            </View>
        )
    return <View style={styles.container}>
        <View style={{}}>
            <Text style={styles.title}>{headerTitle}</Text>
            {
                headerTitle == 'Discover' ? <Text numberOfLines={1} style={[styles.location, { maxWidth: 200 }]}>{userLocation}</Text> :
                    <Text style={styles.location}>{userLocation}</Text>
            }
        </View>
        <Ionicons name={headerIcon} size={40} color={MAIN_COLOR} style={{ transform: [{ rotateZ: rotate }] }} />
    </View>
}

export default Header

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center', flexDirection: 'row'
    },
    title: {
        fontFamily: KANIT_SEMIBOLD, color: 'black',
        fontSize: 32
    },
    location: {
        fontFamily: KANIT_THIN, color: 'black',
        fontSize: 14,
    }
})