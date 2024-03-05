import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import Header from '../../components/Header'
import Animated, { Easing, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Activities from '../../components/Activities'
import MessagesList from '../../components/MessagesList'
import ChatRoom from '../../components/ChatRoom'
import { useFocusEffect } from '@react-navigation/native'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import { authTokenApi, findUserByIdApi } from '../../utils/API/user'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AlertModal from '../../components/AlertModal'
import { getAllApi } from '../../utils/API/userfriends'
const { height, width } = Dimensions.get('window')
const Messages = ({ navigation }: any) => {
  const { user, setUser }: any = useContext(AppContext)
  const [text, setText] = useState('')
  const [checkauth, setCheckauth] = useState('');
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<any>([]);
  const [content, setContent] = useState('');
  const [isChatRoomOn, setIsChatRoomOn] = useState(false)
  const specifiedUser = useRef(null)
  useFocusEffect(
    React.useCallback(() => {
      getAllUserMess()
    }, [])
  );
  useEffect(() => {
    authToken()
  }, [data])
  const authToken = async () => {
    const _token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get(authTokenApi, {
        params: {
          token: _token
        }
      })
      if (res.status == 200) {
      }
    } catch (error) {
      setContent('Your session is end or someone is using your account.')
      setVisible(true)
      setCheckauth('Onboarding')
    }
  }

  const getAllUserMess = async () => {
    try {
      const res = await axios.get(getAllApi, {
        params: {
          userId: user._id
        }
      })
      if (res.status == 200) {
        const data = res.data[0]?.friendsId
        if (data) {
          const users = await Promise.all(data.map(findUserById));
          setData(users)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const findUserById = async (id: any) => {
    try {
      const response = await axios.get(findUserByIdApi, {
        params: { _id: id, userId: user._id }
      });
      return response.data.user;
    } catch (error) {
      console.error('Failed to findUserById', error);
      throw error;
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: 'white', }}>
      <View style={{ flex: 4, alignItems: 'center', }}>
        <Header headerTitle={"Messages"} headerIcon={'filter-circle'} />
        <View style={{ flex: .7, width: '100%', paddingHorizontal: 30 }}>
          <TextInput
            placeholder='Search...'
            style={styles.txtIn}
            value={text}
            onChangeText={t => setText(t)}
          />
          <FontAwesome name='search' size={25} color={'gray'} style={{ position: 'absolute', top: 10, left: 45 }} />
        </View>
        <Activities data={data} navigation={navigation} />
      </View>
      <View style={{ flex: 6 }}>
        <MessagesList specifiedUser={specifiedUser} setIsChatRoomOn={setIsChatRoomOn} data={data} />
      </View>
      {isChatRoomOn && <ChatRoom isChatRoomOn={isChatRoomOn} setIsChatRoomOn={setIsChatRoomOn} specifiedUser={specifiedUser} getAllUserMess={getAllUserMess} />}
      <AlertModal visible={visible} setVisible={setVisible} content={content} checkauth={checkauth} />
    </View >
  )
}

export default Messages

const styles = StyleSheet.create({
  txtIn: {
    borderRadius: 10, borderWidth: .2, borderColor: 'black', paddingHorizontal: 50, height: 50, width: '100%'
  }
})