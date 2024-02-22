import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { MAIN_COLOR, SECOND_COLOR } from '../assets/color'
import { KANIT_MEDIUM, KANIT_REGULAR } from '../assets/fonts/font';
import { TextInput } from 'react-native-gesture-handler';

const { height, width } = Dimensions.get('window');
const AuthModal = ({ password, setPassword, aVisible, setAVisible, handleUpdateProfile }: any) => {
    if (password == '') return <></>
    return (
        <Modal
            transparent={true}
            visible={aVisible}
            animationType="fade"
        >
            <View style={styles.blur}>
                <View style={styles.contain}>
                    <TextInput
                        value={password}
                        style={styles.content}
                        onChangeText={text => setPassword(text)}
                    />
                    <TouchableOpacity
                        style={[styles.btn, { right: 70, width: 70, backgroundColor: MAIN_COLOR, zIndex: 1 }]}
                        onPress={() => {
                            setAVisible(false)
                        }}>
                        <Text style={[styles.txt, { color: 'white' }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {
                            handleUpdateProfile()
                            setAVisible(false)
                        }}>
                        <Text style={styles.txt}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default AuthModal

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
        marginTop: 20, height: 40, width: '80%', backgroundColor: 'white', alignSelf: 'center', borderRadius: 20,
        paddingHorizontal: 20
    }
})