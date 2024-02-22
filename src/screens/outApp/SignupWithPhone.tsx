import { ActivityIndicator, Alert, Dimensions, Image, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { BG, MAIN_COLOR } from '../../assets/color'
import { KANIT_BOLD, KANIT_THIN, KANIT_MEDIUM, KANIT_REGULAR, KANIT_EXTRALIGHT, KANIT_ITALIC, KANIT_BLACK_ITALIC } from '../../assets/fonts/font'
import auth from '@react-native-firebase/auth';
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { compareCodeApi, sendPhoneApi } from '../../utils/API/phone'
import AlertModal from '../../components/AlertModal'
const { height, width } = Dimensions.get('window')
const SignupWithPhone = ({ navigation }: any) => {
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [isloading, setIsLoading] = useState(false)
  const [is_valid_code, set_is_valid_code] = useState(true)
  const [confirm, setConfirm] = useState<any>(null);
  const { user, setUser }: any = useContext(AppContext)
  const [content, setContent] = useState('')
  const [visible, setVisible] = useState(false)

  async function handleSendCode() {
    setIsLoading(true)
    try {
      const res = await axios.post(sendPhoneApi, {
        mainId: phone
      })
      if (res.status == 200) {
        console.log(res.data)
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setVisible(true)
        setContent(error.response.data.error);
      } else {
        console.error(error);
      }
    }
    setIsLoading(false)
  }


  async function handleVertifiedCode() {
    setIsLoading(true);
    try {
      const res = await axios.get(compareCodeApi, {
        params: {
          mainId: phone,
          code: code
        }
      });

      if (res.status == 200) {
        set_is_valid_code(true)
        setUser((pre: any) => ({ ...pre, mainId: phone }))
        navigation.navigate('CreatePassword')
      }
    } catch (error: any) {
      if (error?.response && error.response.status === 404) {
        setContent(error.response.data.result)
        setVisible(true)
        set_is_valid_code(false)
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View style={{ flex: 7, marginVertical: 20, alignItems: 'center', justifyContent: 'space-around' }}>
        <Image style={{ width: 100, height: 100, resizeMode: 'contain' }} source={require('../../assets/images/trademark.png')} />
        <View style={{ gap: 25 }}>
          <View>
            <Text style={styles.content}>Enter your phone number:</Text>
            <TextInput
              value={phone}
              placeholder='0999999999'
              onChangeText={(text) => setPhone(text)}
              style={styles.txtIn} />
          </View>
          <TouchableOpacity style={styles.btn}
            onPress={() => { handleSendCode() }}>
            <Text style={styles.btnTxt}>Send code</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.content}>Enter your code:</Text>
            <TextInput
              value={code}
              placeholder='1234567'
              onChangeText={(text) => setCode(text)}
              style={styles.txtIn} />
            <Text style={styles.title}>You havenot received the code yet?
              <Text
                onPress={() => { }}
                style={styles.resentTxt}>
                Resent code</Text>
            </Text>
            {
              !is_valid_code && <Text style={styles.errorTxt}>Incorrect code</Text>
            }
          </View>
          <TouchableOpacity style={styles.btn}
            onPress={() => { handleVertifiedCode() }}>
            <Text style={styles.btnTxt}>Send veritied code</Text>
          </TouchableOpacity>
        </View>

      </View>
      <View style={{ flex: 3, paddingHorizontal: 40, }}>
        <Text style={styles.recTxt}>or sign in with</Text>
        <View style={styles.line} />
        <View style={{ flexDirection: 'row', marginTop: 25, justifyContent: 'space-around' }}>
          <Entypo style={styles.icon} name='facebook' color={MAIN_COLOR} size={40} />
          <AntDesign style={styles.icon} name='google' color={MAIN_COLOR} size={40} />
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

export default SignupWithPhone

const styles = StyleSheet.create({
  errorTxt: {
    fontFamily: KANIT_REGULAR, color: 'red',
    fontSize: 15, position: 'absolute', top: 0, right: 0
  },
  resentTxt: {
    fontFamily: KANIT_BOLD, color: 'red',
    fontSize: 15,
  },
  txtIn: {
    height: 40, width: width * .8, borderWidth: 1, borderColor: 'black', borderRadius: 15, paddingHorizontal: 15,
  },
  title: {
    fontFamily: KANIT_ITALIC, color: 'black',
    fontSize: 14,
  },
  content: {
    fontFamily: KANIT_MEDIUM, color: 'black',
    fontSize: 14,
  },
  below: {
    flex: 1, justifyContent: 'space-evenly', alignItems: 'center', paddingHorizontal: 20
  },
  signal: { height: 30, width: 70, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
  btn: { height: height * .06, width: width * .8, justifyContent: 'center', alignItems: 'center', backgroundColor: MAIN_COLOR, borderRadius: 15 },
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