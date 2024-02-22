import { Dimensions, StyleSheet, Text, Image, TouchableOpacity, View, TextInput, ScrollView } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import { KANIT_BLACK_ITALIC, KANIT_BOLD, KANIT_EXTRABOLD, KANIT_EXTRALIGHT, KANIT_MEDIUM, KANIT_REGULAR, KANIT_SEMIBOLD, KANIT_THIN } from '../../assets/fonts/font'
import { MAIN_COLOR, SECOND_COLOR } from '../../assets/color'
import Entypo from 'react-native-vector-icons/Entypo'
import { AppContext } from '../../context/AppContext'
const { height, width } = Dimensions.get('window')
const Gender = ({ navigation }: any) => {
    const [gender, setGender] = useState("Women");
    const { user, setUser }: any = useContext(AppContext)
    return (
        <View style={{ flex: 1, paddingHorizontal: 20, backgroundColor: 'white' }}>
            <View style={styles.header}>
                <Entypo
                    onPress={() => navigation.goBack()}
                    name="chevron-left" color={MAIN_COLOR} size={25}
                />
            </View>
            <View style={styles.body}>
                <Text style={styles.title}>I am a</Text>
                <View style={{ flex: 1, justifyContent: 'center', gap: 10 }}>
                    <TouchableOpacity style={[styles.btn, { backgroundColor: gender == "Women" ? MAIN_COLOR : '#f0f0f0' }]}
                        onPress={() => { setGender("Women") }}
                    >
                        <Text style={[styles.txt, { color: gender == "Women" ? 'white' : 'black', }]}>Women</Text>
                        <Entypo name='check' size={25} color={'#f0f0f0'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, { backgroundColor: gender == "Man" ? MAIN_COLOR : '#f0f0f0' }]}
                        onPress={() => { setGender('Man') }}
                    >
                        <Text style={[styles.txt, { color: gender == "Man" ? 'white' : 'black', }]}>Man</Text>
                        <Entypo name='check' size={25} color={'#f0f0f0'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, { backgroundColor: gender == "Others" ? MAIN_COLOR : '#f0f0f0' }]}
                        onPress={() => { setGender('Others') }}
                    >
                        <Text style={[styles.txt, { color: gender == "Others" ? 'white' : 'black', }]}>Others</Text>
                        <Entypo name='check' size={25} color={'#f0f0f0'} />
                    </TouchableOpacity>
                </View>

            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={[styles.btn, { backgroundColor: MAIN_COLOR, justifyContent: 'center' }]}
                    onPress={() => {
                        setUser((pre: any) => ({...pre, gender }))
                        navigation.navigate('InformationForm')
                    }}
                >
                    <Text style={[styles.txt, { color: 'white', }]}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
export default Gender

const styles = StyleSheet.create({
    txt: {
        fontFamily: KANIT_SEMIBOLD, fontSize: 20,
    },
    btn: { height: height * .07, width: '100%', justifyContent: 'space-between', alignItems: 'center', borderRadius: 15, flexDirection: 'row', paddingHorizontal: 20 },
    title: {
        fontFamily: KANIT_MEDIUM, color: 'black', fontSize: 26,
    },
    header: {
        flex: 1, justifyContent: 'center'
    },
    body: {
        flex: 7,
    },
    footer: {
        flex: 2, justifyContent: 'center', alignItems: 'center'
    }
})