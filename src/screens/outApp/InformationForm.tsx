import { Dimensions, StyleSheet, Text, Image, TouchableOpacity, View, TextInput, ScrollView } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import { KANIT_BLACK_ITALIC, KANIT_BOLD, KANIT_EXTRABOLD, KANIT_EXTRALIGHT, KANIT_MEDIUM, KANIT_REGULAR, KANIT_SEMIBOLD, KANIT_THIN } from '../../assets/fonts/font'
import { MAIN_COLOR, SECOND_COLOR } from '../../assets/color'
import Entypo from 'react-native-vector-icons/Entypo'
import { AppContext } from '../../context/AppContext'
const { height, width } = Dimensions.get('window')
const InformationForm = ({ navigation }: any) => {
    const [job, setJob] = useState("");
    const [about, setAbout] = useState("");
    const [location, setLocation] = useState("");
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
                <View style={{ flex: 1, gap: 10 }}>
                    <Text style={styles.title}>My job</Text>
                    <TextInput
                        value={job}
                        placeholder='Student'
                        onChangeText={(text) => setJob(text)}
                        style={styles.txtIn} />
                </View>
                <View style={{ flex: 2, gap: 10 }}>
                    <Text style={styles.title}>About me</Text>
                    <TextInput
                        value={about}
                        placeholder='I am a good guy...'
                        multiline
                        onChangeText={(text) => setAbout(text)}
                        style={[styles.txtIn, { height: height * .15, textAlignVertical: 'top' }]} />
                </View>
                <View style={{ flex: 2, gap: 10 }}>
                    <Text style={styles.title}>My current location</Text>
                    <TextInput
                        value={location}
                        placeholder='Ha Noi, Viet Nam'
                        onChangeText={(text) => setLocation(text)}
                        style={styles.txtIn} />
                </View>
            </View>
            <View style={styles.footer}>
                {
                    job && about && location ?
                        <TouchableOpacity style={[styles.btn, { backgroundColor: MAIN_COLOR, justifyContent: 'center' }]}
                            onPress={() => {
                                navigation.navigate('Interests')
                                setUser((pre: any) => ({...pre, job, about, location }))
                            }}
                        >
                            <Text style={[styles.txt, { color: 'white', }]}>Continue</Text>
                        </TouchableOpacity>
                        :
                        <View style={[styles.btn, { backgroundColor: SECOND_COLOR, justifyContent: 'center' }]}
                        >
                            <Text style={[styles.txt, { color: MAIN_COLOR, }]}>Continue</Text>
                        </View>
                }

            </View>
        </View>
    );
};
export default InformationForm

const styles = StyleSheet.create({
    txtIn: {
        height: height * .06, width: '100%', borderWidth: .3, borderColor: 'black',
        borderRadius: 15, paddingHorizontal: 15,
    },
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
        flex: 7, justifyContent: 'space-between'
    },
    footer: {
        flex: 2, justifyContent: 'center', alignItems: 'center'
    }
})