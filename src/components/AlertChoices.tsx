import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { MAIN_COLOR, SECOND_COLOR } from '../assets/color'
import { KANIT_MEDIUM, KANIT_REGULAR } from '../assets/fonts/font';
import { TextInput } from 'react-native-gesture-handler';
import axios from 'axios';
import { logoutUserApi } from '../utils/API/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

const { height, width } = Dimensions.get('window');
const AlertChoices = ({ content, ACvisible, setACvisible, target, handleCancel }: any) => {
    const navigation = useNavigation()
    async function handleLogout() {
        const token = await AsyncStorage.getItem('token')
        await axios.post(logoutUserApi, {
            token
        }).then(async () => {
            setACvisible(false)
            await messaging().deleteToken();
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
            })
        }).catch((error: any) => {
            console.error(error)
        })
    }

    if (content == '')
        return <></>
    return (
        <Modal
            transparent={true}
            visible={ACvisible}
            animationType="fade"
        >
            <View style={styles.blur}>
                <View style={styles.contain}>
                    <Text style={styles.content}>{content}</Text>
                    <TouchableOpacity
                        style={[styles.btn, { right: 70, width: 70, backgroundColor: MAIN_COLOR, zIndex: 1 }]}
                        onPress={() => {
                            setACvisible(false)
                        }}>
                        <Text style={[styles.txt, { color: 'white' }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {
                            if (target == 'logout')
                                handleLogout()
                            else if (target == 'confirmDeleteMatching') {
                                handleCancel()
                            }
                        }}>
                        <Text style={styles.txt}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default AlertChoices

const styles = StyleSheet.create({
    txt: {
        fontFamily: KANIT_MEDIUM, fontSize: 16, color: MAIN_COLOR
    },
    btn: {
        backgroundColor: SECOND_COLOR, height: 50, width: 50, justifyContent: 'center',
        alignItems: 'center', borderRadius: 15, position: 'absolute', right: 0, bottom: 0,
        marginBottom: 10, marginRight: 10
    },
    blur: {
        backgroundColor: '#rgba(225,225,225,.5)', width: '100%', height: '100%',
        justifyContent: 'center', alignItems: 'center'
    },
    contain: {
        backgroundColor: MAIN_COLOR, width: '80%', height: 140,
        borderRadius: 20,
    },
    content: {
        flex: 1, fontFamily: KANIT_REGULAR, fontSize: 20, color: 'white',
        marginTop: 10, marginHorizontal: 20
    }
})