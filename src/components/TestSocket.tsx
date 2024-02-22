import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import socketServices from '../utils/SOCKETIO/socketServices'

const TestSocket = () => {
    useEffect(() => {
        socketServices.initializeSocket()
    },)
    return (
        <View>
            <Text>TestSocket</Text>
        </View>
    )
}

export default TestSocket

const styles = StyleSheet.create({})