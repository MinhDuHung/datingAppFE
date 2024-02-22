import { Dimensions, StyleSheet, Text, Image, TouchableOpacity, View, TextInput, ScrollView } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import { KANIT_BLACK_ITALIC, KANIT_BOLD, KANIT_EXTRABOLD, KANIT_EXTRALIGHT, KANIT_MEDIUM, KANIT_REGULAR, KANIT_SEMIBOLD, KANIT_THIN } from '../../assets/fonts/font.js'
import { MAIN_COLOR, SECOND_COLOR } from '../../assets/color.js'
import Entypo from 'react-native-vector-icons/Entypo'
import { AppContext } from '../../context/AppContext.tsx'
const { height, width } = Dimensions.get('window')
const CreatePassword = ({ navigation, route }: any) => {
    const { user, setUser }: any = useContext(AppContext)
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    function handleCreatePassword() {
        navigation.navigate('Profile')
        setUser((pre: any) =>({...pre, password }))
    }
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
                    <Text style={styles.title}>Enter your password</Text>
                    <TextInput
                        maxLength={15}
                        style={styles.txtIn}
                        value={password}
                        onChangeText={x => setPassword(x)}
                    />
                    {
                        password.length < 8 && password != "" && <Text style={styles.errorTxt}>Require atleast 8 chareacters</Text>
                    }
                </View>
                <View style={{ flex: 1, gap: 10 }}>
                    <Text style={styles.title}>Retype password</Text>
                    <TextInput
                        maxLength={15}
                        style={styles.txtIn}
                        value={rePassword}
                        onChangeText={x => setRePassword(x)}
                    />
                    {
                        password != rePassword && rePassword != "" && <Text style={styles.errorTxt}>Missmatched password</Text>
                    }
                </View>

                <View style={{ flex: 2, gap: 10 }} />

            </View>
            <View style={styles.footer}>
                {
                    password == rePassword && password != '' ?
                        <TouchableOpacity
                            style={[styles.btn, { backgroundColor: MAIN_COLOR, justifyContent: 'center' }]}
                            onPress={() => { handleCreatePassword() }}>
                            <Text style={[styles.txt, { color: 'white', }]}>Continue</Text>
                        </TouchableOpacity> :
                        <View style={[styles.btn, { backgroundColor: SECOND_COLOR, justifyContent: 'center' }]}>
                            <Text style={[styles.txt, { color: MAIN_COLOR, }]}>Continue</Text>
                        </View>
                }

            </View>
        </View>
    );
};
export default CreatePassword

const styles = StyleSheet.create({
    errorTxt: {
        fontFamily: KANIT_REGULAR, color: 'red',
        fontSize: 15, position: 'absolute', bottom: 0, right: 0
    },
    txtIn: {
        height: 60, width: '100%', borderWidth: .3, borderColor: 'black', borderRadius: 15, paddingHorizontal: 15,
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
        flex: 7,
    },
    footer: {
        flex: 2, justifyContent: 'center', alignItems: 'center'
    }
})