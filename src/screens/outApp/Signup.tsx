import { Dimensions, Image, PermissionsAndroid, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { BG, MAIN_COLOR } from '../../assets/color'
import { KANIT_BOLD, KANIT_THIN, KANIT_MEDIUM, KANIT_REGULAR, KANIT_EXTRALIGHT } from '../../assets/fonts/font'
const { height, width } = Dimensions.get('window')
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { requestUserPermission } from '../../utils/FCM/notifications'

const Signup = ({ navigation }: any) => {
    const [userInfor, setUserInfor] = useState<any>("")
    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            setUserInfor(userInfo);
            navigation.navigate('Profile')
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    };
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "156300340111-g52n46pev2sip4uqe1sq9v3k1n7nlvea.apps.googleusercontent.com"
        });
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <View style={{ flex: 6, marginVertical: 20, alignItems: 'center', justifyContent: 'space-around' }}>
                <Image style={{ width: 100, height: 100, resizeMode: 'contain' }} source={require('../../assets/images/trademark.png')} />
                <View style={{ gap: 25 }}>
                    <Text style={styles.content}>Sign up to continue!</Text>
                    <TouchableOpacity style={styles.btn}
                        onPress={() => navigation.navigate('SignupWithEmail')}>
                        <Text style={styles.btnTxt}>Continue with email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rbtn}
                        onPress={() => navigation.navigate('SignupWithPhone')}>
                        <Text style={styles.rbtnTxt}>Use phone number</Text>
                    </TouchableOpacity>
                </View>

            </View>
            <View style={{ flex: 4, paddingHorizontal: 40, }}>
                <Text style={styles.recTxt}>or sign up with</Text>
                <View style={styles.line} />
                <View style={{ flexDirection: 'row', marginTop: 25, justifyContent: 'space-around' }}>
                    <Entypo style={styles.icon} name='facebook' color={MAIN_COLOR} size={40} />
                    <AntDesign onPress={() => signIn()} style={styles.icon} name='google' color={MAIN_COLOR} size={40} />
                    <Entypo style={styles.icon} name='app-store' color={MAIN_COLOR} size={40} />
                </View>
                <View style={{ flexDirection: 'row', marginTop: 40, justifyContent: 'space-evenly' }}>
                    <Text style={styles.endTxt}>Terms of use</Text>
                    <Text style={styles.endTxt}>Privacy policy</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Signup

const styles = StyleSheet.create({
    title: {
        fontFamily: KANIT_BOLD, color: MAIN_COLOR,
        fontSize: 25,
    },
    content: {
        fontFamily: KANIT_MEDIUM, color: 'black',
        fontSize: 20, textAlign: 'center'
    },
    below: {
        flex: 1, justifyContent: 'space-evenly', alignItems: 'center', paddingHorizontal: 20
    },
    signal: { height: 30, width: 70, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
    btn: { height: height * .07, width: width * .8, justifyContent: 'center', alignItems: 'center', backgroundColor: MAIN_COLOR, borderRadius: 15 },
    btnTxt: {
        fontFamily: KANIT_MEDIUM, color: 'white',
        fontSize: 20, textAlign: 'center'
    },
    rbtn: { height: height * .07, width: width * .8, justifyContent: 'center', alignItems: 'center', borderColor: BG, borderRadius: 15, borderWidth: 2 },
    rbtnTxt: {
        fontFamily: KANIT_MEDIUM, color: MAIN_COLOR,
        fontSize: 20, textAlign: 'center'
    },
    line: {
        backgroundColor: 'black', width: '100%', height: 1, marginTop: 13
    },
    recTxt: {
        fontFamily: KANIT_REGULAR, color: 'black', fontSize: 15, position: 'absolute',
        alignSelf: 'center', zIndex: 1, backgroundColor: 'white', paddingHorizontal: 10
    },
    icon: {
        padding: 20, borderColor: BG, borderRadius: 15, borderWidth: 2
    },
    endTxt: {
        fontFamily: KANIT_EXTRALIGHT, color: MAIN_COLOR, fontSize: 18,
    }
})