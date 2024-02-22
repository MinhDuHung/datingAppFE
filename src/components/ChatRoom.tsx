import { Dimensions, FlatList, Image, Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react'
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { KANIT_BLACK_ITALIC, KANIT_MEDIUM, KANIT_SEMIBOLD } from '../assets/fonts/font'
import { MAIN_COLOR, SECOND_COLOR } from '../assets/color'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios'
import { getOneChatRoomApi, insertDataToChatRoomApi } from '../utils/API/chatrooms'
import { AppContext } from '../context/AppContext'
import socketServices from '../utils/SOCKETIO/socketServices'
import { useFocusEffect } from '@react-navigation/native'
import { launchImageLibrary } from 'react-native-image-picker'
import storage from '@react-native-firebase/storage';
import Ionicons from 'react-native-vector-icons/Ionicons'
const { height, width } = Dimensions.get('window')
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Sound from 'react-native-sound'
import Video from 'react-native-video'

const ChatRoom = ({ navigation, isChatRoomOn, setIsChatRoomOn, specifiedUser }: any) => {
  const position = useSharedValue(height)
  const { user, setUser }: any = useContext(AppContext)
  const isOnline = useRef(true)
  const textInput = useSharedValue(height - height * .43)
  const [text, setText] = useState('')
  const [isOnFocus, setIsOnFocus] = useState(false)
  const [data, setData] = useState<any>([])
  const page = useRef(1)
  const url = useRef('')
  const [pausedIdx, setPausedIdx] = useState(-1);
  const [media, setMedia] = useState<any>();
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current
  const [audio, setAudio] = useState<any>('00:00:00')
  const [isRecord, setIsRecord] = useState(false)
  const [isPlay, setIsPlay] = useState(false)
  const [playIndex, setPlayIndex] = useState(-1)

  const translateY = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: (position.value) }
      ]
    }
  })
  const moveUpAnim = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: (textInput.value) },
      ]
    }
  })

  function concatenateAndSort(str1: string, str2: string) {
    return [str1, str2].sort((a, b) => a.localeCompare(b)).join('');
  }
  const getOneChatRoomBack = async () => {
    try {
      const res = await axios.get(getOneChatRoomApi, {
        params: {
          page: page.current,
          mainId: concatenateAndSort(user._id, specifiedUser.current._id),
        }
      })
      if (res.status == 200) {
        const newData = res.data?.data?.content;
        setData((prevData: any) => {
          if (newData) {
            return prevData.concat(newData);
          }
          return prevData;
        });
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getOneChatRoom = async () => {
    try {
      const res = await axios.get(getOneChatRoomApi, {
        params: {
          page: page.current,
          mainId: concatenateAndSort(user._id, specifiedUser.current._id),
        }
      })
      if (res.status == 200) {
        const newData = res.data?.data?.content;
        setData((prevData: any) => {
          if (newData) {
            return newData.concat(prevData);
          }
          return prevData;
        });
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onStartRecord = async () => {
    const result = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener((e) => {
      console.log(e.currentPosition)
      url.current = result
      setAudio(
        audioRecorderPlayer.mmssss(
          Math.floor(e.currentPosition),
        ))
      return
    })
  }

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder()
    audioRecorderPlayer.removeRecordBackListener()
  };

  const onStartPlay = async () => {
    await audioRecorderPlayer.startPlayer();
    audioRecorderPlayer.addPlayBackListener((e) => {
      // setAudio({
      //   currentPositionSec: e.currentPosition,
      //   currentDurationSec: e.duration,
      //   playTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
      //   duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      // });
      return;
    });
  };

  const onStopPlay = async () => {
    console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  const playAudio = (audioUrl: any) => {
    const sound = new Sound(audioUrl, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.error('Error loading sound:', error);
      } else {
        sound.play(() => {
          sound.release();
          setPlayIndex(-1)
        });
      }
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      socketServices.initializeSocket(concatenateAndSort(user._id, specifiedUser.current._id))
      socketServices.on(concatenateAndSort(user._id, specifiedUser.current._id), (data: any) => {
        // if (page.current == 1)
        //   setData((pre): any => ([data, ...pre]))
        // if (data.length > 20) {
        //   setData((pre): any => [...pre.slice(20)])
        // }
        setData((pre: any): any => ([data, ...pre]))
      });
    }, [])
  );

  useEffect(() => {
    position.value = withTiming(80)
    getOneChatRoomBack()
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      ({ endCoordinates }) => {
        setIsOnFocus(true)
        textInput.value = withTiming(endCoordinates.height - endCoordinates.height * .22)
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      ({ endCoordinates }) => {
        setIsOnFocus(false)
        textInput.value = withTiming(height - height * .43)
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [])

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY >= 80) {
        position.value = e.translationY
      }
    })
    .onEnd((e) => {
      if (position.value >= (height - 80) / 2) {
        position.value = withTiming(height)
        setIsChatRoomOn(false)
        socketServices.disconnect()
      } else {
        position.value = withTiming(80)
      }
    })
    .runOnJS(true)
    .activateAfterLongPress(200)

  const renderItem = ({ item, index }: any) => {
    const paused = pausedIdx !== index
    return (
      <View style={[styles.chatContainer, { justifyContent: item.sender == user._id ? 'flex-end' : 'flex-start', }]}>
        <View style={[styles.chat,
        { backgroundColor: item.sender == user._id ? MAIN_COLOR : SECOND_COLOR },
        { borderBottomRightRadius: item.sender == user._id ? 0 : 10 },
        { borderBottomLeftRadius: item.sender == user._id ? 10 : 0 },
        ]}>
          {
            item.img ?
              <Image source={{ uri: item.img }} style={styles.imgChat} /> :
              (item.music ? <Ionicons
                onPress={() => {
                  setPlayIndex(index)
                  playAudio(item.music)
                }}
                name={playIndex != index ? "play-circle-outline" : "pause-circle-outline"} size={25} color={item.sender == user._id ? 'white' : 'black'} /> :
                (item.video ?
                  <View>
                    <Video
                      paused={paused}
                      style={styles.imgChat}
                      resizeMode='contain'
                      source={{ uri: item.video }}
                    />
                    {
                      paused && <Ionicons
                        onPress={() => setPausedIdx(index)}
                        name='play-circle-outline' size={40} color={'white'} style={{ position: 'absolute', }} />
                    }
                  </View>
                  : <Text style={[styles.text, { color: item.sender == user._id ? 'white' : 'black' }]}>{item.text}</Text>))

          }
        </View>
      </View>
    )
  }

  const handleSendMess = async () => {
    const content = {
      sender: user._id,
      img: '',
      text: '',
      music: '',
      video: '',
      time: new Date()
    }
    if (text != '') {
      socketServices.emit(concatenateAndSort(user._id, specifiedUser.current._id), {
        sender: user._id,
        img: '',
        text: text,
        music: '',
        video: '',
        time: new Date()
      })
      content.text = text
    } if (media?.img) {
      socketServices.emit(concatenateAndSort(user._id, specifiedUser.current._id), {
        sender: user._id,
        img: url.current,
        text: '',
        music: '',
        video: '',
        time: new Date()
      })
      content.img = url.current
    } if (media?.video) {
      socketServices.emit(concatenateAndSort(user._id, specifiedUser.current._id), {
        sender: user._id,
        img: url.current,
        text: '',
        music: '',
        video: '',
        time: new Date()
      })
      content.video = url.current
    } if (audio != '00:00:00') {
      console.log(url)
      socketServices.emit(concatenateAndSort(user._id, specifiedUser.current._id), {
        sender: user._id,
        img: '',
        text: '',
        music: url.current,
        video: '',
        time: new Date()
      })
      content.music = url.current
    }
    try {
      const res = await axios.post(insertDataToChatRoomApi, {
        mainId: concatenateAndSort(user._id, specifiedUser.current._id),
        content
      });
      if (res.status === 200) {
        setText('');
        setAudio('00:00:00');
        url.current = '';
      } else {
        console.error('Unexpected response status:', res.status);
      }
    } catch (error) {
      console.error('Error while posting data to server:', error);
    }
  }

  async function handleOpenGallery() {
    let options: any = {
      mediaType: 'photo',
      type: 'library',
      includeBase64: true,
    }
    launchImageLibrary(options, respone => {
      if (respone.didCancel) {
        console.log('User cancelled image picker')
      }
      else if (respone.errorCode) {
        console.log(respone.errorCode)
      }
      else {
        const img: any = respone.assets
        const newImageUri = img[0].uri;
        setMedia({ img: newImageUri })
      }
    })
  }

  async function handleOpenVideo() {
    let options: any = {
      mediaType: 'video',
      type: 'library',
      includeBase64: true,
    }
    launchImageLibrary(options, respone => {
      if (respone.didCancel) {
        console.log('User cancelled video picker')
      }
      else if (respone.errorCode) {
        console.log(respone.errorCode)
      }
      else {
        const img: any = respone.assets
        const newImageUri = img[0].uri;
        setMedia({ video: newImageUri })
      }
    })
  }
  const handleSendMedia = async () => {
    const uri = media.img ? media.img : media.video
    try {
      const fileName = `${user.emailAndPhone}/imageChat/${uri.substring(uri.lastIndexOf('/') + 1)}`;
      await storage().ref(fileName).putFile(uri);
      url.current = await storage().ref(fileName).getDownloadURL();
      await handleSendMess()
      setMedia(undefined)
    }
    catch (error) {
      console.error('uploadImg chat error ', error)
    }
  }

  const uploadAudio = async (audioFilePath: any) => {
    const reference = storage().ref(`audio/${user.emailAndPhone}/${Platform.OS}/${Date.now()}.mp4`);
    try {
      await reference.putFile(audioFilePath);
      url.current = await reference.getDownloadURL();
      handleSendMess()
      console.log('File uploaded successfully.');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  return (
    <View
      style={styles.container}
    >
      <Pressable
        onPress={() => {
          position.value = height
          setIsChatRoomOn(false)
        }}
        style={{ height: 200, width, position: 'absolute' }}>
      </Pressable>
      <GestureDetector
        gesture={pan}
      >
        <Animated.View style={[styles.sheet, translateY]}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.avatar}>
                <Image source={{ uri: specifiedUser.current.images[0] }} style={styles.avatar} />
              </TouchableOpacity>
              <View>
                <Text style={styles.name}>{specifiedUser.current.lastName}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ height: 12, width: 12, borderRadius: 10, backgroundColor: isOnline.current ? MAIN_COLOR : 'gray' }} />
                  <Text>{isOnline.current ? 'Online' : 'Offline'}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={{ height: 50, width: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: .2 }}>
              <Feather name='more-vertical' size={25} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 9 }}>
            <View style={{ flex: 4, backgroundColor: 'white' }}>
              <View style={{ height: '65%' }}>
                <FlatList
                  data={data}
                  keyExtractor={(item, index) => (index.toString())}
                  renderItem={renderItem}
                  contentContainerStyle={{ gap: 5, }}
                  showsVerticalScrollIndicator={false}
                  removeClippedSubviews={true}
                  onEndReached={() => {
                    page.current++
                    getOneChatRoomBack()
                    if (data.length >= 100) {
                      setData((pre: any[]) => pre.slice(50))
                    }
                  }}
                  onStartReached={() => {
                    if (page.current > 1){
                      page.current--
                      getOneChatRoom()
                      if (data.length >= 100) {
                        setData((pre: any[]) => pre.slice(-50))
                      }
                    }
                  }}
                  onEndReachedThreshold={.3}
                  inverted
                />
              </View>
              {
                isRecord && <View style={styles.record}>
                  {
                    isPlay ?
                      <Ionicons
                        onPress={() => {
                          onStopRecord()
                          setIsPlay(false)
                        }}
                        name="pause-circle" size={30} color={MAIN_COLOR} /> :
                      <Ionicons
                        onPress={() => {
                          setIsPlay(true)
                          onStartRecord()
                        }}
                        name="play-circle" size={30} color={MAIN_COLOR} />
                  }
                  <Text>{JSON.stringify(audio)}</Text>
                  <Ionicons
                    onPress={() => {
                      onStopPlay()
                    }}
                    name="pause-circle-outline" size={30} color={MAIN_COLOR} />
                  <Ionicons
                    onPress={() => {
                      onStartPlay()
                    }}
                    name="play-circle-outline" size={30} color={MAIN_COLOR} />
                  <Ionicons
                    onPress={() => {
                      uploadAudio(url.current)
                    }}
                    name="send" size={30} color={MAIN_COLOR} />
                </View>
              }
            </View>
            <Animated.View style={[styles.controll, moveUpAnim]}>
              {
                !isOnFocus && <MaterialIcons
                  onPress={() => {
                    setIsRecord(!isRecord)
                    setAudio('00:00:00')
                    onStopRecord()
                    setIsPlay(false)
                  }}
                  name='keyboard-voice' size={30} color={MAIN_COLOR} />
              }
              {
                !isOnFocus && <Feather
                  onPress={handleOpenVideo}
                  name='video' size={30} color={MAIN_COLOR} />
              }
              {
                !isOnFocus && <Feather
                  onPress={handleOpenGallery}
                  name='image' size={30} color={MAIN_COLOR} />
              }
              <TextInput
                value={text}
                onChangeText={t => setText(t)}
                style={[styles.txtIn, {
                  height: !isOnFocus ? 40 : 60,
                  width: isOnFocus ? width * .6 : width * .3,
                }]}
                multiline
                placeholder='Type here...'
              />
              <TouchableOpacity
                onPress={() => {
                  if (text) handleSendMess()
                }}
                style={[styles.btn, { backgroundColor: text ? MAIN_COLOR : SECOND_COLOR }]}
              >
                <Text style={[styles.txtSend]}>Send</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </GestureDetector>
      {
        media &&
        <View style={styles.media}>
          <Ionicons
            onPress={() => setMedia(undefined)}
            name='close' size={30} color={MAIN_COLOR} style={{ position: 'absolute', zIndex: 2 }}
          />
          <Pressable
            onPress={() => handleSendMedia()}
            style={{ position: 'absolute', bottom: 10, left: 100, zIndex: 2, height: 40, width: 40, backgroundColor: MAIN_COLOR, justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
            <Ionicons
              name='send' size={25} color={'white'}
            />
          </Pressable>
          {
            media.img && <Image style={styles.img} source={{ uri: media.img }} />
          }
          {
            media.video && <Video
              style={styles.video}
              resizeMode='contain'
              source={{ uri: media.video }} />
          }
        </View>
      }
    </View>
  )
}

export default memo(ChatRoom)

const styles = StyleSheet.create({
  record: {
    height: 60, width: width * .9, zIndex: 1, position: 'absolute', bottom: 240, justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: SECOND_COLOR, flexDirection: 'row'
  },
  imgChat: {
    height: 200, width: 150, borderRadius: 10
  },
  media: {
    height: 200, width: 150, position: 'absolute', bottom: 200, right: 20,
  },
  img: {
    height: '100%', width: '100%', resizeMode: 'contain', borderRadius: 10, zIndex: 1, backgroundColor: SECOND_COLOR
  },
  video: {
    height: '100%', width: '100%', borderRadius: 10, zIndex: 1, backgroundColor: SECOND_COLOR
  },
  chatContainer: {
    width: '100%', flexDirection: 'row', alignItems: 'center',
  },
  text: {
    fontFamily: KANIT_MEDIUM, fontSize: 14, width: 'auto'
  },
  chat: {
    alignItems: "center", padding: 10, borderTopLeftRadius: 10,
    borderTopRightRadius: 10, maxWidth: '80%'
  },
  controll: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: "center", position: 'absolute',
    height: 80, width: '100%', backgroundColor: 'white',
  },
  container: {
    height: height, width, backgroundColor: 'rgba(0, 0, 0, 0.6)', position: 'absolute',
  },
  sheet: {
    height: height, width, backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40,
    paddingHorizontal: 30, paddingTop: 50, flex: 1, zIndex: 1
  }, avatar: {
    height: 70, width: 70, borderRadius: 40, backgroundColor: 'blue'
  },
  header: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: {
    fontFamily: KANIT_SEMIBOLD, color: 'black', fontSize: 20,
  },
  txtIn: {
    borderRadius: 15, paddingHorizontal: 20, borderWidth: .4, zIndex: 2,
  },
  txtSend: {
    fontFamily: KANIT_BLACK_ITALIC, color: 'white', fontSize: 16,
  },
  btn: {
    height: 40, width: 70, borderRadius: 10, justifyContent: 'center', alignItems: 'center',
  }
})