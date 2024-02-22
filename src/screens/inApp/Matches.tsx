import { ActivityIndicator, Dimensions, FlatList, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { authTokenApi, findUserByIdApi } from '../../utils/API/user';
import AlertModal from '../../components/AlertModal';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllApi, removeSendingUserApi } from '../../utils/API/userreceivingmatches';
import { AppContext } from '../../context/AppContext';
import { calculateAge } from '../../utils/calculateAge';
import { KANIT_SEMIBOLD } from '../../assets/fonts/font';
import { BlurView } from '@react-native-community/blur';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AlertChoices from '../../components/AlertChoices';
import { removeReceiverUserApi } from '../../utils/API/usersendingmatches';
import { insertNewFriendApi } from '../../utils/API/userfriends';
import { sendToUserNotiTokenApi } from '../../utils/API/sendNotification';
import { getNotificationsTokenByUserIdApi } from '../../utils/API/tokenNotifications';
const { height, width } = Dimensions.get('window')
const Matches = ({ navigation }: any) => {
  const { user, setUser }: any = useContext(AppContext)
  const [checkauth, setCheckauth] = useState('');
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const isEven = useRef(true)
  const sender: any = useRef(null)
  const [ACvisible, setACvisible] = useState(false);
  const [target, setTarget] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      getAllSender()
    }, [])
  );

  useEffect(() => {
    authToken()
  }, [data])

  const findUserById = async (sender: any) => {
    try {
      const response = await axios.get(findUserByIdApi, {
        params: { _id: sender.senderId }
      });
      return response.data.user;
    } catch (error) {
      console.error('Failed to findUserById', error);
      throw error;
    }
  };

  const getAllSender = async () => {
    try {
      const response = await axios.get(getAllApi, {
        params: { userId: user._id }
      });

      const sender = response.data.result.sender;
      const users = await Promise.all(sender.map(findUserById));
      isEven.current = users.length % 2 == 0
      setData(users);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.log("this acc doesnt have matches request")
      } else
        console.error('Error getAllSender', error);
    }
  };

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

  const showConfirm = (index: number) => {
    sender.current = data[index]
    setACvisible(true)
    setContent('Do you really want to delete this matching request?')
    setTarget('confirmDeleteMatching')
  }

  async function handleCancel() {
    try {
      const senderId = sender.current?._id;

      await axios.put(removeSendingUserApi, {
        userId: user._id,
        senderId
      });
      const res = await axios.put(removeReceiverUserApi, {
        userId: senderId,
        receiverId: user._id
      });

      if (res.status === 200) {
        setData((prevArray: any) => prevArray.filter((item: any) => item._id !== senderId));
        isEven.current = !isEven.current;
        setACvisible(false);
      } else {
        console.log(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  }


  async function handleAcceptMatching(index: number) {
    sender.current = data[index]
    const friendId = sender.current?._id
    try {
      const res = await axios.post(insertNewFriendApi, {
        userId: user._id,
        friendId: friendId
      })
      if (res.status == 200) {
        await handleCancel()
        const res = await axios.get(getNotificationsTokenByUserIdApi, {
          params: {
            userId: data[index]._id
          }
        })
        if (res.status == 200) {
          const token: any = res.data[0].token
          const _res = await axios.post(sendToUserNotiTokenApi, {
            receivedToken: token,
            title: "HUMI chat app",
            body: `${user.lastName} has just accepted your matching request!`
          })
          if (_res.status == 200) {

          }
        }
        navigation.navigate('SuccessfulMatching', { img: sender.current.images[0] })
      }
    } catch (error) {
      console.error(error)
    }
  }

  function renderItemFunc({ item, index }: any) {
    return (
      <Pressable style={styles.card}>
        <Image source={{ uri: item.images[0] }} style={styles.img} />
        <View style={styles.absCard}>
          <Text style={styles.lastName}>{item.lastName}, {calculateAge(item.dateOfBirth)}</Text>
          <View style={{ height: 50, width: '100%', borderBottomLeftRadius: 10, overflow: 'hidden', borderBottomRightRadius: 10 }}>
            <View style={styles.iconPart} >
              <TouchableOpacity
                onPress={() => {
                  showConfirm(index)
                }}
                style={styles.icon}
              >
                <Ionicons
                  name='close' size={30} color={'white'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleAcceptMatching(index)
                }}
                style={styles.icon}
              >
                <Ionicons
                  name='heart' size={30} color={'white'}
                />
              </TouchableOpacity>
            </View>
            <BlurView
              blurType='light'
              blurAmount={2}
              style={{ flex: 1 }}
            />
            <View style={{ position: 'absolute', backgroundColor: 'white', width: 2, height: '100%', alignSelf: 'center' }} />
          </View>
        </View>
      </Pressable>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Header headerTitle={"Matches"} headerIcon={'repeat'} userLocation={'This is a list of people who have liked you.'} />
      </View>
      <View style={{ flex: 9 }}>
        <View style={{ flex: 1, paddingVertical: 20 }}>
          <FlatList
            data={isEven.current ? data : data.slice(0, -1)}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ gap: 15, alignItems: 'center', }}
            columnWrapperStyle={{ width: '100%', paddingHorizontal: 31, gap: 15, }}
            renderItem={renderItemFunc}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => {
              if (!isEven.current) {
                return (
                  <View style={{ width: width, paddingHorizontal: 30 }}>
                    <Pressable style={{ height: height * .3, width: width * .4 }}>
                      <Image source={{ uri: data[data.length - 1].images[0] }} style={styles.img} />
                      <View style={styles.absCard}>
                        <Text style={styles.lastName}>{data[data.length - 1].lastName}, {calculateAge(data[data.length - 1].dateOfBirth)}</Text>
                        <View style={{ height: 50, width: '100%', borderBottomLeftRadius: 10, overflow: 'hidden', borderBottomRightRadius: 10 }}>
                          <View style={styles.iconPart} >
                            <TouchableOpacity
                              onPress={() => {
                                showConfirm(data.length - 1)
                              }}
                              style={styles.icon}
                            >
                              <Ionicons
                                name='close' size={30} color={'white'}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                handleAcceptMatching(data.length - 1)
                              }}
                              style={styles.icon}
                            >
                              <Ionicons
                                name='heart' size={30} color={'white'}
                              />
                            </TouchableOpacity>
                          </View>
                          <BlurView
                            blurType='light'
                            blurAmount={2}
                            style={{ flex: 1 }}
                          />
                          <View style={{ position: 'absolute', backgroundColor: 'white', width: 2, height: '100%', alignSelf: 'center' }} />
                        </View>
                      </View>
                    </Pressable>
                  </View>
                )
              }
            }}
          />
        </View>
      </View>
      <AlertModal visible={visible} setVisible={setVisible} content={content} checkauth={checkauth} />
      <Modal
        transparent={true}
        visible={isLoading}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,.3)' }}>
          <ActivityIndicator color={'blue'} size={50} />
        </View>
      </Modal>
      <AlertChoices ACvisible={ACvisible} setACvisible={setACvisible} content={content} target={target} handleCancel={handleCancel} />
    </View>
  )
}

export default Matches

const styles = StyleSheet.create({
  icon: {
    height: 50, width: 50, justifyContent: 'center', alignItems: 'center'
  },
  iconPart: {
    position: 'absolute', zIndex: 1, flexDirection: 'row', width: '100%', justifyContent: 'space-around',
    alignItems: 'center', height: '100%'
  },
  absCard: {
    position: 'absolute', bottom: 0, height: 70, width: '100%'
  },
  lastName: {
    fontFamily: KANIT_SEMIBOLD, color: 'white', fontSize: 16, maxWidth: 100, marginLeft: 15
  },
  card: {
    flex: 1,
  },
  img: {
    height: height * .3, width: width * .4, borderRadius: 10
  }
})