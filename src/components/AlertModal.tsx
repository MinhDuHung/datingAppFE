import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { MAIN_COLOR, SECOND_COLOR } from '../assets/color'
import { KANIT_MEDIUM, KANIT_REGULAR } from '../assets/fonts/font';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');
const AlertModal = ({ content, visible, setVisible, checkauth }: any) => {
    const navigation = useNavigation()
    if (content == '') return <></>
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
        >
            <View style={styles.blur}>
                <View style={styles.contain}>
                    <Text style={styles.content}>{content}</Text>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {
                            setVisible(false)
                            if (checkauth) {
                                navigation.navigate(checkauth)
                            }
                        }}>
                        <Text style={styles.txt}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default AlertModal

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