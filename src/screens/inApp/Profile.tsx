import { Dimensions, StyleSheet, Text, Image, TouchableOpacity, View, TextInput, ScrollView, Modal, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { KANIT_BLACK_ITALIC, KANIT_BOLD, KANIT_EXTRABOLD, KANIT_EXTRALIGHT, KANIT_MEDIUM, KANIT_REGULAR, KANIT_THIN } from '../../assets/fonts/font'
import { MAIN_COLOR, SECOND_COLOR } from '../../assets/color'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign'
import DatePicker from 'react-native-date-picker'
import { formatDate } from '../../utils/formatDate'
import { isAdult } from '../../utils/isAdult'
import Feather from 'react-native-vector-icons/Feather';
import storage from '@react-native-firebase/storage';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { authPasswordApi, authTokenApi, updateUserApi } from '../../utils/API/user';
import AlertModal from '../../components/AlertModal';
import { sha256Hash } from '../../utils/encryptSha256';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DraggableFlatList, { OpacityDecorator, ScaleDecorator, ShadowDecorator, useOnCellActiveAnimation } from 'react-native-draggable-flatlist';
import Animated from 'react-native-reanimated';
import AuthModal from '../../components/AuthModal';
import AlertChoices from '../../components/AlertChoices';
const { height, width } = Dimensions.get('window')

const Profile = ({ navigation, route }: any) => {

  const { user, setUser }: any = useContext(AppContext)
  const [firstName, setFirstName] = useState("");
  const [job, setJob] = useState("");
  const [about, setAbout] = useState("");
  const [checkauth, setCheckauth] = useState('');
  const [visible, setVisible] = useState(false);
  const [ACvisible, setACvisible] = useState(false);
  const [target, setTarget] = useState('');
  const [aVisible, setAVisible] = useState(false);
  const [password, setPassword] = useState("11111111");
  const [lastName, setLastName] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(user.images);
  const [birthday, setBirthday] = useState(new Date());
  const [content, setContent] = useState('');
  let downloadURL: any = []

  useFocusEffect(
    React.useCallback(() => {
      authToken()
      setFirstName(user.firstName);
      setJob(user.job);
      setAbout(user.about);
      setLastName(user.lastName);
      setImg(user.images);
      setBirthday(new Date(user.dateOfBirth));
    }, [user])
  );

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
  async function checkPassword() {
    setLoading(true)
    try {
      const result = await axios.get(authPasswordApi, {
        params: {
          token: user.token, password: sha256Hash(password)
        }
      })
      if (result.status == 200) {
        return true
      }
    } catch (error) {
      setContent("Updated user failed due to incorrected passord!")
      setVisible(true)
      return false
    }
    setLoading(false)
  }

  async function uploadImg() {
    try {
      for (let i = 0; i < img.length; i++) {
        if (!img[i].includes(`firebasestorage`)) {
          const fileName = `${user.emailAndPhone}/profileImages/${img[i].substring(img[i].lastIndexOf('/') + 1)}`;
          await storage().ref(fileName).putFile(img[i]);
          const url = await storage().ref(fileName).getDownloadURL();
          downloadURL.push(url);
        }
        else {
          downloadURL.push(img[i])
        }
      }
      return true
    } catch (error) {
      console.error('uploadImg error ', error)
      return false
    }
  }

  async function handleUpdateProfile() {
    const check = await checkPassword()
    const upload = await uploadImg()
    setLoading(true)
    if (check && upload) {
      try {
        const result = await axios.put(updateUserApi, {
          token: user.token, firstName,
          lastName,
          dateOfBirth: birthday,
          job,
          about,
          images: downloadURL,
        })
        if (result.status == 200) {
          setContent("Updated user successfully!")
          setUser(result.data.user)
          setVisible(true)
        }
      } catch (error) {
        setContent("Updated user failed!")
        setVisible(true)
        console.error(error)
      }
    }
    setLoading(false)
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
        setImg((pre: any) => [...pre, newImageUri])
        setUser((pre: any) => ({ ...pre, images: [...pre.images, newImageUri] }))
      }
    })
  }

  const handleAuthPassword = async () => {
    setAVisible(true)
  }
  return (
    <View style={{ flex: 1, paddingHorizontal: 20, backgroundColor: 'white' }}>
      <View style={styles.header}>
        <Text
          onPress={() => navigation.goBack()}
          style={[styles.redTxt, { height: 30, width: 65 }]}>Back</Text>
        <Text
          onPress={() => navigation.navigate('PreviewProfile', { chosenId: user._id })}
          style={[styles.redTxt, { height: 30, width: 65 }]}>Preview</Text>
      </View>
      <View style={styles.body}>
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <View style={{ height: 300, width: '100%' }}>
            <Text style={styles.title}>Profile Details</Text>
            <View
              style={[styles.img, { marginTop: 20 }]}>
              {
                img && <Image
                  source={{ uri: img[0] }}
                  style={{ height: 100, width: 100, borderRadius: 20, }}
                />
              }

            </View>
            <View style={styles.imagesBox}>
              <DraggableFlatList
                data={img}
                keyExtractor={(item: any, index: number) => (item + index).toString()}
                horizontal
                onDragEnd={({ data }: any) => {
                  setImg(data)
                  setUser((prev: any) => ({ ...prev, images: data }))
                }}
                renderItem={({ item, drag }: any) => {
                  return (
                    <ScaleDecorator>
                      <OpacityDecorator activeOpacity={1}>
                        <ShadowDecorator>
                          <View style={{ height: 100, width: 100, justifyContent: 'center', alignItems: 'center', }}>
                            <TouchableOpacity
                              onPress={() => { navigation.navigate("ImageDetails", { img: item }) }}
                              onLongPress={drag}>
                              <Animated.Image
                                source={{ uri: item }}
                                style={{ height: 80, width: 80, borderRadius: 10 }}
                              />
                            </TouchableOpacity>
                            {
                              img.length > 1 && <TouchableOpacity
                                style={{ position: 'absolute', right: 0, top: 0, }}
                                onPress={() => {
                                  const updatedImages = img.filter((i: any) => i !== item);
                                  setUser((prev: any) => ({ ...prev, images: updatedImages }));
                                  setImg(updatedImages)
                                }}>
                                <Feather name='x-circle' size={25} color={MAIN_COLOR} />
                              </TouchableOpacity>
                            }
                          </View>
                        </ShadowDecorator>
                      </OpacityDecorator>

                    </ScaleDecorator>

                  )
                }}
                ListFooterComponent={() => {
                  if (img.length < 5)
                    return (
                      <TouchableOpacity
                        onPress={() => handleOpenGallery()}
                        style={styles.addImg}>
                        <AntDesign name="plus" size={30} color={'red'} />
                      </TouchableOpacity>
                    )
                }}
              />
            </View>
          </View>
          <View>
            <Text style={styles.txt}>First name:</Text>
            <TextInput
              maxLength={30}
              style={styles.txtIn}
              value={firstName}
              onChangeText={x => setFirstName(x)}
            />
          </View>
          <View>
            <Text style={styles.txt}>Last name:</Text>
            <TextInput
              maxLength={30}
              style={styles.txtIn}
              value={lastName}
              onChangeText={x => setLastName(x)}
            />
          </View>
          <View>
            <Text style={styles.txt}>Job:</Text>
            <TextInput
              maxLength={30}
              style={styles.txtIn}
              value={job}
              onChangeText={x => setJob(x)}
            />
          </View>
          <View>
            <Text style={styles.txt}>About:</Text>
            <TextInput
              maxLength={300}
              multiline
              style={[styles.txtIn, { height: 150, textAlignVertical: 'top' }]}
              value={about}
              onChangeText={x => setAbout(x)}
            />
          </View>
          <TouchableOpacity style={styles.dateBtn}
            onPress={() => setOpen(true)}
          >
            <AntDesign name='calendar' size={30} color={MAIN_COLOR} />
            <Text style={styles.redTxt}>{formatDate(birthday)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setContent('Do you really wanna logout?')
              setACvisible(true)
              setTarget('logout')
            }}
            style={{ height: 30, width: 100, marginBottom: 20 }}
          >
            <Text style={styles.redTxt}>Logout</Text>
          </TouchableOpacity>
          {
            !isAdult(birthday) && <Text style={styles.errorTxt}>You are under 18</Text>
          }
        </ScrollView>
      </View >
      <View style={styles.footer}>
        {
          isAdult(birthday) && firstName != '' && lastName != '' ?
            <TouchableOpacity style={styles.btn} onPress={() => { handleAuthPassword() }}>
              <Text style={styles.btnTxt}>Confirm</Text>
            </TouchableOpacity> :
            <View style={[styles.btn, { backgroundColor: SECOND_COLOR }]}>
              <Text style={[styles.btnTxt, { color: MAIN_COLOR }]}>Confirm</Text>
            </View>
        }
      </View>

      {/* Alert and model field */}
      <AlertModal visible={visible} setVisible={setVisible} content={content} checkauth={checkauth} />
      <AlertChoices ACvisible={ACvisible} setACvisible={setACvisible} content={content} target={target} handleCancel={null}/>
      <Modal
        transparent={true}
        visible={loading}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,.3)' }}>
          <ActivityIndicator color={'blue'} size={50} />
        </View>

      </Modal>
      <AuthModal aVisible={aVisible} setAVisible={setAVisible} password={password} setPassword={setPassword} handleUpdateProfile={handleUpdateProfile} />
      <DatePicker
        modal
        open={open}
        date={birthday}
        onConfirm={(date) => {
          setOpen(false)
          setBirthday(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
        mode="date"
      />
    </View >
  );
};
export default Profile

const styles = StyleSheet.create({
  addImg: {
    width: 80, borderRadius: 10, height: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128, 128, 128, 0.3)', marginTop: 10
  },
  imagesBox: {
    width: '100%', borderRadius: 10, borderWidth: .5, borderColor: MAIN_COLOR, marginTop: 10, height: 100,
    paddingHorizontal: 10,
  },
  redCir: {
    position: 'absolute', backgroundColor: MAIN_COLOR, height: 35, width: 35, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', bottom: 0, right: 0
  },
  errorTxt: {
    fontFamily: KANIT_REGULAR, color: 'red',
    fontSize: 15, position: 'absolute', bottom: 25, right: 0
  },
  dateBtn: {
    height: 60, width: '100%', borderRadius: 15, paddingHorizontal: 15, marginVertical: 30, backgroundColor: SECOND_COLOR, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 20
  },
  txt: {
    fontFamily: KANIT_EXTRALIGHT, color: 'black', fontSize: 14, position: 'absolute', top: 20, left: 20, backgroundColor: 'white', zIndex: 1, paddingHorizontal: 10
  },
  txtIn: {
    height: 50, width: '100%', borderWidth: .3, borderColor: 'black', borderRadius: 15, paddingHorizontal: 15,
    marginTop: 30,
  },
  img: {
    height: 110, width: 110, alignSelf: 'center', borderRadius: 20,
  },
  btn: { height: height * .08, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: MAIN_COLOR, borderRadius: 15 },
  btnTxt: {
    fontFamily: KANIT_MEDIUM, color: 'white',
    fontSize: 20, textAlign: 'center'
  },
  title: {
    fontFamily: KANIT_MEDIUM, color: 'black', fontSize: 26,
  },
  redTxt: {
    fontFamily: KANIT_MEDIUM, color: MAIN_COLOR, fontSize: 18,
  },
  header: {
    flex: 1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center',
    borderBottomRightRadius: 15, borderBottomLeftRadius: 15, width: '100%'
  },
  body: {
    flex: 8,
  },
  footer: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  }
})