import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, ActivityIndicator, Modal } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { MAIN_COLOR, SECOND_COLOR } from '../../assets/color.js';
import axios from 'axios';
import { registerUserApi } from '../../utils/API/user.js';
import moment from 'moment';
import { sha256Hash } from '../../utils/encryptSha256.js'
import { KANIT_EXTRALIGHT, KANIT_MEDIUM } from '../../assets/fonts/font.js';
import { AppContext } from '../../context/AppContext';
import AlertModal from '../../components/AlertModal';
import storage from '@react-native-firebase/storage';

const { height, width } = Dimensions.get('window');

const Interests = ({ navigation, route }: any) => {
    const { user, setUser }: any = useContext(AppContext)
    const data = ['Photography', 'Shopping', 'Singing', 'Yoga', 'Cooking', 'Tennis', 'Run', 'Swimming', 'Art', 'Traveling', 'Football', 'Dancing', 'Drinks', 'Video games'];
    const [interest, setInterest] = useState<string[]>([]);
    const [isloading, setIsLoading] = useState(false)
    const [content, setContent] = useState('')
    const [visible, setVisible] = useState(false)

    const searchStringInArray = (search: string): boolean => {
        return interest.includes(search);
    };

    const handlePress = (item: string) => {
        const res = searchStringInArray(item)
        if (res == true) {
            setInterest((pre) => pre.filter((interestItem) => interestItem !== item))
        }
        else setInterest((pre) => [...pre, item])
    }

    const handleOfficalRegister = async () => {
        setIsLoading(true)
        setUser((pre: any) => ({ ...pre, interest }))
        const formattedBirthday = moment(user.birthday, 'DD/MM/YYYY').toDate();
        try {
            const fileName = `${user.mainId}/profileImages/${user.images[0].substring(user.images[0].lastIndexOf('/') + 1)}`;
            await storage().ref(fileName).putFile(user.images[0]);
            const url = await storage().ref(fileName).getDownloadURL();
            const result = await axios.post(registerUserApi, {
                firstName: user.firstName,
                lastName: user.lastName,
                dateOfBirth: formattedBirthday,
                isPremium: user.isPremium,
                gender: user.gender,
                job: user.job,
                about: user.about,
                emailAndPhone: user.mainId,
                password: sha256Hash(user.password),
                location: user.location,
                images: [url],
                interests: interest
            })
            if (result.status == 201) {
                setContent('Created account successfully, please login now.')
                setVisible(true)
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Signin' }],
                });
            }
        } catch (error) {
            setContent('Created account failed, please try again.')
            setVisible(true)
            console.error(error)
        }
        setIsLoading(false)
    }

    const Interest = ({ item, index, marginLeft }: any) => {
        const res = searchStringInArray(item);
        const color = !res ? MAIN_COLOR : 'white'
        const name = item == 'Photography' ? 'camera' : (
            item == 'Shopping' ? 'shopping-bag' : (
                item == 'Singing' ? 'mic' : (
                    item == 'Yoga' ? 'slideshare' : (
                        item == 'Cooking' ? 'bowl' : (
                            item == 'Tennis' ? 'vinyl' : (
                                item == 'Run' ? 'man' : (
                                    item == 'Swimming' ? 'air' : (
                                        item == 'Art' ? 'palette' : (
                                            item == 'Traveling' ? 'aircraft' : (
                                                item == 'Football' ? 'dribbble-with-circle' : (
                                                    item == 'Dancing' ? 'users' : (
                                                        item == 'Drinks' ? 'drink' :
                                                            'tablet-mobile-combo'
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
        return (
            <TouchableOpacity
                style={[styles.inBtn, { backgroundColor: res ? MAIN_COLOR : "#f0f0f0", marginLeft }]}
                onPress={() => { handlePress(item) }}
            >
                <Entypo name={name} size={25} color={color} />
                <Text style={[styles.txt, { color: res ? 'white' : 'black' }]}>{item}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1, paddingHorizontal: 20, backgroundColor: 'white' }}>
            <View style={styles.header}>
                <Entypo
                    onPress={() => navigation.goBack()}
                    name="chevron-left" color={MAIN_COLOR} size={25}
                />
            </View>
            <View style={styles.body}>
                <View style={{ flex: 2 }}>
                    <Text style={styles.title}>Your interests</Text>
                    <Text style={styles.content}>Select a few of your interests and let everyone know what you’re passionate about.</Text>
                </View>
                <View style={{ flex: 8, paddingHorizontal: 10 }}>
                    <FlatList
                        data={data}
                        numColumns={2}
                        keyExtractor={(item, index) => item}
                        renderItem={({ item, index }: any) => {
                            const isEvenColumn = (index + 1) % 2 == 0;
                            return (
                                <Interest
                                    marginLeft={isEvenColumn ? 20 : 0}
                                    item={item} index={index} />
                            );
                        }}
                        contentContainerStyle={{ justifyContent: 'space-around', flex: 1 }}
                    />
                </View>
            </View>
            <View style={styles.footer}>
                {
                    interest.length > 0 ?
                        <TouchableOpacity
                            style={[styles.btn,]}
                            onPress={() => { handleOfficalRegister() }}
                        >
                            <Text style={[styles.txt, { color: 'white', }]}>Continue</Text>
                        </TouchableOpacity>
                        :
                        <View
                            style={[styles.btn, { backgroundColor: SECOND_COLOR }]}
                        >
                            <Text style={[styles.txt, { color: MAIN_COLOR, }]}>Continue</Text>
                        </View>
                }
                <Modal
                    transparent={true}
                    visible={isloading}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,.3)' }}>
                        <ActivityIndicator color={'blue'} size={50} />
                    </View>
                </Modal>
                <AlertModal content={content} visible={visible} setVisible={setVisible} />
            </View>
        </View>
    );
};

export default Interests;

const styles = StyleSheet.create({
    inBtn: {
        height: height * .06, width: '45%', justifyContent: 'flex-start', alignItems: 'center', borderRadius: 15, flexDirection: 'row', paddingHorizontal: 20, gap: 10
    },
    content: {
        fontFamily: KANIT_EXTRALIGHT, fontSize: 14, color: 'black'
    },
    txt: {
        fontFamily: KANIT_MEDIUM, fontSize: 14,
    },
    btn: { backgroundColor: MAIN_COLOR, height: height * .07, width: width - 40, justifyContent: 'center', alignItems: 'center', borderRadius: 15 },
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
});
