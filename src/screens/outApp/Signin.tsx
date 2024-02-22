import { ActivityIndicator, Alert, Dimensions, Image, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { BG, MAIN_COLOR, SECOND_COLOR } from '../../assets/color'
import { KANIT_BOLD, KANIT_THIN, KANIT_MEDIUM, KANIT_REGULAR, KANIT_EXTRALIGHT, KANIT_SEMIBOLD } from '../../assets/fonts/font'
const { height, width } = Dimensions.get('window')
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import axios from 'axios'
import { loginUserApi } from '../../utils/API/user'
import { sha256Hash } from '../../utils/encryptSha256'
import { AppContext } from '../../context/AppContext'
import AlertModal from '../../components/AlertModal'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signin = ({ navigation }: any) => {
  const [userInfor, setUserInfor] = useState<any>("")
  const [isloading, setIsLoading] = useState(false)
  const [content, setContent] = useState('')
  const [visible, setVisible] = useState(false)
  const { user, setUser }: any = useContext(AppContext)
  // const signIn = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     setUserInfor(userInfo);
  //     navigation.navigate('Profile')
  //   } catch (error: any) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       // user cancelled the login flow
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       // operation (e.g. sign in) is in progress already
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       // play services not available or outdated
  //     } else {
  //       // some other error happened
  //     }
  //   }
  // };

  async function handleLogin() {
    setIsLoading(true)
    try {
      const result = await axios.get(loginUserApi, {
        params: {
          emailAndPhone, password: sha256Hash(password)
        }
      })
      if (result.status == 200) {
        await setUser(result.data.user)
        await AsyncStorage.setItem('token', result.data.user.token);
        navigation.navigate('BottomTab')
      }
    }
    catch (error: any) {
      if (error.response && error.response.status === 404 || error.response && error.response.status === 401) {
        setVisible(true)
        setContent(error.response.data.error);
      } else {
        console.error(error);
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    // GoogleSignin.configure({
    //   webClientId: "156300340111-g52n46pev2sip4uqe1sq9v3k1n7nlvea.apps.googleusercontent.com"
    // });
  }, [])

  const [password, setPassword] = useState("11111111");
  const [emailAndPhone, setEmailAndPhone] = useState("");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View style={{ flex: 6, marginVertical: 20, alignItems: 'center', justifyContent: 'space-around' }}>
        <Image style={{ width: 100, height: 100, resizeMode: 'contain' }} source={require('../../assets/images/trademark.png')} />
        <View style={{ gap: 25 }}>
          <Text style={styles.content}>Sign in to continue!</Text>
          <View style={{ gap: 10 }}>
            <Text style={styles.title}>Enter your email or phone number</Text>
            <TextInput
              maxLength={30}
              style={styles.txtIn}
              value={emailAndPhone}
              onChangeText={x => setEmailAndPhone(x)}
            />
          </View>
          <View style={{ gap: 10 }}>
            <Text style={styles.title}>Enter your password</Text>
            <TextInput
              maxLength={15}
              style={styles.txtIn}
              value={password}
              onChangeText={x => setPassword(x)}
            />
          </View>
          {
            password && emailAndPhone ?
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: MAIN_COLOR, justifyContent: 'center' }]}
                onPress={() => { handleLogin() }}>
                <Text style={[styles.txt, { color: 'white', }]}>Login</Text>
              </TouchableOpacity> :
              <View style={[styles.btn, { backgroundColor: SECOND_COLOR, justifyContent: 'center' }]}>
                <Text style={[styles.txt, { color: MAIN_COLOR, }]}>Login</Text>
              </View>
          }

        </View>

      </View>
      <View style={{ flex: 4, paddingHorizontal: 40, }}>
        <Text style={styles.recTxt}>or sign up with</Text>
        <View style={styles.line} />
        <View style={{ flexDirection: 'row', marginTop: 25, justifyContent: 'space-around' }}>
          <Entypo style={styles.icon} name='facebook' color={MAIN_COLOR} size={40} />
          <AntDesign onPress={() => { }} style={styles.icon} name='google' color={MAIN_COLOR} size={40} />
          <Entypo style={styles.icon} name='app-store' color={MAIN_COLOR} size={40} />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 40, justifyContent: 'space-evenly' }}>
          <Text style={styles.endTxt}>Terms of use</Text>
          <Text style={styles.endTxt}>Privacy policy</Text>
        </View>
      </View>


      <Modal
        transparent={true}
        visible={isloading}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,.3)' }}>
          <ActivityIndicator color={'blue'} size={50} />
        </View>

      </Modal>
      <AlertModal content={content} visible={visible} setVisible={setVisible} />
    </SafeAreaView>
  )
}

export default Signin

const styles = StyleSheet.create({
  txt: {
    fontFamily: KANIT_SEMIBOLD, fontSize: 20,
  },
  title: {
    fontFamily: KANIT_EXTRALIGHT, color: MAIN_COLOR,
    fontSize: 18,
  },
  content: {
    fontFamily: KANIT_MEDIUM, color: 'black',
    fontSize: 20, textAlign: 'center'
  },
  btn: { height: height * .07, width: width * .8, justifyContent: 'center', alignItems: 'center', backgroundColor: MAIN_COLOR, borderRadius: 15 },
  btnTxt: {
    fontFamily: KANIT_MEDIUM, color: 'white',
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
  },
  txtIn: {
    height: 50, width: width * .8, borderWidth: .3, borderColor: 'black', borderRadius: 15, paddingHorizontal: 15,
  },
})