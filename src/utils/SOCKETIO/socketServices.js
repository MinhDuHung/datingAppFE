
import io from 'socket.io-client';

const SOCKET_URL = 'http://192.168.1.11:3001'

class WSService {

    initializeSocket = async (chatRoomId) => {
        try {
            this.socket = io(SOCKET_URL, {
                transports: ['websocket'],
                query: { chatRoomId }
            })

            this.socket.on('connect', (data) => {
                console.log("=== socket connected ====")
            })

            this.socket.on('disconnect', (data) => {
                console.log("=== socket disconnected ====")
            })

            this.socket.on('error', (data) => {
                console.log("socekt error", data)
            })

        } catch (error) {
            console.log("scoket is not inialized", error)
        }
    }

    emit(event, data = {}) {
        this.socket.emit(event, data)
    }

    on(event, cb) {
        this.socket.on(event, cb)
    }

    removeListener(listenerName) {
        this.socket.removeListener(listenerName)
    }
    disconnect() {
        this.socket.disconnect();
        console.log("Manually disconnected from socket.");
    }

}

const socketServices = new WSService()

export default socketServices