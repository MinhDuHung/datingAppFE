import { Dimensions, StyleSheet, Text, Image, TouchableOpacity, View, TextInput, ScrollView } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import { KANIT_BLACK_ITALIC, KANIT_BOLD, KANIT_EXTRABOLD, KANIT_EXTRALIGHT, KANIT_MEDIUM, KANIT_REGULAR, KANIT_THIN } from '../../assets/fonts/font'
import { MAIN_COLOR, SECOND_COLOR } from '../../assets/color'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign'
import DatePicker from 'react-native-date-picker'
import { formatDate } from '../../utils/formatDate'
import { isAdult } from '../../utils/isAdult'
import Entypo from 'react-native-vector-icons/Entypo';
import { AppContext } from '../../context/AppContext';
const { height, width } = Dimensions.get('window')

const Profile = ({ navigation, route }: any) => {
    const { user, setUser }: any = useContext(AppContext)
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [open, setOpen] = useState(false);
    const [img, setImg] = useState('../../assets/images/user.png');
    const [birthday, setBirthday] = useState(new Date());
    const [profileImageMarginTop, setProfileImageMarginTop] = useState(height * 0.2);

    const isSameDay = (date1: any, date2: any) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    function handleUpdateProfile() {
        navigation.navigate('Gender')
        setUser((pre: any) => ({ ...pre, firstName, lastName, birthday: formatDate(birthday), images: [img] }))
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
                setImg(img[0].uri)
            }
        })
    }

    return (
        <View style={{ flex: 1, paddingHorizontal: 20, backgroundColor: 'white' }}>
            <View style={styles.header}>
                <Text
                    onPress={() => navigation.goBack()}
                    style={styles.redTxt}>Back</Text>
            </View>
            <View style={styles.body}>
                <Text style={styles.title}>Profile Details</Text>
                <TouchableOpacity
                    onPress={() => handleOpenGallery()}
                    style={[styles.img, { marginTop: profileImageMarginTop }]}>
                    {
                        img == '../../assets/images/user.png' ?
                            <Image
                                source={require('../../assets/images/user.png')}
                                style={{ height: 100, width: 100, borderRadius: 20 }}
                            /> : <Image
                                source={{ uri: img }}
                                style={{ height: 100, width: 100, borderRadius: 20 }}
                            />
                    }

                    <View style={styles.redCir} >
                        <Entypo name='camera' size={20} color={'white'} />
                    </View>
                </TouchableOpacity>
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
                        onFocus={() => setProfileImageMarginTop(height * .06)}
                        onBlur={() => setProfileImageMarginTop(height * .15)}
                    />
                </View>
                <TouchableOpacity style={styles.dateBtn}
                    onPress={() => setOpen(true)}
                >
                    <AntDesign name='calendar' size={30} color={MAIN_COLOR} />
                    {
                        !isSameDay(new Date(), birthday) ?
                            <Text style={styles.redTxt}>{formatDate(birthday)}</Text>
                            :
                            <Text style={styles.redTxt}>Choose birthday date</Text>
                    }

                </TouchableOpacity>
                {
                    !isAdult(birthday) && !isSameDay(new Date(), birthday) && <Text style={styles.errorTxt}>You are under 18</Text>
                }
            </View>
            <View style={styles.footer}>
                {
                    isAdult(birthday) && firstName != '' && lastName != '' ?
                        <TouchableOpacity style={styles.btn} onPress={() => { handleUpdateProfile() }}>
                            <Text style={styles.btnTxt}>Confirm</Text>
                        </TouchableOpacity> :
                        <View style={[styles.btn, { backgroundColor: SECOND_COLOR }]}>
                            <Text style={[styles.btnTxt, { color: MAIN_COLOR }]}>Confirm</Text>
                        </View>
                }

            </View>

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
        </View>
    );
};
export default Profile

const styles = StyleSheet.create({
    redCir: {
        position: 'absolute', backgroundColor: MAIN_COLOR, height: 35, width: 35, borderRadius: 20,
        justifyContent: 'center', alignItems: 'center', bottom: 0, right: 0
    },
    errorTxt: {
        fontFamily: KANIT_REGULAR, color: 'red',
        fontSize: 15, position: 'absolute', bottom: 0, right: 0
    },
    dateBtn: {
        height: 60, width: '100%', borderRadius: 15, paddingHorizontal: 15, marginTop: 30, backgroundColor: SECOND_COLOR, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 20
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
        fontFamily: KANIT_MEDIUM, color: MAIN_COLOR,
        fontSize: 18,
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